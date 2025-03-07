import request from 'supertest';
import express from 'express';
import { tokenRouter } from '@/api/tokens/tokensRouter';
import { StatusCodes } from 'http-status-codes';
import { fetchERC20Tokens } from '@/api/tokens/tokenService';
import { vi } from 'vitest';

// mocking the token fetching service:
vi.mock('@/api/tokens/tokenService', () => ({
  fetchERC20Tokens: vi.fn(),
}));

describe('Tokens Router', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/tokens', tokenRouter);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('should return error if chainId or address is missing', async () => {
    // Calling with only chainId provided
    const res = await request(app).get('/api/tokens/11155111');
    expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.body).toHaveProperty('message', 'Missing Ethereum address or chainId!');
  });

  test('should return tokens for valid chainId and address', async () => {
    // mocking fetchERC20Tokens to resolve with tokens
    (fetchERC20Tokens as any).mockResolvedValue({
      tokens: [
        { address: '0xToken1', name: 'Token One', symbol: 'TKN1', balance: '100' },
        { address: '0xToken2', name: 'Token Two', symbol: 'TKN2', balance: '200' },
      ],
    });

    const res = await request(app).get('/api/tokens/11155111/0xTestAddress');
    expect(res.status).toBe(StatusCodes.OK);
    console.log('res.body', res.body);
    expect(res.body.responseObject).toHaveProperty('tokens');
    expect(res.body.responseObject.tokens.tokens).toHaveLength(2);
  });

  test('should handle internal server errors gracefully', async () => {
    (fetchERC20Tokens as any).mockRejectedValue(new Error('Internal error'));
    const res = await request(app).get('/api/tokens/11155111/0xTestAddress');
    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toHaveProperty('message', 'Internal error');
  });
});
