import 'reflect-metadata';

import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import responser from 'responser';

import { appDataSource } from './app-data-source';
import { config } from './config';
import {
  TaskController,
  UserController,
  UserPrivateController,
} from './controllers';
import { privateAuthMiddleware } from './middleware';
import { compressFilter } from './utils';

// establish database connection
appDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

const app: Express = express();

app.use(responser);
app.use(bodyParser.json());

// Helmet is used to secure this app by configuring the http-header
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: [config.cors_origin, 'https://localhost', 'https://localhost:3000'],
    credentials: true,
  })
);

app.use(cookieParser());

// Compression is used to reduce the size of the response body
app.use(compression({ filter: compressFilter }));

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'success', data: 'Hello World!' });
});

app.use('/api/auth', UserController);
app.use('/api/auth', privateAuthMiddleware, UserPrivateController);
app.use('/api/task', privateAuthMiddleware, TaskController);

export { app };
