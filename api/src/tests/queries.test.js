require('../env');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2/promise');

// Precisam do docker rodando e populado porque usam dado real.

const DIR_QUERIES = path.join(__dirname, '../../../db/queries');

function carregarQuery(nomeArquivo) {
  return fs.readFileSync(path.join(DIR_QUERIES, nomeArquivo), 'utf8');
}

function obterConexao() {
  return mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'confiance',
    charset: 'utf8mb4',
    multipleStatements: true,
  });
}

test('clientes que mais compraram no último mês', async () => {
  const conexao = await obterConexao();
  // Fixo pra o resultado ser reproduzível, independente de quando rodar;
  // o dado de exemplo só tem pedidos em julho/agosto de 2026.
  await conexao.query("SET @referenceDate = '2026-09-01';");
  const [resultados] = await conexao.query(carregarQuery('topCustomersLastMonth.sql'));
  const linhas = resultados[1];
  await conexao.end();

  assert.deepEqual(
    linhas.map(l => ({ nomeCliente: l.nomeCliente, valorTotal: Number(l.valorTotal) })),
    [
      { nomeCliente: 'Ana', valorTotal: 1060 },
      { nomeCliente: 'Bruno', valorTotal: 450 },
    ]
  );
});

test('faturamento por produto', async () => {
  const conexao = await obterConexao();
  const [linhas] = await conexao.query(carregarQuery('revenueByProduct.sql'));
  await conexao.end();

  assert.deepEqual(
    linhas.map(l => ({ nomeProduto: l.nomeProduto, valorFaturado: Number(l.valorFaturado) })),
    [
      { nomeProduto: 'Monitor', valorFaturado: 900 },
      { nomeProduto: 'Cabo HDMI', valorFaturado: 560 },
      { nomeProduto: 'Teclado', valorFaturado: 450 },
    ]
  );
});

test('pedidos sem item', async () => {
  const conexao = await obterConexao();
  const [linhas] = await conexao.query(carregarQuery('ordersWithoutItems.sql'));
  await conexao.end();

  assert.deepEqual(linhas, [{ pedidoId: 4, nomeCliente: 'Ana' }]);
});

test('ticket médio por cidade', async () => {
  const conexao = await obterConexao();
  const [linhas] = await conexao.query(carregarQuery('averageTicketByCity.sql'));
  await conexao.end();

  assert.deepEqual(
    linhas.map(l => ({ cidade: l.cidade, ticketMedio: Number(l.ticketMedio) })),
    [
      { cidade: 'Rio de Janeiro', ticketMedio: 730 },
      { cidade: 'Niterói', ticketMedio: 450 },
    ]
  );
});
