const { Schema, model } = require('mongoose')

const messageSchema = new Schema({
    author: {
        type: 'ObjectId',
        ref: 'User',
        unique: false,
        require: true
    },
    text: {
        type: String,
        unique: false,
        require: true
    },
    sentAt: {
        type: Date,
        unique: false,
        require: true,
        default: Date.now()
    },
    readAt: {
        type: Date,
        unique: false,
        require: false
    }
})

module.exports = model('Message', messageSchema)