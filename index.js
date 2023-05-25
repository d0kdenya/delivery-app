require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')

const socket = require('./socket/socket')
const socketIOWrap = require('./utils/socketIOWrap')

const session = require('express-session')
const redisStorage = require('connect-redis')(session)
const redis = require('redis');

const { initializePassport } = require('./strategies/passport-local')

const errorMiddleware = require('./middlewares/errorMiddleware')

const indexRouter = require('./routes/indexRouter')

const PORT = process.env.PORT || 5000
const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/delivery'
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

const client = redis.createClient({
    legacyMode: true,
    url: REDIS_URL
})

const app = express()

const sessionMiddleware = session({
    store: new redisStorage({
        url: REDIS_URL,
        client,
    }),
    secret: process.env.COOKIE_SECRET || 'cookie-secret',
    resave: false,
    saveUninitialized: true,
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors({
    origin: '*',
    credentials: true
}))
app.use(bodyParser.json())
app.use(sessionMiddleware)

const initializeMiddleware = initializePassport.initialize()
const passportSessionMiddleware = initializePassport.session()

app.use(initializeMiddleware)
app.use(passportSessionMiddleware)

app.use('/api', indexRouter)

app.use('/api/uploads', express.static(path.resolve(__dirname, 'uploads')))

app.use(errorMiddleware)

async function start(PORT, DB_URL) {
    try {
        await client.connect().catch(console.error)
        await mongoose.connect(DB_URL)

        const server = app.listen(PORT, (req, res) => {
            console.log(`Server started on ${ PORT } port!`)
        })
        socket(
            server,
            socketIOWrap(sessionMiddleware),
            socketIOWrap(initializeMiddleware),
            socketIOWrap(passportSessionMiddleware)
        )
    } catch (e) {
        console.log(e)
    }
}

start(PORT, DB_URL)