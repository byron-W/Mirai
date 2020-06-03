const Discord = require("discord.js");
const moment = require("moment");
const { orange } = require("../config.json");

module.exports = {
    name: 'banish',
    description: 'They must be punished',
    usage: '<user> or <user> <minutes>',
    cooldown: 5,
    class: 'moderation',
    args: true,
    execute(msg, args) {
        const user = msg.mentions.users.first();
        if (!user) return msg.channel.send(`You didn't mention the user to banish`);     //If the command mentions a user
        const member = msg.guild.member(user);
        if (!member) return msg.channel.send("That user isn't in this server")       //If the user is in the server
        let muterole = msg.guild.roles.cache.find(r => r.name === "bad furry");       //Creation of mute role
        let muted = member.roles.cache.find(r => r.name === "bad furry");
        if (muted) return msg.channel.send("That user is already banished")        //If the user is muted already
        if (!muterole) return msg.channel.send("Make a bad furry role")
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
                .setTitle(`${user.username} was banished`)
                .setThumbnail(uicon)
                .addField("Time: ", moment().format(`LT`))
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
                .setTitle(`${user.username} was banished for ${time} minutes`)
                .setThumbnail(uicon)
                .addField("Time: ", moment().format(`LT`))
                .setColor(orange)
            msg.channel.send(muteEmbed);
            setTimeout(() => {
                member.roles.remove(muterole, `Temporary mute expired.`);
                let uicon = user.displayAvatarURL();
                unmuteEmbed = new Discord.MessageEmbed()       //Fancy display of execution information
                    .setTitle(`${user.username} has been let back into society`)
                    .setThumbnail(uicon)
                    .addField("Time: ", moment().format(`LT`))
                    .setColor(orange)
                msg.channel.send(unmuteEmbed);
            }, time * 60000);
        }
    },
}