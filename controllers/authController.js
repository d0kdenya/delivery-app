const authService = require('../services/authService')

class AuthController {
    async registration(req, res, next) {
        try {
            const data = req.body
            const user = await authService.registration(data)
            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const result = await authService.login(email, password)
            return res.json(result)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new AuthController()