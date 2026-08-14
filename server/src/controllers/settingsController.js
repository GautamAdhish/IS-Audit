import Settings from '../models/Settings.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Returns the single Settings document, creating it with schema
 * defaults on first access so the app never has to special-case
 * "no settings saved yet".
 */
const getSingleton = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

// GET /api/settings
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await getSingleton();
  res.status(200).json({ success: true, data: settings });
});

// PATCH /api/settings  (Admin only — see routes)
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getSingleton();

  const { organisationName, industry, primaryStandard, auditCycle, notifications, auditParameters } = req.body;

  if (organisationName !== undefined) settings.organisationName = organisationName;
  if (industry !== undefined) settings.industry = industry;
  if (primaryStandard !== undefined) settings.primaryStandard = primaryStandard;
  if (auditCycle !== undefined) settings.auditCycle = auditCycle;
  if (notifications) Object.assign(settings.notifications, notifications);
  if (auditParameters) Object.assign(settings.auditParameters, auditParameters);

  await settings.save();
  res.status(200).json({ success: true, data: settings });
});
