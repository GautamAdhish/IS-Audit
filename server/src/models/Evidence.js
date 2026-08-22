import mongoose from 'mongoose';

const EVIDENCE_TYPES = ['Policy', 'Procedure', 'Record', 'Report', 'Certificate'];

const evidenceSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, index: true }, // e.g. E-001
    title: { type: String, required: [true, 'Title is required'], trim: true },
    type: { type: String, enum: EVIDENCE_TYPES, required: true },
    relatedAudit: { type: mongoose.Schema.Types.ObjectId, ref: 'Audit', required: [true, 'Related audit is required'] },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Uploader is required'] },
    uploadedDate: { type: Date, default: Date.now },
    fileSize: { type: String }, // human-readable, e.g. "245 KB" — set from the uploaded file when present
    filePath: { type: String, select: false }, // server-side storage path, never sent to the client directly
    fileName: { type: String },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

evidenceSchema.index({ title: 'text', tags: 'text' });

export const EVIDENCE_TYPES_LIST = EVIDENCE_TYPES;

export default mongoose.model('Evidence', evidenceSchema);
