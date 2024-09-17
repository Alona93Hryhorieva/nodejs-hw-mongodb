import express from 'express';
import cors from 'cors';

import { env } from './utils/env.js';
import contactRouter from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import loggerHandler from './middlewares/loggerHandler.js';
import authRouter from './routers/auth.js';

export const setupServer = () => {
  const app = express();

  app.use(loggerHandler);

  app.use(cors());

  app.use(express.json());

  app.use('/auth', authRouter);

  app.use('/contacts', contactRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const PORT = Number(env('PORT', 3000));

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};
