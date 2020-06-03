const Discord = require("discord.js");
const { pink } = require("../config.json");

module.exports = {
    name: 'image',
    description: 'Show info on a claim',
    aliases: ['img', 'im'],
    usage: '<character>',
    cooldown: 5,
    class: 'waifu',
    args: true,
    execute(msg, args, con) {
        let name = args.join(" ");
        con.query(`SELECT * FROM roll WHERE name LIKE "%${name}%"`, (err, rows) => {
            if (err) return msg.channel.send("I couldn't find that person")
            try {
                let pername = rows[0].name;
                let aniname = rows[0].animename;
                let image = rows[0].image;
                let claim = rows[0].claimuser
                let imEmbed = new Discord.MessageEmbed()
                    .setTitle(pername)
                    .setDescription(aniname)
                    .setImage(image)
                if (claim === "None") {
                    imEmbed.setColor(0xE06666)
                }
                if (claim !== "None") {
                    imEmbed.setFooter(`Belongs to ${claim}`);
                    imEmbed.setColor(pink)
                }
                return msg.channel.send(imEmbed)
            } catch {
                return msg.channel.send("I couldn't find that person")
            }
        });
    }
}