-- O cliente mysql usado pelo entrypoint do Docker assume latin1 por
-- padrão, mesmo as tabelas sendo utf8mb4. Sem isso, nomes com acento são
-- gravados errado de forma permanente (ex.: "Niterói" vira "NiterÃ³i").
SET NAMES utf8mb4;

INSERT INTO Cliente VALUES
    (1,'Ana','Rio de Janeiro','2025-01-10'),
    (2,'Bruno','Niterói','2025-03-02'),
    (3,'Carla','Rio de Janeiro','2025-06-20');

INSERT INTO Produto VALUES
    (1,'Cabo HDMI','Acessorios',80.00),
    (2,'Monitor','Equipamentos',900.00),
    (3,'Teclado','Acessorios',150.00);

INSERT INTO Pedido VALUES
    (1,1,'2026-08-01','FATURADO'),
    (2,2,'2026-08-05','FATURADO'),
    (3,3,'2026-07-15','FATURADO'),
    (4,1,'2026-08-08','ABERTO');

INSERT INTO ItemPedido VALUES
    (1,1,2,1,900.00),
    (2,1,1,2,80.00),
    (3,2,3,3,150.00),
    (4,3,1,5,80.00);

-- Pedido 4 não tem itens de propósito (usado na query "pedidos sem item" do Bloco 1).
