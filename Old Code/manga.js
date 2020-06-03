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

    async function getmanga(name) {
        let { body } = await superagent
            .get("https://api.jikan.moe/v3/search/manga?q=" + name + "&limit=5").catch(error => {
                console.log(error);
                return msg.channel.send("Try using another name for the manga");
            });
        return body.results[0].mal_id;
    }
    if (command === "manga") {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Search for any anime in the MyAnimeList database\n${prefix}man <anime name>`);
        } else {
            var manganame = args.join(" ");
            if (!manganame) return msg.channel.send("Please supply a manga to find!");
            const loading = client.emojis.cache.get(loademote);
            let gen = await msg.channel.send(`Generating... ${loading}`);
            const search = await getmanga(manganame)
            let { body } = await superagent
                .get("https://api.jikan.moe/v3/manga/" + search).catch(error => {
                    console.log(error);
                    gen.delete();
                    return msg.channel.send("Please supply the ID of the manga, not the name");
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
            } catch (error) {
                gen.delete();
                console.log(error);
            }
        }
    }
});
client.login(token);        //Token for the bot to use this file