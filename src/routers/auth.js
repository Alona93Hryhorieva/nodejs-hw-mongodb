import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import * as authControllers from '../controllers/auth.js';
import validateBody from '../utils/validateBody.js';
import { userRegisterSchema, userLoginSchema } from '../validation/users.js';

import { requestResetEmailSchema } from '../validation/users.js';
import { sendResetEmailController } from '../controllers/auth.js';
import { resetPasswordSchema } from '../validation/users.js';
import { resetPasswordController } from '../controllers/auth.js';
const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(userRegisterSchema),
  ctrlWrapper(authControllers.registerController),
);
authRouter.get('/verify', ctrlWrapper(authControllers.verifyController));

authRouter.post(
  '/login',
  validateBody(userLoginSchema),
  ctrlWrapper(authControllers.loginController),
);

authRouter.post('/refresh', ctrlWrapper(authControllers.refreshController));

authRouter.post('/logout', ctrlWrapper(authControllers.logoutController));

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default authRouter;
