import { env } from '@/common/utils/envConfig';
import express, { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const sessionRouter: Router = (() => {
  const router = express.Router();

  router.get('/session', (req: Request, res: Response) => {
    const token = req.cookies.sessionToken;
    if (!token) {
      return res.status(401).json({ valid: false, error: 'Session expired or invalid' });
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET!);
      return res.json({ valid: true, address: (decoded as any).address });
    } catch (err: any) {
      return res.status(401).json({ valid: false, error: 'Session expired or invalid' });
    }
  });

  return router;
})();
