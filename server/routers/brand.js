const express = require('express')
const BrandController = require('../controllers/brandController')
const { authorizationConditional } = require('../middlewares/authorizationStaff')
const router = express.Router()

router.post('/', BrandController.addBrand)
router.get('/', BrandController.showCategories)
router.put('/:id', BrandController.updateBrandById)
router.delete('/:id', BrandController.deleteBrandById)

module.exports = router