const Discord = require("discord.js");
const superagent = require("superagent");
const { blue, loademote } = require("../config.json");

module.exports = {
    name: 'animeseason',
    description: 'Show anime that air in any season',
    usage: '<season> <year>',
    aliases: ['aniseason', 'animeszn', 'aniszn'],
    cooldown: 10,
    class: 'weeb',
    args: true,
    async execute(msg, args, con, linkargs, client, catchErr) {
        var year = args[1]
        var season = args[0].toLowerCase();
        if ((isNaN(year)) || (!season)) return msg.channel.send("Please supply a valid season and year to find, respectively");
        const loading = client.emojis.cache.get(loademote);
        if ((season !== "fall") && (season !== "summer") && (season !== "winter") && (season !== "spring")) return msg.channel.send("That isn't a season")
        let gen = await msg.channel.send(`Generating... ${loading}`);
        let { body } = await superagent
            .get("https://api.jikan.moe/v3/season/" + year + "/" + season).catch((err) => {
                gen.delete();
                msg.channel.send("Please provide a season and year, respectively");
                return;
            })
        try {
            let currentIndex = 0
            let animelist = body.anime
            let pagetotal = Math.floor(animelist.length / 10) + 1
            function generateEmbed(start) {
                let current = animelist.slice(start, 10 + start)
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Here's what I found for __${body.season_name} ${year}__:`)
                    .setColor(blue)
                    .setThumbnail(body.anime[start].image_url)
                    .setFooter(`Page 1/${pagetotal}`)
                let finmsg = '';
                current.forEach((row) => {
                    finmsg += `\n~[${row.title}](${row.url} "Click to view anime in MAL")`;
                })
                embed.setDescription(finmsg)
                gen.delete();
                return embed
            }
            const author = msg.author
            msg.channel.send(generateEmbed(0)).then(message => {
                // exit if there is only one page of guilds (no need for all of this)
                if (animelist.length <= 10) return
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
                    r.emoji.name === '⬅️' ? currentIndex -= 10 : currentIndex += 10;
                    if (currentIndex < 0) {
                        currentIndex = 0;
                        return;
                    }
                    if (currentIndex > animelist.length) {
                        currentIndex -= 10;
                        return;
                    }
                    if (currentIndex === animelist.length) return;
                    function generateEmbed2(start) {
                        let current = animelist.slice(start, 10 + start)
                        const embed2 = new Discord.MessageEmbed()
                            .setTitle(`Here's what I found for __${body.season_name} ${year}__:`)
                            .setColor(blue)
                            .setThumbnail(body.anime[start].image_url)
                            .setFooter(`Page ${(start / 10) + 1}/${pagetotal}`)
                        let finmsg = '';
                        current.forEach((row) => {
                            finmsg += `\n~[${row.title}](${row.url} "Click to view anime in MAL")`;
                        })
                        embed2.setDescription(finmsg)
                        return embed2
                    }
                    message.reactions.cache.clear();
                    message.edit(generateEmbed2(currentIndex))
                });
            }).catch((err) => {
                return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
            })
        } catch (err) {
            catchErr(err, msg, `${module.exports.name}.js`, "Dev")
            gen.delete();
            return;
        }
    },
}