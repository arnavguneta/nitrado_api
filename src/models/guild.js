const mongoose = require('mongoose')

const guildSchema = new mongoose.Schema({
    id: {
        type: Object,
        required: true,
        trim: true,
        _id : false
    },
    channels: {
        games: {
            type: Array,
            required: false,
            trim: true,
            default: [],
            _id : false
        },
        raffles: {
            type: Array,
            required: false,
            trim: true,
            default: [],
            _id : false
        },
        all: {
            type: Array,
            required: false,
            trim: true,
            default: [],
            _id : false
        }
    },
    roles: {
        games: {
            type: Array,
            required: false,
            trim: true,
            default: [],
            _id : false
        },
        raffles: {
            type: Array,
            required: false,
            trim: true,
            default: [],
            _id : false
        },
        all: {
            type: Array,
            required: false,
            trim: true,
            default: [],
            _id : false
        }
    },
    balance: {
        type: Number,
        required: false,
        default: 1000000,
        _id : false
    }
})

const Guild = mongoose.model('Guild', guildSchema)

module.exports = Guild