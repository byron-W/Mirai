const Discord = require("discord.js");
const superagent = require("superagent");
const { blue, loademote } = require("../config.json");

module.exports = {
    name: 'animeschedule',
    description: 'Show anime that are airing on a day of the week',
    usage: '<day of the week>',
    aliases: ['anischedule', 'animesch', 'anisch'],
    cooldown: 10,
    class: 'weeb',
    args: true,
    async execute(msg, args, con, linkargs, client) {
        var dayofweek = args[0].toLowerCase();
        const loading = client.emojis.cache.get(loademote);
        let gen = await msg.channel.send(`Generating... ${loading}`);
        let { body } = await superagent
            .get("https://api.jikan.moe/v3/schedule/" + dayofweek).catch(error => {
                console.log(error);
                gen.delete();
                return msg.channel.send("That isn't a day of the week");
            });
        try {
            let day = '';
            let dayname = '';
            if (dayofweek === "sunday") {
                day = body.sunday;
                dayname = "Sunday";
            }
            if (dayofweek === "monday") {
                day = body.monday;
                dayname = "Monday";
            }
            if (dayofweek === "tuesday") {
                day = body.tuesday;
                dayname = "Tuesday;"
            }
            if (dayofweek === "wednesday") {
                day = body.wednesday;
                dayname = "Wednesday";
            }
            if (dayofweek === "thursday") {
                day = body.thursday;
                dayname = "Thursday";
            }
            if (dayofweek === "friday") {
                day = body.friday;
                dayname = "Friday";
            }
            if (dayofweek === "saturday") {
                day = body.saturday;
                dayname = "Saturday";
            }
            try {
                let currentIndex = 0
                let pagetotal = Math.floor(day.length / 10) + 1;
                function generateEmbed(start) {
                    let current = day.slice(start, 10 + start)
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Here's what I found for __${dayname}__:`)
                        .setColor(blue)
                        .setThumbnail(day[start].image_url)
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
                    if (day.length <= 10) return
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
                        if (currentIndex > day.length) {
                            currentIndex -= 10;
                            return;
                        }
                        if (currentIndex === day.length) return;
                        function generateEmbed2(start) {
                            let current = day.slice(start, 10 + start)
                            const embed2 = new Discord.MessageEmbed()
                                .setTitle(`Here's what I found for __${dayname}__:`)
                                .setColor(blue)
                                .setThumbnail(day[start].image_url)
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
                })
            } catch (error) {
                console.log(error);
                gen.delete();
                return msg.channel.send("That isn't a day of the week");
            }
        } catch (error) {
            console.log(error);
            gen.delete();
            return msg.channel.send("That isn't a day of the week");
        }
    },
}