const { Pool } = require('pg');
require('dotenv').config();

// Configuração do pool de conexões PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Teste de conexão
pool.on('connect', () => {
  console.log('✅ Conectado à base de dados PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro na conexão à base de dados:', err);
});

module.exports = pool;