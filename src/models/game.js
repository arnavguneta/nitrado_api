const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    id: {
        type: Object,
        required: true,
        trim: true,
        _id: false
    },
    guild: {
        type: Object,
        required: true,
        trim: true,
        _id: false
    },
    double: {
        state: {
            type: Boolean,
            required: false,
            default: false,
            _id: false
        },
        lastMessage: {
            type: Object,
            required: false,
            default: null,
            _id: false
        },
        time_created: {
            type: Number,
            required: false,
            _id : false,
            default: null
        }
    },
    bj: {
        state: {
            type: Boolean,
            required: false,
            default: false,
            _id: false
        },
        lastMessage: {
            type: Object,
            required: false,
            default: null,
            _id: false
        },
        hands: {
            type: Object,
            required: false,
            default: {
                dealer: [],
                player: [],
                aces: {
                    dealer: 0,
                    player: 0
                }
            },
            _id: false
        },
        time_created: {
            type: Number,
            required: false,
            _id : false,
            default: 0
        }

    }
})

const Game = mongoose.model('Game', gameSchema)

module.exports = Game