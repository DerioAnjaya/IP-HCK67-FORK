const { Brand } = require('../models')
class BrandController {
    static async showCategories(req, res, next) {
        try {
            const allBrand = await Brand.findAll()

            res.status(200).json(
                allBrand
            )
        } catch (error) {
            next(error)
        }
    }
    
    static async addBrand(req, res, next) {
        try {
            const brand = await Brand.create(req.body)
            res.status(201).json({
                id: brand.id,
                name: brand.name,
                updatedAt: brand.updatedAt,
                createdAt: brand.createdAt
            })
        } catch (error) {
            next(error)
        }
    }


    static async updateBrandById(req, res, next) {
        try {
            await Brand.update(req.body, {
                where: {
                    id: req.params.id
                }
            })

            const afterUpdateBrand = await Brand.findByPk(req.params.id)

            if (!afterUpdateBrand) {
                throw { name: 'error not found' }
            }

            res.status(200).json({
                id: afterUpdateBrand.id,
                name: afterUpdateBrand.name,
                createdAt: afterUpdateBrand.createdAt,
                updatedAt: afterUpdateBrand.updatedAt
            })
        } catch (error) {
            next(error)
        }
    }

    static async deleteBrandById(req, res, next) {
        try {
            const beforeDeleteBrand = await Brand.findByPk(req.params.id)

            if (!beforeDeleteBrand) {
                throw { name: 'error not found' }
            }

            await Brand.destroy({
                where: {
                    id: req.params.id
                }
            })

            res.status(200).json({
                message: `${beforeDeleteBrand.name} success to delete`
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = BrandController