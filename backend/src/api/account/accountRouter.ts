import express, { Router, Request, Response } from 'express';
import { verifyMessage } from 'ethers';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { StatusCodes } from 'http-status-codes';
import { env } from '@/common/utils/envConfig';

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

      //   if signature is verified, return the success message
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
