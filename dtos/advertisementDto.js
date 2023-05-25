module.exports = class AdvertisementDto {
    id
    shortText
    description
    images
    user
    tags
    isDeleted
    createdAt

    constructor(model) {
        this.id = model._id
        this.shortText = model.shortText
        this.description = model.description
        this.images = model.images
        this.user = {
            id: model?.userId._id,
            name: model?.userId.name
        }
        this.tags = model.tags
        this.isDeleted = model.isDeleted
        this.createdAt = model.createdAt
    }
}