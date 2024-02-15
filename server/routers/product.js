const express = require('express')
const ProductController = require('../controllers/productController')
const { authorizationConditional } = require('../middlewares/authorizationStaff')
const router = express.Router()

const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

router.post('/', ProductController.addProduct)
router.get('/', ProductController.showProduct)
router.get('/:id', ProductController.showProductById)
router.put('/:id', authorizationConditional, ProductController.updateProductById)
router.delete('/:id', authorizationConditional, ProductController.deleteProductById)


//Upload email
router.patch('/:id', authorizationConditional, upload.single('imgUrl'), ProductController.updateImageUrlById)

module.exports = router