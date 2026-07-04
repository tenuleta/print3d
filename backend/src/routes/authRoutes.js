const { Router } = require('express');
const { body } = require('express-validator');
const handleValidation = require('../middleware/validate');
const ctrl = require('../controllers/authController');

const router = Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], handleValidation, ctrl.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
], handleValidation, ctrl.login);

router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);

module.exports = router;
