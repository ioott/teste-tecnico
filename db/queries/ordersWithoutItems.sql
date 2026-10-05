-- Bloco 1, item 3: pedidos que não têm nenhum item.
-- Pedidos ABERTO também entram.

SELECT
    Pedido.id AS pedidoId,
    Cliente.nome AS nomeCliente
FROM Pedido
JOIN Cliente ON Cliente.id = Pedido.cliente_id
LEFT JOIN ItemPedido ON ItemPedido.pedido_id = Pedido.id
WHERE ItemPedido.id IS NULL;
