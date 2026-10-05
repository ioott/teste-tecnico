const { obterPool } = require('../db');

async function criar({ nome, categoria, preco }) {
  const pool = obterPool();
  const [resultado] = await pool.query(
    'INSERT INTO Produto (nome, categoria, preco) VALUES (?, ?, ?)',
    [nome, categoria, preco]
  );
  return { id: resultado.insertId, nome, categoria, preco };
}

async function listarTodos({ categoria } = {}) {
  const pool = obterPool();
  const query = categoria
    ? 'SELECT id, nome, categoria, preco FROM Produto WHERE categoria = ?'
    : 'SELECT id, nome, categoria, preco FROM Produto';
  const [linhas] = await pool.query(query, categoria ? [categoria] : []);
  return linhas.map(linha => ({
    id: linha.id,
    nome: linha.nome,
    categoria: linha.categoria,
    preco: Number(linha.preco),
  }));
}

module.exports = { criar, listarTodos };
