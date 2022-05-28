const mongoose = require('mongoose')

const statSchema = new mongoose.Schema({
    probability: {
        type: Array,
        require: false,
        default: undefined,
        _id : false
    },
    game: {
        type: String,
        default: '',
        required: false,
        _id : false
    },
    user: {
        type: Object,
        required: false,
        trim: true,
        _id : false
    },
    winnings: {
        type: Number,
        required: false,
        _id : false
    },
    streak: {
        type: Number,
        required: false,
        _id : false
    },
    current: {
        type: Number,
        required: false,
        _id : false
    },
    guild: {
        type: Object,
        required: false,
        trim: true,
        _id : false
    },
    record: {
        wins: {
            type: Number,
            required: false,
            default: 0,
            _id : false
        },
        loss: {
            type: Number,
            required: false,
            default: 0,
            _id : false
        },
        ties: {
            type: Number,
            required: false,
            default: 0,
            _id : false
        }
    },
})

statSchema.methods.findUser = async function (id) {
    let user
    await this.users.forEach(u => {
        if (u.id === id) user = u
    })
    if (!user) throw new Error('No user exists in stats record')
    return user
}

statSchema.methods.findAvgProb = async function () {
    let sum = 0
    await this.probability.forEach(chance => {
        sum += chance
    })
    if (this.probability.length > 0) sum = sum / this.probability.length
    return sum
}

const Statistics = mongoose.model('Statistics', statSchema)

module.exports = Statistics