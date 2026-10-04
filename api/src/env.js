const path = require('node:path');

// Carrega o .env da raiz do projeto (não da pasta api/). Dentro do Docker
// isso não encontra nenhum arquivo e não faz nada, sem problema: nesse
// caso as variáveis já chegam prontas via docker-compose. Isso só importa
// pra rodar fora do Docker (ex.: `npm test` direto no terminal).
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
