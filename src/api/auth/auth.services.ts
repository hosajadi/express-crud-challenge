import { db } from '../../utils/db'; // Adjust the import path as needed
import { hashToken } from '../../utils/hashToken';

interface RefreshTokenPayload {
  jti: string;
  refreshToken: string;
  userId: string;
}

interface RefreshToken {
  id: string;
  hashedToken: string;
  userId: string;
  revoked?: boolean;
}

function addRefreshTokenToWhitelist({ jti, refreshToken, userId }: RefreshTokenPayload): Promise<RefreshToken> {
  return db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
}

function findRefreshTokenById(id: string): Promise<RefreshToken | null> {
  return db.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

function deleteRefreshToken(id: string): Promise<RefreshToken> {
  return db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
}

function revokeTokens(userId: string): Promise<{ count: number }> {
  return db.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
}

export { addRefreshTokenToWhitelist, findRefreshTokenById, deleteRefreshToken, revokeTokens };
