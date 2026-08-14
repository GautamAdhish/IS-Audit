import express from 'express';
import reportController from '../controllers/reportController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(reportController.getAll)
  .post(restrictTo('Admin', 'Lead Auditor', 'Auditor'), reportController.createOne);

router
  .route('/:id')
  .get(reportController.getOne)
  .patch(restrictTo('Admin', 'Lead Auditor', 'Auditor'), reportController.updateOne)
  .delete(restrictTo('Admin', 'Lead Auditor'), reportController.deleteOne);

export default router;
