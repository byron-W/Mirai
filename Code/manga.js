const Discord = require("discord.js");
const superagent = require("superagent");
const { blue, loademote } = require("../config.json");

module.exports = {
    name: 'manga',
    description: 'Search for any manga in the MyAnimeList database',
    usage: '<manga name>',
    aliases: ['man'],
    cooldown: 10,
    class: 'weeb',
    args: true,
    async execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let manganame = args.join(" ");
            const loading = client.emojis.cache.get(loademote);
            let gen = await msg.channel.send(`Generating... ${loading}`);
            async function getmanga(name) {
                let { body } = await superagent
                    .get("https://api.jikan.moe/v3/search/manga?q=" + name + "&limit=5").catch((err) => {
                        gen.delete()
                        catchErr(err, msg, `${module.exports.name}.js`, "MAL servers may temporarily down or blocking me right now. Feel free to try again")
                        return;
                    });
                return body.results[0].mal_id;
            }
            const search = await getmanga(manganame)
            if (isNaN(search)) return;
            let { body } = await superagent
                .get("https://api.jikan.moe/v3/manga/" + search).catch(err => {
                    gen.delete();
                    catchErr(err, msg, `${module.exports.name}.js`, "I couldn't find any manga with that name")
                    return;
                });
            try {
                let membed = new Discord.MessageEmbed()      //Sends a fancy display of execution information
                    .setTitle(`${body.title} / ${body.title_japanese}`)
                    .setDescription(body.synopsis)
                    .setColor(blue)
                    .setURL(body.url)
                    .setImage(body.image_url)
                    .addField("Volumes:", body.volumes, true)       //"true" parameter puts the information in the same line as the prevous field. Maximum is 3 fields in one line
                    .addField("Chapters:", body.chapters, true)
                    .addField("Status:", body.status, true)
                    .addField("Type:", body.type, true)
                    .addField("Rating:", `${body.score}/10`, true)
                if (body.serializations != null) {
                    membed.addField("Serialized by:", body.serializations[0].name, true)
                }
                if (body.popularity != null) {
                    membed.addField("Popularity:", `#${body.popularity}`, true)
                }
                membed.addField("Airing Time:", body.published.string, true)
                let genrelist = body.genres
                let genres = '';
                genrelist.forEach((row) => {
                    genres += `\n${row.name}`;
                })
                membed.addField("Genres", genres, true)
                membed.setFooter("Information provided by courtesy of MyAnimeList")
                msg.channel.send(membed);
                gen.delete();
            } catch (err) {
                gen.delete()
                return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
            }
        } catch (err) {
            gen.delete()
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}