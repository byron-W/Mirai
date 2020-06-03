const Discord = require("discord.js");
const superagent = require('superagent');
const { loadmeme, darkgreen } = require("../config.json");

module.exports = {
    name: 'animememe',
    description: 'Pull a random meme from r/animemes or r/animememes',
    usage: '',
    aliases: ['animeme'],
    cooldown: 5,
    class: 'fun',
    args: false,
    async execute(msg, args, con, linkargs, client) {      //Shows how to run the command
        const random = Math.floor(Math.random() * 2) + 1;
        if (random == 1) {
            const loading = client.emojis.cache.get(loadmeme);
            let gen = await msg.channel.send(`Generating... ${loading}`);
            const { body } = await superagent
                .get('https://www.reddit.com/r/animemes.json?sort=hot').catch(error => {
                    console.log(error);
                    gen.delete();
                    return msg.channel.send("Sorry but I couldn't pull any anime memes :("); r
                });
            const allowed = msg.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
            if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
            const randomnumber = Math.floor(Math.random() * allowed.length);
            let chosen = allowed[randomnumber].data.url;
            let chosenlink = allowed[randomnumber].data.permalink;
            const animemembed = new Discord.MessageEmbed()
                .setColor(darkgreen)
                .setTitle("Animeme")
                .setImage(chosen)
                .setURL("https://www.reddit.com" + chosenlink)
                .setFooter("Memes provided by courtesy of r/animemes")
            msg.channel.send(animemembed);
            gen.delete();
        }
        if (random == 2) {
            const loading = client.emojis.cache.get(loadmeme);
            let gen = await msg.channel.send(`Generating... ${loading}`);
            const { body } = await superagent
                .get('https://www.reddit.com/r/animememes.json?sort=hot').catch(error => {
                    console.log(error);
                    gen.delete();
                    return msg.channel.send("Sorry but I couldn't pull any anime memes :("); r
                });
            const allowed = msg.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
            if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
            const randomnumber = Math.floor(Math.random() * allowed.length);
            let chosen = allowed[randomnumber].data.url;
            let chosenlink = allowed[randomnumber].data.permalink;
            const animemembed = new Discord.MessageEmbed()
                .setColor(darkgreen)
                .setTitle("Animeme")
                .setImage(chosen)
                .setURL("https://www.reddit.com" + chosenlink)
                .setFooter("Memes provided by courtesy of r/animememes")
            msg.channel.send(animemembed);
            gen.delete();
        }
    },
}