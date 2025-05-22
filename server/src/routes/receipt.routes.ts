import express from 'express';
import { check } from 'express-validator';
import { 
  createReceipt, 
  getReceipts, 
  getReceiptById, 
  updateReceipt, 
  deleteReceipt, 
  updateReceiptStatus,
  getReceiptStats 
} from '../controllers/receipt.controller';
import { protect } from '../middleware/auth'; // Actualizado para usar el middleware correcto
import multer from 'multer';
import path from 'path';

// Set up multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads/'));
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Check file type
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|pdf/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed'));
  }
}

// Initialize upload
const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

const router = express.Router();

// All routes are protected
router.use(protect);

// Get receipt statistics
router.get('/stats', getReceiptStats);

// Get all receipts for current user
router.get('/', getReceipts);

// Get receipt by ID
router.get('/:id', getReceiptById);

// Create a new receipt
router.post(
  '/',
  upload.single('image'),
  [
    check('companyName', 'Company name is required').not().isEmpty(),
    check('folioNumber', 'Folio number is required').not().isEmpty(),
    check('date', 'Date is required').isISO8601().toDate(),
    check('description', 'Description is required').not().isEmpty(),
    check('totalAmount', 'Total amount is required and must be a number').isNumeric()
  ],
  createReceipt
);

// Update receipt
router.put(
  '/:id',
  upload.single('image'),
  [
    check('companyName', 'Company name is required').optional().not().isEmpty(),
    check('folioNumber', 'Folio number is required').optional().not().isEmpty(),
    check('date', 'Date must be valid').optional().isISO8601().toDate(),
    check('description', 'Description is required').optional().not().isEmpty(),
    check('totalAmount', 'Total amount must be a number').optional().isNumeric()
  ],
  updateReceipt
);

// Delete receipt
router.delete('/:id', deleteReceipt);

// Update receipt status
router.patch(
  '/:id/status',
  [
    check('status', 'Status is required').isIn(['en_revision', 'aceptada', 'rechazada'])
  ],
  updateReceiptStatus
);

export default router;