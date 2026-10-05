const express = require('express');
const productsRouter = require('./routes/products.routes');

const app = express();
app.use(express.json());
app.use(productsRouter);

// Sem isso, qualquer erro não tratado (por exemplo, corpo da requisição
// que não é um JSON válido) cai no tratamento padrão do Express, que
// devolve uma página HTML com stack trace em vez de JSON.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'corpo da requisição não é um JSON válido' });
  }
  res.status(500).json({ erro: 'erro interno' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

module.exports = app;
