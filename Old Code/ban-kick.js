const Discord = require("discord.js");
const client = new Discord.Client();
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix;
const red = config.red;
const moment = require("moment");

client.on('message', async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    if (!msg.content.startsWith(prefix)) return;

    //Banning command
    if (command === "ban") {       //Shows how to run the command
        let help = (msg.content.endsWith("help"));
        if (help) {     //Explains what the command does
            msg.channel.send(`**This is an admin only command**\nI'll ban a user from the server\nThe banned user won't be let back in the server unless the admins decide to allow them back\n${prefix}ban <user> *or* ${prefix}ban <user> <reason>`);
        } else {
            const mod = msg.member.hasPermission("BAN_MEMBERS");
            if (!mod) return msg.channel.send("You are not worthy :smirk:");       //If the author has the permissions to execute the command
            const user = msg.mentions.users.first();
            if ((!user) && (!help)) return msg.channel.send(`You didn't mention the user to ban`);     //If the command mentions a user
            const member = msg.guild.member(user);
            if (!member) return msg.channel.send("That user isn't in this server")       //If the user is in the server
            const reasonargs = msg.content.slice(prefix.length + command.length + args[0].length + 1).trim().split(/ +/g)
            let reason = reasonargs.join(" ");
            if (!reason) {
                member.ban({
                    reason: "They were bad!",
                }).then(async () => {
                    let uicon = user.displayAvatarURL();
                    let banEmbed = new Discord.MessageEmbed()      //Sends a fancy display of execution information
                        .setTitle(`**${user.username} was banned :(**`)
                        .setThumbnail(uicon)
                        .addField("Banned by:", msg.author.username)
                        .addField("Banned in:", msg.channel.name)
                        .addField("Time: ", moment().format(`LT`))
                        .setColor(red)
                    msg.channel.send(banEmbed);
                }).catch(err => {
                    msg.channel.send("I don't have the permissions to ban them");
                    console.error(err);
                });
            } else {
                member.ban({
                    reason: reason,
                }).then(async () => {
                    let uicon = user.displayAvatarURL();
                    let banEmbed = new Discord.MessageEmbed()      //Sends a fancy display of execution information
                        .setTitle(`**${user.username} was banned :(**`)
                        .setDescription(`Reason:\n${reason}`)
                        .setThumbnail(uicon)
                        .addField("Banned by:", msg.author.username)
                        .addField("Banned in:", msg.channel.name)
                        .addField("Time: ", moment().format(`LT`))
                        .setColor(red)
                    msg.channel.send(banEmbed);
                }).catch(err => {
                    msg.channel.send("I don't have the permissions to ban them");
                    console.error(err);
                });
            }
        }
    }

    //Kicking command
    if (command === "kick") {      //Shows how to run the command
        let help = (msg.content.endsWith("help"));
        if (help) {     //Explains what the command does
            msg.channel.send(`**This is an admin only command**\nI'll kick a user from the server\nThe kicked user can join the server again but will be prone to being muted or banned\n${prefix}kick <user>`);
        } else {
            const mod = msg.member.hasPermission("KICK_MEMBERS");
            if (!mod) return msg.channel.send("You are not worthy :smirk:")      //If the author has the permissions to execute the command
            const user = msg.mentions.users.first();
            if ((!user) && (!help)) return msg.channel.send(`You didn't mention the user to kick`)     //If the command mentions a user
            const member = msg.guild.member(user);
            if (!member) return msg.channel.send("That user isn't in this server")       //If the user is in the server
            member.kick("They deserved it").then(async () => {
                let uicon = user.displayAvatarURL();
                let kickEmbed = new Discord.MessageEmbed()     //Sends a fancy display of execution information
                    .setTitle(`__${user.username} was kicked :(**__`)
                    .setThumbnail(uicon)
                    .addField("Kicked by:", msg.author.username)
                    .addField("Kicked in:", msg.channel.name)
                    .addField("Time:", moment().format(`LT`))
                    .setColor(red)
                msg.channel.send(kickEmbed);
            }).catch(err => {
                msg.channel.send("I don't have the permissions to ban them");
                console.error(err);
            });
        }
    }
});
client.login(token);        //Token for the bot to use this file