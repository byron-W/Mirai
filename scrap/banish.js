const Discord = require("discord.js");
const moment = require("moment");
const { orange } = require("../config.json");

module.exports = {
    name: 'banish',
    description: 'They must be punished',
    usage: '<user> or <user> <minutes>',
    cooldown: 5,
    class: 'admin',
    args: true,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            const user = msg.mentions.users.first();
            if (!user) return msg.channel.send(`You didn't mention the user to banish`).then(m => m.delete({ timeout: 5000 }));     //If the command mentions a user
            const member = msg.guild.member(user);
            if (!member) return msg.channel.send("That user isn't in this server").then(m => m.delete({ timeout: 5000 }));       //If the user is in the server
            let muterole = msg.guild.roles.cache.find(r => r.name === "bad furry");       //Creation of mute role
            let muted = member.roles.cache.find(r => r.name === "bad furry");
            if (muted) return msg.channel.send("That user is already banished").then(m => m.delete({ timeout: 5000 }));        //If the user is muted already
            if (!muterole) return msg.channel.send("Make a bad furry role").then(m => m.delete({ timeout: 5000 }));
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
                .setColor(orange)
                .setTimestamp()
            return msg.channel.send(muteEmbed);
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}