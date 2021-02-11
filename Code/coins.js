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
                    let noemoji = user.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
                    var coins;
                    var bankcoins;
                    var total;
                    if (rows < 1) {
                        con.query(`INSERT INTO coins (id, coins, bank, total, username) VALUES ("${user.id}", 0, 0, 0, "${noemoji}")`)
                        coins = 0;
                        bankcoins = 0;
                        total = 0;
                    } else {
                        coins = rows[0].coins;
                        bankcoins = rows[0].bank;
                        total = rows[0].total;
                    }
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
                    let noemoji = author.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
                    var coins;
                    var bankcoins;
                    var total;
                    if (rows < 1) {
                        con.query(`INSERT INTO coins (id, coins, bank, total, username) VALUES ("${author.id}", 0, 0, 0, "${noemoji}")`)
                        coins = 0;
                        bankcoins = 0;
                        total = 0;
                    } else {
                        coins = rows[0].coins;
                        bankcoins = rows[0].bank;
                        total = rows[0].total;
                    }
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