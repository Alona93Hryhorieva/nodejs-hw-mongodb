import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import * as authControllers from '../controllers/auth.js';
import validateBody from '../utils/validateBody.js';
import { userRegisterSchema, userLoginSchema } from '../validation/users.js';

// import { requestResetEmailSchema } from '../validation/auth.js';
// import { requestResetEmailController } from '../controllers/auth.js';

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

// router.post(
//   '/request-reset-email',
//   validateBody(requestResetEmailSchema),
//   ctrlWrapper(requestResetEmailController),
// );
export default authRouter;
