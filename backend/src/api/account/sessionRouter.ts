import { env } from '@/common/utils/envConfig';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import express, { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const sessionRegistry = new OpenAPIRegistry();

sessionRegistry.registerPath({
  method: 'get',
  path: '/api/account/session',
  tags: ['Check Session Validity'],
  parameters: [
    {
      name: 'address',
      in: 'query',
      required: true,
      schema: { type: 'string' },
      description: 'User address for which to check the session for',
    },
  ],
  responses: createApiResponse(
    z.object({
      valid: z.boolean(),
      address: z.string(),
    }),
    'Session valid'
  ),
});

export const sessionRouter: Router = (() => {
  const router = express.Router();

  router.get('/session', (req: Request, res: Response) => {
    const { address } = req.query;
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ valid: false, error: 'Missing address query parameter' });
    }

    const token = req.cookies[`sessionToken_${address.toLowerCase()}`];
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
