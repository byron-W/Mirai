const Discord = require("discord.js");
const { devblue } = require("../config.json");

module.exports = {
    name: 'developer',
    description: 'Show a message from the developer',
    aliases: ['dev'],
    usage: '',
    cooldown: 3,
    class: 'info',
    args: false,
    execute(msg) {
        let devembed = new Discord.MessageEmbed()      //Sends a fancy display of execution information
            .setTitle("__**The Developer**__")
            .setColor(devblue)
            .setDescription("I made this bot so I can practice my skills\nI hope you enjoy using it")
            .setThumbnail("https://cdn.myanimelist.net/images/userimages/7078240.jpg")
            .setFooter(`Thanks for taking the time to check this out :)`)
            .addField("Discord:", "Godly_Otaku#6676")
            .addField("Instagram:", "godly.otaku\n https://www.instagram.com/godly.otaku/")
            .addField("MyAnimeList:", "Godly_Otaku\n https://myanimelist.net/profile/Godly_Otaku")
            //.addField("Github:", "This is where I put all my source code for the bots\n https://github.com/Godly-Otaku/The-Big-3")
            .addField("For recommendations or bugs spotted, DM me on my @'s listed above", "I will respond and try to help as soon as possible")
            .addField("Here's a link to the main server", "https://discord.gg/gERxcQa")
        return msg.channel.send(devembed);
    },
}