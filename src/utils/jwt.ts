import jwt from 'jsonwebtoken';
import configService from "../common/config/configService";

interface User {
  id: string;
}

function generateAccessToken(user: User): string {
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: configService.getWithDefault('JWT_ACCESS_TOKEN_EXPIRE', '10d'),
  });
}
function generateRefreshToken(user: User, jti: string): string {
  return jwt.sign({
    userId: user.id,
    jti,
  }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: configService.getWithDefault('JWT_REFRESH_TOKEN_EXPIRE', '20d'),
  });
}
function generateTokens(user: User, jti: string): { accessToken: string, refreshToken: string } {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
}

export { generateAccessToken, generateRefreshToken, generateTokens };
