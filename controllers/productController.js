const express = require('express');
const router = express.Router();
const productValidator = require('../validators/productValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const { searchProducts, getProductCount, addToCart, proceedToBuy } = require('../services/productService');

router.get('/', searchProducts);
router.get('/:productId/count', getProductCount);
router.post('/cart/add', authMiddleware.verifyToken, addToCart);
router.post('/cart/proceed', authMiddleware.verifyToken, proceedToBuy);

module.exports = router;
