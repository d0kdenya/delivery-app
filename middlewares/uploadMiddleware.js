const multer = require('multer')
const uuid = require('uuid')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        const id = uuid.v4()
        const format = file.originalname.split('.')
        cb(null, `${ id }.${ format[format.length - 1] }`)
    }
})

const limits = {
    fileSize: 1024 * 1024 * 10
}

module.exports = multer({
    storage,
    limits
})