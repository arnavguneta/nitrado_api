const { MessageEmbed } = require('discord.js')

module.exports = (options) => {
    let {
        color = '#0099ff',
        title = undefined,
        url = undefined,
        description = undefined,
        thumbnail = undefined,
        fields = undefined,
        image = undefined,
        authorName = undefined,
        authorLink = undefined,
        footer = undefined,
        footerURL = undefined
    } = options

    let embed = new MessageEmbed()
        .setColor(color)
        .setTimestamp()
    if (title) embed.setTitle(title)
    if (url) embed.setURL(url)
    if (thumbnail) embed.setThumbnail(thumbnail)
    if (footerURL) embed.setFooter(footer, footerURL)
    else if (footer) embed.setFooter(footer)
    if (authorName) embed.setAuthor(authorName, authorLink)

    try {
        if (description) embed.setDescription(description)
        if (fields) embed.addFields(fields)
        if (image) embed.setImage(image)
    } catch (error) { }
    return embed
}