const { Schema, model } = require('mongoose')

const advertisementSchema = new Schema({
    shortText: {
        type: String,
        unique: false,
        require: true
    },
    description: {
        type: String,
        unique: false,
        require: false
    },
    images: [{
        type: String,
        unique: false,
        require: false
    }],
    userId: {
        type: 'ObjectId',
        ref: 'User',
        unique: false,
        require: true
    },
    createdAt: {
        type: Date,
        unique: false,
        require: true,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        unique: false,
        require: true,
        default: Date.now()
    },
    tags: [{
        type: String,
        unique: false,
        require: false
    }],
    isDeleted: {
        type: Boolean,
        unique: false,
        require: true,
        default: false
    }
})

module.exports = model('Advertisement', advertisementSchema)