const Discord = require("discord.js");
const superagent = require('superagent');
const { loadmeme, darkgreen } = require("../config.json");

module.exports = {
    name: 'meme',
    description: 'Pull a random meme from r/dankmemes',
    usage: '',
    cooldown: 5,
    class: 'fun',
    args: false,
    async execute(msg, args, con, linkargs, client) {
        const loading = client.emojis.cache.get(loadmeme);
        let gen = await msg.channel.send(`Generating... ${loading}`);
        const { body } = await superagent
            .get('https://www.reddit.com/r/dankmemes.json?sort=hot').catch(error => {
                console.log(error);
                gen.delete();
                return msg.channel.send("Sorry but I couldn't pull any memes :(");
            });
        const allowed = msg.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
        const randomnumber = Math.floor(Math.random() * allowed.length);
        let chosen = allowed[randomnumber].data.url;
        let chosenlink = allowed[randomnumber].data.permalink;
        const memembed = new Discord.MessageEmbed()
            .setColor(darkgreen)
            .setTitle("Dank Meme")
            .setImage(chosen)
            .setURL("https://www.reddit.com" + chosenlink)
            .setFooter("Memes provided by courtesy of r/dankmemes")
        msg.channel.send(memembed);
        gen.delete();
    },
}