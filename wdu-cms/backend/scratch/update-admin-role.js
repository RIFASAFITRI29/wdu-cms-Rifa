const { Client } = require('pg');

async function updateAdminRole() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'rifasafitri567',
    database: 'wdu_cms_db',
  });

  try {
    await client.connect();
    const res = await client.query('UPDATE "User" SET role = \'SUPER_ADMIN\' WHERE email = \'admin@wdu.co.id\'');
    console.log('Update Success:', res.rowCount, 'row(s) affected');
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

updateAdminRole();
