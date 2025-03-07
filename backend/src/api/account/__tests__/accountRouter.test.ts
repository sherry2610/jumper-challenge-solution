import request from 'supertest';
import express from 'express';
import { accountRouter } from '@/api/account/accountRouter';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { verifyMessage } from 'ethers';
import { vi } from 'vitest';

// mock environment variables for testing
process.env.SIGN_MESSAGE = 'test message';
process.env.JWT_SECRET = 'test secret';

vi.mock('ethers', () => ({
  verifyMessage: vi.fn(),
}));

vi.mock('jsonwebtoken', () => ({
  sign: vi.fn(() => 'fakeToken'),
}));

describe('Account Router', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/account', accountRouter);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('should return error for missing address or signature', async () => {
    const res = await request(app).post('/api/account/create').send({});
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('message', 'Missing address or signature');
  });

  test('should return error for invalid signature', async () => {
    (verifyMessage as any).mockReturnValue('0xDifferentAddress');
    const res = await request(app).post('/api/account/create').send({
      address: '0xTestAddress',
      signature: 'invalidSignature',
    });
    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty('message', 'Signature verification failed');
  });

  test('should return success for valid signature and set http-only cookie', async () => {
    (verifyMessage as any).mockReturnValue('0xTestAddress');
    const res = await request(app).post('/api/account/create').send({
      address: '0xTestAddress',
      signature: 'validSignature',
    });

    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('message', 'Account verified successfully');
    expect(res.header['set-cookie'][0]).toContain('sessionToken=');
  });
});
