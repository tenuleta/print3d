const { Router } = require('express');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');
const userModel = require('../models/userModel');

const router = Router();

router.get('/', authenticate, authorize('admin'), (req, res) => {
  const users = userModel.findAll();
  res.json(users);
});

module.exports = router;
