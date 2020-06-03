const Discord = require("discord.js");
const { darker_green } = require("../config.json");

module.exports = {
    name: 'devcoins',
    description: `Give a user coins`,
    usage: '<user> <amount>',
    aliases: ['devc'],
    class: 'moderation',
    args: true,
    execute(msg, args, con) {
        let user = msg.mentions.users.first();
        let giveamt = parseInt(args[1]);
        if (!user) return msg.channel.send("You didn't mention anyone to give coins to")
        if (!giveamt) return msg.channel.send("You didn't specify how many coins to give")
        con.query(`SELECT * FROM coins WHERE id = "${user.id}"`, (err, rows) => {
            if (err) throw err;
            if (!rows.length) {
                try {
                    con.query(`INSERT INTO coins (id, coins, bank, total, username) VALUES ("${user.id}", 0, 0, 0, "${user.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}")`, err => {
                        if (err) return msg.channel.send("Can't give coins to a bot retard")
                    })
                } catch {
                    return msg.channel.send("Can't give coins to a bot retard")
                }
            }
            con.query(`SELECT * FROM coins WHERE id = "${user.id}"`, (err, rows) => {
                let receivecoins = rows[0].coins;
                let receivertotal = giveamt + receivecoins;
                let receiverfinal = giveamt + receivecoins;
                con.query(`UPDATE coins SET coins = ${receiverfinal} WHERE id = "${user.id}"`, (err, rows) => {
                    if (err) return msg.channel.send(`${giveamt} is too big nigga. Max characters = 11`);
                });
                con.query(`UPDATE coins SET total = ${receivertotal} WHERE id = "${user.id}"`, (err, rows) => {
                    if (err) return msg.channel.send(`Nigga you already have ${receivertotal}. You already rich nigga, chill.`);
                });
                let cembed = new Discord.MessageEmbed()
                    .setAuthor(user.username, user.avatarURL())
                    .setColor(darker_green)
                    .setTitle(`${user.username} recieved ${giveamt} coins`)
                return msg.channel.send(cembed);
            });
        });
    },
}