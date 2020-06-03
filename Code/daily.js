const Discord = require("discord.js");
const { darker_green } = require("../config.json");
const moment = require("moment")

module.exports = {
    name: 'daily',
    description: `Claim your daily coins`,
    usage: '',
    class: 'economy',
    args: false,
    execute(msg, args, con) {
        let author = msg.author;
        con.query(`SELECT lastclaimed FROM dailytimer WHERE id = "${author.id}"`, (err, rows) => {
            if (err) throw err;
            if (rows.length < 1) con.query(`INSERT INTO dailytimer (id, lastclaimed) VALUES ("${author.id}", 'Unclaimed')`)
            try {
                if (rows[0].lastclaimed != moment().format(`L`)) {
                    con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                        let coins = rows[0].coins
                        let dailyamt = 5000;
                        let finalcoins = coins + dailyamt;
                        con.query(`UPDATE coins SET coins = ${finalcoins} WHERE id = "${author.id}"`);
                        con.query(`UPDATE dailytimer SET lastclaimed = '${moment().format(`L`)}' WHERE id = "${author.id}"`);
                        let dembed = new Discord.MessageEmbed()
                            .setTitle(`Here are your ${dailyamt} daily coins ${author.username}`)
                            .setAuthor(author.username, author.avatarURL())
                            .setColor(darker_green)
                        msg.channel.send(dembed);
                    });
                } else {
                    let dembed = new Discord.MessageEmbed()
                        .setTitle(`You must wait ${moment().endOf(`day`).fromNow(true)}`)
                        .setAuthor(author.username, author.avatarURL())
                        .setColor(darker_green)
                    msg.channel.send(dembed);
                }
            } catch (err) {
                console.log(err);
                return msg.channel.send("Say something first so I can recognize you")
            }
        });
    },
}