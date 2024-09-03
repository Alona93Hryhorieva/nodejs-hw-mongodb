import 'dotenv/config';
// import dotenv from 'dotenv';
// dotenv.config(); до спрощення коду

export const env = (name, defaultValue) => {
  const value = process.env[name];
  // if(!value && !defaultValue) throw new Error(`Missing process.env[${name}]`);
  //return value || defaultValue  простіший запис
  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing process.env[${name}]`);
};
