import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import * as authControllers from '../controllers/auth.js';
import validateBody from '../utils/validateBody.js';
import { userSignupSchema, userSigninSchema } from '../validation/users.js';

const authRouter = Router();

authRouter.post(
  '/signup',
  validateBody(userSignupSchema),
  ctrlWrapper(authControllers.signupController),
);
// authRouter.post(
//   '/signup',
//   (req, res, next) => {
//     console.log('Signup route hit');
//     next();
//   },
//   validateBody(userSignupSchema),
//   ctrlWrapper(authControllers.signupController),
// );

authRouter.post(
  '/signin',
  validateBody(userSigninSchema),
  ctrlWrapper(authControllers.signinController),
);

authRouter.post('/refresh', ctrlWrapper(authControllers.refreshController));

authRouter.post('/signout', ctrlWrapper(authControllers.signoutController));
export default authRouter;

// authRouter.post(
//   '/register',
//   validateBody(userSignupSchema),
//   ctrlWrapper(authControllers.signupController),
// );

// authRouter.post(
//   '/login',
//   validateBody(userSigninSchema),
//   ctrlWrapper(authControllers.signinController),
// );

// authRouter.post('/refresh', ctrlWrapper(authControllers.refreshController));

// authRouter.post('/logout', ctrlWrapper(authControllers.logoutController));
