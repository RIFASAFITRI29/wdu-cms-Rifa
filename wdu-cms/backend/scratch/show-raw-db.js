const { Client } = require('pg');

async function showRawPostgres() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'rifasafitri567',
    database: 'wdu_cms_db',
  });

  try {
    await client.connect();
    console.log('--- KONEKSI KE POSTGRESQL BERHASIL ---');
    
    // Ambil daftar tabel
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE '_prisma_migrations';
    `);
    
    console.log('\nDAFTAR TABEL DI DATABASE WDU:');
    console.table(tables.rows);
    
    // Ambil contoh data dari tabel User (tanpa password)
    const users = await client.query('SELECT id, email, role, name FROM "User"');
    console.log('\nISI TABEL "User" (MENTAH DARI POSTGRES):');
    console.table(users.rows);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

showRawPostgres();
