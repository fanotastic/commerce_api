const router = require ('express').Router()
const { productsController } = require('../controllers')

router.get('/', productsController.getProducts);
router.post('/', productsController.addProducts);

module.exports = router