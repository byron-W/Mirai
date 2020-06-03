const Discord = require("discord.js");
const { darker_green } = require("../config.json");

module.exports = {
    name: 'givecoins',
    description: `Give a user some of your coins`,
    usage: '<user> <amount>',
    aliases: ['gc', 'givec'],
    class: 'economy',
    cooldown: 5,
    args: true,
    execute(msg, args, con) {
        let author = msg.author;
        let user = msg.mentions.users.first();
        let giveamt = parseInt(args[1]);
        let givercoins = rows[0].coins;
        if (!user) return msg.channel.send("You didn't mention anyone to give coins to")
        if (!giveamt) return msg.channel.send("You didn't specify how many coins to give")
        if (user.id === author.id) return msg.channel.send("Kinda sad man")
        con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
            if (err) return msg.channel.send("You broke nigga");
            if (rows.length < 1) return msg.channel.send("You broke nigga");
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
                    let giverfinal = givercoins - giveamt;
                    let receiverfinal = giveamt + receivecoins;
                    con.query(`UPDATE coins SET coins = ${receiverfinal} WHERE id = "${user.id}"`);
                    con.query(`UPDATE coins SET coins = ${giverfinal} WHERE id = "${author.id}"`);
                    let cembed = new Discord.MessageEmbed()
                        .setAuthor(author.username, author.avatarURL())
                        .setColor(darker_green)
                        .setTitle(`${author.username} gave ${user.username} ${giveamt} coins`)
                    return msg.channel.send(cembed);
                });
            });
        });
    },
}