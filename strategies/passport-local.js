const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require("bcrypt");

async function verify(email, password, done) {
    try {
        console.log('email: ', email)
        console.log('password: ', password)
        const user = await User.findOne({ email })
        console.log('user: ', user)

        if (!user) {
            return done({ message: 'Пользователь не найден!' }, false)
        }
        const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)

        if (!isCorrectPassword) {
            console.log('Incorrect password!')
            return done({ message: 'Неверный пароль!' }, false)
        }
        return done(null, user)
    } catch (e) {
        done(e)
    }
}

const options = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false
}

function serializeUser(user, cb) {
    cb(null, user._id)
}

async function deserializeUser(id, cb) {
    try {
        const user = await User.findById(id, { name: 1, email: 1, contactPhone: 1 })

        if (!user) {
            return cb(null, false)
        }
        return cb(null, user)
    } catch (e) {
        cb(e)
    }
}

passport.use('local', new LocalStrategy(options, verify))
passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)

module.exports = {
    initializePassport: passport
}