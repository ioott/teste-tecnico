const express = require('express');
const controller = require('../controllers/productsController');

const router = express.Router();

router.post('/produtos', controller.criar);
router.get('/produtos', controller.listar);

module.exports = router;
