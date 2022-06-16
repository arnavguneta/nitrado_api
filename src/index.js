const Discord = require('discord.js')
const fs = require("fs");
const fetch = require('node-fetch');

require('module-alias/register')
require('events').EventEmitter.defaultMaxListeners = 40;

const config = require('@root/config.json');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: Object.values(Discord.Constants.PartialTypes) })

let webhook;

client.on('ready', async () => {
    if (config.settings.maintenance) {
        config.settings.maintenance = false
        fs.writeFile('./src/config.json', JSON.stringify(config), err => { })
    }

    // webhook fetcher
    const channel = client.channels.cache.get('987101924266496000');

	try {
		const webhooks = await channel.fetchWebhooks();
		webhook = webhooks.find(wh => wh.token);

		if (!webhook) {
			return console.log('No webhook was found that I can use!');
		}
	} catch (error) {
		console.error('Error trying to send a message: ', error);
	}

    // start listener for streamer logs
    let last_message = require('@root/last-message.json');
    setInterval(async () => {
        let post_fetch = await fetch(`https://logs.ivr.fi/channel/erobb221/user/erobb221?json=true&reverse=true`);
        let data = await post_fetch.json()

        let new_messages = await data.messages.filter(message => message.tags['tmi-sent-ts'] > last_message.tags['tmi-sent-ts'])
        for (let i = new_messages.length-1; i >= 0; i--) sendMessage(new_messages[i].text, new_messages[i].username, 'https://cdn.betterttv.net/emote/5fc53fdecac2fb4621e48bb0/3x')
        
        last_message = data.messages[0]
        fs.writeFile('./src/last-message.json', JSON.stringify(last_message), err => { })
    }, 10000)

    console.log("Bot is ready!")
})

const sendMessage = async (content, streamer, avatar) => {
    await webhook.send({
        content: content,
        username: streamer,
        avatarURL: avatar,
    });
}

client.on('messageCreate', async message => {
    let { content } = message
    if (!content.startsWith(process.env.prefix)) return
    const command = `${process.env.prefix}register`
    if (content.toLowerCase().startsWith(`${command} `) || content.toLowerCase() === command) {
        const TEST_GUILD = client.guilds.cache.get('903462757377142785')
        let commands

        if (TEST_GUILD) commands = TEST_GUILD.commands
        else commands = client.application?.commands

        commands?.set([
            {
                name: 'ark',
                description: 'Commands related to the ArkSE gameserver.',
                options: [{
                    name: 'action',
                    description: 'desired command action',
                    required: true,
                    type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
                    choices: [{ name: 'status', value: 'status' }, { name: 'restart', value: 'restart' }, { name: 'stop', value: 'stop' }]
                }]
            }
        ])
    }
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return
    const { commandName, options } = interaction

    if (commandName === 'ark') {
        let status_fetch = await fetch(`https://api.nitrado.net/services/${process.env.service_id}/gameservers`, { headers: { 'Authorization': `Bearer ${process.env.ACCESS_TOKEN}` } });
        let status_data = await status_fetch.json()
        let status = (status_data.data?.gameserver?.status) ? status_data.data.gameserver.status : 'unknown'

        let out = `Status fetch request: ${status_data.status}\nServer status: ${status}\nPlayers online: ${status_data.data?.gameserver?.query?.player_current}`
        
        if (options.getString('action') != 'status' && status_data.status == 'success') {
            out += `Attempting to ${options.getString('action')} the gameserver ...\n`
            if (status != 'started' && status != 'stopped' && status != 'suspended') {
                out += 'Server is in a non actionable state\n'
            } else {
                let action_fetch = await fetch(`https://api.nitrado.net/services/${process.env.service_id}/gameservers/${options.getString('action')}`, { 
                    method: 'post',
                    headers: { 'Authorization': `Bearer ${process.env.ACCESS_TOKEN}` } 
                });
                let action_data = await action_fetch.json()
                
                out += `Action fetch request: ${action_data.status}\nResponse: ${action_data.message}\n`
            }
        }

        await interaction.reply({
            content: out,
            ephemeral: false,
        })
    }
})

client.login(process.env.token)