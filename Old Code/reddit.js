const Discord = require("discord.js");
const client = new Discord.Client();
const superagent = require('superagent');
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix;
const darkgreen = config.dark_green;
const loadmeme = config.loading_meme

client.on("message", async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    if (!msg.content.startsWith(prefix)) return;

    //Meme command
    if (command === "meme") {       //Shows how to run the command
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`I'll pull a random meme from r/dankmemes\n${prefix}meme`);
        } else {
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
        }
    }

    //Anime meme command
    if (command === "animeme") {       //Shows how to run the command
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`I'll pull a random meme from r/animemes or r/animememes\nThese memes are for the cultured people\n${prefix}animeme`);
        } else {
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
                    .setTitle("Anime Meme")
                    .setImage(chosen)
                    .setURL("https://www.reddit.com" + chosenlink)
                    .setFooter("Memes provided by courtesy of r/animememes")
                msg.channel.send(animemembed);
                gen.delete();
            }
        }
    }
});
client.login(token)