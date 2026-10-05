-- Bloco 1, bônus: ticket médio por cidade do cliente.
-- Primeiro calcula o total de cada pedido numa subquery, depois
-- tira a média desses totais agrupando por cidade.
-- Só pedidos FATURADO contam.

SELECT
    Cliente.cidade AS cidade,
    AVG(totaisPedido.valorPedido) AS ticketMedio
FROM Cliente
JOIN (
    SELECT
        Pedido.id AS pedidoId,
        Pedido.cliente_id AS clienteId,
        SUM(ItemPedido.quantidade * ItemPedido.preco_unitario) AS valorPedido
    FROM Pedido
    JOIN ItemPedido ON ItemPedido.pedido_id = Pedido.id
    WHERE Pedido.status = 'FATURADO'
    GROUP BY Pedido.id, Pedido.cliente_id
) AS totaisPedido ON totaisPedido.clienteId = Cliente.id
GROUP BY Cliente.cidade
ORDER BY ticketMedio DESC;
