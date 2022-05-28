const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
    guild: {
        type: Object,
        required: true,
        trim: true,
        _id: false
    },
    id: {
        type: Object,
        required: true,
        trim: true,
        _id: false
    },
    channel: {
        type: Object,
        required: false,
        trim: true,
        _id: false
    },
    settings: {
        active: {
            type: Boolean,
            required: false,
            _id: false
        },
        category: {
            type: Boolean,
            required: false,
            _id: false
        }
    },
    roles: {
        live: {
            type: Object,
            required: false,
            _id: false
        },
        category: {
            type: Object,
            required: false,
            _id: false
        }
    },
    message: {
        type: String,
        required: false,
        _id: false
    },
})

const Subscription = mongoose.model('Subscription', subscriptionSchema)

module.exports = Subscription