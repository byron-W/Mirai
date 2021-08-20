const Discord = require("discord.js");
const { darker_green, prefix } = require("../config.json");

module.exports = {
    name: 'myroles',
    description: `See what economy roles someone has`,
    usage: '<myroles>',
    aliases: ['myr'],
    class: 'economy',
    cooldown: 5,
    args: false,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let author = msg.author;
            let user = msg.mentions.users.first();
            if (user) {
                con.query(`SELECT roles FROM boughtroles WHERE id = "${user.id}"`, (err, rows) => {
                    if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                    if (rows.length < 1) return msg.channel.send("That user doesn't have any economy roles")
                    let JSONroles = JSON.stringify(rows);
                    let parsedRoles = JSON.parse(JSONroles);
                    let finroles = '';
                    parsedRoles.forEach((row) => {
                        finroles += `\n${row.roles}`;
                    })
                    let rembed = new Discord.MessageEmbed()
                        .setTitle(`__**${user.username}'s Roles**__`)
                        .setColor(darker_green)
                        .setFooter(`Use ${prefix}deletemyrole to remove a role`)
                        .setDescription(finroles)
                    msg.channel.send(rembed);
                });
            } else {
                con.query(`SELECT roles FROM boughtroles WHERE id = "${author.id}"`, (err, rows) => {
                    if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                    if (rows.length < 1) return msg.channel.send("You don't have any economy roles")
                    let JSONroles = JSON.stringify(rows);
                    let parsedRoles = JSON.parse(JSONroles);
                    let finroles = '';
                    parsedRoles.forEach((row) => {
                        finroles += `\n${row.roles}`;
                    })
                    let rembed = new Discord.MessageEmbed()
                        .setTitle("__**Your Roles**__")
                        .setColor(darker_green)
                        .setFooter(`Use ${prefix}deletemyrole to remove a role`)
                        .setDescription(finroles)
                    msg.channel.send(rembed);
                });
            }
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}