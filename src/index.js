const Discord = require('discord.js')
const fs = require("fs");

require('module-alias/register')
require('@db/mongoose')
require('events').EventEmitter.defaultMaxListeners = 40;

const config = require('@root/config.json');

const Wordle = require('@models/Wordle')

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: Object.values(Discord.Constants.PartialTypes) })

const { VALID_GUESSES } = require('./constants/valid_guesses.js')
const { WORD_LIST } = require('./constants/word_list.js')
const colors = { YELLOW_BOX: '🟨', BLACK_BOX: '⬛', GREEN_BOX: '🟩' }
let WOTD = ''

let array_equals = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

let check_word = (word) => {
    return (
        WORD_LIST.includes(word.toLowerCase()) ||
        VALID_GUESSES.includes(word.toLowerCase())
    )
}

// get word of the day
let getWOTD = () => {
    // January 1, 2022 Game Epoch
    let epochMs = new Date('January 1, 2022 00:00:00').valueOf()
    let now = Date.now()
    let msInDay = 86400000
    let index = Math.floor((now - epochMs) / msInDay)
    let nextday = (index + 1) * msInDay + epochMs
  
    return {
      solution: WORD_LIST[index % WORD_LIST.length].toUpperCase(),
      solutionIndex: index,
      tomorrow: nextday
    }
}

let get_colors = (word) => {
    if (!word.length) word = ['*','*','*','*','*']
    let out = []
    for (let letter = 0; letter < WOTD.length; letter++) 
        if (WOTD[letter] === word[letter]) out.push(colors.GREEN_BOX) 
        else if (WOTD.includes(word[letter])) out.push(colors.YELLOW_BOX)
        else out.push(colors.BLACK_BOX) 
    return out
}   

let display_board = (board, word, confirm) => {
    let out = ``, rows = board.rows, color_vals 
    if (word) rows = [... board.rows, word]
    for (let row of rows) {
        color_vals = [colors.BLACK_BOX, colors.BLACK_BOX, colors.BLACK_BOX, colors.BLACK_BOX, colors.BLACK_BOX]   
        if (confirm || row !== word) color_vals = get_colors(row)

        console.log({row, word, val: (row!==word), confirm, color_vals})

        for (let letter = 0; letter < row.length; letter++) out += (letter == 4) ? `| ${color_vals[letter]} ${row[letter]} |\n` : `| ${color_vals[letter]} ${row[letter]} `
    }
    for (let i = 0; i < (6 - rows.length); i++) out += `| ${colors.BLACK_BOX} X | ${colors.BLACK_BOX} X | ${colors.BLACK_BOX} X | ${colors.BLACK_BOX} X | ${colors.BLACK_BOX} X |\n`
    return { output: out, game_won: array_equals(word, WOTD), game_over: (confirm && rows.length >= 6), distr_index: rows.length-1 }
}

let update_distr = (distribution, index) => { 
    distribution[index] += 1
    return distribution
}

let is_won = (board) => {
    for (let row of board.rows) {
        if (array_equals(row, WOTD)) return true
    }
    return false
}

client.on('ready', async () => {
    if (config.settings.maintenance) {
        config.settings.maintenance = false
        fs.writeFile('./src/config.json', JSON.stringify(config), err => { })
    }
    console.log("Bot is ready!")
})

