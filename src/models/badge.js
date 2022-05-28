const mongoose = require('mongoose')

const badgeSchema = new mongoose.Schema({
    storeID: {
        type: Number,
        required: false,
        _id : false
    },
    id: {
        type: Object,
        required: false,
        _id : false
    },
    name: {
        type: String,
        required: false,
        _id : false
    },
    animated: {
        type: Boolean,
        required: false,
        default: false,
        _id : false
    },
    tier: {
        type: Number,
        default: 3,
        required: false,
        _id : false
    },
    upgrade: {
        previous: {
            type: Number,
            required: false,
            _id : false
        },
        next: {
            type: Number,
            required: false,
            _id : false
        }
    },
})

const Badge = mongoose.model('Badge', badgeSchema)

module.exports = Badge