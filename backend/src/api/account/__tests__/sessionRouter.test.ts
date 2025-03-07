import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { sessionRouter } from '@/api/account/sessionRouter';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { vi } from 'vitest';

vi.mock('jsonwebtoken', async () => {
  const actualModule = await vi.importActual('jsonwebtoken');
  return {
    default: { ...actualModule, verify: vi.fn() },
  };
});

describe('Session Router', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(cookieParser());
    app.use('/api/account', sessionRouter);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('should return 401 if no session token is provided', async () => {
    const res = await request(app).get('/api/account/session');
    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty('error', 'Session expired or invalid');
  });

  test('should return valid session if token is valid', async () => {
    (jwt.verify as any).mockReturnValue({ address: '0xTestAddress' });
    const res = await request(app).get('/api/account/session').set('Cookie', ['sessionToken=fakeToken']);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('valid', true);
    expect(res.body).toHaveProperty('address', '0xTestAddress');
  });

  test('should return 401 if token is invalid or expired', async () => {
    (jwt.verify as any).mockImplementation(() => {
      throw new Error('Invalid token');
    });
    const res = await request(app).get('/api/account/session').set('Cookie', ['sessionToken=invalidToken']);
    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty('error', 'Session expired or invalid');
  });
});