client.on('messageCreate', async message => {
    let { content } = message
    if (!content.startsWith(process.env.prefix)) return
    const command = `${process.env.prefix}register`
    if (content.toLowerCase().startsWith(`${command} `) || content.toLowerCase() === command) {
        const TEST_GUILD = client.guilds.cache.get('338754004869971968')
        let commands

        if (TEST_GUILD) commands = TEST_GUILD.commands
        else commands = client.application.commands

        commands?.create({
            name: 'wordle',
            description: 'Guess the word of the day or view your game.',
            options: [{
                name: 'word',
                description: '5 letter word to guess.',
                required: false,
                type: Discord.Constants.ApplicationCommandOptionTypes.STRING
            }]
        })
    }
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return
    const { commandName, options } = interaction

    if (commandName === 'wordle') {
        // TODO Database: check if the word of the day from loaded game is same as now, if not make new game
        let { solution, solutionIndex, tomorrow} = getWOTD()
        WOTD = solution.split('')

        // check if the user id sending this has a game going already
        let game = await Wordle.findOne({ id: interaction.user.id })        
        if (game?.board?.WOTD !== solution || !game) await Wordle.findOneAndUpdate({ id: interaction.user.id }, { '$set': { 'board': {rows: [], WOTD: ''} } }, {upsert: true})
        game = await Wordle.findOne({ id: interaction.user.id })  

        console.log(game, { WOTD: solution, solutionIndex, tomorrow})

        if (options.data.length && game.board.rows.length < 6 && !is_won(game.board)) {
            data = options.data[0]
            data.value = data.value.toUpperCase()
            // check if the word passed is 5 letters
            if (data.value.length == 5) {
                // buttons for the message, confirm and delete
                let row = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId('enter')
                            .setLabel('Enter')
                            .setStyle('SUCCESS')
                            .setEmoji('✔')
                    )
                    .addComponents(
                        new Discord.MessageButton()
                           .setCustomId('delete')
                           .setLabel('Delete')
                           .setStyle('SECONDARY')
                    )
                
                // reply with game board with the word 
                await interaction.reply({
                    //content: `|  ${data.value[0]}  |  ${data.value[1]}  |  ${data.value[2]}  |  ${data.value[3]}  |  ${data.value[4]}  |\n${EMPTY_ROW}${EMPTY_ROW}${EMPTY_ROW}${EMPTY_ROW}${EMPTY_ROW}`,
                    content: display_board(game.board, data.value.split(''), false).output,
                    ephemeral: true,
                    components: [row]
                })

                // setup button reaction collector for 5 minutes
                const collector = interaction.channel.createMessageComponentCollector({
                    filter: (button_int) => interaction.user.id = button_int.user.id,
                    max: 1,
                    time: 1000 * 300
                })

                collector.on('collect', async button_int => {
                    if (button_int.customId === 'enter') {
                        // for confirm button, if the 5 letter combination is a word
                        if (check_word(data.value)) {
                            let results = display_board(game.board, data.value.split(''), true)
                            console.log(results)
                            await interaction.editReply({
                                content: results.output,
                                ephemeral: true,
                                components: []
                            })
                            // double array of board, use update instead
                            console.log(game)
                            await Wordle.updateOne({ id: button_int.user.id }, { '$set': { 'board.rows': [ ... game.board.rows, data.value.split('') ], 'board.WOTD': solution, 
                            'stats.max_streak': (results.game_won && (game.stats.current_streak + 1) >= game.stats.max_streak) ? (game.stats.current_streak + 1) : game.stats.max_streak, 
                            'stats.current_streak': (!results.game_won && results.game_over) ? 0 : game.stats.current_streak, 
                            'stats.distribution': (results.game_won) ? update_distr(game.stats.distribution, results.distr_index) : game.stats.distribution } })

                            await Wordle.updateOne({ id: button_int.user.id },{ '$inc': { 'stats.played': (results.game_won || results.game_over) ? 1 : 0, 'stats.won': (results.game_won) ? 1 : 0, 'stats.current_streak': (results.game_won) ? 1 : 0 } })
                            
                            game = await Wordle.findOne({ id: interaction.user.id })  

                            if (results.game_won || results.game_over) {
                                let out = `<@${button_int.user.id}>'s Wordle ${solutionIndex} ${results.distr_index+1}/6\n\n`
                                for (let row of game.board.rows) out += get_colors(row).join('') + '\n'
                                await button_int.channel.send(out);
                                out = `**Your Statistics**\nPlayed ${game.stats.played}\nWin % ${(game.stats.won/game.stats.played) * 100}\nCurrent Streak ${game.stats.current_streak}\nMax Streak ${game.stats.max_streak}\nDistribution:\n`
                                for (let i = 0; i < game.stats.distribution.length; i++) out += `${i+1}: ${game.stats.distribution[i]}\n`
                                await button_int.reply({
                                    content: out,
                                    ephemeral: true,
                                })
                            }
                        } else {
                            // the 5 letter combination is not an accepted word
                            await interaction.editReply({
                                content: `*${data.value}* is not an accepted word.\nUse /wordle [word] to guess another word`,
                                ephemeral: true,
                                components: []
                            })
                        }
                    } else {
                        // helpful message 
                        await interaction.editReply({
                            content: `Use /wordle [word] to guess another word\n${display_board(game.board, null, true).output}`,
                            ephemeral: true,
                            components: []
                        })
                    }
                        
                })
                // collector.on('end', async collection => {
                //     console.log(interaction)

                    
                // })
            } else {
                await interaction.reply({
                    content: 'Word must be 5 letters long',
                    ephemeral: true
                })
            }
        } else {
            // TODO just display the game board
            let results = display_board(game.board, null, true)
            interaction.reply({
                content: results.output,
                ephemeral: true
            })
        }        
    }
})

client.login(process.env.token)