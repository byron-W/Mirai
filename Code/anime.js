const Discord = require("discord.js");
const superagent = require("superagent");
const { blue, loademote } = require("../config.json");

async function getanime(name) {
    let { body } = await superagent
        .get("https://api.jikan.moe/v3/search/anime?q=" + name + "&limit=5").catch(error => {
            console.log(error);
            return msg.channel.send("Try using another name for the anime");
        });
    return body.results[0].mal_id;
}
module.exports = {
    name: 'anime',
    description: 'Search for any anime in the MyAnimeList database',
    usage: '<anime name>',
    aliases: ['ani'],
    cooldown: 10,
    class: 'weeb',
    args: true,
    async execute(msg, args, con, linkargs, client) {
        var animename = args.join(" ");
        const loading = client.emojis.cache.get(loademote);
        let gen = await msg.channel.send(`Generating... ${loading}`);
        const search = await getanime(animename).catch(async err => {
            gen.delete()
            return msg.channel.send("I couldn't find any anime wih that name")
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
            return msg.channel.send("I couldn't find any anime wih that name")
        }
    },
}