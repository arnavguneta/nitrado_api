// Edited from https://github.com/saanuregh/discord.js-pagination/blob/master/index.js
const paginationEmbed = async (channel, pages, message, emojiList = ['⬅', '➡'], timeout = 120000) => {
    //if (!channel) throw new Error('Channel is inaccessible.');
    if (!pages) throw new Error('Pages are not given.');
    if (emojiList.length !== 2) throw new Error('Need two emojis.');
    let page = 0;

    channel.send(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`))
        .then(msg => collectReactions(msg))
        .catch(async err => { message.channel.send(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)).then(msg => collectReactions(msg)) });


    const collectReactions = async (curPage) => {
        for (const emoji of emojiList) await curPage.react(emoji);
        const reactionCollector = curPage.createReactionCollector(
            (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot, { time: timeout, dispose: true },
        );
        const managePageChange = (reaction) => {
            switch (reaction.emoji.name) {
                case emojiList[0]:
                    page = page > 0 ? --page : pages.length - 1;
                    break;
                case emojiList[1]:
                    page = page + 1 < pages.length ? ++page : 0;
                    break;
                default:
                    break;
            }
            try {
                curPage.edit(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`));
            } catch (error) { console.log('Failed to update page') }
        }
        reactionCollector.on('collect', reaction => {
            managePageChange(reaction)
        });
        reactionCollector.on('remove', reaction => {
            managePageChange(reaction)
        });
        reactionCollector.on('end', () => {
            try {
                if (!curPage.deleted) curPage.edit(pages[page].setDescription(pages[page].description += '\n**Message has expired!** Resend the command to view other pages\n'))
            } catch (error) { console.log('Failed to update page') }

        });
        return curPage;
    }


}
module.exports = paginationEmbed;