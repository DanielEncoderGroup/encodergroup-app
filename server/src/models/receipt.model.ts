import mongoose, { Document, Schema } from 'mongoose';

export interface IReceipt extends Document {
  user: mongoose.Schema.Types.ObjectId;
  companyName: string;
  folioNumber: string;
  date: Date;
  description: string;
  totalAmount: number;
  imageUrl?: string;
  status: 'en_revision' | 'aceptada' | 'rechazada';
  createdAt: Date;
  updatedAt: Date;
}

const ReceiptSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: [true, 'Please provide the company name'],
    trim: true
  },
  folioNumber: {
    type: String,
    required: [true, 'Please provide the folio number'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please provide the receipt date'],
    default: Date.now
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please provide the total amount']
  },
  imageUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['en_revision', 'aceptada', 'rechazada'],
    default: 'en_revision'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IReceipt>('Receipt', ReceiptSchema);