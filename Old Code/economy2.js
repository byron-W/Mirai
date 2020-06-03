const Discord = require("discord.js");
const client = new Discord.Client();
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix;
const darker_green = config.darker_green;
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
    console.log("Economy 2 connected to database");
});
client.on("message", async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server
    const econchan = msg.guild.channels.cache.find(ch => ch.name === "economy")

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    if (!msg.content.startsWith(prefix)) return;

    let author = msg.author;

    if (command === "shop") {
        if ((msg.channel.name != "economy") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${econchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Display all available roles and their prices\n${prefix}shop`);
        } else {
            con.query(`SELECT * FROM roles LIMIT 10`, (err, rows) => {
                if (err) throw err;
                if (rows.length < 1) return msg.channel.send("Looks like we're sold out!")
                let JSONroles = JSON.stringify(rows);
                let parsedRoles = JSON.parse(JSONroles);
                con.query(`SELECT * FROM limited`, (err, rows) => {
                    if (err) throw err;
                    if (rows.length < 1) {
                        try {
                            let rshop = new Discord.MessageEmbed()
                                .setTitle("__**Role Shop**__")
                                .setDescription(`You can buy cool roles from the shop\nUse ${prefix}buyrole`)
                                .setColor(darker_green)
                                .setFooter(`Use ${prefix}buyrole to purchase a role`)
                                .addField(`__Limited Time Role: Not available__`, `Please wait until the admins/mods decide to release it`)
                                .addField(`${parsedRoles[0].name}`, `Cost: ${parsedRoles[0].value} coins`)
                                .addField(`${parsedRoles[1].name}`, `Cost: ${parsedRoles[1].value} coins`)
                                .addField(`${parsedRoles[2].name}`, `Cost: ${parsedRoles[2].value} coins`)
                                .addField(`${parsedRoles[3].name}`, `Cost: ${parsedRoles[3].value} coins`)
                                .addField(`${parsedRoles[4].name}`, `Cost: ${parsedRoles[4].value} coins`)
                                .addField(`${parsedRoles[5].name}`, `Cost: ${parsedRoles[5].value} coins`)
                                .addField(`${parsedRoles[6].name}`, `Cost: ${parsedRoles[6].value} coins`)
                                .addField(`${parsedRoles[7].name}`, `Cost: ${parsedRoles[7].value} coins`)
                                .addField(`${parsedRoles[8].name}`, `Cost: ${parsedRoles[8].value} coins`)
                                .addField(`${parsedRoles[9].name}`, `Cost: ${parsedRoles[9].value} coins`)
                                .setThumbnail(msg.guild.iconURL())
                            msg.channel.send(rshop);
                        } catch (err) {
                            throw err;
                            return msg.channel.send("Either you need to add more items or I fucked up somewhere else");
                        }
                    } else {
                        let limitedJSONroles = JSON.stringify(rows);
                        let limitedparsedRoles = JSON.parse(limitedJSONroles);
                        try {
                            let rshop = new Discord.MessageEmbed()
                                .setTitle("__**Role Shop**__")
                                .setDescription(`You can buy cool roles from the shop\nUse ${prefix}buyrole`)
                                .setColor(darker_green)
                                .setFooter(`Use ${prefix}buyrole to purchase a role/Use ${prefix}buylimitedrole to purchase the limited role`)
                                .addField(`__Limited Time Role: ${limitedparsedRoles[0].name}__`, `Cost: ${limitedparsedRoles[0].value} coins`)
                                .addField(`${parsedRoles[0].name}`, `Cost: ${parsedRoles[0].value} coins`)
                                .addField(`${parsedRoles[1].name}`, `Cost: ${parsedRoles[1].value} coins`)
                                .addField(`${parsedRoles[2].name}`, `Cost: ${parsedRoles[2].value} coins`)
                                .addField(`${parsedRoles[3].name}`, `Cost: ${parsedRoles[3].value} coins`)
                                .addField(`${parsedRoles[4].name}`, `Cost: ${parsedRoles[4].value} coins`)
                                .addField(`${parsedRoles[5].name}`, `Cost: ${parsedRoles[5].value} coins`)
                                .addField(`${parsedRoles[6].name}`, `Cost: ${parsedRoles[6].value} coins`)
                                .addField(`${parsedRoles[7].name}`, `Cost: ${parsedRoles[7].value} coins`)
                                .addField(`${parsedRoles[8].name}`, `Cost: ${parsedRoles[8].value} coins`)
                                .addField(`${parsedRoles[9].name}`, `Cost: ${parsedRoles[9].value} coins`)
                                .setThumbnail(msg.guild.iconURL())
                            msg.channel.send(rshop);
                        } catch (err) {
                            throw err;
                            return msg.channel.send("Either you need to add more items or I fucked up somewhere else");
                        }
                    }
                });
            });
        }
    }
    if ((command === "leaderboard") || (command === "lb")) {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Shows the top 5 richest people from the server\n${prefix}lb`);
        } else {
            con.query(`SELECT * FROM coins ORDER BY total DESC LIMIT 5`, (err, rows) => {
                if (err) throw err;
                if (rows.length < 1) return msg.channel.send("Everyone is broke!")
                let JSONroles = JSON.stringify(rows);
                let parsedRoles = JSON.parse(JSONroles);
                var rank = 1;
                let finmsg = '';
                parsedRoles.forEach((row) => {
                    finmsg += `\n#${rank++} ${row.username} - Coins: ${row.total}`;
                })
                let leadembed = new Discord.MessageEmbed()
                    .setTitle(`__**${msg.guild.name}'s Leaderboard**__`)
                    .setThumbnail(msg.guild.iconURL())
                    .setColor(darker_green)
                    .setDescription("The top 5 richest people in the server. The more money you have, the less of a life you have")
                    .addField(finmsg, "DISCLAIMER:\nIf you change your username, you WILL lose your money\nFeel free to change your nickname tho")
                msg.channel.send(leadembed);
            })
        }
    }
    if ((command === "gamble") || (command === "gam")) {
        if ((msg.channel.name != "economy") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${econchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Gamble to get some money\n${prefix}gam <amount> or ${prefix}gam all`);
        } else {
            con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                if (err) throw err;
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
                        con.query(`SELECT * FROM coins WHERE id = "${author.id}"`)
                        let checkcoins = rows[0].coins;
                        if (checkcoins != losecoin) con.query(`UPDATE coins SET coins = ${losecoin} WHERE id = "${author.id}"`)
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
                        con.query(`SELECT * FROM coins WHERE id = "${author.id}"`)
                        let checkcoins = rows[0].coins;
                        if (checkcoins != wincoin) con.query(`UPDATE coins SET coins = ${wincoin} WHERE id = "${author.id}"`)
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
                            con.query(`SELECT * FROM coins WHERE id = "${author.id}"`)
                            let checkcoins = rows[0].coins;
                            if (checkcoins != losecoin) con.query(`UPDATE coins SET coins = ${losecoin} WHERE id = "${author.id}"`)
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
                            con.query(`SELECT * FROM coins WHERE id = "${author.id}"`)
                            let checkcoins = rows[0].coins;
                            if (checkcoins != wincoin) con.query(`UPDATE coins SET coins = ${wincoin} WHERE id = "${author.id}"`)
                        }
                    }
                }
            })
        }
    }
});
client.login(token)