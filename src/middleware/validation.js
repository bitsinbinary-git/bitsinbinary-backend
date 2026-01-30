import { body } from 'express-validator';

// User registration validation
export const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .toLowerCase(),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
];

// Username validation (for checking availability)
export const validateUsername = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .toLowerCase(),
];

// User login validation (accepts email or username)
export const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Please provide email or username')
    .custom((value) => {
      // Check if it's either a valid email or valid username format
      const isEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
      const isUsername = /^[a-zA-Z0-9_]{3,20}$/.test(value);
      
      if (!isEmail && !isUsername) {
        throw new Error('Please provide a valid email or username');
      }
      return true;
    }),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];