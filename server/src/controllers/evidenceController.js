import path from 'node:path';
import fs from 'node:fs';
import Evidence from '../models/Evidence.js';
import createCRUDController from './crudControllerFactory.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import generateCode from '../utils/generateCode.js';
import { humanFileSize } from '../middleware/upload.js';

const base = createCRUDController(Evidence, {
  codePrefix: 'E',
  searchFields: ['title', 'tags'],
  populate: [
    { path: 'relatedAudit', select: 'code title' },
    { path: 'uploadedBy', select: 'name email role' },
  ],
});

// POST /api/evidence  (multipart/form-data, field name "file")
// Overrides the generic createOne so the uploaded file's metadata
// (path, size, name) is captured alongside the record.
const createOne = asyncHandler(async (req, res, next) => {
  const { title, type, relatedAudit, tags } = req.body;
  const uploader = req.user?._id || req.body.uploadedBy;

  if (!title || !type || !relatedAudit || !uploader) {
    return next(new AppError('title, type, relatedAudit and uploadedBy are required.', 400));
  }

  const code = await generateCode('E');
  const doc = await Evidence.create({
    code,
    title,
    type,
    relatedAudit,
    uploadedBy: uploader,
    tags: Array.isArray(tags) ? tags : tags ? String(tags).split(',').map((t) => t.trim()) : [],
    ...(req.file && {
      filePath: req.file.path,
      fileName: req.file.originalname,
      fileSize: humanFileSize(req.file.size),
    }),
  });

  res.status(201).json({ success: true, data: doc });
});

// GET /api/evidence/:id/download
const downloadFile = asyncHandler(async (req, res, next) => {
  const doc = await Evidence.findById(req.params.id).select('+filePath fileName');
  if (!doc) return next(new AppError(`Evidence not found with id ${req.params.id}`, 404));
  if (!doc.filePath || !fs.existsSync(doc.filePath)) {
    return next(new AppError('No file is attached to this evidence record.', 404));
  }
  res.download(doc.filePath, doc.fileName || path.basename(doc.filePath));
});

export default { ...base, createOne, downloadFile };
