import express from 'express';
import { isAuthenticated } from '../../middlewares'; // Adjust the path as needed
import {findUserById, getAllUsers, likeUser, unlikeUser, updateUser} from './users.services'; // Adjust the path as needed
import { Request, Response, NextFunction } from 'express';
import {IUpdateUser} from "../auth/interfaces";
import {User} from "./models/user.model";
import {userSockets} from "../socket";
import {websocket} from "../../index";
import {errorsTypes} from "../../common/errors/errors";

// Extending the Request type to include payload
interface AuthenticatedRequest extends Request {
  payload?: {
    userId: string;
  };
}
interface AuthenticatedRequest2 extends Request {
  body: IUpdateUser;
  payload?: {
    userId: string;
  };
}

const router = express.Router();

router.get('/', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users: User[] = await getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/profile', isAuthenticated, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.payload!;
    const user: User | null = await findUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(400).send(errorsTypes.user.USER_NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/update', isAuthenticated, async (req: AuthenticatedRequest2, res: Response, next: NextFunction) => {
  try {
    const user = await findUserById(req.payload?.userId!);
    if (user) {
      const updatedUser: User = await updateUser(user, req.body!);
      res.json(updatedUser);
    } else {
      res.status(404).json(errorsTypes.user.USER_NOT_FOUND);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/like/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId } = req.payload!;
    if (id === userId) {
      res.status(400).json(errorsTypes.user.USER_NOT_ALLOWED_LIKE_THEMSELVES);
    }
    const likedUser = await findUserById(id);
    if(!likedUser) {
      res.status(404).json(errorsTypes.user.USER_NOT_FOUND);
    }

    const userLike = await likeUser(userId, id);
    if (!userLike) {
      res.status(400).json(errorsTypes.user.USER_ALREADY_LIKE);
    } else {
      const targetSocketId = userSockets.get(id);
      if (targetSocketId) {
        // websocket.to(targetSocketId).emit('likeNotification', { userId });
      }
      res.json({
        liked: true,
      });
    }
  } catch (error) {
    next(error)
  }
});

router.post('/unlike/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId } = req.payload!;
    const unlikedUser = await findUserById(id);
    if(!unlikedUser) {
      res.status(404).json(errorsTypes.user.USER_NOT_FOUND);
    }

    const userUnLike = await unlikeUser(userId, id);
    if (!userUnLike) {
      res.status(400).json(errorsTypes.user.USER_DID_NOT_LIKE);
    } else {
      res.json({
        unlike: true,
      });
    }
  } catch (error) {
    next(error)
  }
});


export default router;
