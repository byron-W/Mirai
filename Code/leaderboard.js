const Discord = require("discord.js");
const { darker_green } = require("../config.json");

module.exports = {
    name: 'leaderboard',
    description: `Show the richest users`,
    usage: '',
    aliases: ['lb', 'lbd'],
    class: 'economy',
    cooldown: 5,
    args: false,
    execute(msg, args, con) {
        con.query(`SELECT * FROM coins ORDER BY total DESC LIMIT 5`, (err, rows) => {
            if (err) throw err;
            if (rows.length < 1) return msg.channel.send("Everyone is broke!")
            let JSONroles = JSON.stringify(rows);
            let parsedRoles = JSON.parse(JSONroles);
            var rank = 1;
            try {
                let currentIndex = 0
                let pagetotal = Math.floor(parsedRoles.length / 5);
                function generateEmbed(start) {
                    let current = parsedRoles.slice(start, 5 + start)
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`__**${msg.guild.name}'s Leaderboard**__`)
                        .setColor(darker_green)
                        .setThumbnail(msg.guild.iconURL())
                        .setFooter(`Page 1/${pagetotal}`)
                    let finmsg = '';
                    current.forEach((row) => {
                        finmsg += `\n#${rank++} ${row.username} - Coins: ${row.total}`;
                    })
                    embed.setDescription(finmsg)
                    return embed
                }
                const author = msg.author
                msg.channel.send(generateEmbed(0)).then(message => {
                    // exit if there is only one page of guilds (no need for all of this)
                    if (parsedRoles.length <= 5) return
                    // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
                    message.react('⬅️')
                    message.react('➡️')
                    const collector = message.createReactionCollector(
                        // only collect left and right arrow reactions from the message author
                        (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author.id,
                        // time out after a minute
                        { time: 60000 }
                    )
                    collector.on('collect', r => {
                        r.emoji.name === '⬅️' ? currentIndex -= 5 : currentIndex += 5;
                        if (r.emoji.name === '⬅️') rank -= 5 ;
                        if (currentIndex < 0) {
                            currentIndex = 0;
                            return;
                        }
                        if (currentIndex > parsedRoles.length) {
                            currentIndex -= 5;
                            return;
                        }
                        if (currentIndex === parsedRoles.length) return;
                        function generateEmbed2(start) {
                            let current = parsedRoles.slice(start, 5 + start)
                            const embed2 = new Discord.MessageEmbed()
                                .setTitle(`__**${msg.guild.name}'s Leaderboard**__`)
                                .setColor(darker_green)
                                .setThumbnail(msg.guild.iconURL())
                                .setFooter(`Page ${(start / 5) + 1}/${pagetotal}`)
                            let finmsg = '';
                            current.forEach((row) => {
                                finmsg += `\n#${rank++} ${row.username} - Coins: ${row.total}`;
                            })
                            embed2.setDescription(finmsg)
                            return embed2
                        }
                        message.reactions.cache.clear();
                        message.edit(generateEmbed2(currentIndex))
                    });
                })
            } catch (error) {
                gen.delete();
                console.log(error);
            }
        })
    },
}