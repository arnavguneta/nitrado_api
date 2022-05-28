const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: false,
        trim: true,
        _id: false
    },
    accounts: [{
        guild: {
            type: Object,
            required: false,
            trim: true,
            _id: false
        },
        balance: {
            type: Number,
            required: false,
            trim: true,
            default: 100,
            _id: false
        },
        mc: {
            type: Number,
            required: false,
            _id: false
        },
        left: {
            type: Boolean,
            default: false,
            required: false,
            _id: false
        },
        badges: {
            type: Array,
            default: [],
            required: false,
            _id: false
        },
        reward: {
            weekly: {
                type: Boolean,
                required: false,
                _id: false
            },
            amount: {
                type: Number,
                required: false,
                _id: false
            }
        }
    }],
    id: {
        type: Object,
        required: true,
        trim: true,
        _id: false
    },
    settings: {
        lootboxes: {
            type: Boolean,
            default: false,
            required: false,
            _id: false
        },
        cooldowns: {
            type: Boolean,
            default: false,
            required: false,
            _id: false
        }
    },
    vote: {
        lastVote: {
            type: Number,
            required: false,
            _id: false
        },
        rewards: {
            type: Number,
            required: false,
            _id: false
        },
        total: {
            type: Number,
            required: false,
            _id: false
        },
        weekly: {
            type: Number,
            required: false,
            _id: false
        },
        streak: {
            type: Number,
            required: false,
            _id: false
        }
    }
})

userSchema.methods.addBadge = async function (id, guild) {
    if (!this.hasGuildAccount(guild)) return
    for (obj of this.accounts) {
        if (obj.guild === guild) obj.badges.push(id)
    }
    await this.save()
}

userSchema.methods.removeBadge = async function (id, guild) {
    if (!this.hasGuildAccount(guild)) return
    for (obj of this.accounts) {
        if (obj.guild === guild) {
            obj.badges.splice(obj.badges.indexOf(id), 1);
        }
    }
    await this.save()
}


userSchema.methods.hasBadge = function (id, guild) {
    if (!this.hasGuildAccount(guild)) return
    for (obj of this.accounts) {
        if (obj.guild === guild) {
            for (let badge of obj.badges) {
                if (badge === id) return true
            }
        }
    }
    return false
}

userSchema.methods.getBadges = function (guild) {
    if (!this.hasGuildAccount(guild)) return
    for (obj of this.accounts) {
        if (obj.guild === guild) return obj.badges
    }
    return
}

userSchema.methods.getBalance = function (id) {
    let balance = -10000
    for (obj of this.accounts) {
        if (obj.guild === id) balance = obj.balance
    }
    return balance
}

userSchema.methods.hasReward = function (type, id) {
    for (obj of this.accounts) {
        if (obj.reward != undefined && obj.guild === id && obj.reward[type]) return { has: obj.reward[type], amount: obj.reward.amount } 
    }
    return { has: false, amount: 0 }
}

userSchema.methods.getMCTimestamp = function (id) {
    let stamp = undefined
    for (obj of this.accounts) {
        if (obj.guild === id) stamp = obj.mc
    }
    return stamp
}

userSchema.methods.hasGuildAccount = function (id) {
    let found = false
    for (obj of this.accounts) {
        if (obj.guild === id) {
            found = true
            return found
        }
    }
    return found
}

userSchema.statics.findByUserId = async (id) => {
    const user = await User.findOne({ id })
    if (!user) throw new Error('Unable to fetch user')
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User