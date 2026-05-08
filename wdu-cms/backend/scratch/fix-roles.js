const { Client } = require('pg');

async function fixRoles() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'rifasafitri567',
    database: 'wdu_cms_db',
  });

  try {
    await client.connect();
    // Samakan semua role jadi HURUF BESAR agar sesuai dengan kodingan Frontend
    const res = await client.query(`
      UPDATE "User" 
      SET role = UPPER(role) 
      WHERE role IN ('editor', 'admin', 'super_admin');
    `);
    console.log('Update Success:', res.rowCount, 'row(s) affected');
    
    // Cek hasil akhirnya
    const users = await client.query('SELECT email, role FROM "User"');
    console.log('Current Roles in DB:');
    console.table(users.rows);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

fixRoles();
