const { magenta } = require("../config.json");
const Discord = require("discord.js");

module.exports = {
    name: 'giveaway',
    description: 'Check giveaway placements',
    usage: '',
    cooldown: 10,
    class: 'devcmd',
    args: false,
    async execute(msg, args, con) {
        con.query(`SELECT * FROM giveaway ORDER BY count DESC`, (err, rows) => {
            let JSONrows = JSON.stringify(rows);
            let parsedRows = JSON.parse(JSONrows);
            let currentIndex = 0
            let pagetotal = (Math.floor(parsedRows.length / 10) + 1)
            function generateEmbed(start) {
                let current = parsedRows.slice(start, 10 + start)
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Here are the giveaway rankings`)
                    .setColor(magenta)
                    .setThumbnail(msg.guild.iconURL())
                    .setFooter(`Page 1/${pagetotal}`)
                let finrows = '';
                current.forEach((row) => {
                    finrows += `\n**${row.user}** ~*${row.count}* messages`;
                })
                embed.setDescription(finrows)
                return embed
            }
            msg.channel.send(generateEmbed(0)).then(message => {
                // exit if there is only one page of guilds (no need for all of this)
                if (parsedRows.length <= 10) return
                // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
                message.react('⬅️')
                message.react('➡️')
                const collector = message.createReactionCollector(
                    // only collect left and right arrow reactions from the message author
                    (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === msg.author.id,
                    // time out after a minute
                    { time: 60000 }
                )
                collector.on('collect', r => {
                    r.emoji.name === '⬅️' ? currentIndex -= 10 : currentIndex += 10;
                    if (currentIndex < 0) {
                        currentIndex = 0;
                        return;
                    }
                    if (currentIndex > parsedRows.length) {
                        currentIndex -= 10;
                        return;
                    }
                    if (currentIndex === parsedRows.length) return;
                    function generateEmbed2(start) {
                        let current = parsedRows.slice(start, 10 + start)
                        const embed2 = new Discord.MessageEmbed()
                            .setTitle(`Here are the giveaway rankings`)
                            .setColor(magenta)
                            .setThumbnail(msg.guild.iconURL())
                            .setFooter(`Page ${(start / 10) + 1}/${pagetotal}`)
                        let finrows = '';
                        current.forEach((row) => {
                            finrows += `\n**${row.user}** ~*${row.count}* messages`;
                        })
                        embed2.setDescription(finrows)
                        return embed2
                    }
                    message.reactions.cache.clear();
                    message.edit(generateEmbed2(currentIndex))
                });
            })
        });
    },
}