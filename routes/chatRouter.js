const { Router } = require('express')
const chatController = require('../controllers/chatController')
const router = new Router()

router.get('/', chatController.getChatByUserId)
router.post('/', chatController.createChat)

module.exports = router