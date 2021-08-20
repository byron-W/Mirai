const Discord = require("discord.js");
const { pink } = require("../config.json");

module.exports = {
    name: 'trade',
    description: 'Trade claims with a user',
    usage: '<user>|<character>',
    cooldown: 10,
    class: 'waifu',
    args: false,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let user = msg.mentions.users.first();
            let author = msg.author;
            let tradewaifu = linkargs[1];
            if (!tradewaifu) return msg.channel.send("You didn't say who you wanted to trade")
            if (!user) return msg.channel.send("You didn't mention a user to trade with")
            con.query(`SELECT * FROM trading`, (err, rows) => {
                if (rows.length > 0) return msg.channel.send("There is an active trading event")
                con.query(`SELECT * FROM claimed WHERE id = "${author.id}" AND name LIKE "%${tradewaifu}%"`, (err, rows) => {
                    if (rows.length < 1) return msg.channel.send("You don't have that waifu")
                    let tradeoffer = rows[0].name;
                    try {
                        con.query(`SELECT * FROM claimed WHERE id = "${user.id}"`, (err, rows) => {
                            if (rows.length < 1) return msg.channel.send("That user doesn't have any waifus")
                            con.query(`INSERT INTO trading (id, waifu) VALUES ("${author.id}", "${tradeoffer}")`)
                            con.query(`INSERT INTO trading (id, waifu) VALUES ("${user.id}", 'Undecided')`)
                            msg.channel.send(`<@${user.id}>, choose who you'd like to trade back with`)
                            con.query(`SELECT name FROM claimed WHERE id = "${user.id}"`, (err, rows) => {
                                if (err) throw err;
                                if (rows.length < 1) return msg.channel.send("That user doesn't have any people")
                                let JSONrows = JSON.stringify(rows);
                                let parsedRows = JSON.parse(JSONrows);
                                try {
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
                                } catch (err) {
                                    return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                                }
                                let checkname = parsedRows.map(command => command.name).join(', ').toLowerCase();
                                const claim = m => checkname.includes(m.content.toLowerCase()) && m.author.id === user.id;
                                const claimcollector = msg.channel.createMessageCollector(claim, { time: 20000 });
                                claimcollector.on('collect', m => {
                                    claimcollector.stop();
                                    con.query(`SELECT * FROM claimed WHERE id = "${user.id}" AND name LIKE "%${m.content}%"`, (err, rows) => {
                                        if (rows.length < 1) return msg.channel.send("You don't have that waifu")
                                        let tradeback = rows[0].name;
                                        con.query(`UPDATE trading SET waifu = "${tradeback}" WHERE id = "${user.id}"`)
                                        msg.channel.send(`<@${msg.author.id}>, <@${user.id}> has offered **${tradeback}** for **${tradeoffer}**. Do you "accept" or "decline"?`)
                                        const yes = m => ((m.content.toLowerCase().includes('yes')) || (m.content.toLowerCase().includes('accept'))) && m.author.id === msg.author.id;
                                        const no = m => ((m.content.toLowerCase().includes('no')) || (m.content.toLowerCase().includes('decline'))) && m.author.id === msg.author.id;
                                        const yescollector = msg.channel.createMessageCollector(yes, { time: 10000 });
                                        const nocollector = msg.channel.createMessageCollector(no, { time: 20000 });
                                        yescollector.on('collect', m => {
                                            yescollector.stop();
                                            nocollector.stop();
                                            con.query(`UPDATE claimed SET name = "${tradeback}" WHERE name = "${tradeoffer}" AND id = "${msg.author.id}"`)
                                            con.query(`UPDATE claimed SET name = "${tradeoffer}" WHERE name = "${tradeback}" AND id = "${user.id}"`)
                                            con.query(`UPDATE roll SET claimedby = "${user.id}" WHERE name = "${tradeoffer}" AND claimedby = "${msg.author.id}"`)
                                            con.query(`UPDATE roll SET claimedby = "${msg.author.id}" WHERE name = "${tradeback}" AND claimedby = "${user.id}"`)
                                            con.query(`UPDATE roll SET claimuser = "${user.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}" WHERE name = "${tradeoffer}" AND claimuser = "${msg.author.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}"`)
                                            con.query(`UPDATE roll SET claimuser = "${msg.author.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}" WHERE name = "${tradeback}" AND claimuser = "${user.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}"`)
                                            con.query(`DELETE FROM trading`)
                                            return msg.channel.send(`Trading successful!\n__${msg.author.username}__ traded **${tradeoffer}** for __${user.username}'s__ **${tradeback}**`)
                                            yescollector.on('end', collected => {
                                                return msg.channel.send("I don't have all day bro, im out")
                                            });
                                        });
                                        nocollector.on('collect', m => {
                                            nocollector.stop();
                                            yescollector.stop();
                                            con.query(`DELETE FROM trading`)
                                            return msg.channel.send(`Trading cancelled\n__${msg.author.username}__ declined __${user.username}'s__ offer`)
                                            nocollector.on('end', collected => {
                                                con.query(`DELETE FROM trading`)
                                                return msg.channel.send("I don't have all day bro, im out")
                                            });
                                        });
                                    });
                                    claimcollector.on('end', collected => {
                                        con.query(`DELETE FROM trading`)
                                        return msg.channel.send("I don't have all day bro, im out")
                                    });
                                });
                            });
                        });
                    } catch (err) {
                        con.query(`DELETE FROM trading`)
                        return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                    }
                })
            });
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}