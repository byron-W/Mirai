const Discord = require("discord.js");
const { darker_green, jailemote } = require("../config.json");
const moment = require("moment")

module.exports = {
    name: 'rob',
    description: `Rob someone if you dare. You'll either lose 25% or gain 25%`,
    usage: '<user>',
    class: 'economy',
    args: true,
    execute(msg, args, con, linkargs, client) {
        let author = msg.author;
        let user = msg.mentions.users.first();
        if (!user) return msg.channel.send("That is not a user")
        if (user.id === author.id) return msg.channel.send("Kinda sad man")
        const jail = client.emojis.cache.get(jailemote);
        con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
            if (err) throw err;
            if (rows.length < 1) return msg.channel.send("You've gotta have money to rob someone");
            let robbercoins = rows[0].coins;
            con.query(`SELECT * FROM coins WHERE id = "${user.id}"`, (err, rows) => {
                if (err) throw err;
                if (rows.length < 1) return msg.channel.send("You can't rob a broke person");
                let defendercoins = rows[0].coins;
                let random = Math.floor(Math.random() * 2) + 1;
                con.query(`SELECT * FROM robtimer WHERE id = "${author.id}"`, (err, rows) => {
                    if (err) return msg.channel.send("I fucked up")
                    if (rows.length < 1) con.query(`INSERT INTO robtimer (id, lastused) VALUES ("${author.id}", 'Unused')`)
                    try {
                        if (rows[0].lastused != moment().format(`k`)) {
                            con.query(`UPDATE robtimer SET lastused = '${moment().format(`k`)}' WHERE id = "${author.id}"`)
                            if (random == 1) {
                                let robberfinal = Math.floor(robbercoins * 0.75);
                                let robberlost = Math.floor(robbercoins * 0.25);
                                let defenderfinal = robberlost + defendercoins;
                                let rfembed = new Discord.MessageEmbed()
                                    .setTitle(`You got caught! You failed to rob ${user.username} ${jail}`)
                                    .setDescription(`You lost ${robberlost} coins\nYour remaining coins: ${robberfinal}`)
                                    .setAuthor(author.username, author.avatarURL())
                                    .setColor(darker_green)
                                msg.reply(rfembed);
                                con.query(`UPDATE coins SET coins = ${robberfinal} WHERE id = "${author.id}"`);
                                con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                    let checkcoins = rows[0].coins;
                                    if (checkcoins != robberfinal) con.query(`UPDATE coins SET coins = ${robberfinal} WHERE id = "${author.id}"`);
                                });
                                con.query(`UPDATE coins SET coins = ${defenderfinal} WHERE id = "${user.id}"`);
                                con.query(`SELECT * FROM coins WHERE id = "${user.id}"`, (err, rows) => {
                                    let checkcoins = rows[0].coins;
                                    if (checkcoins != defenderfinal) con.query(`UPDATE coins SET coins = ${defenderfinal} WHERE id = "${user.id}"`);
                                });
                                con.query(`UPDATE robtimer SET lastused = '${moment().format(`k`)}' WHERE id = "${author.id}"`)

                            } else if (random == 2) {
                                let defenderlost = Math.floor(defendercoins * 0.25)
                                let robberfinal = defenderlost + robbercoins;
                                let defenderfinal = Math.floor(defendercoins * 0.75);
                                let rfembed = new Discord.MessageEmbed()
                                    .setTitle(`Your attempt was a success! You successfully robbed ${user.username} :money_mouth:`)
                                    .setDescription(`You gained ${defenderlost} coins\nYour remaining coins: ${robberfinal}`)
                                    .setAuthor(author.username, author.avatarURL())
                                    .setColor(darker_green)
                                msg.reply(rfembed);
                                con.query(`UPDATE coins SET coins = ${robberfinal} WHERE id = "${author.id}"`);
                                con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                    let checkcoins = rows[0].coins;
                                    if (checkcoins != robberfinal) con.query(`UPDATE coins SET coins = ${robberfinal} WHERE id = "${author.id}"`);
                                });
                                con.query(`UPDATE coins SET coins = ${defenderfinal} WHERE id = "${user.id}"`);
                                con.query(`SELECT * FROM coins WHERE id = "${user.id}"`, (err, rows) => {
                                    let checkcoins = rows[0].coins;
                                    if (checkcoins != defenderfinal) con.query(`UPDATE coins SET coins = ${defenderfinal} WHERE id = "${user.id}"`);
                                });
                                con.query(`UPDATE robtimer SET lastused = '${moment().format(`k`)}' WHERE id = "${author.id}"`)
                            }
                        } else {
                            return msg.channel.send(`You've gotta wait ${moment().endOf('hour').fromNow(true)} till you can rob someone again`)
                        }
                    } catch (error) {
                        console.log(error);
                        return msg.channel.send("Say something first so i can recognize you")
                    }
                });
            });
        });

    },
}