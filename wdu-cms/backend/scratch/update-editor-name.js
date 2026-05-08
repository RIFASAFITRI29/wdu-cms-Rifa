const { Client } = require('pg');

async function updateEditorName() {
  const client = new Client({
    host: 'localhost', port: 5432, user: 'postgres', password: 'rifasafitri567', database: 'wdu_cms_db',
  });
  try {
    await client.connect();
    await client.query(`UPDATE "User" SET name = 'Wahana Editor' WHERE email = 'editor@wdu.co.id';`);
    console.log('Editor name updated to Wahana Editor');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

updateEditorName();
