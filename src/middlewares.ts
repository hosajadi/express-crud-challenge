import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

function notFound(req: Request, res: Response, next: NextFunction): void {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    // Assuming process.env.NODE_ENV is a string or undefined.
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}

function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(401);
    throw new Error('🚫 Un-Authorized 🚫');
  }

  try {
    const token = authorization.split(' ')[1];
    // You need to specify the secret's type or make sure it's available in the environment variables
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    // You might need to extend the Request type to include payload or use any here
    (req as any).payload = payload;
  } catch (err: any) { // Catching anything throws and treating it as any to access its properties
    res.status(401);
    if (err.name === 'TokenExpiredError') {
      throw new Error(err.name);
    }
    throw new Error('🚫 Un-Authorized 🚫');
  }

  return next();
}

export { notFound, errorHandler, isAuthenticated };
