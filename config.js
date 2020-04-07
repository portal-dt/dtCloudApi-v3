import knex from 'knex';
import AWS from 'aws-sdk';

const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PORT,
  DATABASE_PASSWORD
} = process.env;

const awsCredentials = new AWS.Credentials(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY);

export const db = knex({
  client: 'pg',
  connection: {
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    post: DATABASE_PORT
  }
});

AWS.config.update({
  credentials: awsCredentials, // credentials required for local execution
  region: AWS_REGION
});

export const s3 = new AWS.S3();
