import { Router, Response } from 'express';
import Shipment from '../models/Shipment.js';
import User from '../models/User.js';
import { AuthRequest } from '../types/index.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { generateTrackingNumber } from '../utils/trackingNumber.js';

const router = Router();

router.post(
  '/',
  verifyToken,
  requireRole(['client']),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { recipientName, recipientAddress, shipmentDetails } = req.body;

      if (!recipientName || !recipientAddress || !shipmentDetails) {
        res.status(400).json({
          error: 'Recipient name, address, and shipment details are required',
        });
        return;
      }

      const user = await User.findById(req.user?.userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const shipment = new Shipment({
        trackingNumber: generateTrackingNumber(),
        userId: req.user?.userId,
        senderName: user.name,
        senderAddress: user.email,
        recipientName,
        recipientAddress,
        shipmentDetails,
        status: 'Pending',
      });

      await shipment.save();

      res.status(201).json({
        message: 'Shipment created successfully',
        shipment,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create shipment' });
    }
  }
);

router.get(
  '/:trackingNumber',
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const trackingNumber = req.params.trackingNumber.trim().toUpperCase();
      
      if (!trackingNumber || trackingNumber.length < 5) {
        res.status(400).json({ error: 'Please enter a valid tracking number (e.g., TRK-ABC12345)' });
        return;
      }

      const shipment = await Shipment.findOne({
        trackingNumber: trackingNumber,
      });

      if (!shipment) {
        res.status(404).json({ 
          error: `Tracking number "${trackingNumber}" not found. Please verify the tracking number and try again.` 
        });
        return;
      }

      res.json(shipment);
    } catch (error) {
      console.error('Tracking error:', error);
      res.status(500).json({ error: 'Unable to retrieve shipment information. Please try again later.' });
    }
  }
);

router.get(
  '/',
  verifyToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      let shipments;

      if (req.user?.role === 'admin') {
        shipments = await Shipment.find().populate('userId', 'name email');
      } else {
        shipments = await Shipment.find({ userId: req.user?.userId });
      }

      res.json(shipments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve shipments' });
    }
  }
);

router.put(
  '/:id',
  verifyToken,
  requireRole(['admin']),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status } = req.body;

      if (!status || !['Pending', 'In Transit', 'Delivered'].includes(status)) {
        res.status(400).json({ error: 'Valid status is required' });
        return;
      }

      const shipment = await Shipment.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!shipment) {
        res.status(404).json({ error: 'Shipment not found' });
        return;
      }

      res.json({
        message: 'Shipment updated successfully',
        shipment,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update shipment' });
    }
  }
);

export default router;
