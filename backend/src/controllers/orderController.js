const orderModel = require('../models/orderModel');
const materialModel = require('../models/materialModel');
const { estimateVolume } = require('../utils/stlVolume');
const { calculateQuote } = require('../utils/quote');
const path = require('path');
const fs = require('fs');
const { log } = require('../middleware/logger');

exports.create = (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'STL file is required' });

    const { quality, infill, color, material_id } = req.body;
    const parsedInfill = parseInt(infill, 10);
    if (!quality || !parsedInfill || parsedInfill < 10 || parsedInfill > 100) {
      return res.status(400).json({ error: 'Invalid quality or infill (10-100)' });
    }

    const material = materialModel.findById(parseInt(material_id, 10));
    if (!material) return res.status(404).json({ error: 'Material not found' });

    const volumeCm3 = estimateVolume(req.file.size);
    const quoteCents = calculateQuote({
      volumeCm3,
      materialPricePerCm3: material.price_per_cm3,
      quality,
      infill: parsedInfill,
    });

    const order = orderModel.create({
      userId: req.user.id,
      filename: req.file.filename,
      materialId: material.id,
      quality,
      infill: parsedInfill,
      color: color || material.color,
      volumeCm3,
      quoteCents,
    });

    log.info(`Order #${order.id} created by user #${req.user.id}`);

    res.status(201).json(order);
  } catch (err) {
    if (req.file) {
      const filePath = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
      fs.unlink(filePath, () => {});
    }
    next(err);
  }
};

exports.mine = (req, res, next) => {
  try {
    const orders = orderModel.findByUserId(req.user.id);
    res.json(orders);
  } catch (err) { next(err); }
};

exports.listAll = (req, res, next) => {
  try {
    const orders = orderModel.findAll();
    res.json(orders);
  } catch (err) { next(err); }
};

exports.updateStatus = (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'printing', 'shipped', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = orderModel.updateStatus(parseInt(req.params.id, 10), status);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    log.info(`Order #${order.id} status updated to "${status}"`);
    res.json(order);
  } catch (err) { next(err); }
};

exports.cancel = (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    const order = orderModel.findById(orderId);
    
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this order' });
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Can only cancel pending orders' });
    }

    const updated = orderModel.updateStatus(orderId, 'cancelled');
    log.info(`Order #${orderId} cancelled by user #${req.user.id}`);
    res.json(updated);
  } catch (err) { next(err); }
};
