module.exports = class UserDto {
    id
    email
    name
    contactPhone

    constructor(model) {
        this.id = model._id
        this.email = model.email
        this.name = model.name
        this.contactPhone = model.contactPhone
    }
}