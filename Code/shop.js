const Discord = require("discord.js");
const { darker_green, prefix } = require("../config.json");

module.exports = {
    name: 'shop',
    description: `See what roles you can buy`,
    usage: '',
    aliases: ['store'],
    class: 'economy',
    cooldown: 5,
    args: false,
    execute(msg, args, con) {
        con.query(`SELECT * FROM roles LIMIT 11`, (err, rows) => {
            if (err) throw err;
            if (rows.length < 1) return msg.channel.send("Looks like we're sold out!")
            let JSONroles = JSON.stringify(rows);
            let parsedRoles = JSON.parse(JSONroles);
            try {
                let rshop = new Discord.MessageEmbed()
                    .setTitle("__**Role Shop**__")
                    .setColor(darker_green)
                    .setFooter(`Use ${prefix}buyrole to purchase a role`)
                    .addField(`__Special Hoist Role: ${parsedRoles[10].name}__`, `Cost: ${parsedRoles[10].value} coins`)
                    .addField(`${parsedRoles[0].name}`, `Cost: ${parsedRoles[0].value} coins`)
                    .addField(`${parsedRoles[1].name}`, `Cost: ${parsedRoles[1].value} coins`)
                    .addField(`${parsedRoles[2].name}`, `Cost: ${parsedRoles[2].value} coins`)
                    .addField(`${parsedRoles[3].name}`, `Cost: ${parsedRoles[3].value} coins`)
                    .addField(`${parsedRoles[4].name}`, `Cost: ${parsedRoles[4].value} coins`)
                    .addField(`${parsedRoles[5].name}`, `Cost: ${parsedRoles[5].value} coins`)
                    .addField(`${parsedRoles[6].name}`, `Cost: ${parsedRoles[6].value} coins`)
                    .addField(`${parsedRoles[7].name}`, `Cost: ${parsedRoles[7].value} coins`)
                    .addField(`${parsedRoles[8].name}`, `Cost: ${parsedRoles[8].value} coins`)
                    .addField(`${parsedRoles[9].name}`, `Cost: ${parsedRoles[9].value} coins`)
                    .setThumbnail(msg.guild.iconURL())
                return msg.channel.send(rshop);
            } catch (err) {
                console.log(err);
                return msg.channel.send("Either you need to add more items or I fucked up somewhere else");
            }
        });
    },
}