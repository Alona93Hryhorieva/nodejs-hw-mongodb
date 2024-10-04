import jwt from 'jsonwebtoken';
import { env } from './env.js';

const jwtSecret = env('JWT_SECRET');

// export const createJwtToken = (payload) => jwt.sign(payload, jwtSecret);
export const createJwtToken = (user) => {
  const payload = {
    data: {
      email: user.email, // Додайте електронну адресу сюди
      // Можна додати інші дані, якщо потрібно
    },
  };
  return jwt.sign(payload, jwtSecret);
};
// export const verifyToken = (token) => {
//   try {
//     const payload = jwt.verify(token, jwtSecret);
//     return { data: payload };
//   } catch (error) {
//     console.log(error.message);
//     return { error };
//   }
// };
export const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, jwtSecret);
    return { data: payload }; // Повертаємо дані
  } catch (error) {
    console.log(error.message);
    return { error };
  }
};
