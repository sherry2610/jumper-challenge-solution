import express, { Router } from 'express';
import { Request, Response } from 'express';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { fetchERC20Tokens } from './tokenService';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';

export const tokensRegistry = new OpenAPIRegistry();
tokensRegistry.registerPath({
  method: 'get',
  path: '/api/tokens/{chainId}/{address}',
  tags: ['Tokens'],
  parameters: [
    {
      name: 'chainId',
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'Network Chain ID',
    },
    {
      name: 'address',
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'Ethereum address',
    },
  ],
  responses: createApiResponse(
    z.object({
      success: z.boolean(),
      tokens: z.array(
        z.object({
          address: z.string(),
          name: z.string(),
          symbol: z.string(),
          balance: z.string(),
        })
      ),
    }),
    'List of ERC20 tokens'
  ),
});

export const tokenRouter: Router = (() => {
  const router = express.Router();

  /*
This endpoint is for : 
 - GET /api/tokens/:address
 - Fetches ERC20 tokens for the given Ethereum address and chainId.
 */
  router.get('/:chainId?/:userAddress?', async (req: Request, res: Response) => {
    try {
      const { chainId, userAddress } = req.params;
      console.log('INSIDE token api!', { chainId, userAddress });
      if (!userAddress || !chainId) {
        const serviceResponse = new ServiceResponse(
          ResponseStatus.Failed,
          'Missing Ethereum address or chainId!',
          null,
          StatusCodes.UNPROCESSABLE_ENTITY
        );
        return handleServiceResponse(serviceResponse, res);
      }
      const tokens = await fetchERC20Tokens(userAddress, chainId);

      const serviceResponse = new ServiceResponse(
        ResponseStatus.Success,
        'Tokens Fetched Successfully!',
        { tokens },
        StatusCodes.OK
      );
      return handleServiceResponse(serviceResponse, res);
    } catch (error: any) {
      const serviceResponse = new ServiceResponse(
        ResponseStatus.Failed,
        `${error.message}`,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      return handleServiceResponse(serviceResponse, res);
    }
  });
  return router;
})();
