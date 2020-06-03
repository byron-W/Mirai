const Discord = require("discord.js");
const { pink } = require("../config.json");

module.exports = {
    name: 'myclaims',
    description: 'Display the claims a user has',
    aliases: ['myc', 'myclaim'],
    usage: '<user>',
    cooldown: 5,
    class: 'waifu',
    args: false,
    execute(msg, args, con) {
        let author = msg.author;
        let user = msg.mentions.users.first();
        if (user) {
            con.query(`SELECT name FROM claimed WHERE id = "${user.id}"`, (err, rows) => {
                if (err) throw err;
                if (rows.length < 1) return msg.channel.send("That user doesn't have any people")
                try {
                    let JSONrows = JSON.stringify(rows);
                    let parsedRows = JSON.parse(JSONrows);
                    let currentIndex = 0
                    let pagetotal = (Math.floor(parsedRows.length / 10) + 1)
                    function generateEmbed(start) {
                        let current = parsedRows.slice(start, 10 + start)
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`__**${user.username}'s ${parsedRows.length} claims**__`)
                            .setColor(pink)
                            .setThumbnail(parsedRows[start].image)
                            .setFooter(`Page 1/${pagetotal}`)
                        let finrows = '';
                        current.forEach((row) => {
                            finrows += `\n**${row.name}**`;
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
                                    .setTitle(`__**${user.username}'s ${parsedRows.length} claims**__`)
                                    .setColor(pink)
                                    .setThumbnail(parsedRows[start].image)
                                    .setFooter(`Page ${(start / 10) + 1}/${pagetotal}`)
                                let finrows = '';
                                current.forEach((row) => {
                                    finrows += `\n**${row.name}**`;
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
        } else {
            con.query(`SELECT name FROM claimed WHERE id = "${author.id}"`, (err, rows) => {
                if (err) throw err;
                if (rows.length < 1) return msg.channel.send("You don't have any people")
                try {
                    let JSONrows = JSON.stringify(rows);
                    let parsedRows = JSON.parse(JSONrows);
                    let currentIndex = 0
                    let pagetotal = (Math.floor(parsedRows.length / 10) + 1)
                    function generateEmbed(start) {
                        let current = parsedRows.slice(start, 10 + start)
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`__**Your ${parsedRows.length} claims**__`)
                            .setColor(pink)
                            .setThumbnail(parsedRows[start].image)
                            .setFooter(`Page 1/${pagetotal}`)
                        let finrows = '';
                        current.forEach((row) => {
                            finrows += `\n**${row.name}**`;
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
                                    .setTitle(`__**Your ${parsedRows.length} claims**__`)
                                    .setColor(pink)
                                    .setThumbnail(parsedRows[start].image)
                                    .setFooter(`Page ${(start / 10) + 1}/${pagetotal}`)
                                let finrows = '';
                                current.forEach((row) => {
                                    finrows += `\n**${row.name}**`;
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