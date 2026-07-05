const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');
const ctrl = require('../controllers/orderController');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'uploads'),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.stl';
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.stl') {
      cb(null, true);
    } else {
      cb(new Error('Only .stl files are allowed'), false);
    }
  },
});

const router = Router();

router.post('/', authenticate, upload.single('stl_file'), ctrl.create);
router.get('/mine', authenticate, ctrl.mine);
router.get('/', authenticate, authorize('admin'), ctrl.listAll);
router.patch('/:id/status', authenticate, authorize('admin'), ctrl.updateStatus);
router.patch('/:id/cancel', authenticate, ctrl.cancel);

module.exports = router;
