const { Client } = require('pg');

async function checkUsers() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'rifasafitri567',
    database: 'wdu_cms_db',
  });

  try {
    await client.connect();
    const res = await client.query('SELECT email, role, name FROM "User"');
    console.log('Registered Users:');
    console.table(res.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

checkUsers();
