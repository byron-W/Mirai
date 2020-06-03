const Discord = require("discord.js");

module.exports = {
    name: 'allcharacters',
    description: 'Search for all characters in an anime',
    aliases: ['allchar'],
    usage: '<anime name> or unclaimed or nothin for all characters',
    cooldown: 5,
    class: 'waifu',
    args: false,
    execute(msg, args, con) {
        let unclaimed = msg.content.endsWith("unclaimed");
        let animename = args.join(" ");
        if (!animename) {
            con.query(`SELECT * FROM roll ORDER BY animename`, (err, rows) => {
                if (err) return msg.channel.send("I couldn't find that anime")
                try {
                    let JSONrows = JSON.stringify(rows);
                    let parsedRows = JSON.parse(JSONrows);
                    let currentIndex = 0
                    let pagetotal = (Math.floor(parsedRows.length / 10) + 1)
                    function generateEmbed(start) {
                        let current = parsedRows.slice(start, 10 + start)
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`There are a total of ${parsedRows.length} waifus/husbandos`)
                            .setColor(0xE06666)
                            .setThumbnail(parsedRows[start].image)
                            .setFooter(`Page 1/${pagetotal}`)
                        let finrows = '';
                        current.forEach((row) => {
                            if (row.claimedby === "None") {
                                finrows += `\n**${row.name}**(*${row.animename}*)`;

                            } else {
                                finrows += `\n**${row.name}**(*${row.animename}*) - Claimed by: ${row.claimuser}`;
                            }
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
                                    .setTitle(`There are a total of ${parsedRows.length} waifus/husbandos`)
                                    .setColor(0xE06666)
                                    .setThumbnail(parsedRows[start].image)
                                    .setFooter(`Page ${(start / 10) + 1}/${pagetotal}`)
                                let finrows = '';
                                current.forEach((row) => {
                                    if (row.claimedby === "None") {
                                        finrows += `\n**${row.name}**(*${row.animename}*)`;

                                    } else {
                                        finrows += `\n**${row.name}**(*${row.animename}*) - Claimed by: ${row.claimuser}`;
                                    }
                                })
                                embed2.setDescription(finrows)
                                return embed2
                            }
                            message.reactions.cache.clear();
                            message.edit(generateEmbed2(currentIndex))
                        });
                    })
                } catch (er) {
                    console.log(er)
                    return msg.channel.send("I couldn't find that anime")
                }
            });
        } if ((animename) && (!unclaimed)) {
            con.query(`SELECT * FROM roll WHERE animename LIKE "%${animename}%" ORDER BY name`, (err, rows) => {
                if (err) return msg.channel.send("I couldn't find that anime")
                try {
                    let JSONrows = JSON.stringify(rows);
                    let parsedRows = JSON.parse(JSONrows);
                    let currentIndex = 0
                    let pagetotal = (Math.floor(parsedRows.length / 10) + 1)
                    let aniname = rows[0].animename;
                    function generateEmbed(start) {
                        let current = parsedRows.slice(start, 10 + start)
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`${aniname} has ${parsedRows.length} waifus/husbandos`)
                            .setColor(0xE06666)
                            .setThumbnail(parsedRows[start].image)
                            .setFooter(`Page 1/${pagetotal}`)
                        let finrows = '';
                        current.forEach((row) => {
                            if (row.claimedby === "None") {
                                finrows += `\n**${row.name}**`;

                            } else {
                                finrows += `\n**${row.name}** - Claimed by: ${row.claimuser}`;
                            }
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
                                    .setTitle(`${aniname} has ${parsedRows.length} waifus/husbandos`)
                                    .setColor(0xE06666)
                                    .setThumbnail(parsedRows[start].image)
                                    .setFooter(`Page ${(start / 10) + 1}/${pagetotal}`)
                                let finrows = '';
                                current.forEach((row) => {
                                    if (row.claimedby === "None") {
                                        finrows += `\n**${row.name}**`;

                                    } else {
                                        finrows += `\n**${row.name}** - Claimed by: ${row.claimuser}`;
                                    }
                                })
                                embed.setDescription(finrows)
                                return embed2
                            }
                            message.reactions.cache.clear();
                            message.edit(generateEmbed2(currentIndex))
                        });
                    })
                } catch (er) {
                    console.log(er)
                    return msg.channel.send("I couldn't find that anime")
                }
            });
        } if ((unclaimed) && (animename)) {
            con.query(`SELECT * FROM unclaimed ORDER BY animename`, (err, rows) => {
                if (err) return msg.channel.send("I couldn't find that anime")
                try {
                    let JSONrows = JSON.stringify(rows);
                    let parsedRows = JSON.parse(JSONrows);
                    let currentIndex = 0
                    let pagetotal = (Math.floor(parsedRows.length / 10) + 1)
                    function generateEmbed(start) {
                        let current = parsedRows.slice(start, 10 + start)
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`There are a total of ${parsedRows.length} unclaimed waifus/husbandos`)
                            .setColor(0xE06666)
                            .setThumbnail(parsedRows[start].image)
                            .setFooter(`Page 1/${pagetotal}`)
                        let finrows = '';
                        current.forEach((row) => {
                            finrows += `\n**${row.name}** - (*${row.animename}*)`;
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
                                    .setTitle(`There are a total of ${parsedRows.length} unclaimed waifus/husbandos`)
                                    .setColor(0xE06666)
                                    .setThumbnail(parsedRows[start].image)
                                    .setFooter(`Page ${(start / 10) + 1}/${pagetotal}`)
                                let finrows = '';
                                current.forEach((row) => {
                                    finrows += `\n**${row.name}** - (*${row.animename}*)`;
                                })
                                embed2.setDescription(finrows)
                                return embed2
                            }
                            message.reactions.cache.clear();
                            message.edit(generateEmbed2(currentIndex))
                        });
                    })
                } catch (er) {
                    console.log(er)
                    return msg.channel.send("I couldn't find that anime")
                }
            });
        }
    },
}