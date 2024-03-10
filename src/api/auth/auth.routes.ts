import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {
  findUserByEmail,
  createUserByEmailAndPassword,
  findUserById,
} from '../users/users.services';
import { generateTokens } from '../../utils/jwt';
import {
  addRefreshTokenToWhitelist,
  findRefreshTokenById,
  deleteRefreshToken,
  revokeTokens,
} from './auth.services';
import { hashToken } from '../../utils/hashToken';
import {ILoginUser, IRegisterUser} from "./interfaces";
import {errorsTypes} from "../../common/errors/errors";
import {validateDto} from "../../middlewares";
import {CreateUserDto} from "./dtos";

const router = express.Router();

interface TokenPayload {
  userId: string;
  jti: string;
}

router.post('/register', validateDto(CreateUserDto), async (req: Request<{}, {}, IRegisterUser>, res: Response, next: NextFunction) => {
  try {
    const { email, password, avatars, name } = req.body;
    if (!email || !password) {
      res.status(400).send(errorsTypes.user.NOT_PROVIDE_EMAIL_PASS);
      return;
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      res.status(400).send(errorsTypes.user.USER_ALREADY_EXIST);
      return;
    }

    const user = await createUserByEmailAndPassword({ email, password, avatars, name });
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req: Request<{}, {}, ILoginUser>, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send(errorsTypes.user.NOT_PROVIDE_EMAIL_PASS);
      return;
    }
    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      res.status(404).send(errorsTypes.user.USER_NOT_FOUND);
      return;
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      res.status(403).send(errorsTypes.user.USER_INVALID_CREDENTIAL);
      return;
    }

    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.id });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/refreshToken', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).send('Missing refresh token.');
      return;
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as TokenPayload;
    const savedRefreshToken = await findRefreshTokenById(payload.jti);

    if (!savedRefreshToken || savedRefreshToken.revoked) {
      res.status(401).send('Unauthorized');
      return;
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401).send('Unauthorized');
      return;
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      res.status(401).send('Unauthorized');
      return;
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = uuidv4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
});

// This endpoint is only for demo purposes.
// Move this logic where you need to revoke the tokens (for example, on password reset)
router.post('/revokeRefreshTokens', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    await revokeTokens(userId);
    res.json({ message: `Tokens revoked for user with id #${userId}` });
  } catch (err) {
    next(err);
  }
});
export default router;
