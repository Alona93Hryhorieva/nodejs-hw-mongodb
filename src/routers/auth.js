import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import * as authControllers from '../controllers/auth.js';
import validateBody from '../utils/validateBody.js';
import { userRegisterSchema, userLoginSchema } from '../validation/users.js';
import { requestResetEmailSchema } from '../validation/users.js';
import { resetPasswordSchema } from '../validation/users.js';
// import { getGoogleOAuthUrlController } from '../controllers/auth.js';
// import { loginController } from '../controllers/auth.js';
import { loginWithGoogleOAuthSchema } from '../validation/users.js';
const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(userRegisterSchema),
  ctrlWrapper(authControllers.registerController),
);

// authRouter.get('/verify', ctrlWrapper(authControllers.verifyController));

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
  ctrlWrapper(authControllers.sendResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(authControllers.resetPasswordController),
);

authRouter.get(
  '/get-oauth-url',
  ctrlWrapper(authControllers.getGoogleOAuthUrlController),
);

authRouter.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(authControllers.loginWithGoogleController),
);

export default authRouter;
