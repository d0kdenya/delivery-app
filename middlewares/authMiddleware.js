const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: 'Пользователь не аутентифицирован!'
        })
    }
})