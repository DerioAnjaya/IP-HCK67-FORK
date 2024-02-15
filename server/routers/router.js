const express = require('express')
const router = express.Router()
const { errorHandler } = require('../middlewares/errorHandler')
const { authentication } = require('../middlewares/authentication')
const { authorizationAdminOnly } = require('../middlewares/authorizationAdmin')
const UserController = require('../controllers/userController')
const PubController = require('../controllers/pubController')

router.use('/publics', require('./public'))
router.post('/login', UserController.login)

router.use(authentication)

router.post('/add-user', authorizationAdminOnly, UserController.addUser)
router.use('/brands', require('./brand'))
router.use('/products', require('./product'))

router.use(errorHandler)

module.exports = router