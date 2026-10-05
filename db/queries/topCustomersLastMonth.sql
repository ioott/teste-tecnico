-- Bloco 1, item 1: os 10 clientes que mais compraram no último mês.
-- "Último mês" é calculado em relação a uma variável de sessão
-- @referenceDate, em vez de uma data fixa no código, pra query continuar
-- correta sempre que rodar em produção (usa CURDATE() como padrão).

-- COALESCE em vez de atribuição direta: se quem chamou (o teste, por
-- exemplo) já definiu @referenceDate antes de rodar este arquivo, esse
-- valor é preservado, só cai pra CURDATE() se ninguém tiver definido nada
-- ainda. Isso evita que esta linha sobrescreva a data fixa que o teste usa
-- pra ter um resultado reproduzível, e ainda assim funciona sozinha, com a
-- data de hoje, quando rodada manualmente sem nenhum SET antes.

SET @referenceDate = COALESCE(@referenceDate, CURDATE());

SELECT
    Cliente.nome AS nomeCliente,
    SUM(ItemPedido.quantidade * ItemPedido.preco_unitario) AS valorTotal
FROM Pedido
JOIN Cliente ON Cliente.id = Pedido.cliente_id
JOIN ItemPedido ON ItemPedido.pedido_id = Pedido.id
WHERE Pedido.status = 'FATURADO'
  AND Pedido.data_pedido >= DATE_SUB(DATE_FORMAT(@referenceDate, '%Y-%m-01'), INTERVAL 1 MONTH)
  AND Pedido.data_pedido < DATE_FORMAT(@referenceDate, '%Y-%m-01')
GROUP BY Cliente.id, Cliente.nome
ORDER BY valorTotal DESC
LIMIT 10;
