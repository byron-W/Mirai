const Discord = require("discord.js");
const client = new Discord.Client();
const superagent = require('superagent');
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix;
const lavender = config.lavender

client.on("message", async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    if (!msg.content.startsWith(prefix)) return;

    let author = msg.author;
    let user = msg.mentions.users.first();

    if (command === "urban") {      //Shows how to run the command
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`I'll find the best definition for your search\n${prefix}urban <search>`);
        } else {        //If the user isn't asking for help
            let search = args.join(" ");
            if (!search) return msg.channel.send("You didn't search for a definition")
            let gen = await msg.channel.send("Generating...")
            let { body } = await superagent
                .get("http://api.urbandictionary.com/v0/define?term=" + search).catch(error => {
                    console.log(error);
                    gen.delete();
                    return msg.channel.send("I couldn't find a definition");
                });
            try {
                let urbanembed = new Discord.RichEmbed()
                    .setTitle(`Here's the urban dictionary definition of '${search}'`)
                    .setDescription(body.list[0].definition)
                    .setColor(lavender)
                    .setAuthor(msg.author.username, msg.author.avatarURL)
                    .addField("Example:", body.list[0].example)
                msg.channel.send(urbanembed)
                gen.delete();       //Deletes the "Generating..." message
            } catch (err) {
                gen.delete();       //Deletes the "Generating..." message
                return msg.channel.send("I couldn't find any definitions for that")
            }
        }
    }
    //Say command

});
client.login(token)