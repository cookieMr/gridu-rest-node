import knex, { Knex } from 'knex';

export const knexConnection: Knex = knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'docker',
    password: process.env.MYSQL_PASSWORD || 'mysql_very_secret_docker_password',
    database: process.env.MYSQL_DATABASE || 'gridu'
  }
});

knexConnection.raw('SELECT 1')
  .then(() => {
    console.log('Knex Initialization - MySQL connected.');
  })
  .catch((error) => {
    console.log('Knex Initialization - MySQL not connected...');
    console.error(error);
  });
