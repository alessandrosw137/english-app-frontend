const { Client } = require('../server/node_modules/pg');
require('../server/node_modules/dotenv').config({ path: './.env' });

const pw = process.env.DB_PASSWORD || 'amlo4t';

async function checkDatabase(dbName) {
  const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: pw,
    port: 5432,
    database: dbName
  });
  try {
    await client.connect();
    const res = await client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
    console.log(`Database '${dbName}' tables:`, res.rows.map(r => r.tablename));
    await client.end();
    return res.rows.map(r => r.tablename);
  } catch (err) {
    console.log(`Database '${dbName}' connection failed:`, err.message);
    return null;
  }
}

async function main() {
  await checkDatabase('english_app');
  await checkDatabase('postgres');
}

main();
