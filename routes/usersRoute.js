const router = require ('express').Router()
const { readToken } = require('../config/encrip');
const { usersController } = require('../controllers')

router.get("/", usersController.getData);
router.post("/login", usersController.login);
router.post("/regis", usersController.register);
router.get('/keep', readToken, usersController.keepLogin);
module.exports = router