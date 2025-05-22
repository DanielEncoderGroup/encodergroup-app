import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Receipt, { IReceipt } from '../models/receipt.model';
import path from 'path';
import fs from 'fs';

// @desc    Create a new receipt
// @route   POST /api/receipts
// @access  Private
export const createReceipt = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  try {
    const { companyName, folioNumber, date, description, totalAmount } = req.body;
    
    // Handle image upload if present
    let imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const receipt = await Receipt.create({
      user: req.user._id,
      companyName,
      folioNumber,
      date,
      description,
      totalAmount,
      imageUrl,
      status: 'en_revision'
    });

    res.status(201).json({
      success: true,
      data: receipt
    });
  } catch (error) {
    console.error('Error in createReceipt: ', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get all receipts for logged in user
// @route   GET /api/receipts
// @access  Private
export const getReceipts = async (req: Request, res: Response): Promise<void> => {
  try {
    const receipts = await Receipt.find({ user: req.user._id });
    
    res.json({
      success: true,
      count: receipts.length,
      data: receipts
    });
  } catch (error) {
    console.error('Error in getReceipts: ', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get receipt by ID
// @route   GET /api/receipts/:id
// @access  Private
export const getReceiptById = async (req: Request, res: Response): Promise<void> => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      res.status(404).json({ success: false, message: 'Receipt not found' });
      return;
    }

    // Make sure the receipt belongs to the logged in user
    if (receipt.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ success: false, message: 'Not authorized to access this receipt' });
      return;
    }

    res.json({
      success: true,
      data: receipt
    });
  } catch (error) {
    console.error('Error in getReceiptById: ', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update receipt by ID
// @route   PUT /api/receipts/:id
// @access  Private
export const updateReceipt = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  try {
    let receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      res.status(404).json({ success: false, message: 'Receipt not found' });
      return;
    }

    // Make sure the receipt belongs to the logged in user
    if (receipt.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ success: false, message: 'Not authorized to update this receipt' });
      return;
    }

    // Handle image upload if present
    if (req.file) {
      // Delete old image if exists
      if (receipt.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', '..', 'public', receipt.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      req.body.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Update fields
    receipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: receipt
    });
  } catch (error) {
    console.error('Error in updateReceipt: ', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Delete receipt by ID
// @route   DELETE /api/receipts/:id
// @access  Private
export const deleteReceipt = async (req: Request, res: Response): Promise<void> => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      res.status(404).json({ success: false, message: 'Receipt not found' });
      return;
    }

    // Make sure the receipt belongs to the logged in user
    if (receipt.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ success: false, message: 'Not authorized to delete this receipt' });
      return;
    }

    // Delete image if exists
    if (receipt.imageUrl) {
      const imagePath = path.join(__dirname, '..', '..', 'public', receipt.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await receipt.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteReceipt: ', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update receipt status
// @route   PATCH /api/receipts/:id/status
// @access  Private
export const updateReceiptStatus = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body;

  // Validate status
  if (!['en_revision', 'aceptada', 'rechazada'].includes(status)) {
    res.status(400).json({ success: false, message: 'Invalid status' });
    return;
  }

  try {
    let receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      res.status(404).json({ success: false, message: 'Receipt not found' });
      return;
    }

    // Make sure the receipt belongs to the logged in user
    if (receipt.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ success: false, message: 'Not authorized to update this receipt' });
      return;
    }

    // Update status
    receipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    res.json({
      success: true,
      data: receipt
    });
  } catch (error) {
    console.error('Error in updateReceiptStatus: ', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get receipt statistics
// @route   GET /api/receipts/stats
// @access  Private
export const getReceiptStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalReceipts = await Receipt.countDocuments({ user: req.user._id });
    const enRevision = await Receipt.countDocuments({ user: req.user._id, status: 'en_revision' });
    const aceptadas = await Receipt.countDocuments({ user: req.user._id, status: 'aceptada' });
    const rechazadas = await Receipt.countDocuments({ user: req.user._id, status: 'rechazada' });
    
    // Get total amount of accepted receipts
    const totalAmount = await Receipt.aggregate([
      { $match: { user: req.user._id, status: 'aceptada' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalReceipts,
        enRevision,
        aceptadas,
        rechazadas,
        totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0
      }
    });
  } catch (error) {
    console.error('Error in getReceiptStats: ', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};