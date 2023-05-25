const { Router } = require('express')
const uploadMiddleware = require('../middlewares/uploadMiddleware')
const router = new Router()

const userController = require('../controllers/advertisementController')

router.get('/', userController.find)
router.post('/', uploadMiddleware.any('fileAdv'), userController.create)
router.delete('/:id', userController.remove)

module.exports = router