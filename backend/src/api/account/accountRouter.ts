import express, { Router, Request, Response } from 'express';
import { verifyMessage } from 'ethers';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { StatusCodes } from 'http-status-codes';
import { env } from '@/common/utils/envConfig';
import jwt from 'jsonwebtoken';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { z } from 'zod';

export const accountRegistry = new OpenAPIRegistry();

accountRegistry.registerPath({
  method: 'post',
  path: '/api/account/create',
  tags: ['Account Creation'],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            address: { type: 'string' },
            signature: { type: 'string' },
          },
          required: ['address', 'signature'],
        },
      },
    },
  },
  responses: createApiResponse(
    z.object({
      success: z.boolean(),
      message: z.string().optional(),
    }),
    'Account created / authenticated successfully'
  ),
});

export const accountRouter: Router = (() => {
  const router = express.Router();

  router.post('/create', async (req: Request, res: Response) => {
    try {
      const { address, signature } = req.body;
      if (!address || !signature) {
        const serviceResponse = new ServiceResponse(
          ResponseStatus.Failed,
          'Missing address or signature',
          null,
          StatusCodes.BAD_REQUEST
        );
        return handleServiceResponse(serviceResponse, res);
      }

      const SIGN_MESSAGE = env.SIGN_MESSAGE;
      const recoveredAddress = verifyMessage(SIGN_MESSAGE, signature);

      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        const serviceResponse = new ServiceResponse(
          ResponseStatus.Failed,
          'Signature verification failed',
          null,
          StatusCodes.UNAUTHORIZED
        );
        return handleServiceResponse(serviceResponse, res);
      }

      //   if signature is verified, generate a 1hr session token and return the success message
      const token = jwt.sign({ address }, env.JWT_SECRET!, {
        expiresIn: '1h',
      });

      // setting the token as http-only cookie
      res.cookie('sessionToken', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000, // 1 hour
      });

      const serviceResponse = new ServiceResponse(
        ResponseStatus.Success,
        'Account verified successfully',
        { address },
        StatusCodes.OK
      );
      return handleServiceResponse(serviceResponse, res);
    } catch (error: any) {
      console.error(error);
      const serviceResponse = new ServiceResponse(
        ResponseStatus.Failed,
        'Internal server error',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      return handleServiceResponse(serviceResponse, res);
    }
  });

  return router;
})();
