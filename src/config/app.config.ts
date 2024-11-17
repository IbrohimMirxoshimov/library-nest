import { registerAs } from '@nestjs/config';

export const app_config = {
  node_env: process.env.NODE_ENV,
  production: process.env.NODE_ENV === 'production',
  name: process.env.APP_NAME,
  working_directory: process.env.PWD || process.cwd(),

  // auth
  secret: process.env.AUTH_JWT_SECRET,
  expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,

  // app
  // frontend_domain: process.env.FRONTEND_DOMAIN,
  backend_domain: process.env.BACKEND_DOMAIN,
  port: parseInt(process.env.PORT!),
  api_prefix: process.env.API_PREFIX || 'api',

  // file
  driver: process.env.FILE_DRIVER,
  access_key_id: process.env.ACCESS_KEY_ID,
  secret_access_key: process.env.SECRET_ACCESS_KEY,
  max_file_size: 5242880, // 5mb
};

export default registerAs('app', () => app_config);
