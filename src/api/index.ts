import express from 'express';
import auth from './auth/auth.routes';
import users from './users/users.routes';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/auth', auth);
router.use('/users', users);

export default router;
