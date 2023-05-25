const User = require('../models/user')
const UserModule = require('../services/userService')
const bcrypt = require('bcrypt')
const ApiError = require('../exceptions/apiError')

class AuthService {
    async registration(data) {
        if (!data) throw ApiError.BadRequest('Некорректный объект data!')
        if (!data?.email) throw ApiError.BadRequest('Некорректный email!')

        const user = await UserModule.findByEmail(data.email)

        if (user) return {
            "error": "email занят",
            "status": "error"
        }
        data.passwordHash = await bcrypt.hash(data.password, 12)
        const regUser = await UserModule.create(data)

        return {
            "data": { ...regUser },
            "status": "ok"
        }
    }
    async login(email, password) {
        if (!email || !password) {
            throw ApiError.BadRequest('Неверный email или пароль!')
        }
        const user = await UserModule.findByEmail(email)

        if (!user) {
            return {
                "error": "Неверный логин или пароль",
                "status": "error"
            }
        } else {
            return {
                "data": { ...user },
                "status": "ok"
            }
        }
    }
}

module.exports = new AuthService()