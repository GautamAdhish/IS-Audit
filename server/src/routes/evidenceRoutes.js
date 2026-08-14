import express from 'express';
import evidenceController from '../controllers/evidenceController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(evidenceController.getAll)
  .post(restrictTo('Admin', 'Lead Auditor', 'Auditor', 'Auditee'), upload.single('file'), evidenceController.createOne);

router
  .route('/:id')
  .get(evidenceController.getOne)
  .patch(restrictTo('Admin', 'Lead Auditor', 'Auditor'), evidenceController.updateOne)
  .delete(restrictTo('Admin', 'Lead Auditor'), evidenceController.deleteOne);

router.get('/:id/download', evidenceController.downloadFile);

export default router;
