CREATE TABLE Cliente (
    id INT PRIMARY KEY,
    nome VARCHAR(100),
    cidade VARCHAR(60),
    data_cadastro DATE
);

-- AUTO_INCREMENT adicionado em Produto.id
CREATE TABLE Produto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    categoria VARCHAR(60),
    preco DECIMAL(10,2)
);

CREATE TABLE Pedido (
    id INT PRIMARY KEY,
    cliente_id INT,
    data_pedido DATE,
    status VARCHAR(20),
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id)
);

CREATE TABLE ItemPedido (
    id INT PRIMARY KEY,
    pedido_id INT,
    produto_id INT,
    quantidade INT,
    preco_unitario DECIMAL(10,2),
    FOREIGN KEY (pedido_id) REFERENCES Pedido(id),
    FOREIGN KEY (produto_id) REFERENCES Produto(id)
);
