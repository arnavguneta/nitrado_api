const mongoose = require('mongoose')

const lootBoxSchema = new mongoose.Schema({
    id: {
        type: Object,
        required: false,
        _id : false
    },
    amount: {
        type: Number,
        default: 0,
        required: false,
        _id : false
    },
    claimed: {
        type: Boolean,
        default: false,
        required: false,
        _id : false
    },
    guild: {
        type: Object,
        required: false,
        _id : false
    }
})

const LootBox = mongoose.model('LootBox', lootBoxSchema)

module.exports = LootBox