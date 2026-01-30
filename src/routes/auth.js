import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  logout,
  getMe,
  checkUsernameAvailability,
  googleCallback,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin, validateUsername } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/check-username', validateUsername, checkUsernameAvailability);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/sign-in?error=auth_failed`,
    session: false 
  }),
  googleCallback
);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;