-- Bloco 1, item 2: total faturado por produto, do maior para o menor.

SELECT
    Produto.nome AS nomeProduto,
    SUM(ItemPedido.quantidade * ItemPedido.preco_unitario) AS valorFaturado
FROM ItemPedido
JOIN Produto ON Produto.id = ItemPedido.produto_id
JOIN Pedido ON Pedido.id = ItemPedido.pedido_id
WHERE Pedido.status = 'FATURADO'
GROUP BY Produto.id, Produto.nome
ORDER BY valorFaturado DESC;
