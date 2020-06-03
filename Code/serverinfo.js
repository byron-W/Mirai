const Discord = require("discord.js");
const { purple } = require("../config.json");

module.exports = {
    name: 'serverinfo',
    description: 'Show info about the server',
    aliases: ['sinfo', 'server'],
    usage: '',
    cooldown: 3,
    class: 'info',
    args: false,
    execute(msg) {
        let sicon = msg.guild.iconURL();
        let serverembed = new Discord.MessageEmbed()       //Sends a fancy display of execution information if the command isn't asking for help
            .setTitle("__**Server Information**__")
            .setColor(purple)
            .setThumbnail(sicon)
            .addField("Server Name", msg.guild.name)
            .addField("Created On", `${msg.guild.createdAt.getMonth()}/${msg.guild.createdAt.getDate()}/${msg.guild.createdAt.getFullYear()}`)
            .addField("You Joined", `${msg.member.joinedAt.getMonth()}/${msg.member.joinedAt.getDate()}/${msg.member.joinedAt.getFullYear()}`)
            .addField("Total Members", msg.guild.memberCount)
            .addField("# of Roles", msg.guild.roles.cache.size)
            .addField("# of Boosts", msg.guild.premiumSubscriptionCount)
            .addField("# of Emojis", msg.guild.emojis.cache.size)
        return msg.channel.send(serverembed);
    },
}