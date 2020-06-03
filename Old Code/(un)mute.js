const Discord = require("discord.js");
const client = new Discord.Client();
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix;
const orange = config.orange;
const moment = require("moment");

client.on('message', async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    if (!msg.content.startsWith(prefix)) return;

    //Muting command
    if (command === "mute") {      //Shows how to run the command
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`**This is an admin only command**\nI'll mute a user until the 'umute' command is used on the muted user\nThe muted user won't be able to speak in voice and text chats\n${prefix}mute <user>`);
        } else {
            const mod = msg.member.hasPermission("MUTE_MEMBERS");
            if (!mod) return msg.channel.send("You are not worthy :smirk:")      //If the author has the permissions to execute the command
            const user = msg.mentions.users.first();
            if ((!user) && (!help)) return msg.channel.send(`You didn't mention the user to mute`);     //If the command mentions a user
            const member = msg.guild.member(user);
            if (!member) return msg.channel.send("That user isn't in this server")       //If the user is in the server
            let muterole = msg.guild.roles.cache.find(r => r.name === "muted");       //Creation of mute role
            if (!muterole) {        //Creates a mute role if there isn't one already
                try {
                    muterole = msg.guild.roles.add({
                        name: "muted",
                        color: "#000000",
                        permissions: !"SEND_MESSAGES" && !"MANAGE_MESSAGES",
                        mentionable: true
                    });
                } catch (e) {
                    console.log(e.stack);
                }
            }
            msg.channel.overwritePermissions(muterole,      //Overwriting channel permissions
                {
                    'ADD_REACTIONS': false,
                    'SEND_MESSAGES': false,
                    'SEND_TTS_MESSAGES': false,
                    'MANAGE_MESSAGES': false,
                    'ATTACH_FILES': false,
                    'SPEAK': false
                });
            let muted = member.roles.cache.find(r => r.name === "muted");
            if (muted) return msg.channel.send("That user is already muted")        //If the user is muted already
            member.roles.add(muterole).catch(console.error);      //Adds mute role to the user
            let uicon = user.displayAvatarURL();
            muteEmbed = new Discord.MessageEmbed()     //Sends a fancy display of execution information
                .setTitle(`**${user.username} was muted :(**`)
                .setThumbnail(uicon)
                .addField("Muted by:", msg.author.username)
                .addField("Muted in:", msg.channel.name)
                .addField("Time: ", moment().format(`LT`))
                .setColor(orange)
            msg.channel.send(muteEmbed);
        }
    }

    //Unmuting command
    if (command === "unmute") {        //Shows how to run the command
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`**This is an admin only command**\nI'll unmute a user that was previously muted\nThe unmuted user will be allowed to speak in voice and text chats\n${prefix}unmute <user>`);
        } else {
            const mod = msg.member.hasPermission("MANAGE_ROLES");
            if (!mod) return msg.channel.send("You are not worthy :smirk:");      //If the author has the permissions to execute the command
            const user = msg.mentions.users.first();
            if ((!user) && (!help)) return msg.channel.send(`You didn't mention the user to unmute`);     //If the command mentions a user
            const member = msg.guild.member(user);
            if (!member) return msg.channel.send("That user isn't in this server")       //If the user is in the server
            let muted = member.roles.cache.find(r => r.name === "muted");
            if (!muted) return msg.channel.send("That user isn't muted")        //If the user is muted already
            member.roles.remove(muted).catch(console.error);      //Removal of mute role
            let uicon = user.displayAvatarURL();
            unmuteEmbed = new Discord.MessageEmbed()       //Fancy display of execution information
                .setTitle(`**${user.username} was unmuted**`)
                .setThumbnail(uicon)
                .addField("Unmuted by:", msg.author.username)
                .addField("Unmuted in:", msg.channel.name)
                .addField("Time: ", moment().format(`LT`))
                .setColor(orange)
            msg.channel.send(unmuteEmbed);
        }
    }
});
client.login(token);        //Token for the bot to use this file