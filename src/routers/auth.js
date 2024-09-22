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

// authRouter.post('/refresh', ctrlWrapper(authControllers.refreshController));

// authRouter.post('/signout', ctrlWrapper(authControllers.signoutController));
export default authRouter;

/*жпт
const express = require('express');
const { register } = require('../controllers/auth');
const router = express.Router();

router.post('/register', register);

module.exports = router;


const express = require('express');
const { loginController } = require('../controllers/auth');
const router = express.Router();

router.post('/login', loginController);

module.exports = router;



const express = require('express');
const { register, login } = require('../controllers/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login); // Новий роут для логіну

module.exports = router;
*/
