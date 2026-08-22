export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type RiskStatus = 'Open' | 'Mitigated' | 'Accepted' | 'Closed';

export interface Risk {
  id: string;
  title: string;
  category: string;
  likelihood: number; // 1-5
  impact: number;     // 1-5
  riskScore: number;  // likelihood * impact
  level: RiskLevel;
  owner: string;
  status: RiskStatus;
  mitigationPlan: string;
}

export const risks: Risk[] = [
  { id: 'R-001', title: 'Ransomware Attack on Core Systems',    category: 'Cyber Security',   likelihood: 4, impact: 5, riskScore: 20, level: 'Critical', owner: 'Alice Chen',  status: 'Open',      mitigationPlan: 'Deploy EDR solution and implement daily encrypted backups.'       },
  { id: 'R-002', title: 'Data Breach via Third-Party Vendor',   category: 'Data Privacy',     likelihood: 3, impact: 5, riskScore: 15, level: 'High',     owner: 'Bob Martinez', status: 'Mitigated', mitigationPlan: 'Enforce vendor security assessments and DPA agreements.'          },
  { id: 'R-003', title: 'Regulatory Non-Compliance (GDPR)',     category: 'Compliance',       likelihood: 3, impact: 4, riskScore: 12, level: 'High',     owner: 'Carol Singh', status: 'Open',      mitigationPlan: 'Complete GDPR gap analysis and appoint DPO.'                      },
  { id: 'R-004', title: 'Insider Threat — Privileged Access',  category: 'Access Control',   likelihood: 2, impact: 5, riskScore: 10, level: 'High',     owner: 'David Lee',   status: 'Open',      mitigationPlan: 'Implement PAM solution and quarterly access reviews.'             },
  { id: 'R-005', title: 'Physical Access to Server Room',       category: 'Physical Security',likelihood: 2, impact: 4, riskScore: 8,  level: 'Medium',   owner: 'Eve Johnson', status: 'Mitigated', mitigationPlan: 'Install biometric access control and CCTV.'                       },
  { id: 'R-006', title: 'Software Vulnerability Exploitation',  category: 'Cyber Security',   likelihood: 3, impact: 3, riskScore: 9,  level: 'Medium',   owner: 'Frank Wu',    status: 'Open',      mitigationPlan: 'Adopt vulnerability scanning tool and patch within SLA.'          },
  { id: 'R-007', title: 'Business Continuity Plan Failure',     category: 'Operational',      likelihood: 2, impact: 4, riskScore: 8,  level: 'Medium',   owner: 'Grace Kim',   status: 'Accepted',  mitigationPlan: 'Test BCP annually and update contact lists quarterly.'            },
  { id: 'R-008', title: 'Password Policy Non-Adherence',        category: 'Access Control',   likelihood: 3, impact: 2, riskScore: 6,  level: 'Low',      owner: 'Alice Chen',  status: 'Closed',    mitigationPlan: 'Enforce password complexity rules via AD Group Policy.'           },
];
