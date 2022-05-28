const mongoose = require('mongoose')

const bankSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: false,
        trim: true
    },
    balance: {
        type: Number,
        required: false,
        trim: true,
        default: 100
    },
    id: {
        type: Object,
        required: true,
        trim: true
    },
    guild: {
        type: Object,
        required: true,
        trim: true
    }
}, { _id : false })
// bankSchema.statics.findByUserId = async (id) => {
//     const user = await User.findOne({ id })
//     if (!user) throw new Error('Unable to fetch user')
//     return user
// }

const Bank = mongoose.model('Bank', bankSchema)

module.exports = Bank