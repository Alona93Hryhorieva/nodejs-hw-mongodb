import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './utils/env.js';
import { UPLOAD_DIR } from './constants/index.js';
import contactRouter from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import loggerHandler from './middlewares/loggerHandler.js';
import authRouter from './routers/auth.js';
import swaggerDocs from './middlewares/swaggerDocs.js';
export const setupServer = () => {
  const app = express();

  app.use(loggerHandler);

  app.use(cors());

  app.use(express.json());

  app.use(cookieParser());

  app.use('uploads', express.static(UPLOAD_DIR));

  app.use('/auth', authRouter);

  app.use('/contacts', contactRouter);

  app.use('/api-docs', swaggerDocs());

  app.use(notFoundHandler);

  app.use(errorHandler);

  const PORT = Number(env('PORT', 3000));

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};
