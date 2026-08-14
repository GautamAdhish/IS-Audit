import Report from '../models/Report.js';
import createCRUDController from './crudControllerFactory.js';

const base = createCRUDController(Report, {
  codePrefix: 'RP',
  searchFields: ['title', 'period'],
  populate: [{ path: 'generatedBy', select: 'name email role' }],
});

export default base;
