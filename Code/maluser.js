const Discord = require("discord.js");
const { blue, loademote } = require("../config.json");
const superagent = require("superagent");

module.exports = {
    name: 'maluser',
    description: 'Display a user on MyAnimeList',
    usage: '<MyAnimeList username>',
    cooldown: 10,
    class: 'weeb',
    args: true,
    async execute(msg, args, con, linkargs, client) {
        let maluser = args.join(" ")
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
            aembed.addField("Joined MAL:", joinedat)
            aembed.addField("Lists:", `[Animelist](${"https://myanimelist.net/animelist/" + body.username} "${body.username}'s Anime List")/[Mangalist](${"https://myanimelist.net/mangalist/" + body.username} "${body.username}'s Manga List")`)
            aembed.setFooter("Information provided by courtesy of MyAnimeList")
            msg.channel.send(aembed);
            gen.delete();
        } catch (error) {
            gen.delete();
            console.log(error);
            return msg.channel.send(`Their description is too long\nHere's the link to their account: ${body.url}`)
        }
    },
}