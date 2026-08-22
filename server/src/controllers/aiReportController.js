import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT_PATH = path.join(__dirname, '..', '..', 'scripts', 'generate_narrative.py');
const PYTHON_BIN = process.env.PYTHON_BIN || 'python3';

/**
 * The insights payload is computed client-side (see client/src/pages/summary/
 * computeInsights.ts) from the same data the rest of the app already shows.
 * Rather than calling an external LLM API, this shells out to a small,
 * deterministic, rule-based Python tool (server/scripts/generate_narrative.py)
 * that turns those numbers into board- or auditor-appropriate prose. No
 * external network call, no API key, no per-call cost, same output every
 * time for the same input.
 */
const runNarrativeScript = (payload) =>
  new Promise((resolve, reject) => {
    const child = spawn(PYTHON_BIN, [SCRIPT_PATH]);

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('error', (err) => {
      // Most commonly ENOENT: python3 isn't installed / not on PATH.
      reject(new Error(`Could not start narrative generator: ${err.message}`));
    });

    child.on('close', (code) => {
      if (code !== 0) {
        let message = 'Narrative generator failed.';
        try {
          const parsedErr = JSON.parse(stderr.trim());
          if (parsedErr.error) message = parsedErr.error;
        } catch {
          if (stderr.trim()) message = stderr.trim();
        }
        return reject(new Error(message));
      }
      try {
        resolve(JSON.parse(stdout.trim()));
      } catch (err) {
        reject(new Error('Narrative generator returned malformed output.'));
      }
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });

export const generateNarrative = asyncHandler(async (req, res, next) => {
  const { reportType, insights } = req.body;

  if (!reportType || !['general', 'technical'].includes(reportType)) {
    return next(new AppError('reportType must be "general" or "technical"', 400));
  }
  if (!insights || typeof insights !== 'object') {
    return next(new AppError('insights payload is required', 400));
  }

  try {
    const result = await runNarrativeScript({ reportType, insights });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('Narrative generation error:', err.message);
    return next(new AppError(err.message || 'Failed to generate narrative.', 502));
  }
});

export default { generateNarrative };
