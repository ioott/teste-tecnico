const productService = require('../services/productService');

async function criar(req, res) {
  try {
    const { nome, categoria, preco } = req.body;
    const produto = await productService.criarProduto({ nome, categoria, preco });
    res.status(201).json({ mensagem: 'Produto criado com sucesso.', produto });
  } catch (erro) {
    res.status(erro.statusCode || 500).json({ erro: erro.message });
  }
}

async function listar(req, res) {
  try {
    const { categoria } = req.query;
    const produtos = await productService.listarProdutos({ categoria });
    res.status(200).json(produtos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

module.exports = { criar, listar };
