import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { tokenRouter } from '@/api/tokens/tokensRouter';
import { accountRouter } from '@/api/account/accountRouter';
import { sessionRouter } from '@/api/account/sessionRouter';
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { openAPIRouter } from '@/api-docs/openAPIRouter';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';
import cookieParser from 'cookie-parser';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Add middleware to parse cookies from the request headers
app.use(cookieParser());

// Parse JSON request bodies
app.use(express.json());

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/api/account', accountRouter);
app.use('/api/account', sessionRouter);
app.use('/api/tokens', tokenRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
