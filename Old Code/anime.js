const Discord = require("discord.js");
const client = new Discord.Client();
const superagent = require("superagent");
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix;
const blue = config.blue;
const loademote = config.loading_emote

client.on("message", async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    if (!msg.content.startsWith(prefix)) return;

    //Searching for anime command
    async function getanime(name) {
        let { body } = await superagent
            .get("https://api.jikan.moe/v3/search/anime?q=" + name + "&limit=5").catch(error => {
                console.log(error);
                return msg.channel.send("Try using another name for the anime");
            });
        return body.results[0].mal_id;
    }
    if (command === "anime") {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Search for any anime in the MyAnimeList database\n${prefix}anime <anime name>`);
        } else {
            var animename = args.join(" ");
            if (!animename) return msg.channel.send("Please supply an anime to find!");
            const loading = client.emojis.cache.get(loademote);
            let gen = await msg.channel.send(`Generating... ${loading}`);
            const search = await getanime(animename).catch(async err => {
                await msg.channel.send(search)
                gen.delete()
            })
            let { body } = await superagent
                .get("https://api.jikan.moe/v3/anime/" + search).catch(error => {
                    console.log(error);
                    gen.delete();
                });
            try {
                let aembed = new Discord.MessageEmbed()      //Sends a fancy display of execution information
                    .setTitle(`${body.title} / ${body.title_japanese}`)
                    .setDescription(body.synopsis)
                    .setColor(blue)
                    .setURL(body.url)
                    .setImage(body.image_url)
                    .addField("Episodes:", body.episodes, true)        //"true" parameter puts the information in the same line as the prevous field. Maximum is 3 fields in one line
                if (body.status === "Currently Airing") aembed.addField("Status:", `${body.status}\n${body.broadcast}`, true)
                if (body.status === "Finished Airing") aembed.addField("Status:", body.status, true)
                    .addField("Type:", body.type, true)
                    .addField("Rating:", `${body.score}/10`, true)
                    .addField("Studio:", body.studios[0].name, true)
                if (body.popularity != null) aembed.addField("Popularity:", `#${body.popularity}`, true)
                aembed.addField("Source Material", body.source, true)
                aembed.addField("Airing Time:", body.aired.string, true)
                let genrelist = body.genres
                let genres = '';
                genrelist.forEach((row) => {
                    genres += `\n${row.name}`;
                })
                aembed.addField("Genres", genres, true)
                if (body.trailer_url != null) aembed.addField("Trailer:", body.trailer_url)
                aembed.setFooter("Information provided by courtesy of MyAnimeList")
                msg.channel.send(aembed);
                gen.delete();
            } catch (error) {
                gen.delete();
                console.log(error);
            }
        }
    }
    if ((command === "aniseason") || (command === "aniszn")) {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Show the top 10 anime of an season\n${prefix}aniszn <season> <year>`);
        } else {        //If the user isn't asking for help
            if (!args[0]) return msg.channel.send("Please supply a season and year to find");
            var year = args[1]
            var season = args[0].toLowerCase();
            if ((!year) || (!season)) return msg.channel.send("Please supply a season and year to find!");
            const loading = client.emojis.cache.get(loademote);
            let gen = await msg.channel.send(`Generating... ${loading}`);
            let { body } = await superagent
                .get("https://api.jikan.moe/v3/season/" + year + "/" + season).catch(error => {
                    console.log(error);
                    gen.delete();
                    return msg.channel.send("Please provide a season and year, respectively");
                });
            try {
                let currentIndex = 0
                let animelist = body.anime
                let pagetotal = Math.floor(animelist.length / 10) + 1
                function generateEmbed(start) {
                    let current = animelist.slice(start, 10 + start)
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Here's what I found for __${season} ${year}__:`)
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
                    if (body.anime.length <= 10) return
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
                                .setTitle(`Here's what I found for __${season} ${year}__:`)
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
                })
            } catch (error) {
                gen.delete();
                console.log(error);
            }
        }
    }
    if ((command === "animeschedule") || (command === "anisch")) {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Show the top 5 anime airing on a certain day\n${prefix}anisch <day of the week>`);
        } else {        //If the user isn't asking for help
            if (!args[0]) return msg.channel.send("Please supply a day of the week");
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
                    let pagetotal = Math.floor(day.length / 10)
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
                                    .setTitle(`Here's what I found for __${dayofweek}__:`)
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
                    gen.delete();
                    console.log(error);
                }
            } catch (error) {
                gen.delete();
                console.log(error);
            }
        }
    }
    if (command === "maluser") {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Search for any MyAnimeList user\n${prefix}maluser <MAL username>`);
        } else {
            let maluser = args.join(" ");
            if (!maluser) return msg.channel.send("Please supply a MAL account to find!");
            const loading = client.emojis.cache.get(loademote);
            let gen = await msg.channel.send(`Generating... ${loading}`);
            let { body } = await superagent
                .get("https://api.jikan.moe/v3/user/" + maluser).catch(error => {
                    console.log(error);
                    gen.delete();
                    return msg.channel.send("Sorry I couldn't find that user");
                });
            try {
                let aembed = new Discord.MessageEmbed()      //Sends a fancy display of execution information
                    .setTitle(body.username)
                    .setDescription(body.about)
                    .setColor(blue)
                    .setURL(body.url)
                    .setThumbnail(body.image_url)
                    .addField("Anime Stats:", `Episodes Watched: ${body.anime_stats.episodes_watched}\nDays Watched: ${body.anime_stats.days_watched}\nMean Score: ${body.anime_stats.mean_score}`, true)        //"true" parameter puts the information in the same line as the prevous field. Maximum is 3 fields in one line
                    .addField("Anime Stats:", `Watching: ${body.anime_stats.watching}\nCompleted: ${body.anime_stats.completed}\nOn Hold: ${body.anime_stats.on_hold}`, true)
                    .addField("Anime Stats:", `Dropped: ${body.anime_stats.dropped}\nPlan to Watch: ${body.anime_stats.plan_to_watch}\nTotal Entries: ${body.anime_stats.total_entries}`, true)
                    //Manga
                    .addField("Manga Stats:", `Volumes Read: ${body.manga_stats.volumes_read}\nDays Watched: ${body.manga_stats.days_read}\nMean Score: ${body.manga_stats.mean_score}`, true)        //"true" parameter puts the information in the same line as the prevous field. Maximum is 3 fields in one line
                    .addField("Manga Stats:", `Reading: ${body.manga_stats.reading}\nCompleted: ${body.manga_stats.completed}\nOn Hold: ${body.manga_stats.on_hold}`, true)
                    .addField("Manga Stats:", `Dropped: ${body.manga_stats.dropped}\nPlan to Read: ${body.manga_stats.plan_to_read}\nTotal Entries: ${body.manga_stats.total_entries}`, true)
                const event = new Date(body.joined);
                let joinedat = event.toDateString();
                aembed.addField("Joined MAL:", joinedat, true)
                aembed.addField("Lists:", `[Animelist](${"https://myanimelist.net/animelist/" + body.username} "${body.username}'s Anime List")/[Mangalist](${"https://myanimelist.net/mangalist/" + body.username} "${body.username}'s Manga List")`)
                aembed.setFooter("Information provided by courtesy of MyAnimeList")
                msg.channel.send(aembed);
                gen.delete();
            } catch (error) {
                gen.delete();
                console.log(error);
            }
        }
    }
});
client.login(token);        //Token for the bot to use this file