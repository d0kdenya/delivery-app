const Chat = require('../models/chat')
const Message = require('../models/message')
const ApiError = require('../exceptions/apiError')
const normalizeMessage = require('../mappers/normalizeMessage')
const normalizeChat = require('../mappers/normalizeChat')

class ChatService {
    async findChat(users) {
        const chats = await Chat.find({ users: { $all: users } })
        return chats[0]
    }

    async findChatById(id) {
        return await Chat.findById(id)
    }

    async getChatsByUserId(userId) {
        const chats = await Chat.find({ users: { $id: [userId] } })
            .populate([
                {
                    path: 'messages',
                    select: '-__v',
                    transform: normalizeMessage
                },
                {
                    path: 'users',
                    select: 'name',
                    transform: ({ name }, id) => {
                        return { name, id }
                    }
                }
            ])
            .select('-__v -createdAt')
        return chats.map(normalizeChat)
    }

    async createChat(author, receiver) {
        const users = [author, receiver]
        const chats = await Chat.find({ users: { $all: users } }).exec()

        if (chats.length) {
            return chats[0]
        }
        return await Chat.create({ users })
    }

    async sendMessage(author, receiver, text) {
        const users = [author, receiver]
        const chats = await Chat.find({ users: { $all: users } })

        let chat = chats[0]
        if (!chat) {
            chat = new Chat({ userCreator: author, users })
        }

        const message = await Message.create({ author, text, sentAt: new Date() })
        chat.messages.push(message._id)
        await chat.save()

        chat = await Chat.findById(chat._id)
            .populate([
                {
                    path: 'messages',
                    select: '-__v',
                    transform: normalizeMessage,
                },
                {
                    path: 'users',
                    select: 'name',
                    transform: ({ name }, id) => {
                        return { name, id }
                    },
                }
            ])
            .select('-__v -createdAt')
        return normalizeChat(chat)
    }

    async getHistory(id) {
        const chat = await Chat.findById(id)
            .populate([
                {
                    path: 'messages',
                    select: '-__v',
                    transform: normalizeMessage,
                },
                {
                    path: 'users',
                    select: 'name',
                    transform: ({ name }, id) => {
                        return { name, id }
                    },
                }
            ])
            .select('-__v -createdAt')
        return normalizeChat(chat)
    }
}

module.exports = new ChatService()