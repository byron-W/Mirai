const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const fs = require("fs");
const { token, sqlpass } = require("./token.json");
const { prefix, pink, lavender, crimson, green, devid, big_nut } = require("./config.json");
const moment = require("moment")
const mysql = require("mysql");
const wait = require('util').promisify(setTimeout);
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
function catchErr(err, message, file, sendb) {
    const bruh = new Date(Date.now())
    if (err.sql) {
        fs.appendFile(`./Logs/Error/${bruh.getMonth() + 1}_${bruh.getDate()}_${bruh.getFullYear()}.txt`, `\n\n----------${bruh.toTimeString().slice(0, 8)}----------\n${file}\n${err.sql}\n${err.sqlMessage}\n\n#${message.channel.name}\n@${message.author.username}\n${message.author.id}`, (err) => {
            if (err) throw err;
        });
        let dev = client.users.cache.get('250072488929787924')
        let errembed = new Discord.MessageEmbed()
            .setTitle(`${bruh.toTimeString().slice(0, 8)} @ ${file}`)
            .setDescription(`\`${err.sql}\n${err.sqlMessage}\`\n\n#${message.channel.name}\n<@${message.author.id}>`)
            .setThumbnail("https://i.pinimg.com/originals/e6/a8/44/e6a8448e291d3f3b4d4842fda7ba3c52.jpg")
            .setColor(green)
        dev.send(errembed)
        if (sendb === "None") return;
        else if (sendb === "Dev") return message.channel.send(`Oops something went wrong on our end! Contact the developer for assistance\n<@${devid}>`)
        else return message.channel.send(sendb)
    } else { //Not a MySQL problem
        fs.appendFile(`./Logs/Error/${bruh.getMonth() + 1}_${bruh.getDate()}_${bruh.getFullYear()}.txt`, `\n\n----------${bruh.toTimeString().slice(0, 8)}----------\n${file}\n${err.name}\n${err.message}\n${err.stack}\n\n#${message.channel.name}\n@${message.author.username}\n${message.author.id}`, (err) => {
            if (err) throw ezrr;
        });
        let dev = client.users.cache.get('250072488929787924')
        let errembed = new Discord.MessageEmbed()
            .setTitle(`${bruh.toTimeString().slice(0, 8)} @ ${file}`)
            .setDescription(`\`${err.message}\n${err.stack}\`\n\n#${message.channel.name}\n<@${message.author.id}>`)
            .setThumbnail("https://i.pinimg.com/originals/e6/a8/44/e6a8448e291d3f3b4d4842fda7ba3c52.jpg")
            .setColor(crimson)
        dev.send(errembed)
        if (sendb === "None") return;
        else if (sendb === "Dev") return message.channel.send(`Oops something went wrong on our end! Contact the developer for assistance\n<@${devid}>`)
        else return message.channel.send(sendb)
    }
}
client.on("ready", () => {
    console.log(`${client.user.username} is now online`);
    client.user.setActivity("with your no-no zone :)", { type: "PLAYING" });     //Sets what the bot is doing
    wait(1000)
    client.guilds.cache.get('463777968146219008').fetchInvites().then(g => {
        let allinv = g.array()
        allinv.forEach((inv) => {
            con.query(`SELECT * FROM invites`, (err, rows) => {
                if (err) throw err;
                let JSONrows = JSON.stringify(rows);
                let parsedRows = JSON.parse(JSONrows);
                let coderow = parsedRows.map(b => b.code)
                if (coderow.includes(inv.code)) return;
                con.query(`INSERT INTO invites (code, uses, creatorid, creatoruser) VALUES ("${inv.code}", ${inv.uses}, ${inv.inviter.id}, "${inv.inviter.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}")`, (err) => {
                    if (err) return con.query(`INSERT INTO invites (code, uses, creatorid, creatoruser) VALUES ("${inv.code}", ${inv.uses}, ${inv.inviter.id}, "Stupid Name")`)
                })
            })
        })
    })
    //let iconlist = [
    //    'https://media2.giphy.com/media/TvmbZRpwDoTny/giphy.gif?cid=ecf05e475c688e4c7a0eca5fd569da07b9a8793cce6d71ae&rid=giphy.gif',
    //    'https://media1.giphy.com/media/hhsVCAsdv9eUM/giphy.gif?cid=ecf05e475c688e4c7a0eca5fd569da07b9a8793cce6d71ae&rid=giphy.gif',
    //    'https://media1.tenor.com/images/a5ce987663179da8933e5aee8fa2021c/tenor.gif?itemid=11949656',
    //    'https://media.tenor.com/images/38010c62316700913444983d380ebade/tenor.gif'
    //];
    //setInterval(() => {
    //    const index = Math.floor(Math.random() * (iconlist.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
    //    client.guilds.cache.get('572127244655394836').setIcon(iconlist[index])
    //}, 10000); // Runs this every 10 seconds.
});
function generateCoins() {
    return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
}
client.on("message", async msg => {
    try {
        let author = msg.author;
        if (author.bot) return;     //Doesn't let the bot respond to itself

        let noemoji = msg.author.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
        con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
            if (msg.author.id == '857061924034314261') return;
            try {
                if (err) return msg.channel.send(`${author.username}, I cannot give you coins due to emojis or other weird characters in your username\nPlease change it to stop recieving this message and to recieve coins`)
                if (msg.content.startsWith(prefix)) return;
                if (rows.length < 1) {
                    con.query(`INSERT INTO coins (id, coins, bank, total, username) VALUES ("${author.id}", ${generateCoins()}, 0, ${generateCoins()}, "${noemoji}")`)
                } else {
                    let coins = rows[0].coins;
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
            if (msg.author.id == '857061924034314261') return;
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
        setInterval(() => {
            con.query(`UPDATE dailytimer SET lastclaimed = 'Unclaimed'`)
            con.query(`UPDATE robtimer SET lastused = 'Unused'`)
            con.query(`UPDATE deposittimer SET lastused = 'Unused'`)
            con.query(`UPDATE withdrawtimer SET lastused = 'Unused'`)
            con.query(`UPDATE rolltimer SET uses = 0`)
        }, 3600000)
        const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
        const commandName = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed
        const linkargs = msg.content.slice(prefix.length + commandName.length).trim().split(" | ");
        let message = msg.content.toLowerCase();
        if ((message === "gn") || (message === "goodnight") || (message === "good night")) {
            if (author.id === devid) return msg.channel.send(`*goodnight* :heart: :sleeping:`, { files: ["./reactions/sleeping.gif"] });
        }
        if ((message === "gm") || (message === "goodmorning") || (message === "good morning")) {
            if (author.id === devid) return msg.channel.send(`*goodmorning* :heart: :blush:`, { files: ["./reactions/waking.gif"] });
        }
        if ((message === "potato") || (message === "beans")) {
            msg.channel.send(`:potato:`, { files: ["./reactions/potato.jpg"] });
        }
        if (message === "kuriyama7867:(") {
            msg.reply("I am off").then(() => {
                client.destroy();
            })
        }
        if (message === "uwu") msg.channel.send("you're a bitch")
        if (message === "hey") {
            msg.channel.messages.fetchPinned({ limit: 100 })
                .then(fetched => {
                    let pinarray = fetched.array();
                    const ranpin = Math.floor(Math.random() * pinarray.length);
                    let pinmsg = pinarray[ranpin].content;
                    if (pinarray[ranpin].attachments.size > 0) {
                        let img = '';
                        pinarray[ranpin].attachments.forEach((row) => {
                            img += `\n${row.url}`;
                        })
                        try {
                            msg.channel.send(pinmsg)
                            msg.channel.send(img);
                        } catch {
                            msg.channel.send(img);
                        }
                    } else {
                        msg.channel.send(pinmsg);
                    }
                })
        }
        let steparray = ['BRANDON HAS A MANGINA', 'IM GONNA ROLL YOU INTO A LITTLE BALL AND PUT YOU UP MY VAGINA']
        if ((message === "stepbro") || (message === "step bro")) {
            const ranpin = Math.floor(Math.random() * steparray.length);
            msg.channel.send(steparray[ranpin])
        }
        let sonicarray = ['SONIC FEET AND BDSM', 'COCK RING', 'WHITE PRIVILLEGE', 'MIXED RACE COUPLE', 'FURRY COUPLE', 'THEY BOMBED THE FURRY', 'FURRY BROMANCE', 'Uh oh stinky', 'SSB SONIC', 'SON OF THE UGH', 'SONIC ABDUCTION', 'MUSHROOM PLANET', 'DR EGGNUTS', 'FLOSSING', 'ROCKONASANCE', 'SEX ATTIC', 'OLIVE GARDEN GIFT CARD', 'SONIC GOT THE YEEZYS', 'SONIC SEX']
        if (message === "sonic") {
            const ranpin = Math.floor(Math.random() * sonicarray.length);
            msg.channel.send(sonicarray[ranpin])
        }
        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (msg.channel.type === 'dm') {
            if (msg.author.bot == true) return;
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
        if ((command.class === "admin") && (!msg.member.hasPermission("ADMINISTRATOR"))) return msg.channel.send("You are not worthy :pensive:");
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
            command.execute(msg, args, con, linkargs, client, catchErr, devid);
        } catch (error) {
            return catchErr(error, msg, "mirai.js", "Main file error");
        }
    } catch (error) {
        return catchErr(error, msg, "mirai.js", "Main file error");
    }
})
client.on("guildMemberAdd", async (newmem) => {
    const bruh = new Date(Date.now())
    const genchan = client.channels.cache.get("722982530470379550");
    const nutchan = client.channels.cache.get("715925099307335680");
    const welchan = client.channels.cache.get("464172724181270549");
    console.log(newmem.guild.id)
    if (newmem.guild.id !== big_nut) return;
    if (newmem.user.bot) {
        newmem.roles.add("Bots")
        let newbotmsg = new Discord.MessageEmbed()
            .setTitle("A new bot has been added")
            .setAuthor(newmem.user.tag, newmem.user.avatarURL())
            .setThumbnail("https://i.pinimg.com/originals/f6/30/fb/f630fbf31454641d95317c9862d38a9d.gif")
            .setColor(pink)
            .setTimestamp();
        let newbotlog = new Discord.MessageEmbed()
            .setTitle("A new bot has been added")
            .setAuthor(newmem.user.tag, newmem.user.avatarURL())
            .setColor(pink)
            .setThumbnail("https://media3.giphy.com/media/EOHqVt2BTTvCU/source.gif")
            .setTimestamp();
        genchan.send(newbotmsg)
        welchan.send(newbotlog)
    } if (!newmem.user.bot) {
        function findCommonElement(array1, array2) {
            // Loop for array1 
            for (let i = 0; i < array1.length; i++) {
                // Loop for array2 
                for (let j = 0; j < array2.length; j++) {
                    if ((array1[i].uses !== array2[j].uses) && (array1[i].code === array2[j].code)) {
                        // Return if common element found 
                        return array1[i].code;
                    }
                }
            }
            let welcomelog = new Discord.MessageEmbed()
                .setAuthor(newmem.user.tag, newmem.user.avatarURL())
                .setTitle(`${newmem.user.username} has joined the server`)
                .setThumbnail("https://media3.giphy.com/media/EOHqVt2BTTvCU/source.gif")
                .setColor(pink)
                .setTimestamp();
            let welcomemsg = new Discord.MessageEmbed()
                .setAuthor(newmem.user.tag, newmem.user.avatarURL())
                .setDescription(`-Read the rules in ${client.channels.cache.get('463806957875363841')}\n-Use ${prefix}help for assistance with any bots\n-Contact an admin if you're having problems`)
                .setThumbnail("https://i.pinimg.com/originals/f6/30/fb/f630fbf31454641d95317c9862d38a9d.gif")
                .setColor(pink)
                .setTimestamp();
            welchan.send(welcomelog)
            genchan.send(welcomemsg)
            return;
        }
        con.query(`SELECT * FROM invites`, (err, rows) => {
            let JSONrows = JSON.stringify(rows);
            let parsedRows = JSON.parse(JSONrows);
            newmem.guild.fetchInvites().then(g => {
                let allinv = g.array()
                let invmatch = findCommonElement(parsedRows, allinv)
                if (!invmatch) return msg.channel.send("Oh lawd, byron is gay")
                let finalinv = allinv.find(n => n.code === invmatch)
                let welcomelog = new Discord.MessageEmbed()
                    .setAuthor(newmem.user.tag, newmem.user.avatarURL())
                    .setTitle(`${newmem.user.username} has joined the server`)
                    .setThumbnail("https://media3.giphy.com/media/EOHqVt2BTTvCU/source.gif")
                    .setDescription(`Invite code: ${finalinv.code}\nCreator: ${finalinv.inviter.username}\nUses: ${finalinv.uses}`)
                    .setColor(pink)
                    .setTimestamp();
                let welcomemsg = new Discord.MessageEmbed()
                    .setAuthor(newmem.user.tag, newmem.user.avatarURL())
                    .setDescription(`-Read the rules in ${client.channels.cache.get('463806957875363841')}\n-Use ${prefix}help for assistance with any bots\n-Contact an admin if you're having problems`)
                    .setThumbnail("https://i.pinimg.com/originals/f6/30/fb/f630fbf31454641d95317c9862d38a9d.gif")
                    .setColor(pink)
                    .setTimestamp();
                welchan.send(welcomelog)
                genchan.send(`Welcome to Big Nut, <@${newmem.id}>`);
                genchan.send(welcomemsg);
                nutchan.send(`Joined: ${newmem.user.tag}\n${bruh.toDateString()}\n${bruh.toLocaleTimeString()}`)
                con.query(`UPDATE invites SET uses = ${finalinv.uses} WHERE code = "${finalinv.code}"`)
            })
        })
        con.query(`SELECT id FROM banlist`, (err, rows) => {
            let JSONrows = JSON.stringify(rows);
            let parsedRows = JSON.parse(JSONrows);
            let idmap = parsedRows.map(n => n.id)
            if (idmap.includes(newmem.id)) {
                genchan.send(`${newmem}, you have a minute to say why you're here before you get banned`)
                setTimeout(async () => {
                    newmem.send(`Your time is up, DM Godly_Otaku#6676 to get unbanned`)
                    await newmem.ban({
                        reason: "Not welcome in our server",
                    }).catch(err => {
                        console.error(err);
                        return msg.channel.send("I don't have the permissions to ban them");
                    });
                }, 60000);
            }
        })
    }
});
client.on("guildMemberRemove", (leavemem) => {
    const bruh = new Date(Date.now())
    const nutchan = client.channels.cache.get("715925099307335680");
    const welchan = client.channels.cache.get("464172724181270549");
    const server = client.guilds.cache.get("463777968146219008")
    console.log(leavemem.guild.id)
    if (leavemem.guild.id != big_nut) return;
    try {
        let memberbanned = server.fetchBan(leavemem.user).catch((err) => {
            let leavemsg = new Discord.MessageEmbed()
                .setAuthor(leavemem.user.tag, leavemem.user.avatarURL())
                .setTitle(`**${leavemem.user.username}** left the server`)
                .setThumbnail("https://data.whicdn.com/images/205213419/superthumb.jpg?t=1445706119")
                .setColor(pink)
                .setTimestamp();
            welchan.send(leavemsg);
            nutchan.send(`Left: ${leavemem.user.tag}\n${bruh.toDateString()}\n${bruh.toLocaleTimeString()}`)
        })
        if (memberbanned) return;
    }
    catch {
        let leavemsg = new Discord.MessageEmbed()
            .setAuthor(leavemem.user.tag, leavemem.user.avatarURL())
            .setTitle(`**${leavemem.user.username}** left the server`)
            .setThumbnail("https://data.whicdn.com/images/205213419/superthumb.jpg?t=1445706119")
            .setFooter("Mans got banned")
            .setColor(pink)
            .setTimestamp();
        welchan.send(leavemsg);
        nutchan.send(`Banned: ${leavemem.user.tag}\n${bruh.toDateString()}\n${bruh.toLocaleTimeString()}`)
    }
});
client.on("messageDelete", async oldmsg => {
    if (oldmsg.author.bot == true) return;
    if (oldmsg.guild.id != big_nut) return;
    if (oldmsg.channel.id === "597962790220595210") return;
    const logchan = client.channels.cache.get("597962790220595210");
    const nutchan = client.channels.cache.get("715925099307335680");

    if (oldmsg.attachments.size > 0) {
        let oldimg = '';
        oldmsg.attachments.forEach((row) => {
            oldimg += `\n${row.proxyURL}`;
        })
        try {
            let delmsg = new Discord.MessageEmbed()
                .setAuthor(oldmsg.author.username, oldmsg.author.avatarURL())
                .setTitle(`**${oldmsg.author.username}'s** message was deleted`)
                .setThumbnail("https://66.media.tumblr.com/7faf76a655814723d93f17aac4223adc/tumblr_p67vmb88qf1wctgsho1_250.jpg")
                .setColor(pink)
                .setDescription(`__Message:__ ${oldmsg.content}\n__Channel:__ ${oldmsg.channel.name}`)
                .setTimestamp();
            logchan.send(delmsg);
            logchan.send(oldimg);
            nutchan.send(delmsg);
            nutchan.send(oldimg);
        } catch {
            let delmsg = new Discord.MessageEmbed()
                .setAuthor(oldmsg.author.username, oldmsg.author.avatarURL())
                .setTitle(`**${oldmsg.author.username}'s** message was deleted`)
                .setThumbnail("https://66.media.tumblr.com/7faf76a655814723d93f17aac4223adc/tumblr_p67vmb88qf1wctgsho1_250.jpg")
                .setColor(pink)
                .setDescription(`__Channel:__ ${oldmsg.channel.name}`)
                .setTimestamp()
            logchan.send(delmsg);
            logchan.send(oldimg);
            nutchan.send(delmsg);
            nutchan.send(oldimg);
        }
    } else {
        let delmsg = new Discord.MessageEmbed()
            .setAuthor(oldmsg.author.username, oldmsg.author.avatarURL())
            .setTitle(`**${oldmsg.author.username}'s** message was deleted`)
            .setThumbnail("https://66.media.tumblr.com/7faf76a655814723d93f17aac4223adc/tumblr_p67vmb88qf1wctgsho1_250.jpg")
            .setColor(pink)
            .setDescription(`__Message:__ ${oldmsg.content}\n__Channel:__ ${oldmsg.channel.name}`)
            .setTimestamp()
        logchan.send(delmsg);
        nutchan.send(delmsg);
    }
});
client.on("guildBanAdd", (guild, banmem) => {
    const bruh = new Date(Date.now())
    const logchan = client.channels.cache.get("597962790220595210");
    const nutchan = client.channels.cache.get("715925099307335680");
    if (guild.id != "463777968146219008") return;
    let banEmbed = new Discord.MessageEmbed()      //Sends a fancy display of execution information
        .setTitle(`**${banmem.username}** was banned`)
        .setAuthor(banmem.username, banmem.avatarURL())
        .setThumbnail("https://media2.giphy.com/media/WXgtdvFFbAYIU/source.gif")
        .setTimestamp()
        .setColor(pink)
    logchan.send(banEmbed);
    nutchan.send(`Banned: ${banmem.tag}\n${bruh.toDateString()}\n${bruh.toLocaleTimeString()}`)
});
client.on("guildBanRemove", (guild, unbanmem) => {
    const bruh = new Date(Date.now())
    const logchan = client.channels.cache.get("597962790220595210");
    const nutchan = client.channels.cache.get("715925099307335680");
    if (guild.id != "463777968146219008") return;
    let banEmbed = new Discord.MessageEmbed()      //Sends a fancy display of execution information
        .setTitle(`**${unbanmem.username}** was unbanned`)
        .setAuthor(unbanmem.username, unbanmem.avatarURL())
        .setThumbnail("http://38.media.tumblr.com/d9d99d3b8904a38f8108c7eecec1b766/tumblr_ncvx9wgMLi1se015qo1_500.gif")
        .setColor(pink)
        .setTimestamp()
    logchan.send(banEmbed);
    nutchan.send(`Unbanned: ${unbanmem.tag}\n${bruh.toDateString()}\n${bruh.toLocaleTimeString()}`)
});
client.on("inviteCreate", inv => {
    const nutchan = client.channels.cache.get("715925099307335680");
    let invembed = new Discord.MessageEmbed()
        .setTitle(`${inv.inviter.username} created an invite`)
        .setAuthor(inv.inviter.tag, inv.inviter.avatarURL())
        .setColor(lavender)
        .setDescription(`Code: ${inv.code}\nUses: ${inv.maxUses}\nExpires: ${inv.expiresAt}\nChannel: ${inv.channel}`)
    nutchan.send(invembed)
    con.query(`INSERT INTO invites (code, uses, creatorid, creatoruser) VALUES ("${inv.code}", ${inv.uses}, ${inv.inviter.id}, "${inv.inviter.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}")`, (err) => {
        if (err) return con.query(`INSERT INTO invites (code, uses, creatorid, creatoruser) VALUES ("${inv.code}", ${inv.uses}, ${inv.inviter.id}, "Stupid Name")`)
    })
})
client.on("inviteDelete", inv => {
    con.query(`SELECT * FROM invites WHERE code = "${inv.code}"`, (err, rows) => {
        const nutchan = client.channels.cache.get("715925099307335680");
        let invembed = new Discord.MessageEmbed()
            .setTitle(`${rows[0].creatoruser}'s invite was deleted`)
            .setColor(lavender)
            .setDescription(`Code: ${inv.code}\nUses: ${inv.maxUses}\nChannel: ${inv.channel}`)
        nutchan.send(invembed)
        con.query(`DELETE FROM invites WHERE code = "${inv.code}"`)
    })

})
client.on("debug", deb => {
    const bruh = new Date(Date.now())
    fs.appendFile(`./Logs/Debug/${bruh.getMonth() + 1}_${bruh.getDate()}_${bruh.getFullYear()}--Debug.txt`, `\n\n----------${bruh.toTimeString().slice(0, 8)}----------\n${deb}`, (err) => {
        if (err) throw err;
    });
})
client.login(token);        //Token for the bot to use this filefilefile