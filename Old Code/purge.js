const Discord = require("discord.js");
const client = new Discord.Client();
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix;

client.on('message', async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    if (!msg.content.startsWith(prefix)) return;

    //Purging command
    if (command === "purge") {     //Shows how to run the command
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`**This is an admin only command**\nI'll clear a set amount of messages predefined by the argument given\nMax is 100 messages\n${prefix}purge <# of messages>`)
        } else {
            const mod = msg.member.hasPermission("MANAGE_MESSAGES");
            if (!mod) return msg.channel.send("You are not worthy :smirk:")   //If the author has the permissions to execute the command
            let numofmsg = parseInt(args[0]);     //The number of messages that the user decides
            if (!numofmsg) return msg.channel.send(`You didn't specify how many messages to delete`)
            numofmsg = Math.round(numofmsg);        //Rounds the number of messages
            try {
                msg.channel.bulkDelete(numofmsg)
                let delmes = await msg.channel.send(`Successfully deleted ${numofmsg} messages!`)
                delmes.delete(2000);
            } catch (error) {
                console.log(error)
                return msg.channel.send("You have input a number");
            }
        }
    }
});
client.login(token);        //Token for the bot to use this file