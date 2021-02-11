const Discord = require("discord.js");
const { darker_green } = require("../config.json");
const moment = require("moment")

module.exports = {
    name: 'withdraw',
    description: `Withdraw any amount of coins from your bank`,
    usage: '<amount> or all',
    aliases: ['with'],
    class: 'economy',
    args: true,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let author = msg.author
            let withdrawamt = parseInt(args[0]);
            let withdrawall = msg.content.endsWith("all");
            if (isNaN(args[0]) && (!withdrawall)) return msg.channel.send("That's not an amount of coins");
            con.query(`SELECT coins FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                if (rows.length < 1) return msg.channel.send("You've gotta have money to deposit");
                let currentcoins = rows[0].coins;
                con.query(`SELECT * FROM withdrawtimer WHERE id = "${author.id}"`, (err, rows) => {
                    if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev");
                    var used;
                    if (rows.length < 1) {
                        con.query(`INSERT INTO withdrawtimer (id, lastused) VALUES ("${author.id}", 'Unused')`)
                        used = 'Unused';
                    } else {
                        used = rows[0].lastused;
                    }
                    try {
                        if (used != moment().format('k')) {
                            if (withdrawall) {
                                con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                    if (!rows.length) {
                                        try {
                                            con.query(`INSERT INTO coins (id, coins, bank, total, username) VALUES ("${user.id}", 0, 0, 0, "${msg.user.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}")`, err => {
                                                if (err) return msg.channel.send("Can't give coins to a bot retard")
                                            })
                                        } catch {
                                            return msg.channel.send("DAMN")
                                        }
                                    }
                                    con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                        let currentbankamt = rows[0].bank;
                                        let finalamt = currentcoins + currentbankamt;
                                        let finalbankamt = finalamt * 0;
                                        con.query(`UPDATE coins SET coins = ${finalamt} WHERE id = "${author.id}"`)
                                        con.query(`SELECT coins FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                            let checkcoins = rows[0].coins;
                                            if (checkcoins != finalamt) con.query(`UPDATE coins SET coins = ${finalamt} WHERE id = "${author.id}"`);
                                        });
                                        con.query(`UPDATE coins SET bank = ${finalbankamt} WHERE id = "${author.id}"`)
                                        let rfembed = new Discord.MessageEmbed()
                                            .setTitle(`You've successfully withdrawn all your coins`)
                                            .setDescription(`Wallet coins: ${finalamt}\nDeposited coins: ${finalbankamt}`)
                                            .setAuthor(author.username, author.avatarURL())
                                            .setColor(darker_green)
                                        msg.reply(rfembed);
                                        con.query(`UPDATE withdrawtimer SET lastused = '${moment().format(`k`)}' WHERE id = "${author.id}"`)
                                    });
                                });
                            } else {
                                if (isNaN(withdrawamt)) return;
                                con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                    if (!rows.length) {
                                        try {
                                            con.query(`INSERT INTO coins (id, coins, bank, total, username) VALUES ("${user.id}", 0, 0, 0, "${msg.user.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}")`, err => {
                                                if (err) return msg.channel.send("Can't give coins to a bot retard")
                                            })
                                        } catch {
                                            return msg.channel.send("DAMN")
                                        }
                                    }
                                    con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                        let currentbankamt = rows[0].bank
                                        if (withdrawamt > currentbankamt) return msg.channel.send("You don't have that much money in your bank account")
                                        let finalamt = currentcoins + withdrawamt;
                                        con.query(`UPDATE coins SET coins = ${finalamt} WHERE id = "${author.id}"`)
                                        con.query(`SELECT coins FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                            let checkcoins = rows[0].coins;
                                            if (checkcoins != finalamt) con.query(`UPDATE coins SET coins = ${finalamt} WHERE id = "${author.id}"`);
                                        });
                                        let finalbankamt = currentbankamt - withdrawamt;
                                        con.query(`UPDATE coins SET bank = ${finalbankamt} WHERE id = "${author.id}"`)
                                        let rfembed = new Discord.MessageEmbed()
                                            .setTitle(`You've successfully withdrew ${withdrawamt} coins`)
                                            .setDescription(`Wallet coins: ${finalamt}\nDeposited coins: ${finalbankamt}`)
                                            .setAuthor(author.username, author.avatarURL())
                                            .setColor(darker_green)
                                        msg.reply(rfembed);
                                        con.query(`UPDATE withdrawtimer SET lastused = '${moment().format(`k`)}' WHERE id = "${author.id}"`)
                                    });
                                });
                            }
                        } else {
                            return msg.channel.send(`You've gotta wait ${moment().endOf('hour').fromNow(true)} till you can withdraw again`)
                        }
                    } catch (err) {
                        return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                    }
                });
            })
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}