const express = require('express')
const PubController = require('../controllers/pubController')
const { authorizationAdminOnly } = require('../middlewares/authorizationAdmin')
const { authorizationConditional } = require('../middlewares/authorizationStaff')
const router = express.Router()

router.get('/pub', PubController.showProducts)
router.get('/pub/:id', PubController.detailProducts)

module.exports = router