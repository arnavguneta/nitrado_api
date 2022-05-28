const User = require('@models/user')

const updateUser = async (id, data, callback) => {
    let user = await User.findOne({ id })
    if (!user) callback('User not found')
    else {
        const updates = Object.keys(data)
        const allowedUpdates = ['tag', 'id', 'games', 'balance', 'vote', 'mc', 'account']
        const isValidOperation = updates.every(update => allowedUpdates.includes(update))

        if (!isValidOperation) return callback('Invalid update operation')
        
        try {
            updates.forEach(update => {
                // if (update === 'games') {
                //     const gameUpdates = Object.keys(data.games)
                //     gameUpdates.forEach(gameUpdate => {
                //         if (gameUpdate === 'double') {
                //             const doubleUpdates = Object.keys(data.games.double)
                //             doubleUpdates.forEach(doubleUpdate => {
                //                 user.games.double[doubleUpdate] = data.games.double[doubleUpdate]
                //             })
                //         } else if (gameUpdate === 'bj') {
                //             const bjUpdates = Object.keys(data.games.bj)
                //             bjUpdates.forEach(bjUpdate => {
                //                 user.games.bj[bjUpdate] = data.games.bj[bjUpdate]
                //             })
                //         }
                //     })
                // } else 
                if (update === 'account') {
                    for (obj of user.accounts) {
                        if (data.account.guild === obj.guild) {
                            if (data.account.mc !== undefined) obj.mc = data.account.mc
                            obj.balance = data.account.balance
                        }
                    }
                } else if (update === 'vote') {
                    const voteUpdates = Object.keys(data.vote)
                    voteUpdates.forEach(voteUpdate => { 
                        user.vote[voteUpdate] = data.vote[voteUpdate]
                    })
                    
                } else {
                    user[update] = data[update]
                }
            })
            await user.save()
            callback('', user)
        } catch (error) {
            callback('Some error occured')
        }
    }

}

const addUsers = async (user, guildID) => {
    try {
        const data = {
            tag: user.tag,
            id: user.id,
            accounts: { guild: guildID, balance: 1000 }
        }
        user = new User(data)
        await user.save()
    } catch (error) {
        console.log(`Error saving user ${data.tag} to database`)
    }
}

const fetchById = async (id) => {
    let user = await User.findOne({ id })
    return user
}

const fetchByGuild = async (data) => {
    let user = await User.find(data)
    return user
}
module.exports = { updateUser, addUsers, fetchById, fetchByGuild }