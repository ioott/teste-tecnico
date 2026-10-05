require('./env');
const mysql = require('mysql2/promise');

let pool = null;

function obterPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'confiance',
      // Sem isso, o driver assume um charset diferente do que o MySQL usa
      // pra guardar os dados, e acentos voltam corrompidos (ex.: "Niterói"
      // vira "NiterÃ³i").
      charset: 'utf8mb4',
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

module.exports = { obterPool };
