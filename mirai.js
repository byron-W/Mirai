const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const fs = require("fs");
const { token, sqlpass } = require("./token.json");
const { prefix, pink } = require("./config.json");
const moment = require("moment")
const mysql = require("mysql");

const commandFiles = fs.readdirSync('./Code/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./Code/${file}`);
    client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: sqlpass,
    database: "petuniabase",
    flags: '-SESSION_TRACK'
});
con.connect(err => {
    if (err) throw err;
    console.log("All commands loaded");
});
client.on("ready", () => {
    console.log(`${client.user.username} is now online`);
    client.user.setActivity("with your no-no zone :)", { type: "PLAYING" });     //Sets what the bot is doing
});
function generateCoins() {
    return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
}
client.on("message", async msg => {
    let author = msg.author;
    if (author.bot) return;     //Doesn't let the bot respond to itself

    let noemoji = msg.author.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
        try {
            if (err) return msg.channel.send(`${author.username}, I cannot give you coins due to emojis or other weird characters in your username\nPlease change it to stop recieving this message and to recieve coins`)
            if (rows.length < 1) {
                con.query(`INSERT INTO coins (id, coins, bank, total, username) VALUES ("${author.id}", ${generateCoins()}, 0, ${generateCoins()}, "${noemoji}")`)
            } else {
                let coins = rows[0].coins;
                if (msg.content.startsWith(prefix)) return;
                con.query(`UPDATE coins SET coins = ${coins + generateCoins()} WHERE id = "${author.id}"`)
            }
            if (rows.length > 1) {
                let coins = rows[0].coins;
                con.query(`DELETE FROM coins WHERE id = "${author.id}"`)
                con.query(`INSERT INTO coins (id, coins, bank, total, username) VALUES ("${author.id}", ${coins}, 0, ${coins}, "${noemoji}")`)
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
    con.query(`SELECT * FROM giveaway WHERE id = ${msg.author.id}`, (err, rows) => {
        if (rows.length < 1) return con.query(`INSERT INTO giveaway (user, count, id) VALUES ("${msg.author.username}", 1, ${msg.author.id})`)
        con.query(`UPDATE giveaway SET count = ${rows[0].count + 1} WHERE id = ${msg.author.id}`)
    })

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const commandName = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed
    const linkargs = msg.content.slice(prefix.length + commandName.length).trim().split(" | ");
    let message = msg.content.toLowerCase();
    if ((message === "gn") || (message === "goodnight") || (message === "good night")) {
        msg.channel.send(`*Goodnight* :heart: :sleeping:`, { files: ["./Reactions/sleeping.gif"] });
    }
    if ((message === "gm") || (message === "goodmorning") || (message === "good morning")) {
        msg.channel.send(`*Goodmorning* :heart: :blush:`, { files: ["./Reactions/waking.gif"] });
    }
    if ((message === "potato") || (message === "beans")) {
        if (!msg.content.startsWith(prefix)) return;
        msg.channel.send(`:potato:`, { files: ["./Reactions/potato.jpg"] });
    }
    if (message === "uwu") msg.channel.send("You're a bitch")
    if (message === "hey") {
        msg.channel.messages.fetchPinned({ limit: 100 })
            .then(fetched => {
                let pinarray = fetched.array();
                const ranpin = Math.floor(Math.random() * pinarray.length);
                let pinmsg = pinarray[ranpin].content;
                let pinatt = pinarray[ranpin].attachments.array();
                try {
                    msg.channel.send(pinatt[0].url);
                } catch {
                    msg.channel.send(pinmsg);
                }
            })
    }
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (msg.channel.type !== 'text') {
        if (msg.author.bot == true) return;
        let logchan = client.channels.cache.get("597962790220595210");
        let nutchan = client.channels.cache.get("715925099307335680");
        if (msg.attachments.size > 0) {
            let oldimg = '';
            msg.attachments.forEach((row) => {
                oldimg += `\n${row.proxyURL}`;
            })
            let delmsg = new Discord.MessageEmbed()
                .setAuthor(msg.author.username, msg.author.avatarURL())
                .setTitle(`**${msg.author.username}** is in my DMs`)
                .setDescription(`__Sent at:__ ${moment().format(`LT`)}`)
                .setThumbnail("https://66.media.tumblr.com/7faf76a655814723d93f17aac4223adc/tumblr_p67vmb88qf1wctgsho1_250.jpg")
                .setColor(pink)
            logchan.send(delmsg);
            logchan.send(oldimg)
            nutchan.send(delmsg);
            nutchan.send(oldimg);
        } else {
            let delmsg = new Discord.MessageEmbed()
                .setAuthor(msg.author.username, msg.author.avatarURL())
                .setTitle(`**${msg.author.username}** is in my DMs`)
                .setDescription(`__Message:__ ${msg.content}\n__Sent at:__ ${moment().format(`LT`)}`)
                .setThumbnail("https://66.media.tumblr.com/7faf76a655814723d93f17aac4223adc/tumblr_p67vmb88qf1wctgsho1_250.jpg")
                .setColor(pink)
            logchan.send(delmsg);
            nutchan.send(delmsg);
        }
        return msg.reply('Fuck out my DMs pussboi');
    }
    if (!command) return;
    if (!msg.content.startsWith(prefix)) return;
    const rollchan = msg.guild.channels.cache.find(r => r.name === "waifu-rolling")
    const econchan = msg.guild.channels.cache.find(r => r.name === "economy")
    const anichan = msg.guild.channels.cache.find(r => r.name === "anime-games")

    if ((command.class === "economy") && (msg.channel.name != "economy") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${econchan}`)
    if ((command.class === "vc") && (msg.channel.name != "anime-games") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${anichan}`)
    if ((command.class === "vc") && (!msg.member.voice.channel)) return msg.channel.send("You must be in a voice channel to use this command")
    if ((command.class === "waifu") && (msg.channel.name != "waifu-rolling") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${rollchan}`)
    if ((command.class === "devcmd") && (msg.author.id != '250072488929787924')) return msg.channel.send("You are not worthy :pensive:");
    if ((command.class === "moderation") && (!msg.member.hasPermission("MANAGE_MESSAGES"))) return msg.channel.send("You are not worthy :pensive:");
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${msg.author.username}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return msg.channel.send(reply);
    }
    //Cooldown
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(msg.author.id)) {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return msg.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(msg.author.id, now);
    setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

    try {
        command.execute(msg, args, con, linkargs, client);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
});
client.on("guildMemberAdd", (newmem) => {
    if (newmem.guild.name != "Big Nut") return;
    let welchan = client.channels.cache.get("464172724181270549");
    let nutchan = client.channels.cache.get("715925099307335680");
    let welcomemsg = new Discord.MessageEmbed()
        .setAuthor(newmem.user.tag, newmem.user.avatarURL())
        .setTitle(`Welcome to the server, **${newmem.user.username}**`)
        .setDescription(`-Make sure you read the rules in ${client.channels.cache.get('463806957875363841')}\n-Use ${prefix}help for assistance with any bots\n-Contact an admin if you're having problems\n-Lastly, go make some friends in ${client.channels.cache.get('470063981134872587')}`)
        .setFooter(`Joined at: ${moment().format(`LT`)}`)
        .setImage("https://i.pinimg.com/originals/f6/30/fb/f630fbf31454641d95317c9862d38a9d.gif")
        .setThumbnail("https://media3.giphy.com/media/EOHqVt2BTTvCU/source.gif")
        .setColor(pink)
    welchan.send(`<@${newmem.id}>`);
    welchan.send(welcomemsg);
    nutchan.send(`Joined: ${newmem.user.tag}\n${moment().format(`LT`)}`)
});
client.on("guildMemberRemove", (leavemem) => {
    if (leavemem.guild.name != "Big Nut") return;
    let server = client.guilds.cache.get("463777968146219008")
    let welchan = client.channels.cache.get("464172724181270549");
    let nutchan = client.channels.cache.get("715925099307335680");
    try {
        let memberbanned = server.fetchBan(leavemem.user).catch((err) => {
            let leavemsg = new Discord.MessageEmbed()
                .setAuthor(leavemem.user.tag, leavemem.user.avatarURL())
                .setTitle(`**${leavemem.user.username}** left the server`)
                .setDescription(`__Left at:__ ${moment().format(`LT`)}`)
                .setThumbnail("https://data.whicdn.com/images/205213419/superthumb.jpg?t=1445706119")
                .setFooter("You made her cry :(")
                .setColor(pink)
            welchan.send(leavemsg);
            nutchan.send(`Left: ${leavemem.user.tag}\n${moment().format(`LT`)}`)
        })
        if (memberbanned) return;
    }
    catch {
        let leavemsg = new Discord.MessageEmbed()
            .setAuthor(leavemem.user.tag, leavemem.user.avatarURL())
            .setTitle(`**${leavemem.user.username}** left the server`)
            .setDescription(`__Left at:__ ${moment().format(`LT`)}`)
            .setThumbnail("https://data.whicdn.com/images/205213419/superthumb.jpg?t=1445706119")
            .setFooter("Mans got banned")
            .setColor(pink)
        welchan.send(leavemsg);
        nutchan.send(`Banned: ${leavemem.user.tag}\n${moment().format(`LT`)}`)
    }
});
client.on("messageDelete", async oldmsg => {
    const fetchedLogs = await oldmsg.guild.fetchAuditLogs({
        limit: 1,
        type: 'MESSAGE_DELETE',
    });
    const deletionLog = fetchedLogs.entries.first();
    const { executor } = deletionLog;

    if (oldmsg.author.bot == true) return;
    if (oldmsg.guild.name != "Big Nut") return;
    if (oldmsg.channel.id === "597962790220595210") return;
    let logchan = client.channels.cache.get("597962790220595210");
    let nutchan = client.channels.cache.get("715925099307335680");
    if (oldmsg.attachments.size > 0) {
        let oldimg = '';
        oldmsg.attachments.forEach((row) => {
            oldimg += `\n${row.proxyURL}`;
        })
        let delmsg = new Discord.MessageEmbed()
            .setAuthor(oldmsg.author.username, oldmsg.author.avatarURL())
            .setTitle(`**${oldmsg.author.username}'s** message was deleted`)
        if (!deletionLog) delmsg.setDescription(`__Channel:__ ${oldmsg.channel.name}\n__Deleted at:__ ${moment().format(`LT`)}`)
        if (deletionLog) delmsg.setDescription(`__Channel:__ ${oldmsg.channel.name}\n__Deleted at:__ ${moment().format(`LT`)}\n__Deleted by:__ ${executor.tag}`)
            .setThumbnail("https://66.media.tumblr.com/7faf76a655814723d93f17aac4223adc/tumblr_p67vmb88qf1wctgsho1_250.jpg")
            .setColor(pink)
        logchan.send(delmsg);
        logchan.send(oldimg);
        nutchan.send(delmsg);
        nutchan.send(oldimg);
    } else {
        let delmsg = new Discord.MessageEmbed()
            .setAuthor(oldmsg.author.username, oldmsg.author.avatarURL())
            .setTitle(`**${oldmsg.author.username}'s** message was deleted`)
        if (!deletionLog) delmsg.setDescription(`__Message:__ ${oldmsg}\n__Channel:__ ${oldmsg.channel.name}\n__Deleted at:__ ${moment().format(`LT`)}`)
        if (deletionLog) delmsg.setDescription(`__Message:__ ${oldmsg}\n__Channel:__ ${oldmsg.channel.name}\n__Deleted at:__ ${moment().format(`LT`)}\n__Deleted by:__ ${executor.tag}`)
            .setThumbnail("https://66.media.tumblr.com/7faf76a655814723d93f17aac4223adc/tumblr_p67vmb88qf1wctgsho1_250.jpg")
            .setColor(pink)
        logchan.send(delmsg);
        nutchan.send(delmsg);
    }
});
client.on("guildBanAdd", (guild, banmem) => {
    let nutchan = client.channels.cache.get("715925099307335680");
    let logchan = client.channels.cache.get("597962790220595210");
    let banEmbed = new Discord.MessageEmbed()      //Sends a fancy display of execution information
        .setTitle(`**${banmem.username}** was banned`)
        .setDescription(`__Time:__ ${moment().format(`LT`)}`)
        .setAuthor(banmem.username, banmem.avatarURL())
        .setThumbnail("https://media2.giphy.com/media/WXgtdvFFbAYIU/source.gif")
        .setColor(pink)
    logchan.send(banEmbed);
    nutchan.send(`Banned: ${banmem.tag}\n${moment().format(`LT`)}`)
});
client.on("guildBanRemove", (guild, unbanmem) => {
    let nutchan = client.channels.cache.get("715925099307335680");
    let logchan = client.channels.cache.get("597962790220595210");
    let banEmbed = new Discord.MessageEmbed()      //Sends a fancy display of execution information
        .setTitle(`**${unbanmem.username}** was unbanned`)
        .setDescription(`__Time:__ ${moment().format(`LT`)}`)
        .setAuthor(unbanmem.username, unbanmem.avatarURL())
        .setThumbnail("http://38.media.tumblr.com/d9d99d3b8904a38f8108c7eecec1b766/tumblr_ncvx9wgMLi1se015qo1_500.gif")
        .setColor(pink)
    logchan.send(banEmbed);
    nutchan.send(`Unbanned: ${unbanmem.tag}\n${moment().format(`LT`)}`)
});
client.on("shardDisconnect", event => {
    let dev = client.users.cache.get('250072488929787924')
    client.login(token)
    dev.send("Fix me you fucking nigger before i burn down your jigaboo house down you cotton picking cunt")
})
client.on("error", (err) => {
    let dev = client.users.cache.get('250072488929787924')
    client.login(token)
    dev.send("Fix me you fucking nigger before i burn down your jigaboo house down you cotton picking cunt")
})
client.login(token);        //Token for the bot to use this file