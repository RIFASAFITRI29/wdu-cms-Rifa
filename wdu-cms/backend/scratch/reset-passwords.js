const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function resetPasswords() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'rifasafitri567',
    database: 'wdu_cms_db',
  });

  try {
    await client.connect();
    
    // Hash new passwords
    const adminHash = await bcrypt.hash('admin123', 10);
    const editorHash = await bcrypt.hash('editor123', 10);
    
    // Update Admin
    await client.query('UPDATE "User" SET "passwordHash" = $1 WHERE email = $2', [adminHash, 'admin@wdu.co.id']);
    console.log('Admin password updated to admin123');
    
    // Update Editor
    await client.query('UPDATE "User" SET "passwordHash" = $1 WHERE email = $2', [editorHash, 'editor@wdu.co.id']);
    console.log('Editor password updated to editor123');
    
  } catch (err) {
    console.error('Error resetting passwords', err.stack);
  } finally {
    await client.end();
  }
}

resetPasswords();
