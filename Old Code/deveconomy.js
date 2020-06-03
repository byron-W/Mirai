const Discord = require("discord.js");
const client = new Discord.Client();
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix;
const darker_green = config.darker_green
const moment = require("moment");
const mysql = require("mysql");
const sqlpass = tokenfile.sqlpass;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: sqlpass,
    database: "petuniabase"
});
con.connect(err => {
    if (err) throw err;
    console.log("Developer Economy connected to database");
});
function generateCoins() {
    return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
}
function generateSize() {
    return (Math.random() * 10) + 1;
}
client.on("message", async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server
    if (msg.author.bot) return;     //Doesn't let the bot respond to itself
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    let author = msg.author;
    con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
        try {
            if (err) return msg.channel.send(`${author.username}, I cannnot give you coins due to emojis or other weird characters in your username\nPlease change it to stop recieving this message and to recieve coins`)
            if (rows.length < 1) {
                con.query(`INSERT INTO coins (id, coins, bank, total, username) VALUES ("${author.id}", ${generateCoins()}, 0, ${generateCoins()}, "${author.username}")`)
            } else {
                let coins = rows[0].coins;
                if (msg.content.startsWith(prefix)) return;
                con.query(`UPDATE coins SET coins = ${coins + generateCoins()} WHERE id = "${author.id}"`)
            }
            if (rows.length > 1) {
                let coins = rows[0].coins;
                con.query(`DELETE FROM coins WHERE id = "${author.id}"`)
                con.query(`INSERT INTO coins (id, coins, bank, total, username) VALUES ("${author.id}", ${coins}, 0, ${coins}, "${author.username}")`)
            }
        } catch {
            return msg.reply(`I cannot give you coins due to emojis or other weird characters in your username\nPlease change it to stop recieving this message and to recieve coins`)
        }
    });
    con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
        try {
            con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                let wallet = rows[0].coins;
                let bank = rows[0].bank;
                let newtotal = wallet + bank;
                con.query(`UPDATE coins SET total = ${newtotal} WHERE id = "${author.id}"`)
            });
        }
        catch {
            console.log(`${author.username} ; ${author.id}`)
        }
    });
    con.query(`SELECT * FROM dailytimer WHERE id = "${author.id}"`, (err, rows) => {
        if (err) throw err;
        if (rows.length < 1) con.query(`INSERT INTO dailytimer (id, lastclaimed) VALUES ("${author.id}", 'Unclaimed')`)
    });
    con.query(`SELECT * FROM weewee WHERE id = "${author.id}"`, (err, rows) => {
        if (err) throw err;
        if (rows.length < 1) con.query(`INSERT INTO weewee (id, size) VALUES ("${author.id}", ${generateSize()})`)
    })
    con.query(`SELECT * FROM robtimer WHERE id = "${author.id}"`, (err, rows) => {
        if (err) return msg.channel.send("I fucked up")
        if (rows.length < 1) con.query(`INSERT INTO robtimer (id, lastused) VALUES ("${author.id}", 'Unused')`)
    });
    con.query(`SELECT * FROM deposittimer WHERE id = "${author.id}"`, (err, rows) => {
        if (err) return msg.channel.send("I fucked up")
        if (rows.length < 1) con.query(`INSERT INTO deposittimer (id, lastused) VALUES ("${author.id}", 'Unused')`)
    });
    con.query(`SELECT * FROM withdrawtimer WHERE id = "${author.id}"`, (err, rows) => {
        if (err) return msg.channel.send("I fucked up")
        if (rows.length < 1) con.query(`INSERT INTO withdrawtimer (id, lastused) VALUES ("${author.id}", 'Unused')`)
    });
    con.query(`SELECT * FROM rolltimer WHERE id = "${author.id}"`, (err, rows) => {
        if (err) return msg.channel.send("I fucked up")
        if (rows.length < 1) con.query(`INSERT INTO rolltimer (id, lastused, uses) VALUES ("${author.id}", 'Unused', 0)`)
        con.query(`SELECT * FROM rolltimer WHERE id = "${author.id}"`, (err, rows) => {
            if (rows[0].lastused != moment().format('k')) con.query(`UPDATE rolltimer SET uses = 0 WHERE id = "${author.id}"`)
        });
    });
    
    if ((command === "devcoins") || (command === "devc")) {
        if (!msg.content.startsWith(prefix)) return;
        let admin = msg.member.hasPermission("ADMINISTRATOR");
        if (!admin) return msg.reply("You are not worthy :smirk:")
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Add coins to a user's coins\n${prefix}devcoins <user> <amount>`);
        } else {
            let user = msg.mentions.users.first();
            let giveamt = parseInt(args[1]);
            if (!user) return msg.channel.send("You didn't menatoin anyone to give coins to")
            if (!giveamt) return msg.channel.send("You specify how many coins to give")
            con.query(`SELECT * FROM coins WHERE id = "${user.id}"`, (err, rows) => {
                if (err) throw err;
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
                msg.channel.send(cembed);
            });
        }
    }
});
client.login(token);