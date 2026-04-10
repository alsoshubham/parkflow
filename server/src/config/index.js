import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  nodeEnv: process.env.NODE_ENV || 'development',
};
