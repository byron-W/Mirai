const Discord = require("discord.js");
const client = new Discord.Client();
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix;
const darker_green = config.darker_green;
const mysql = require("mysql");
const sqlpass = tokenfile.sqlpass;
const moment = require("moment")

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: sqlpass,
    database: "petuniabase"
});
con.connect(err => {
    if (err) throw err;
    console.log("Economy 4 connected to database");
});
client.on("message", async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server
    if (msg.author.bot) return;     //Doesn't let the bot respond to itself
    const econchan = msg.guild.channels.cache.find(ch => ch.name === "economy")

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    if (!msg.content.startsWith(prefix)) return;

    let author = msg.author;

    if ((command === "deposit") || (command === "dep")) {
        if ((msg.channel.name != "economy") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${econchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Deposit up to 50% of your money into your bank\n${prefix}dep <amount of coins> or ${prefix}dep half`);
        } else {
            let depositamt = parseInt(args[0]);
            let deposithalf = msg.content.endsWith("half");
            if (!args[0]) return msg.channel.send("You gotta tell me how much you wanna deposit")
            con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                if (err) throw err;
                if (rows.length < 1) return msg.channel.send("You've gotta have money to deposit");
                let currentcoins = rows[0].coins;
                con.query(`SELECT * FROM deposittimer WHERE id = "${author.id}"`, (err, rows) => {
                    if (err) return msg.channel.send("I fucked up")
                    if (rows.length < 1) con.query(`INSERT INTO deposittimer (id, lastused) VALUES ("${author.id}", 'Unused')`)
                    try {
                        if (rows[0].lastused != moment().format('k')) {
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
                    } catch (error) {
                        console.log(error);
                        return msg.channel.send("Say something first so i can recognize you")
                    }
                });
            })
        }
    }
    if ((command === "withdraw") || (command === "with")) {
        if ((msg.channel.name != "economy") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${econchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Withdraw any amount from your bank\n${prefix}with <amount of coins> or ${prefix}with all`);
        } else {
            let withdrawamt = parseInt(args[0]);
            let withdrawall = msg.content.endsWith("all");
            if (!args[0]) return msg.channel.send("You gotta tell me how much you wanna withdraw")
            con.query(`SELECT coins FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                if (err) throw err;
                if (rows.length < 1) return msg.channel.send("You've gotta have money to deposit");
                let currentcoins = rows[0].coins;
                con.query(`SELECT * FROM withdrawtimer WHERE id = "${author.id}"`, (err, rows) => {
                    if (err) return msg.channel.send("I fucked up")
                    if (rows.length < 1) con.query(`INSERT INTO withdrawtimer (id, lastused) VALUES ("${author.id}", 'Unused')`)
                    try {
                        if (rows[0].lastused != moment().format('k')) {
                            if (withdrawall) {
                                con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                    if (rows.length < 1) con.query(`UPDATE coins SET bank = 0 WHERE id = "${author.id}"`)
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
                            } else {
                                if (isNaN(withdrawamt)) return;
                                con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                                    if (rows.length < 1) con.query(`UPDATE coins SET bank = 0 WHERE id = "${author.id}"`)
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
                            }
                        } else {
                            return msg.channel.send(`You've gotta wait ${moment().endOf('hour').fromNow(true)} till you can withdraw again`)
                        }
                    } catch (error) {
                        console.log(error);
                        return msg.channel.send("Say something first so i can recognize you")
                    }
                });
            })
        }
    }

});
client.login(token)