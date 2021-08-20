const { magenta, left, right } = require("../config.json");
const Discord = require("discord.js");

module.exports = {
    name: 'giveaway',
    description: 'Check giveaway placements',
    usage: '',
    cooldown: 10,
    class: 'devcmd',
    args: false,
    async execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let leftem = client.emojis.cache.get(left)
            let rightem = client.emojis.cache.get(right)
            con.query(`SELECT * FROM giveaway ORDER BY count DESC`, (err, rows) => {
                if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                if (!rows.length) return msg.channel.send("There is no giveaway taking place right now")
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
                    if (parsedRows.length <= 10) return;
                    // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
                    message.react(leftem)
                    message.react(rightem)
                    const collector = message.createReactionCollector(
                        // only collect left and right arrow reactions from the message author
                        (reaction, user) => [left, right].includes(reaction.emoji.id) && user.id === msg.author.id,
                        // time out after a minute
                        { time: 60000 }
                    )
                    collector.on('collect', r => {
                        r.emoji.id === left ? currentIndex -= 10 : currentIndex += 10;
                        if (currentIndex < 0) {
                            currentIndex = 0;
                            return;
                        }
                        if (curretIndex > parsedRows.length) {
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
                    })
                }).catch((err) => {
                    return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                })
            })
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}