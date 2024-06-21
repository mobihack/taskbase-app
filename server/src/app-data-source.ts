import path from 'path';
import { DataSource } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(process.cwd(), 'db', 'database.sqlite'),
  entities: [path.join(__dirname, './entity/*.entity.{js,ts}')],
  logging: true,
  synchronize: true,
});
