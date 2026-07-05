const materialModel = require('../models/materialModel');

exports.list = (req, res, next) => {
  try {
    const materials = materialModel.findAll();
    res.json(materials);
  } catch (err) { next(err); }
};
