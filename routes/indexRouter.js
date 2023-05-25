const { Router } = require('express')
const router = new Router()
const passport = require('passport')

const authController = require('../controllers/authController')
const advertisementRouter = require('./advertisementRouter')
const chatRouter = require('./chatRouter')
const saveFromSession = require("../middlewares/saveFromSessionMiddleware")
const { initializePassport } = require('../strategies/passport-local')

router.use('/advertisement', advertisementRouter)
router.use('/chat', chatRouter)

router.post('/signup', authController.registration)
// router.post(
//     '/signin',
//     passport.authenticate('local', {  }),
//     authController.login
// )
router.post('/signin',  saveFromSession, (req, res, next) => {
    initializePassport.authenticate('local', (error, user) => {
        if (error) {
            console.log('Офыбка!', error)
        }

        req.logIn(user, function (error) {
            if (error) {
                console.log('Офыбка!', error)
            }
            const data = {
                email: user.email,
                name: user.name
            }
            return res.send(data)
        })
    })(req, res, next)
})

module.exports = router