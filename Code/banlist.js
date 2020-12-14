const Discord = require("discord.js");
const { cyan, left, right } = require("../config.json");

module.exports = {
    name: 'banlist',
    description: 'View the banlist',
    usage: '<user id>',
    aliases: ['bans'],
    cooldown: 5,
    class: 'admin',
    args: false,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let leftem = client.emojis.cache.get(left)
            let rightem = client.emojis.cache.get(right)
            if (args[0]) {
                let idfunc = args[0];
                let userid = args[1];
                if (idfunc === "add") {
                    con.query(`SELECT * FROM banlist`, (err, rows) => {
                        if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                        let JSONrows = JSON.stringify(rows);
                        let parsedRows = JSON.parse(JSONrows);
                        let idmap = parsedRows.map(n => n.id)
                        if (userid < 10000000) return msg.channel.send("That isn't a valid user ID")
                        if (idmap.includes(userid)) return msg.channel.send("That user is already in the banlist")
                        con.query(`INSERT INTO banlist (id) VALUES (${userid})`)
                        msg.channel.send(`<@${userid}> added`)
                    })
                } if (idfunc === "delete") {
                    if ((!args[1]) || (isNaN(args[1]))) return msg.channel.send("You've gotta tell me a user to delete")
                    con.query(`SELECT * FROM banlist`, (err, rows) => {
                        if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                        if (!rows.length) return msg.channel.send("There's no one on the banlist")
                        if (userid < 10000000) return msg.channel.send("That isn't a valid user ID")
                        con.query(`DELETE FROM banlist WHERE id = ${userid}`, err => {
                            if (err) return msg.channel.send("That isn't a user on the banlist");
                            msg.channel.send(`<@${userid}> deleted`)
                        })
                    })
                }
            } else {
                con.query(`SELECT * FROM banlist`, (err, rows) => {
                    if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                    let JSONrows = JSON.stringify(rows);
                    let parsedRows = JSON.parse(JSONrows);
                    let currentIndex = 0
                    let pagetotal = (Math.floor(parsedRows.length / 10) + 1)
                    function generateEmbed(start) {
                        let current = parsedRows.slice(start, 10 + start)
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`Members on the banlist`)
                            .setColor(cyan)
                            .setThumbnail(msg.guild.iconURL())
                            .setFooter(`Page 1/${pagetotal}`)
                        let finrows = '';
                        current.forEach((row) => {
                            finrows += `\n<@${row.id}>`;
                        })
                        embed.setDescription(finrows)
                        return embed
                    }
                    msg.channel.send(generateEmbed(0)).then(message => {
                        // exit if there is only one page of guilds (no need for all of this)
                        if (parsedRows.length <= 10) return
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
                                    .setTitle(`Members on the banlist`)
                                    .setColor(cyan)
                                    .setThumbnail(msg.guild.iconURL())
                                    .setFooter(`Page ${(start / 10) + 1}/${pagetotal}`)
                                let finrows = '';
                                current.forEach((row) => {
                                    finrows += `\n<@${row.id}>`;
                                })
                                embed2.setDescription(finrows)
                                return embed2
                            }
                            message.reactions.cache.clear();
                            message.edit(generateEmbed2(currentIndex))
                        })
                    }).catch((err) => {
                        return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                    });
                })
            }
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}