const Discord = require("discord.js");
const { prefix, red } = require("../config.json");

module.exports = {
    name: 'rowinfo',
    description: 'View an anime song in the database',
    usage: '<table> | <request> | <search>',
    cooldown: 5,
    class: 'devcmd',
    args: true,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let table = linkargs[0].toLowerCase();
            let request = linkargs[1].toLowerCase();
            if ((!table) || (!request) || (!linkargs[2])) return msg.channel.send("You didn't tell me what to show")
            if (request === "songid") {
                let songid = parseInt(linkargs[2]);
                con.query(`SELECT * FROM ${table}`, (err, rows) => {
                    if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                    let maxid = rows.length;
                    con.query(`SELECT * FROM ${table} WHERE ${request} = ${songid}`, (err, rows) => {
                        if (err) return msg.channel.send(`Error occured in query for songid #${songid} in ${table}`)
                        if (rows.length < 1) return msg.channel.send(`Can't find that song\nMax is ${maxid}`)
                        let songlink = rows[0].songlink;
                        let fulllink = "https://www.youtube.com/watch?v=" + songlink;
                        let songname = rows[0].songname;
                        let altname = rows[0].altname;
                        let infoembed = new Discord.MessageEmbed()
                            .setTitle(`Info for #${songid}`)
                            .addField("Anime Name", `${songname}/${altname}`)
                            .addField("Songlink", `[${songlink}](${fulllink})`)
                            .setColor(red)
                        msg.channel.send(infoembed)
                    });
                });
            } else {
                let search = linkargs[2];
                con.query(`SELECT * FROM ${table} WHERE ${request} LIKE "%${search}%"`, (err, rows) => {
                    if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                    if (rows.length < 1) return msg.channel.send("Couldn't find any results")
                    let JSONrows = JSON.stringify(rows);
                    let parsedRows = JSON.parse(JSONrows);
                    let currentIndex = 0
                    let pagetotal = (Math.floor(parsedRows.length / 10) + 1)
                    function generateEmbed(start) {
                        let current = parsedRows.slice(start, 10 + start)
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`Search results for "${search}" in __${table}__`)
                            .setColor(red)
                            .setFooter(`Page 1/${pagetotal}`)
                        current.forEach(g => embed.addField(g.songid, `**Songname:** ${g.songname} **Altname:** ${g.altname} **Link:** [${g.songlink}](${"https://www.youtube.com/watch?v=" + g.songlink})`))
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
                                    .setTitle(`Search results for "${search}" in __${table}__`)
                                    .setColor(red)
                                    .setFooter(`Page ${(start / 10) + 1}/${pagetotal}`)
                                current.forEach(g => embed.addField(g.songid, `**Songname:** ${g.songname} **Altname:** ${g.altname} **Link:** [${g.songlink}](${"https://www.youtube.com/watch?v=" + g.songlink})`))
                                return embed2
                            }
                            message.reactions.cache.clear();
                            message.edit(generateEmbed2(currentIndex))
                        });
                    })
                });
            }
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, `Remember the format\n${prefix}rowinfo <table> | <request> | <search>`)
        }
    },
}