const Discord = require("discord.js");
const client = new Discord.Client();
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix;
const lavender = config.lavender
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
    console.log("Random commands connected to database");
});
client.on("message", async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    if (!msg.content.startsWith(prefix)) return;

    let author = msg.author;
    let user = msg.mentions.users.first();

    if ((command === "weewee") || (command === "pp")) {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Display your weewee size\nIf you don't mention a user, then it will show your size\n${prefix}weewee or ${prefix}weewee <user>`);
        } else if ((user) && (!help)) {
            if (msg.isMemberMentioned(client.user)) return msg.channel.send("You don't need to know that");
            con.query(`SELECT * FROM weewee WHERE id = "${user.username}"`, (err, rows) => {
                if (err) throw err;
                try {
                    let size = rows[0].size;
                    if (!size) return msg.channel.send(`They have to say something so I can recognize them`)
                    let cembed = new Discord.RichEmbed()
                        .setAuthor(user.username, user.avatarURL)
                        .setColor(lavender)
                        .setTitle(`They're packin ${size}"`)
                    msg.channel.send(cembed);
                } catch (err) {
                    return msg.channel.send(`They have to say something so I can recognize them`)
                }
            });
        } else if ((!user) && (!help)) {
            con.query(`SELECT * FROM weewee WHERE id = "${author.username}"`, (err, rows) => {
                if (err) throw err;
                try {
                    let size = rows[0].size;
                    if (!size) return msg.channel.send(`They have to say something so I can recognize them`)
                    let cembed = new Discord.RichEmbed()
                        .setAuthor(author.username, author.avatarURL)
                        .setColor(lavender)
                        .setTitle(`You're packin ${size}"`)
                    msg.channel.send(cembed);
                } catch (err) {
                    return msg.channel.send(`Say something so I can recognize you`)
                }
            });
        }
    }
});
client.login(token)