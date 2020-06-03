const Discord = require("discord.js");
const client = new Discord.Client();
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix;
const darker_green = config.darker_green;
const mysql = require("mysql");
const sqlpass = tokenfile.sqlpass;
const moment = require("moment");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: sqlpass,
    database: "petuniabase"
});
con.connect(err => {
    if (err) throw err;
    console.log("Economy 3 connected to database");
});
client.on("message", async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server
    if (msg.author.bot) return;     //Doesn't let the bot respond to itself
    const econchan = msg.guild.channels.cache.find(ch => ch.name === "economy")

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    if (!msg.content.startsWith(prefix)) return;

    let author = msg.author;
    let user = msg.mentions.users.first();

    if ((command === "givecoins") || (command === "gc")) {
        if ((msg.channel.name != "economy") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${econchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Give a user some coins\n${prefix}gc <user> <amount>`);
        } else {
            con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                if (err) throw err;
                if (rows < 1) return msg.channel.send("You broke nigga");
                let giveamt = parseInt(args[1]);
                let givercoins = rows[0].coins;
                if (!user) return msg.channel.send("You didn't mentoin anyone to give coins to")
                if (!giveamt) return msg.channel.send("You specify how many coins to give")
                con.query(`SELECT * FROM coins WHERE id = "${user.id}"`, (err, rows) => {
                    if (err) throw err;
                    let receivecoins = rows[0].coins;
                    let giverfinal = givercoins - giveamt;
                    let receiverfinal = giveamt + receivecoins;
                    con.query(`UPDATE coins SET coins = ${receiverfinal} WHERE id = "${user.id}"`);
                    con.query(`UPDATE coins SET coins = ${giverfinal} WHERE id = "${author.id}"`);
                    let cembed = new Discord.MessageEmbed()
                        .setAuthor(author.username, author.avatarURL())
                        .setColor(darker_green)
                        .setTitle(`${author.username} gave ${user.username} ${giveamt} coins`)
                    msg.channel.send(cembed);
                });
            });
        }
    }
    if (command === "daily") {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Get some coins every 24 hours\n${prefix}daily`);
        } else {
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
        }
    }

    if (command === "rob") {
        if ((msg.channel.name != "economy") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${econchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Rob someone if you dare\nYou'll either lose 25% or gain 25%\n${prefix}rob <user>`);
        } else {
            if (!user) return msg.channel.send("You gotta tell me who you want to rob")
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
                                        .setTitle(`You got caught! You failed to rob ${user.username} :(`)
                                        .setDescription(`You lost ${robberlost} coins\nYour remaining coins: ${robberfinal}`)
                                        .setAuthor(author.username, author.avatarURL())
                                        .setColor(darker_green)
                                    msg.reply(rfembed);
                                    con.query(`UPDATE coins SET coins = ${robberfinal} WHERE id = "${author.id}"`);
                                    con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                        let checkcoins = rows[0].coins;
                                        if (checkcoins != robberfinal) con.query(`UPDATE coins SET coins = ${robberfinal} WHERE id = "${author.id}"`);
                                    });
                                    con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                        let checkcoins = rows[0].coins;
                                        if (checkcoins != robberfinal) con.query(`UPDATE coins SET coins = ${robberfinal} WHERE id = "${author.id}"`);
                                    });
                                    con.query(`UPDATE coins SET coins = ${defenderfinal} WHERE id = "${user.id}"`);
                                    con.query(`SELECT * FROM coins WHERE id = "${user.id}"`, (err, rows) => {
                                        let checkcoins = rows[0].coins;
                                        if (checkcoins != defenderfinal) con.query(`UPDATE coins SET coins = ${defenderfinal} WHERE id = "${user.id}"`);
                                    });
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
                                        .setTitle(`Your attempt was a success! You successfully robbed ${user.username}`)
                                        .setDescription(`You gained ${defenderlost} coins\nYour remaining coins: ${robberfinal}`)
                                        .setAuthor(author.username, author.avatarURL())
                                        .setColor(darker_green)
                                    msg.reply(rfembed);
                                    con.query(`UPDATE coins SET coins = ${robberfinal} WHERE id = "${author.id}"`);
                                    con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                        let checkcoins = rows[0].coins;
                                        if (checkcoins != robberfinal) con.query(`UPDATE coins SET coins = ${robberfinal} WHERE id = "${author.id}"`);
                                    });
                                    con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                        let checkcoins = rows[0].coins;
                                        if (checkcoins != robberfinal) con.query(`UPDATE coins SET coins = ${robberfinal} WHERE id = "${author.id}"`);
                                    });
                                    con.query(`UPDATE coins SET coins = ${defenderfinal} WHERE id = "${user.id}"`);
                                    con.query(`SELECT * FROM coins WHERE id = "${user.id}"`, (err, rows) => {
                                        let checkcoins = rows[0].coins;
                                        if (checkcoins != defenderfinal) con.query(`UPDATE coins SET coins = ${defenderfinal} WHERE id = "${user.id}"`);
                                    });
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

            })
        }
    }
});
client.login(token);