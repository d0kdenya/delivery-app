const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')
const {isMac} = require("nodemon/lib/utils");

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        require: true
    },
    passwordHash: {
        type: String,
        unique: false,
        require: true
    },
    name: {
        type: String,
        unique: false,
        require: true
    },
    contactPhone: {
        type: String,
        unique: false,
        require: false
    }
})

module.exports = model('User', userSchema)