const productRepository = require('../repositories/productRepository');

function validar({ nome, categoria, preco }) {
  const erros = [];
  if (!nome || typeof nome !== 'string' || !nome.trim()) {
    erros.push('nome é obrigatório');
  }
  if (!categoria || typeof categoria !== 'string' || !categoria.trim()) {
    erros.push('categoria é obrigatória');
  }
  if (typeof preco !== 'number' || Number.isNaN(preco) || preco <= 0) {
    erros.push('preço precisa ser um número positivo');
  }
  return erros;
}

async function criarProduto(dados) {
  const erros = validar(dados);
  if (erros.length > 0) {
    const erro = new Error(erros.join(', '));
    erro.statusCode = 400;
    throw erro;
  }
  return productRepository.criar(dados);
}

async function listarProdutos(filtros) {
  return productRepository.listarTodos(filtros);
}

module.exports = { criarProduto, listarProdutos };
