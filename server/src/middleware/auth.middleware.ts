import { NextFunction,Request, Response } from 'express';

import { authService } from '../services';

export const privateAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionCookie = req.cookies?.['session_token'];

  if (!sessionCookie) {
    return res.status(401).json({ msg: 'No Authorization cookie was found' });
  }

  return authService().verify(sessionCookie, (err) => {
    if (err) return res.send_unauthorized('Invalid token', { err });
    req.currentUser = authService().extract(sessionCookie as string) as {
      id: string;
    };

    return next();
  });
};
