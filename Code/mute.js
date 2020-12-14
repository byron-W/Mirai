const Discord = require("discord.js");
const { orange } = require("../config.json");

module.exports = {
    name: 'mute',
    description: 'Mute a user from all text and voice chats',
    usage: '<user> or <user> <minutes>',
    cooldown: 5,
    class: 'moderation',
    args: true,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            if (!msg.member.hasPermission("MUTE_MEMBERS")) return msg.channel.send("You are not worthy :pensive:");
            const user = msg.mentions.users.first();
            if (!user) return msg.channel.send(`You didn't mention the user to mute`);     //If the command mentions a user
            const member = msg.guild.member(user);
            if (!member) return msg.channel.send("That user isn't in this server")       //If the user is in the server
            let muterole = msg.guild.roles.cache.find(r => r.name === "muted");       //Creation of mute role
            let muted = member.roles.cache.find(r => r.name === "muted");
            if (muted) return msg.channel.send("That user is already muted")        //If the user is muted already
            if (!muterole) return msg.channel.send("Make a muted role")
            if (!args[1]) {
                msg.guild.channels.cache.forEach(f => {
                    f.updateOverwrite(muterole, {
                        SEND_MESSAGES: false,
                        READ_MESSAGE_HISTORY: false,
                        ADD_REACTIONS: false,
                        ATTACH_FILES: false,
                        MENTION_EVERYONE: false,
                        SPEAK: false
                    })
                });
                member.roles.add(muterole).catch(console.error);      //Adds mute role to the user
                let uicon = user.displayAvatarURL();
                let muteEmbed = new Discord.MessageEmbed()     //Sends a fancy display of execution information
                    .setTitle(`**${user.username} was muted :(**`)
                    .setThumbnail(uicon)
                    .addField("Muted by:", msg.author.username)
                    .setColor(orange)
                return msg.channel.send(muteEmbed);
            } if (args[1]) {
                let time = parseInt(args[1]);
                if (!time) return msg.channel.send("That isn't a valid time to mute someone")
                msg.guild.channels.cache.forEach(f => {
                    f.updateOverwrite(muterole, {
                        SEND_MESSAGES: false,
                        READ_MESSAGE_HISTORY: false,
                        ADD_REACTIONS: false,
                        ATTACH_FILES: false,
                        MENTION_EVERYONE: false,
                        SPEAK: false
                    })
                });
                member.roles.add(muterole).catch(console.error);      //Adds mute role to the user
                let uicon = user.displayAvatarURL();
                let muteEmbed = new Discord.MessageEmbed()     //Sends a fancy display of execution information
                    .setTitle(`**${user.username} was muted for ${time} minute(s) :(**`)
                    .setThumbnail(uicon)
                    .addField("Muted by:", msg.author.username)
                    .setColor(orange)
                msg.channel.send(muteEmbed);
                setTimeout(() => {
                    if (!member.roles.cache.find(r => r.name === "muted")) return;
                    member.roles.remove(muterole, `Temporary mute expired.`);
                    let uicon = user.displayAvatarURL();
                    unmuteEmbed = new Discord.MessageEmbed()       //Fancy display of execution information
                        .setTitle(`**${user.username} was unmuted after a ${time} minute mute**`)
                        .setThumbnail(uicon)
                        .addField("Unmuted by:", msg.author.username)
                        .setColor(orange)
                    msg.channel.send(unmuteEmbed);
                }, time * 60000);
            }
        } catch (err) {
            catchErr(err, msg, `${module.exports.name}.js`, "Dev")
            return;
        }
    },
}