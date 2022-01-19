const router = require ('express').Router()
const { productsController } = require('../controllers')

router.get('/', productsController.getData);
router.post('/addproduct', productsController.addProducts);

module.exports = router