const { body } = require('express-validator');

const updateMeRules = [
  body('name').optional().isLength({ min: 1, max: 100 }).withMessage('name không hợp lệ'),
  body('email').optional().isEmail().withMessage('email không hợp lệ'),
  body('phone').optional().isLength({ min: 8, max: 20 }).withMessage('phone không hợp lệ'),
  body('address').optional().isLength({ max: 255 }).withMessage('address quá dài'),
  body('avatar').optional().isURL().withMessage('avatar phải là URL hợp lệ'),
  // chặn các trường nhạy cảm
  body('role').not().exists().withMessage('Không được cập nhật role'),
  body('is_active').not().exists().withMessage('Không được cập nhật is_active'),
  body('password_hash').not().exists(),
];

const changePasswordRules = [
  body('old_password').isLength({ min: 6 }).withMessage('old_password tối thiểu 6 ký tự'),
  body('new_password').isLength({ min: 6 }).withMessage('new_password tối thiểu 6 ký tự'),
];

module.exports = {
  updateMeRules,
  changePasswordRules,
};