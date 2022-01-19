const router = require ('express').Router()
const { usersController } = require('../controllers')

router.get("/", usersController.getData);
router.post("/regis", usersController.register);

module.exports = router