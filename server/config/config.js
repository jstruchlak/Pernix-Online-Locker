
const path = require('path');
const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';


const envFile = env === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.resolve(__dirname, envFile) });

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  SECRET: process.env.SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  DEV_BASE_URL: process.env.DEV_BASE_URL
};

module.exports = config;
