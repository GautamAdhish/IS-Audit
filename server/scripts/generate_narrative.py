#!/usr/bin/env python3
"""
generate_narrative.py — specialized, local, rule-based narrative generator
for the IS-Audit Summary Report page.

No external API calls. Takes the exact same `insights` object the frontend
already computed (audits, findings, risks, CAPA, assets, vendors, checklist
rolled up into percentages and counts) on stdin as JSON, and produces a
structured narrative — headline, prose, top concerns, recommendations — in
the same JSON shape the report UI expects.

Usage:
    echo '{"reportType": "general", "insights": {...}}' | python3 generate_narrative.py

Deterministic: the same input always produces the same output, which also
makes it trivially cacheable and free to run as often as needed.
"""

import json
import sys


def pct(n, label="%"):
    return f"{n}{label}"


def band(value, low_hi=(35, 60)):
    """Classify a 0-100 exposure/severity number into low/medium/high."""
    lo, hi = low_hi
    if value >= hi:
        return "high"
    if value >= lo:
        return "medium"
    return "low"


def area_sentence_general(area):
    """One plain-language sentence about a vulnerability area, for the board."""
    label = area.get("label", "This area")
    exp = area.get("exposurePct", 0)
    open_n = area.get("openCount", 0)
    total_n = area.get("totalCount", 0)
    b = band(exp)
    if total_n == 0:
        return f"{label} has no recorded items yet, so it can't be assessed."
    if b == "high":
        return f"{label} needs urgent attention — {open_n} of {total_n} items here are still unresolved ({exp}%)."
    if b == "medium":
        return f"{label} is partly under control, but {open_n} of {total_n} items ({exp}%) still need work."
    return f"{label} is in good shape — only {open_n} of {total_n} items ({exp}%) remain open."


def area_sentence_technical(area):
    """One technical sentence about a vulnerability area, for auditors."""
    label = area.get("label", "This area")
    exp = area.get("exposurePct", 0)
    sev = area.get("severityScore", 0)
    open_n = area.get("openCount", 0)
    total_n = area.get("totalCount", 0)
    if total_n == 0:
        return f"{label}: no records in scope for this period."
    return (
        f"{label} shows {exp}% exposure ({open_n}/{total_n} open) with a severity-weighted "
        f"score of {sev}%, indicating {band(exp)} residual risk in this control area."
    )


def build_general(insights):
    overall = insights.get("overallExposure", 0)
    overall_label = insights.get("overallLabel", "")
    avg_compliance = insights.get("avgCompliance", 0)
    audits_completed = insights.get("auditsCompleted", 0)
    audits_total = insights.get("auditsTotal", 0)
    critical_risks = insights.get("criticalOpenRisks", []) or []
    overdue_capas = insights.get("overdueCapas", []) or []
    areas = insights.get("vulnerabilityAreas", []) or []

    healthy_pct = 100 - overall
    b = band(overall)
    if not overall_label:
        overall_label = {"high": "High Exposure", "medium": "Moderate Exposure", "low": "Low Exposure"}[b]

    if b == "high":
        posture = "a number of important controls are not yet working as intended"
    elif b == "medium":
        posture = "most controls are working, but a meaningful portion still need attention"
    else:
        posture = "the vast majority of controls are working as intended"

    headline = (
        f"Overall, the organisation is in {overall_label.lower()} at {healthy_pct}% healthy — {posture}."
    )

    paragraphs = []
    paragraphs.append(
        f"Out of {audits_total} planned audits, {audits_completed} have been completed, with an average "
        f"compliance score of {avg_compliance}% across departments. This reflects how consistently teams are "
        f"following the organisation's own policies and procedures day to day."
    )

    if critical_risks:
        n = len(critical_risks)
        verb = "is" if n == 1 else "are"
        noun = "risk" if n == 1 else "risks"
        paragraphs.append(
            f"There {verb} currently {n} serious {noun} still open that could meaningfully affect the business "
            f"if left unaddressed. These are the ones most worth board-level attention this cycle."
        )
    else:
        paragraphs.append(
            "There are no serious risks currently open, which is a good sign that the risk register is being "
            "actively managed."
        )

    if overdue_capas:
        paragraphs.append(
            f"{len(overdue_capas)} corrective action{'s' if len(overdue_capas) != 1 else ''} planned to fix "
            f"known issues {'are' if len(overdue_capas) != 1 else 'is'} now running behind schedule. Keeping "
            f"these on track is the simplest way to prevent small issues from becoming bigger ones."
        )

    worst_areas = sorted(areas, key=lambda a: a.get("exposurePct", 0), reverse=True)[:3]
    top_concerns = [area_sentence_general(a) for a in worst_areas if a.get("totalCount", 0) > 0]

    recommendations = []
    if critical_risks:
        recommendations.append("Approve budget/resources to close the highest-severity open risks first.")
    if overdue_capas:
        recommendations.append("Ask department leads for a revised timeline on overdue corrective actions.")
    if avg_compliance < 85:
        recommendations.append("Request a follow-up review in departments scoring below 85% compliance.")
    if not recommendations:
        recommendations.append("Continue routine oversight — no urgent board action required this cycle.")
    recommendations.append("Review this summary again next audit cycle to track whether exposure is trending down.")

    return {
        "headline": headline,
        "narrative": "\n\n".join(paragraphs),
        "topConcerns": top_concerns,
        "recommendations": recommendations[:4],
    }


