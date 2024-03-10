import express from 'express';
import auth from './auth/auth.routes'; // Adjust the path as needed
import users from './users/users.routes'; // Adjust the path as needed

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/auth', auth);
router.use('/users', users);

export default router;
