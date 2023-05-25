const advertisementService = require('../services/advertisementService')

class AdvertisementController {
    async find(req, res, next) {
        try {
            const { params } = req.body
            const result = await advertisementService.find(params)
            return res.json(result)
        } catch (e) {
            next(e)
        }
    }

    async create(req, res, next) {
        try {
            const data = req.body
            const files = req.files
            const advertisement = await advertisementService.create(data, files)
            return res.json(advertisement)
        } catch (e) {
            next(e)
        }
    }

    async remove(req, res, next) {
        try {
            const { id } = req.params
            const advertisement = await advertisementService.remove(id)
            return res.json(advertisement)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new AdvertisementController()