def build_technical(insights):
    overall = insights.get("overallExposure", 0)
    avg_compliance = insights.get("avgCompliance", 0)
    critical_risks = insights.get("criticalOpenRisks", []) or []
    overdue_capas = insights.get("overdueCapas", []) or []
    areas = insights.get("vulnerabilityAreas", []) or []
    findings_by_sev = {d["name"]: d["value"] for d in insights.get("findingsBySeverity", [])}
    risks_by_level = {d["name"]: d["value"] for d in insights.get("risksByLevel", [])}

    headline = (
        f"Overall exposure index is {overall}% with {avg_compliance}% average control compliance; "
        f"{len(critical_risks)} Critical/High risk(s) remain open and {len(overdue_capas)} CAPA item(s) "
        f"are past due."
    )

    paragraphs = []
    sev_summary = ", ".join(f"{v} {k}" for k, v in findings_by_sev.items()) or "no findings recorded"
    paragraphs.append(
        f"Findings register: {sev_summary}. Risk register distribution: "
        + (", ".join(f"{v} {k}" for k, v in risks_by_level.items()) or "no risks recorded") + "."
    )

    sorted_areas = sorted(areas, key=lambda a: a.get("exposurePct", 0), reverse=True)
    for a in sorted_areas:
        if a.get("totalCount", 0) > 0:
            paragraphs.append(area_sentence_technical(a))

    if critical_risks:
        top = critical_risks[0]
        paragraphs.append(
            f"Highest-priority open risk: {top.get('code', '')} \"{top.get('title', '')}\" "
            f"(likelihood {top.get('likelihood', '?')} x impact {top.get('impact', '?')} = "
            f"score {top.get('riskScore', '?')}, level {top.get('level', '?')}). "
            f"Mitigation on file: {top.get('mitigationPlan') or 'none documented — needs a mitigation plan.'}"
        )

    top_concerns = [area_sentence_technical(a) for a in sorted_areas[:6] if a.get("totalCount", 0) > 0]

    recommendations = []
    for a in sorted_areas:
        if a.get("exposurePct", 0) >= 35 and a.get("topFixes"):
            recommendations.extend(a["topFixes"][:2])
    if not recommendations:
        recommendations.append("No control area currently exceeds the 35% exposure threshold — maintain current cadence.")
    recommendations.append(
        f"Prioritise remediation in exposure order: "
        + ", ".join(a["label"] for a in sorted_areas[:3] if a.get("totalCount", 0) > 0) + "."
    )

    return {
        "headline": headline,
        "narrative": "\n\n".join(paragraphs),
        "topConcerns": top_concerns[:6],
        "recommendations": recommendations[:6],
    }


def main():
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON input: {e}"}), file=sys.stderr)
        sys.exit(1)

    report_type = payload.get("reportType")
    insights = payload.get("insights") or {}

    if report_type not in ("general", "technical"):
        print(json.dumps({"error": "reportType must be 'general' or 'technical'"}), file=sys.stderr)
        sys.exit(1)

    result = build_general(insights) if report_type == "general" else build_technical(insights)
    print(json.dumps(result))


if __name__ == "__main__":
    main()
