const Discord = require("discord.js");
const { darker_green } = require("../config.json");

module.exports = {
    name: 'gamble',
    description: `Feed that gambling addiction`,
    usage: '<amount> or all',
    aliases: ['gam'],
    class: 'economy',
    cooldown: 3,
    args: true,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let author = msg.author;
            con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                if (rows.length < 1) return msg.channel.send("You can't gamble with no coins")
                let gambleall = msg.content.endsWith("all");
                let random = Math.floor(Math.random() * 2) + 1;
                let coins = rows[0].coins;
                if (gambleall) {
                    if (random == 1) {
                        let losecoin = coins * 0;
                        let cembed = new Discord.MessageEmbed()
                            .setAuthor(author.username, author.avatarURL())
                            .setColor(darker_green)
                            .setTitle(`Sadly you lost the gamble. You're broke now`)
                        msg.channel.send(cembed);
                        con.query(`UPDATE coins SET coins = ${losecoin} WHERE id = "${author.id}"`);
                        con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                            let checkcoins = rows[0].coins;
                            if (checkcoins != losecoin) con.query(`UPDATE coins SET coins = ${losecoin} WHERE id = "${author.id}"`)
                        })
                    }
                    if (random == 2) {
                        let wincoin = coins * 2;
                        let gained = wincoin - coins;
                        let cembed = new Discord.MessageEmbed()
                            .setAuthor(author.username, author.avatarURL())
                            .setColor(darker_green)
                            .setTitle(`Congrats, you gained ${gained} coins and now have ${wincoin} coins`)
                        msg.channel.send(cembed);
                        con.query(`UPDATE coins SET coins = ${wincoin} WHERE id = "${author.id}"`)
                        con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                            let checkcoins = rows[0].coins;
                            if (checkcoins != wincoin) con.query(`UPDATE coins SET coins = ${wincoin} WHERE id = "${author.id}"`)
                        })
                    }
                } else {
                    let gambleamount = parseInt(args[0]);
                    if (!gambleamount) return msg.channel.send("You've gotta give me an amount to gamble")
                    if (gambleamount > coins) return msg.channel.send("You aren't that rich")
                    if (gambleamount) {
                        if (random == 1) {
                            let losecoin = coins - gambleamount;
                            let cembed = new Discord.MessageEmbed()
                                .setAuthor(author.username, author.avatarURL())
                                .setColor(darker_green)
                                .setTitle(`Sadly you lost the gamble. You now have ${losecoin} coins`)
                            msg.channel.send(cembed);
                            con.query(`UPDATE coins SET coins = ${losecoin} WHERE id = "${author.id}"`);
                            con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                let checkcoins = rows[0].coins;
                                if (checkcoins != losecoin) con.query(`UPDATE coins SET coins = ${losecoin} WHERE id = "${author.id}"`)
                            })
                        }
                        if (random == 2) {
                            let wincoin = coins + gambleamount;
                            let gained = wincoin - coins;
                            let cembed = new Discord.MessageEmbed()
                                .setAuthor(author.username, author.avatarURL())
                                .setColor(darker_green)
                                .setTitle(`Congrats, you gained ${gained} coins and now have ${wincoin} coins`)
                            msg.channel.send(cembed);
                            con.query(`UPDATE coins SET coins = ${wincoin} WHERE id = "${author.id}"`);
                            con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                let checkcoins = rows[0].coins;
                                if (checkcoins != wincoin) con.query(`UPDATE coins SET coins = ${wincoin} WHERE id = "${author.id}"`)
                            })
                        }
                    }
                }
            })
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}