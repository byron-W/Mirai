const Discord = require("discord.js");
const moment = require("moment");
const { orange } = require("../config.json");

module.exports = {
    name: 'unmute',
    description: 'Unmute a user from all text and voice chats',
    usage: '<user>',
    cooldown: 5,
    class: 'moderation',
    args: true,
    execute(msg) {
        const user = msg.mentions.users.first();
        if (!user) return msg.channel.send(`You didn't mention the user to unmute`);     //If the command mentions a user
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
        return msg.channel.send(unmuteEmbed);
    },
}