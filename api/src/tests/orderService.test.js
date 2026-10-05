const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularTotalPedidos } = require('../services/orderService');

// Roda sem Docker porque a função só processa o array que já recebe como parâmetro.

test('valor total de cada pedido, com desconto por faixa', () => {
  const entrada = [
    { pedidoId: 1, itens: [{ produto: 'A', qtd: 2, precoUnit: 100 }, { produto: 'B', qtd: 1, precoUnit: 250 }] },
    { pedidoId: 2, itens: [{ produto: 'C', qtd: 3, precoUnit: 300 }] },
    { pedidoId: 3, itens: [{ produto: 'D', qtd: 5, precoUnit: 400 }] },
  ];
  assert.deepEqual(calcularTotalPedidos(entrada), [
    { pedidoId: 1, total: 450 },
    { pedidoId: 2, total: 855 },
    { pedidoId: 3, total: 1800 },
  ]);
});

test('lista vazia devolve lista vazia', () => {
  assert.deepEqual(calcularTotalPedidos([]), []);
});

test('pedido sem itens tem total zero', () => {
  assert.deepEqual(calcularTotalPedidos([{ pedidoId: 4, itens: [] }]), [{ pedidoId: 4, total: 0 }]);
});

test('quantidade zero não contribui pro subtotal', () => {
  assert.deepEqual(
    calcularTotalPedidos([{ pedidoId: 5, itens: [{ produto: 'X', qtd: 0, precoUnit: 999 }] }]),
    [{ pedidoId: 5, total: 0 }]
  );
});

test('entrada que não é um array devolve lista vazia', () => {
  assert.deepEqual(calcularTotalPedidos(null), []);
  assert.deepEqual(calcularTotalPedidos('não é lista'), []);
});

test('subtotal exatamente na fronteira da faixa de desconto', () => {
  // 500.00 -> sem desconto ("até 500"); 1000.00 -> 5% ("até 1000")
  assert.deepEqual(
    calcularTotalPedidos([
      { pedidoId: 6, itens: [{ produto: 'Y', qtd: 5, precoUnit: 100 }] },
      { pedidoId: 7, itens: [{ produto: 'Z', qtd: 10, precoUnit: 100 }] },
    ]),
    [
      { pedidoId: 6, total: 500 },
      { pedidoId: 7, total: 950 },
    ]
  );
});
