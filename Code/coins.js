const Discord = require("discord.js");
const { darker_green } = require("../config.json");

module.exports = {
    name: 'coins',
    description: `See how many coins someone has`,
    usage: '<user>',
    aliases: ['c', 'wal', 'wallet', 'balance', 'bal', 'bank'],
    class: 'economy',
    cooldown: 5,
    args: false,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let author = msg.author;
            let user = msg.mentions.users.first();
            if (user) {
                con.query(`SELECT * FROM coins WHERE id = "${user.id}"`, (err, rows) => {
                    if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev");
                    if (!rows[0]) return msg.channel.send("That nigga broke")
                    let coins = rows[0].coins;
                    let bankcoins = rows[0].bank;
                    let total = rows[0].total;
                    let cembed = new Discord.MessageEmbed()
                        .setAuthor(user.username, user.avatarURL())
                        .setColor(darker_green)
                        .setTitle(`Wallet coins: ${coins}\nDeposited coins: ${bankcoins}\nTotal coins: ${total}`)
                        .setTimestamp()
                    msg.channel.send(cembed);
                });
            } else {
                con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                    if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev");
                    if (!rows[0]) return msg.channel.send("You broke nigga")
                    let coins = rows[0].coins;
                    let bankcoins = rows[0].bank;
                    let total = rows[0].total;
                    let cembed = new Discord.MessageEmbed()
                        .setAuthor(author.username, author.avatarURL())
                        .setColor(darker_green)
                        .setTitle(`Wallet coins: ${coins}\nDeposited coins: ${bankcoins}\nTotal coins: ${total}`)
                        .setTimestamp()
                    msg.channel.send(cembed);
                });
            }
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}