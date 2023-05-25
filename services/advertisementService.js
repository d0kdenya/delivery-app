const User = require('../models/user')
const Advertisement = require('../models/advertisement')
const AdvertisementDto = require('../dtos/advertisementDto')
const ApiError = require('../exceptions/apiError')

class AdvertisementService {
    async find(params) {
        // if (!params) throw ApiError.BadRequest('Некорректный email!')

        /*const advertisements = await Advertisement.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'name',
                    foreignField: 'userId',
                    as: 'user'
                }
            }
        ]).exec()*/
        // const advertisements = await Advertisement.find({ isDeleted: false })
        const advertisements = await Advertisement.find({ isDeleted: false }).populate('userId', ['_id', 'name'])

        return {
            'data': advertisements.map(advertisement => {
                return new AdvertisementDto(advertisement)
            }),
            'status': 'ok'
        }
    }
    async create(data, fileAdvertisement) {
        if (!data) throw ApiError.BadRequest('Некорректный объект data!')
        if (!data.userId) throw ApiError.BadRequest('Некорректный userId!')

        const user = await User.findOne({ _id: data.userId })
        if (!user) throw ApiError.BadRequest('Пользователь не найден!')
        const fileNames = []

        fileAdvertisement.forEach(file => {
            fileNames.push(file.filename)
        })
        const advertisement = new Advertisement({ ...data, images: fileNames })
        return new AdvertisementDto(await advertisement.save())
    }

    async remove(id) {
        if (!id) throw ApiError.BadRequest('Некорректный id!')

        const advertisement = await Advertisement.findOne({ _id: id })
        if (!advertisement) throw ApiError.BadRequest('Объявление не найдено!')

        if (advertisement.isDeleted) throw ApiError.BadRequest('Объявление уже было удалено!')

        await Advertisement.updateOne({_id: id}, { isDeleted: true })
        return 'Успешное удаление!'
    }
}

module.exports = new AdvertisementService()