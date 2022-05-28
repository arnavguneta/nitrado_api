const mongoose = require('mongoose')

const creatorSchema = new mongoose.Schema({
    id: {
        type: Object,
        required: true,
        trim: true,
        _id : false
    },
    subscribed: {
        type: Array,
        default: [],
        required: false,
        _id: false
    },
    type: {
        type: String,
        required: false,
        _id: false
    }
})

const Creator = mongoose.model('Creator', creatorSchema)

module.exports = Creator