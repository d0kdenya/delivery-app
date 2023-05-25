const chatService = require('../services/chatService')
const normalizeChat = require('../mappers/normalizeChat')

class ChatController {
    async getChatByUserId(req, res, next) {
        try {
            const {_id: id} = req.user
            const chats = await chatService.getChatsByUserId(id)
            return res.json(chats)
        } catch (e) {
            next(e)
        }
    }

    async createChat(req, res, next) {
        try {
            const { receiver } = req.body
            const chat = await chatService.createChat({ author: req.user, receiver })
            return res.json(normalizeChat(chat))
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ChatController()