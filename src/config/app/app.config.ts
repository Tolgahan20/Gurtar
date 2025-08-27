import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  swagger: {
    title: 'Gurtar API',
    description: 'Too Good To Go clone for Turkish Republic of North Cyprus',
    version: '1.0.0',
    path: 'docs',
  },
}));
