const mongoose = require('mongoose')

const raffleSchema = new mongoose.Schema({
    reactions: {
        type: Array,
        default: [],
        require: false,
        _id : false
    },
    id: {
        type: Object,
        required: false,
        _id : false
    },
    time: {
        type: Number,
        default: 0,
        required: false,
        _id : false
    },
    amount: {
        type: Number,
        default: 0,
        required: false,
        _id : false
    },
    state: {
        isOver: {
            type: Boolean,
            default: false,
            required: false,
            _id : false
        }
    },
    location: {
        guild: {
            type: Object,
            default: '',
            required: false,
            _id : false
        },
        channel: {
            type: Object,
            default: '',
            required: false,
            _id : false
        },
        message: {
            type: Object,
            default: '',
            required: false,
            _id : false
        },
    },
    winner: {
        type: Object,
        required: false,
        _id : false
    },
    duration: {
        type: String,
        default: '',
        required: false,
        _id : false
    }
})

raffleSchema.statics.findMostRecent = async function () {
    let raffles = await Raffle.find({ game: 'double' })
    if (!raffles) throw new Error('No raffle exists')
    let mostRecent = 0
    await raffles.forEach(raffle => {
        mostRecent = (raffle.time > mostRecent.time && !raffle.isOver) ? raffle : mostRecent
    })
    return mostRecent
}

const Raffle = mongoose.model('Raffle', raffleSchema)

module.exports = Raffle