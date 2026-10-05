// --- Entregável do Bloco 2 do teste -------------------------------------------
// Função recebe uma lista de pedidos e devolve o total de cada um,
// aplicando desconto por faixa sobre o subtotal:
//   subtotal <= 500        -> sem desconto
//   500 < subtotal <= 1000  -> 5% de desconto
//   subtotal > 1000         -> 10% de desconto

function calcularTotalPedidos(pedidos) {
  if (!Array.isArray(pedidos)) return [];

  return pedidos.map(pedido => {
    const itens = Array.isArray(pedido.itens) ? pedido.itens : [];
    const subtotal = itens.reduce(
      (soma, item) => soma + (item.qtd || 0) * (item.precoUnit || 0),
      0
    );

    let desconto = 0;
    if (subtotal > 1000) {
      desconto = 0.10;
    } else if (subtotal > 500) {
      desconto = 0.05;
    }

    const total = subtotal * (1 - desconto);
    return { pedidoId: pedido.pedidoId, total: Number(total.toFixed(2)) };
  });
}

module.exports = { calcularTotalPedidos };
