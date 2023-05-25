const User = require('../models/user')
const UserDto = require('../dtos/userDto')
const ApiError = require('../exceptions/apiError')

class UserService {
    async findByEmail(email) {
        if (!email) throw ApiError.BadRequest('Некорректный email!')
        const user = await User.findOne({ email })
        return user ? new UserDto(user) : null
    }
    async create(data) {
        if (!data) throw ApiError.BadRequest('Некорректный объект data!')
        const oldUser = await User.findOne({ email: data.email })

        if (oldUser) throw ApiError.BadRequest(`Пользователь с email: ${ data.email } уже существует!`)

        const user = new User(data)
        return new UserDto(await user.save());
    }
}

module.exports = new UserService()