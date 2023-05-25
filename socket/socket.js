const socketIO = require('socket.io')
const EventEmitter = require('../utils/eventEmitter')

const event = new EventEmitter()

module.exports = (server, session, initialize, passport) => {
    const io = socketIO(server)

    io.use(session)
    io.use(initialize)
    io.use(passport)

    io.use(async (socket, next) => {
        const query = socket.handshake.query
        const user = socket.request.user

        socket.data.user = user
        socket.data.type = query.type

        if (!user) return next(new Error('Incorrect session!'))

        next()
    })

    io.on('connection', socket => {
        const { user, type } = socket.data
        const userId = user._id.toString()

        let deleteEvent

        if (type === 'chat') {
            deleteEvent = event.subscribe(type, userId, chat => {
                socket.emit('newMessage', chat)
            })
        } else {
            deleteEvent = event.subscribe(type, userId, async () => {
                const chats = ''
                // Получить чаты по userId
                socket.emit('newChatsMessage', chats)
            })
        }

        socket.on('getHistory', async chatId => {
            const chat = ''
            // Получить чат по id
            const messages = await Chat.getHistory(chat._id)
            socket.emit('chatHistory', messages)
        })
        socket.on('sendMessage', async ({users, text}) => {
            const receiver = users.filter(id => id !== userId)[0]
            const chat = ''
            // Отправить сообщение
            // const chat = await Chat.sendMessage({author: userId, receiver, text})

            chat.users.forEach(user => {
                event.emit('chat', user.id, chat)
            })

            event.emit('chats', receiver)
        })

        socket.on('disconnect', () => {
            deleteEvent()
        })
    })

    return io
}