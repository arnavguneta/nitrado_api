const mongoose = require('mongoose')

const wordleSchema = new mongoose.Schema({
    id: {
        type: Object,
        required: true,
        trim: true,
        _id: false
    },
    board: {
        type: Object,
        required: false,
        default: {
            rows: [],
            WOTD: '',
        },
        _id: false
    },
    stats: {
        played: {
            type: Number,
            required: false,
            default: 0,
            _id: false
        },
        won: {
            type: Number,
            required: false,
            default: 0,
            _id: false
        },
        current_streak: {
            type: Number,
            required: false,
            default: 0,
            _id: false
        },
        max_streak: {
            type: Number,
            required: false,
            default: 0,
            _id: false
        },
        distribution: {
            type: Object,
            required: false,
            default: [0,0,0,0,0],
            _id: false
        },
    }
})

const Wordle = mongoose.model('Wordle', wordleSchema)

module.exports = Wordle