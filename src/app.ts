import express, { Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import * as middlewares from './middlewares';
import api from './api';

dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello To You' + '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});
app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
export default app;

// "start": "node build/app.js",
// "scripts": {
//   "build": "tsc",
//       "buildd": "tsc --project tsconfig.build.json",
//       "start": "node dist/app.js",
//       "startt":"node dist",
//       "dev": "nodemon src/index.ts",
//       "devv": "tsc --watch & NODE_ENV=development nodemon dist",
//       "watch": "tsc -w",
//       "migrate:dev": "prisma migrate dev --preview-feature",
//       "migrate:deploy": "npx prisma migrate deploy --preview-feature",
//       "seedd": "prisma db seed",
//       "seed": "node prisma\\seed.js",
//       "docker:db": "docker-compose -f docker-compose.mysql.yml --env-file=.env up -d",
//       "docker": "docker-compose up -d"
// },
