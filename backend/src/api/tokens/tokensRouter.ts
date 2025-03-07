import express, { Router } from 'express';
import { Request, Response } from 'express';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { fetchERC20Tokens } from './tokenService';

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
