import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IShipment extends Document {
  trackingNumber: string;
  userId: Types.ObjectId;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  shipmentDetails: string;
  status: 'Pending' | 'In Transit' | 'Delivered';
  createdAt: Date;
  updatedAt: Date;
}

const shipmentSchema = new Schema<IShipment>(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderAddress: {
      type: String,
      required: true,
    },
    recipientName: {
      type: String,
      required: true,
    },
    recipientAddress: {
      type: String,
      required: true,
    },
    shipmentDetails: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Transit', 'Delivered'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IShipment>('Shipment', shipmentSchema);
