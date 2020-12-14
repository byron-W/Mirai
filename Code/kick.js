const Discord = require("discord.js");
const { red } = require("../config.json");
const moment = require("moment");

module.exports = {
    name: 'kick',
    description: `What's the shape of Italy?`,
    usage: '<user>',
    cooldown: 5,
    class: 'moderation',
    args: true,
    execute(msg) {
        const user = msg.mentions.users.first();
        if (!user) return msg.channel.send(`You didn't mention the user to kick`)     //If the command mentions a user
        const member = msg.guild.member(user);
        if (!member) return msg.channel.send("That user isn't in this server")       //If the user is in the server
        member.kick("They deserved it").then(async () => {
            let uicon = user.displayAvatarURL();
            let kickEmbed = new Discord.MessageEmbed()     //Sends a fancy display of execution information
                .setTitle(`__${user.username} was kicked :(__`)
                .setThumbnail(uicon)
                .addField("Kicked by:", msg.author.username)
                .addField("Kicked in:", msg.channel.name)
                .addField("Time:", moment().format(`LT`))
                .setColor(red)
            return msg.channel.send(kickEmbed);
        }).catch(err => {
            return catchErr(err, msg, `${module.exports.name}.js`, "I don't have the permissions to kick them");
        });
    },
}