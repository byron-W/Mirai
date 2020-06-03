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
    console.log("Economy 1 connected to database");
});
client.on("message", async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server
    const econchan = msg.guild.channels.cache.find(ch => ch.name === "economy")

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    if (!msg.content.startsWith(prefix)) return;

    let author = msg.author;
    let user = msg.mentions.users.first();

    if ((command === "coins") || (command === "c")) {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Display the amount of coins a user has\nIf you don't mention a user, then it will show your coins\n${prefix}c or ${prefix}c <user>`);
        } else if ((user) && (!help)) {
            con.query(`SELECT * FROM coins WHERE id = "${user.id}"`, (err, rows) => {
                if (err) throw err;
                if (!rows[0]) return msg.channel.send("That nigga broke")
                let coins = rows[0].coins;
                let bankcoins = rows[0].bank;
                let total = rows[0].total;
                let cembed = new Discord.MessageEmbed()
                    .setAuthor(user.username, user.avatarURL())
                    .setColor(darker_green)
                    .setTitle(`Wallet coins: ${coins}\nDeposited coins: ${bankcoins}\nTotal coins: ${total}`)
                msg.channel.send(cembed);
            });
        } else if ((!user) && (!help)) {
            con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                if (err) throw err;
                if (!rows[0]) return msg.channel.send("You broke nigga")
                let coins = rows[0].coins;
                let bankcoins = rows[0].bank;
                let total = rows[0].total;
                let cembed = new Discord.MessageEmbed()
                    .setAuthor(author.username, author.avatarURL())
                    .setColor(darker_green)
                    .setTitle(`Wallet coins: ${coins}\nDeposited coins: ${bankcoins}\nTotal coins: ${total}`)
                msg.channel.send(cembed);
            });
        }
    }
    if ((command === "buyrole") || (command === "br")) {
        if ((msg.channel.name != "economy") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${econchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Purchase a role from the shop\n${prefix}br <role name>`);
        } else {
            let itemName = args[0];
            let mentionedRole = msg.guild.roles.cache.find(r => r.name === itemName)
            if (!mentionedRole) return msg.channel.send("That isn't in the store. Please check your spelling to make sure it's spelled exaclty how it's listed :)")
            if (!itemName) return msg.channel.send(`You've gotta give me a role to purchase\nEx. ${prefix}buyrole <role name>`);
            con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                if (err) throw err;
                if (!rows[0]) return msg.channel.send("You broke nigga")
                let coins = rows[0].coins;
                con.query(`SELECT * FROM roles WHERE name = '${itemName}'`, (err, rows) => {
                    if (err) throw err;
                    let price = rows[0].value;
                    if (price > coins) return msg.channel.send("You're too broke to buy this");
                    let newbal = coins - price;
                    con.query(`UPDATE coins SET coins = ${newbal} WHERE id = "${author.id}"`);
                    con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                        let checkcoins = rows[0].coins;
                        if (checkcoins != newbal) con.query(`UPDATE coins SET coins = ${newbal} WHERE id = "${author.id}"`);
                    });
                    con.query(`INSERT INTO boughtroles (roles, id) VALUES ('${itemName}', "${author.id}")`);
                    const member = msg.guild.member(author);
                    member.roles.add(mentionedRole).catch(console.error)
                    msg.reply(`You've successfully purchased ${itemName}`);
                });
            });
        }
    }
    if ((command === "buylimitedrole") || (command === "blr")) {
        if ((msg.channel.name != "economy") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${econchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Purchase the limited role from the shop\n${prefix}blr`);
        } else {
            con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                if (err) throw err;
                if (!rows[0]) return msg.channel.send("You broke nigga")
                let coins = rows[0].coins;
                con.query(`SELECT * FROM limited WHERE name = 'Special Nut'`, (err, rows) => {
                    if (err) throw err;
                    if (rows.length < 1) return msg.channel.send("The limited role is not available at this time")
                    let price = rows[0].value;
                    if (price > coins) return msg.channel.send("You're too broke to buy this");
                    let newbal = coins - price;
                    con.query(`UPDATE coins SET coins = ${newbal} WHERE id = "${author.id}"`);
                    con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                        let checkcoins = rows[0].coins;
                        if (checkcoins != newbal) con.query(`UPDATE coins SET coins = ${newbal} WHERE id = "${author.id}"`);
                    });
                    con.query(`DELETE FROM limited WHERE name = 'Special Nut'`);
                    con.query(`INSERT INTO boughtroles (roles, id) VALUES ('Special Nut', "${author.id}")`);
                    const member = msg.guild.member(author);
                    let mentionedRole = msg.guild.roles.cache.find(r => r.name === "Special Nut")
                    member.roles.add(mentionedRole).catch(console.error)
                    msg.reply(`You've successfully purchased Special Nut`);
                });
            });
        }
    }
    if ((command === "myroles") || (command === "myr")) {
        if ((msg.channel.name != "economy") || (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${econchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Display the amount of roles a user has\nIf you don't mention a user, then it will show your roles\n${prefix}mr or ${prefix}mr <user>`);
        } else if ((user) && (!help)) {
            con.query(`SELECT roles FROM boughtroles WHERE id = "${user.id}"`, (err, rows) => {
                if (err) throw err;
                if (rows.length < 1) return msg.channel.send("That user doesn't have any roles")
                let JSONroles = JSON.stringify(rows);
                let parsedRoles = JSON.parse(JSONroles);
                let finroles = '';
                parsedRoles.forEach((row) => {
                    finroles += `\n${row.roles}`;
                })
                let rembed = new Discord.MessageEmbed()
                    .setTitle(`__**${user.username}'s Roles**__`)
                    .setColor(darker_green)
                    .setFooter(`Use ${prefix}deletemyrole to remove a role`)
                    .setDescription(finroles)
                msg.channel.send(rembed);
            });
        } else if ((!user) && (!help)) {
            con.query(`SELECT roles FROM boughtroles WHERE id = "${author.id}"`, (err, rows) => {
                if (err) throw err;
                if (rows.length < 1) return msg.channel.send("You don't have any roles")
                let JSONroles = JSON.stringify(rows);
                let parsedRoles = JSON.parse(JSONroles);
                let finroles = '';
                parsedRoles.forEach((row) => {
                    finroles += `\n${row.roles}`;
                })
                let rembed = new Discord.MessageEmbed()
                    .setTitle("__**Your Roles**__")
                    .setColor(darker_green)
                    .setFooter(`Use ${prefix}deletemyrole to remove a role`)
                    .setDescription(finroles)
                msg.channel.send(rembed);
            });
        }
    }
    if ((command === "deletemyrole") || (command === "dmr")) {
        if ((msg.channel.name != "economy") || (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${econchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Remove one of your roles\n${prefix}dmr <role name>`);
        } else {
            let roleName = args.join(" ");
            if (!roleName) return msg.channel.send("You've gotta give me a role to delete");
            let mentionedRole = msg.guild.roles.cache.find(r => r.name === roleName);
            if (!mentionedRole) return msg.channel.send("That role doesn't exist");
            const member = msg.guild.member(author);
            member.roles.remove(mentionedRole).catch(console.error)
            con.query(`SELECT * FROM boughtroles WHERE roles = '${roleName}' AND id = "${author.id}"`, (err, rows) => {
                if (rows.length < 1) {
                    return msg.channel.send("You don't have that role");
                } else {
                    con.query(`DELETE FROM boughtroles WHERE roles = '${roleName}' AND id = "${author.id}"`);
                    msg.channel.send("Role deleted");
                }
            });
        }
    }
});
client.login(token)