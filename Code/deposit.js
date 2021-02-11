const Discord = require("discord.js");
const { darker_green } = require("../config.json");
const moment = require("moment")

module.exports = {
    name: 'deposit',
    description: `Deposit up to 50% of your coins into the bank at one time`,
    usage: '<amount> or half',
    aliases: ['dep'],
    class: 'economy',
    args: true,
    execute(msg, args, con) {
        try {
            let author = msg.author
            let depositamt = parseInt(args[0]);
            let deposithalf = msg.content.endsWith("half");
            if (isNaN(args[0]) && (!deposithalf)) return msg.channel.send("That's not an amount of coins");
            con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev");
                if (rows.length < 1) return msg.channel.send("You've gotta have money to deposit");
                let currentcoins = rows[0].coins;
                con.query(`SELECT * FROM deposittimer WHERE id = "${author.id}"`, (err, rows) => {
                    if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev");
                    var used;
                    if (rows.length < 1) {
                        con.query(`INSERT INTO deposittimer (id, lastused) VALUES ("${author.id}", 'Unused')`)
                        used = 'Unused';
                    } else {
                        used = rows[0].lastused;
                    }
                    try {
                        if (used != moment().format('k')) {
                            if (deposithalf) {
                                let finalamt = currentcoins / 2;
                                con.query(`UPDATE coins SET coins = ${finalamt} WHERE id = "${author.id}"`)
                                con.query(`SELECT coins FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                    let checkcoins = rows[0].coins;
                                    if (checkcoins != finalamt) con.query(`UPDATE coins SET coins = ${finalamt} WHERE id = "${author.id}"`);
                                });
                                con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                    if (rows.length < 1) con.query(`UPDATE coins SET bank = 0 WHERE id = "${author.id}"`)
                                    let currentbankamt = rows[0].bank
                                    let finalbankamt = finalamt + currentbankamt;
                                    con.query(`UPDATE coins SET bank = ${finalbankamt} WHERE id = "${author.id}"`)
                                    let rfembed = new Discord.MessageEmbed()
                                        .setTitle(`You've successfully deposited 50% of your coins`)
                                        .setDescription(`Wallet coins: ${finalamt}\nDeposited coins: ${finalbankamt}`)
                                        .setAuthor(author.username, author.avatarURL())
                                        .setColor(darker_green)
                                    msg.reply(rfembed);
                                });
                            } else {
                                if (isNaN(depositamt)) return;
                                if (depositamt > (currentcoins / 2)) return msg.channel.send("You may not deposit more than half of you coins at one time")
                                let finalamt = currentcoins - depositamt;
                                con.query(`UPDATE coins SET coins = ${finalamt} WHERE id = "${author.id}"`)
                                con.query(`SELECT coins FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                    let checkcoins = rows[0].coins;
                                    if (checkcoins != finalamt) con.query(`UPDATE coins SET coins = ${finalamt} WHERE id = "${author.id}"`);
                                });
                                con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                    if (rows.length < 1) con.query(`UPDATE coins SET bank = 0 WHERE id = "${author.id}"`)
                                    let currentbankamt = rows[0].bank
                                    let finalbankamt = depositamt + currentbankamt;
                                    con.query(`UPDATE coins SET bank = ${finalbankamt} WHERE id = "${author.id}"`)
                                    let rfembed = new Discord.MessageEmbed()
                                        .setTitle(`You've successfully deposited ${depositamt} coins`)
                                        .setDescription(`Wallet coins: ${finalamt}\nDeposited coins: ${finalbankamt}`)
                                        .setAuthor(author.username, author.avatarURL())
                                        .setColor(darker_green)
                                    msg.reply(rfembed);
                                });
                            }
                            con.query(`UPDATE deposittimer SET lastused = '${moment().format(`k`)}' WHERE id = "${author.id}"`)
                        } else {
                            return msg.channel.send(`You've gotta wait ${moment().endOf('hour').fromNow(true)} till you can deposit again`)
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