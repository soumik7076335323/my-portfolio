const ContactMessage = require('../models/ContactMessage');
const { HttpError } = require('../utils/crudFactory');

// POST /api/contact (public)
exports.sendMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const doc = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({
      success: true,
      message: 'Message sent successfully. Thank you for reaching out!',
      data: { id: doc._id, createdAt: doc.createdAt },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/contact (admin)
exports.listMessages = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 25);
    const filter = {};
    if (req.query.status && ['unread', 'read', 'replied'].includes(req.query.status)) {
      filter.status = req.query.status;
    }
    const [items, total] = await Promise.all([
      ContactMessage.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ContactMessage.countDocuments(filter),
    ]);
    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      unread: await ContactMessage.countDocuments({ status: 'unread' }),
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/contact/:id/status (admin)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['unread', 'read', 'replied'].includes(status)) {
      throw new HttpError(400, 'Invalid status');
    }
    const doc = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!doc) throw new HttpError(404, 'Message not found');
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/contact/:id (admin)
exports.deleteMessage = async (req, res, next) => {
  try {
    const doc = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!doc) throw new HttpError(404, 'Message not found');
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
};
