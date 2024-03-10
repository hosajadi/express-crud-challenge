import { Response } from 'express';

function sendRefreshToken(res: Response, token: string): void {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    sameSite: 'strict', // 'strict' or 'lax'. Assuming 'strict' for stronger security, adjust as needed.
    path: '/api/v1/auth',
  });
}

export { sendRefreshToken };
