const Discord = require("discord.js");

module.exports = {
    name: 'avatar',
    description: `Display a user's avatar`,
    aliases: ['av'],
    usage: '<user>',
    cooldown: 3,
    class: 'info',
    args: false,
    execute(msg, args) {
        if (args.length < 1) {
            let rcolor = msg.member.roles.highest.color;      //The user's role's color
            let uicon = msg.author.avatarURL();
            let autembed = new Discord.MessageEmbed()       //Sends a fancy display of execution information if the command isn't asking for help
                .setTitle("__**Your Avatar**__")
                .setColor(rcolor)
                .setImage(uicon)
                .setURL(uicon)
            msg.channel.send(autembed);
            return;
        }
        let member = msg.mentions.members.first();
        let user = msg.mentions.users.first();
        if (member) {
            let ucolor = member.roles.highest.color;      //The user's role's color
            let umenicon = user.avatarURL();
            let umenembed = new Discord.MessageEmbed()       //Sends a fancy display of execution information if the command isn't asking for help
                .setTitle(`__**${user.username}'s Avatar**__`)
                .setColor(ucolor)
                .setImage(umenicon)
                .setURL(umenicon)
            msg.channel.send(umenembed);
            return;
        }
        let findMemID = msg.guild.members.cache.find(f => f.id === args[0]);
        let findMemUSER = msg.guild.members.cache.find(f => f.user.username === args[0]);
        if (findMemID) {
            let ucolor = findMemID.roles.highest.color;      //The user's role's color
            let umenicon = findMemID.user.avatarURL();
            let umenembed = new Discord.MessageEmbed()       //Sends a fancy display of execution information if the command isn't asking for help
                .setTitle(`__**${findMemID.user.username}'s Avatar**__`)
                .setColor(ucolor)
                .setImage(umenicon)
                .setURL(umenicon)
            msg.channel.send(umenembed);
        } else if (findMemUSER) {
            if (findMemUSER.id === msg.author.id) {
                let rcolor = msg.member.roles.highest.color;      //The user's role's color
                let uicon = msg.author.avatarURL();
                let autembed = new Discord.MessageEmbed()       //Sends a fancy display of execution information if the command isn't asking for help
                    .setTitle("__**Your Avatar**__")
                    .setColor(rcolor)
                    .setImage(uicon)
                    .setURL(uicon)
                msg.channel.send(autembed);
                return;
            } else {
                let ucolor = findMemUSER.roles.highest.color;      //The user's role's color
                let umenicon = findMemUSER.user.avatarURL();
                let umenembed = new Discord.MessageEmbed()       //Sends a fancy display of execution information if the command isn't asking for help
                    .setTitle(`__**${findMemUSER.user.username}'s Avatar**__`)
                    .setColor(ucolor)
                    .setImage(umenicon)
                    .setURL(umenicon)
                msg.channel.send(umenembed);
            }
        } else {
            return msg.channel.send("Please give either the user's ID or username");
        }
    },
}