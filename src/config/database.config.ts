import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
  autoloadEntities: process.env.DATABASE_AUTOLOAD === 'true' ? true : false,
}));
