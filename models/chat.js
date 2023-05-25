const { Schema, model } = require('mongoose')

const chatSchema = new Schema({
    users: {
        type: [{
            type: 'ObjectId',
            ref: 'User'
        }, {
            type: 'ObjectId',
            ref: 'User'
        }],
        unique: false,
        require: true,
    },
    messages: [{
        type: 'ObjectId',
        ref: 'Message',
        unique: false,
        require: false
    }],
    createdAt: {
        type: Date,
        unique: false,
        require: true,
        default: Date.now()
    }
})

module.exports = model('Chat', chatSchema)