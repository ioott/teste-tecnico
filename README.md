# Teste Técnico - Assistente de Desenvolvimento de Software

## Como rodar

Requisitos: [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/) (já vem junto no Docker Desktop).

Por que Docker: o projeto precisa de um banco MySQL e da API Node.js rodando juntos. Com `docker compose up`, quem for avaliar sobe os dois com um comando só, sem instalar MySQL ou Node na máquina, e sem risco de "na minha máquina funciona", já que o ambiente é o mesmo pra todo mundo que rodar.

```bash
cp .env.example .env
docker compose up -d --build
```

Isso sobe o banco MySQL (com schema e dados de exemplo já carregados) e a API de produtos, em `http://localhost:3000`.

Testar a API:

```bash
curl http://localhost:3000/produtos
curl "http://localhost:3000/produtos?categoria=Acessorios"
curl -X POST http://localhost:3000/produtos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Mouse","categoria":"Acessorios","preco":45.90}'
```

## Como rodar os testes

```bash
cd api
npm install
npm test
```

Isso roda dois grupos de teste diferentes:

- **`tests/orderService.test.js`** (Bloco 2 da avaliação): testes unitários da função de cálculo de desconto. Não precisam do banco nem do Docker rodando.
- **`tests/queries.test.js`** (Bloco 1 da avaliação): testes de integração, rodam as queries reais contra o banco e conferem o resultado. Precisam do banco de pé (`docker compose up -d db`).

### Rodar uma query do Bloco 1 manualmente

Com o banco de pé (`docker compose up -d db`), dá pra rodar qualquer arquivo de `db/queries/` direto contra o MySQL, sem precisar do teste. Os comandos abaixo assumem que você está na raiz do projeto:

```bash
docker compose exec -T db mysql -uroot -pconfiance confiance < db/queries/revenueByProduct.sql
```

A query `topCustomersLastMonth.sql` usa uma data de referência (ver "Último mês calculado dinamicamente" mais abaixo). Pra ver resultado preenchido contra o dado de exemplo, fixe a data antes:

```bash
{ echo "SET @referenceDate = '2026-09-01';"; cat db/queries/topCustomersLastMonth.sql; } | docker compose exec -T db mysql -uroot -pconfiance confiance
```

### Testar a função do Bloco 2 interativamente

Sem precisar de Docker nem banco, só Node. A partir da raiz do projeto:

```bash
cd api
node
```

Dentro do REPL que abrir:

```js
const { calcularTotalPedidos } = require('./src/services/orderService');

calcularTotalPedidos([
  { pedidoId: 1, itens: [{ produto: 'A', qtd: 2, precoUnit: 100 }, { produto: 'B', qtd: 1, precoUnit: 250 }] },
  { pedidoId: 2, itens: [{ produto: 'C', qtd: 3, precoUnit: 300 }] },
  { pedidoId: 3, itens: [{ produto: 'D', qtd: 5, precoUnit: 400 }] },
]);
```

O resultado aparece na hora (`[{ pedidoId: 1, total: 450 }, ...]`), igual ao exemplo do enunciado. Dá pra trocar os valores ali e testar outros casos ao vivo.

## Estrutura

```
db/
  init/             # schema e dados de exemplo
  queries/          # Bloco 1 da avaliação: as 4 consultas pedidas
api/
  src/
    routes/         # POST /produtos, GET /produtos
    controllers/
    services/       # regras de negócio (inclui o Bloco 2 da avaliação)
    repositories/
    tests/          # testes do Bloco 1 e do Bloco 2
```

## Decisões técnicas

**Banco: MySQL, via Docker Compose.** O enunciado permite MySQL ou SQL Server. Usei MySQL porque a imagem Docker é mais leve, sobe mais rápido. Subir banco e API com `docker compose up` evita qualquer passo manual de instalação pra quem for avaliar.

**Sem ORM na API.** O Bloco 1 pesa alto em SQL. Usar um ORM na API esconderia justamente essa competência atrás de uma camada de abstração. Optei por `mysql2` com queries parametrizadas escritas à mão.

**Arquitetura em camadas na API** (rota → controller → service → repository), cada uma com um único motivo pra mudar: controller cuida só de HTTP, service só de regra de negócio, repository é o único lugar que sabe que existe um banco.

**Ajuste no schema.** `Produto.id` ganhou `AUTO_INCREMENT`, que o script original do apêndice não tinha. Sem isso o `POST /produtos` não teria como gerar um novo id.

**Filtro de status nas consultas de valor (Bloco 1).** As queries que somam dinheiro (clientes que mais compraram, faturamento por produto, ticket médio) consideram só pedidos com `status = 'FATURADO'`. Pedidos `ABERTO` ainda não são venda confirmada, então não deveriam contar como receita. A consulta de "pedidos sem item" não usa esse filtro, porque é uma pergunta estrutural, não de faturamento.

**"Último mês" calculado dinamicamente.** A primeira query do Bloco 1 usa uma variável de sessão (`@referenceDate`) em vez de uma data fixa, pra continuar correta não importa quando rodar. A própria query já define um padrão (`SET @referenceDate = COALESCE(@referenceDate, CURDATE());`), então funciona sozinha, sem passo manual nenhum. Se quiser testar com outra data (por exemplo, contra o dado de exemplo, que só tem pedido em julho/agosto de 2026), defina a variável antes de rodar o arquivo, na mesma sessão: `SET @referenceDate = '2026-09-01';`. Os testes automatizados já fazem isso, com uma data fixa, pra serem reproduzíveis.

**Endpoint de pedidos não implementado.** A função do Bloco 2 (`calcularTotalPedidos`) está completa e testada, inclusive com o exemplo exato do enunciado. Os arquivos `routes/orders.routes.js`, `controllers/ordersController.js` e `repositories/orderRepository.js` foram criados porque coloquei a função de lógica no service, então achei que deixar apenas o service ficaria desorganizado. Eles ficaram como placeholders comentados, documentando como esse endpoint seria conectado se decidirmos construí-lo.

## Bugs encontrados e corrigidos durante o desenvolvimento

- A carga inicial do banco gravava nomes com acento de forma corrompida (`Niterói` virava `NiterÃ³i`), porque o cliente MySQL usado pelo `docker-entrypoint-initdb.d` assume `latin1` por padrão, mesmo as tabelas sendo `utf8mb4`. Corrigido com `SET NAMES utf8mb4;` no início do script de seed.

## Repositório

Código versionado em commits pequenos e semânticos, enviados para [github.com/ioott/teste-tecnico](https://github.com/ioott/teste-tecnico).
