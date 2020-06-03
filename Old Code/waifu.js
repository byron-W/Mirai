const Discord = require("discord.js");
const client = new Discord.Client();
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix;
const pink = config.pink;
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
    console.log("Waifu/Husbando Rolling connected to database");
});

client.on("message", async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server
    const rollchan = msg.guild.channels.cache.find(r => r.name === "waifu-rolling")

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    if (!msg.content.startsWith(prefix)) return;
    let author = msg.author;
    let user = msg.mentions.users.first();

    if ((command === "roll") || (command === "r")) {
        if ((msg.channel.name != "waifu-rolling") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${rollchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Roll a waifu for 5000 coins and claim for free\n${prefix}r`);
        } else {
            con.query(`SELECT * FROM coins WHERE id = '${author.id}'`, (err, rows) => {
                if (err) return msg.channel.send("You're too broke")
                let coins = rows[0].coins;
                if (coins < 5000) return msg.reply("You are too broke to roll")
                con.query(`SELECT * FROM rolltimer WHERE id = "${author.id}"`, (err, rows) => {
                    if (rows.length < 1) return msg.channel.send("Say something so i can recognize you")
                    if (rows[0].lastused != moment().format('k')) con.query(`UPDATE rolltimer SET uses = 0 WHERE id = "${author.id}"`)
                    con.query(`SELECT * FROM rolltimer WHERE id = "${author.id}"`, (err, rows) => {
                        let usedtimes = rows[0].uses;
                        if (usedtimes > 5) return msg.channel.send("You've used up your rolls for the hour")
                        con.query(`SELECT * FROM unclaimed`, (err, rows) => {
                            let numofpeeps = rows.length;
                            con.query(`SELECT * FROM randomroll`, (err, rows) => {
                                const randomid = Math.floor(Math.random() * numofpeeps)
                                if (rows.length < 1) con.query(`INSERT INTO randomroll (number) VALUES (${randomid})`)
                                con.query(`UPDATE randomroll SET number = ${randomid}`)
                                con.query(`SELECT * FROM randomroll`, (err, rows) => {
                                    const claimid = rows[0].number;
                                    con.query(`SELECT * FROM rolltimer WHERE id = "${author.id}"`, (err, rows) => {
                                        let useamt = parseInt(rows[0].uses);
                                        con.query(`UPDATE rolltimer SET uses = ${useamt + 1} WHERE id = "${author.id}"`)
                                        con.query(`SELECT * FROM unclaimed`, (err, rows) => {
                                            if (err) throw err;
                                            try {
                                                con.query(`UPDATE rolltimer SET lastused = "${moment().format(`k`)}" WHERE id = "${author.id}"`)
                                                let anime = rows[claimid].animename;
                                                let name = rows[claimid].name;
                                                let image = rows[claimid].image;
                                                let rollembed = new Discord.MessageEmbed()
                                                    .setTitle(name)
                                                    .setDescription(anime)
                                                    .setImage(image)
                                                    .setColor(0xE06666)
                                                msg.channel.send(rollembed).then(
                                                    // Create the reactionCollector
                                                    m => {
                                                        m.react('💖');
                                                        let filter = (reaction, user) => reaction.emoji.name === '💖' && user.id !== client.user.id;
                                                        let collector = m.createReactionCollector(filter, { time: 15000 });
                                                        collector.on('collect', r => {
                                                            collector.stop();
                                                            m.reactions.cache.clear();
                                                        });
                                                        collector.on('end', collected => {
                                                            if (collected.get('💖')) {
                                                                let userID = collected.get('💖').users.cache.lastKey();
                                                                let claimingUser = collected.get('💖').users.cache.get(userID);
                                                                let claimedEmbed = new Discord.MessageEmbed()
                                                                    .setTitle(name)
                                                                    .setColor(pink)
                                                                    .setDescription(`${anime}\n\nRolled by: ${author.username}`)
                                                                    .setImage(image)
                                                                    .setFooter(`Claimed by ${claimingUser.username}`,
                                                                        claimingUser.avatarURL());
                                                                m.edit(claimedEmbed).then(me => {
                                                                    me.channel.send(`<@${userID}> has claimed ${name} !`);
                                                                })
                                                                let fincoin = coins - 5000;
                                                                con.query(`UPDATE roll SET availability = 'Claimed' WHERE name = "${name}" AND animename = "${anime}"`)
                                                                con.query(`UPDATE roll SET claimedby = '${claimingUser.username}' WHERE name = "${name}" AND animename = "${anime}"`)
                                                                con.query(`DELETE FROM unclaimed WHERE name = "${name}" AND animename = "${anime}"`)
                                                                con.query(`INSERT INTO claimed (name, id) VALUES ("${name}", "${claimingUser.username}") `)
                                                                con.query(`UPDATE coins SET coins = ${fincoin} WHERE id = "${claimingUser.id}"`)
                                                                con.query(`SELECT * FROM coins  WHERE id = "${claimingUser.id}"`, (err, rows) => {
                                                                    if (rows[0].coins != fincoin) con.query(`UPDATE coins SET coins = ${fincoin} WHERE id = "${claimingUser.id}"`)
                                                                })
                                                            }
                                                            m.reactions.cache.clear();
                                                        });
                                                    }
                                                );

                                            } catch (error) {
                                                console.log(error)
                                                return msg.channel.send("Looks like we're out of people to roll")
                                            }
                                        })
                                    });
                                });
                            });

                        });
                    })
                })
            })
        }
    }

    if ((command === "myclaims") || (command === "myc")) {
        if ((msg.channel.name != "waifu-rolling") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${rollchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Display the amount of people a user has\nIf you don't mention a user, then it will show your people\n${prefix}myc or ${prefix}myc <user>`);
        } else if ((user) && (!help)) {
            con.query(`SELECT name FROM claimed WHERE id = "${user.username}"`, (err, rows) => {
                if (err) throw err;
                if (rows.length < 1) return msg.channel.send("That user doesn't have any people")
                try {
                    let JSONrows = JSON.stringify(rows);
                    let parsedRows = JSON.parse(JSONrows);
                    let currentIndex = 0
                    let pagetotal = (Math.floor(parsedRows.length / 10) + 1)
                    function generateEmbed(start) {
                        let current = parsedRows.slice(start, 10 + start)
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`__**${user.username}'s ${parsedRows.length} claims**__`)
                            .setColor(pink)
                            .setThumbnail(parsedRows[start].image)
                            .setFooter(`Page 1/${pagetotal}`)
                        let finrows = '';
                        current.forEach((row) => {
                            finrows += `\n**${row.name}**`;
                        })
                        embed.setDescription(finrows)
                        return embed
                    }
                    msg.channel.send(generateEmbed(0)).then(message => {
                        // exit if there is only one page of guilds (no need for all of this)
                        if (parsedRows.length <= 10) return
                        // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
                        message.react('⬅️')
                        message.react('➡️')
                        const collector = message.createReactionCollector(
                            // only collect left and right arrow reactions from the message author
                            (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === msg.author.id,
                            // time out after a minute
                            { time: 60000 }
                        )
                        collector.on('collect', r => {
                            r.emoji.name === '⬅️' ? currentIndex -= 10 : currentIndex += 10;
                            if (currentIndex < 0) {
                                currentIndex = 0;
                                return;
                            }
                            if (currentIndex > parsedRows.length) {
                                currentIndex -= 10;
                                return;
                            }
                            if (currentIndex === parsedRows.length) return;
                            function generateEmbed2(start) {
                                let current = parsedRows.slice(start, 10 + start)
                                const embed2 = new Discord.MessageEmbed()
                                    .setTitle(`__**${user.username}'s ${parsedRows.length} claims**__`)
                                    .setColor(pink)
                                    .setThumbnail(parsedRows[start].image)
                                    .setFooter(`Page ${(start / 10) + 1}/${pagetotal}`)
                                let finrows = '';
                                current.forEach((row) => {
                                    finrows += `\n**${row.name}**`;
                                })
                                embed2.setDescription(finrows)
                                return embed2
                            }
                            message.reactions.cache.clear();
                            message.edit(generateEmbed2(currentIndex))
                        });
                    })
                } catch (er) {
                    console.log(er)
                    return msg.channel.send("I couldn't find that anime")
                }
            });
        } else if ((!user) && (!help)) {
            con.query(`SELECT name FROM claimed WHERE id = "${author.username}"`, (err, rows) => {
                if (err) throw err;
                if (rows.length < 1) return msg.channel.send("You don't have any people")
                try {
                    let JSONrows = JSON.stringify(rows);
                    let parsedRows = JSON.parse(JSONrows);
                    let currentIndex = 0
                    let pagetotal = (Math.floor(parsedRows.length / 10) + 1)
                    function generateEmbed(start) {
                        let current = parsedRows.slice(start, 10 + start)
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`__**Your ${parsedRows.length} claims**__`)
                            .setColor(pink)
                            .setThumbnail(parsedRows[start].image)
                            .setFooter(`Page 1/${pagetotal}`)
                        let finrows = '';
                        current.forEach((row) => {
                            finrows += `\n**${row.name}**`;
                        })
                        embed.setDescription(finrows)
                        return embed
                    }
                    msg.channel.send(generateEmbed(0)).then(message => {
                        // exit if there is only one page of guilds (no need for all of this)
                        if (parsedRows.length <= 10) return
                        // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
                        message.react('⬅️')
                        message.react('➡️')
                        const collector = message.createReactionCollector(
                            // only collect left and right arrow reactions from the message author
                            (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === msg.author.id,
                            // time out after a minute
                            { time: 60000 }
                        )
                        collector.on('collect', r => {
                            r.emoji.name === '⬅️' ? currentIndex -= 10 : currentIndex += 10;
                            if (currentIndex < 0) {
                                currentIndex = 0;
                                return;
                            }
                            if (currentIndex > parsedRows.length) {
                                currentIndex -= 10;
                                return;
                            }
                            if (currentIndex === parsedRows.length) return;
                            function generateEmbed2(start) {
                                let current = parsedRows.slice(start, 10 + start)
                                const embed2 = new Discord.MessageEmbed()
                                    .setTitle(`__**Your ${parsedRows.length} claims**__`)
                                    .setColor(pink)
                                    .setThumbnail(parsedRows[start].image)
                                    .setFooter(`Page ${(start / 10) + 1}/${pagetotal}`)
                                let finrows = '';
                                current.forEach((row) => {
                                    finrows += `\n**${row.name}**`;
                                })
                                embed2.setDescription(finrows)
                                return embed2
                            }
                            message.reactions.cache.clear();
                            message.edit(generateEmbed2(currentIndex))
                        });
                    })
                } catch (er) {
                    console.log(er)
                    return msg.channel.send("I couldn't find that anime")
                }
            });
        }
    }

    //if ((command === "giveclaim") || (command === "gclaim")) {
    //    let help = msg.content.endsWith("help");
    //    if (help) {     //Explains what the command does
    //        msg.channel.send(`Give a user some coins\n${prefix}givecoins <user> <amount>`);
    //    } else {
    //        con.query(`SELECT * FROM coins WHERE id = "${author.username}"`, (err, rows) => {
    //            if (err) throw err;
    //            if (rows < 1) return msg.channel.send("You broke nigga");
    //            let giveamt = parseInt(args[1]);
    //            let givercoins = rows[0].coins;
    //            if (!user) return msg.channel.send("You didn't menatoin anyone to give coins to")
    //            if (!giveamt) return msg.channel.send("You specify how many coins to give")
    //            con.query(`SELECT * FROM coins WHERE id = "${user.id}"`, (err, rows) => {
    //                if (err) throw err;
    //                let receivecoins = rows[0].coins;
    //                let giverfinal = givercoins - giveamt;
    //                let receiverfinal = giveamt + receivecoins;
    //                con.query(`UPDATE coins SET coins = ${receiverfinal} WHERE id = "${user.id}"`);
    //                con.query(`UPDATE coins SET coins = ${giverfinal} WHERE id = "${author.username}"`);
    //                let cembed = new Discord.MessageEmbed()
    //                    .setAuthor(author.username, author.avatarURL)
    //                    .setColor(darker_green)
    //                    .setTitle(`${author.username} gave ${user.id} ${giveamt} coins`)
    //                msg.channel.send(cembed);
    //            });
    //        });
    //    }
    //}
    if ((command === "addclaim") || (command === "ac")) {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`**This is a moderator only command**\nAdds a person to the roll list\n${prefix}ac name?anime name?image from myanimelist`);
        } else {
            let mod = msg.member.hasPermission("MANAGE_MESSAGES");
            if (!mod) return msg.reply("You are not worthy :smirk:")
            if (!args[0]) return msg.channel.send("You didn't supply a link or name")
            con.query(`SELECT * FROM roll`, (err, rows) => {
                if (err) return msg.channel.send("I couldn't find the table")
                let rollrank = rows.length + 1;
                con.query(`SELECT * FROM unclaimed`, (err, rows) => {
                    //let urank = rows.length + 1
                    const linkargs = msg.content.slice(prefix.length + command.length).trim().split("?")
                    let name = linkargs[0];
                    let anime = linkargs[1];
                    let image = linkargs[2];
                    if ((!name) || (!anime) || (!image)) return msg.channel.send("You didn't supply the right the information")
                    con.query(`INSERT INTO unclaimed (name, animename, availability, image, charid) VALUES("${name}", "${anime}", 'Unclaimed', '${image}', ${rollrank})`, (err, rows) => {
                        if (err) {
                            console.log(err)
                            return msg.channel.send("Error occured (unclaimed)")
                        }
                        con.query(`INSERT INTO roll (name, animename, availability, image, claimedby, charid) VALUES("${name}", "${anime}", "Unclaimed", '${image}', 'None', ${rollrank})`, (err, rows) => {
                            if (err) {
                                console.log(err)
                                return msg.channel.send("Error occured (roll)")
                            }
                            msg.channel.send("Character added")
                        });
                    });
                });
            });
        }
    }
    if ((command === "image") || (command === "im")) {
        if ((msg.channel.name != "waifu-rolling") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${rollchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`**This is a moderator only command**\nAdds a song to the list\n${prefix}im name`);
        } else {
            let name = args.join(" ");
            if (!name) return msg.channel.send("You didn't supply a name")
            con.query(`SELECT * FROM roll WHERE name LIKE "%${name}%"`, (err, rows) => {
                if (err) return msg.channel.send("I couldn't find that person")
                try {
                    let pername = rows[0].name;
                    let aniname = rows[0].animename;
                    let image = rows[0].image;
                    let claim = rows[0].claimedby
                    let imEmbed = new Discord.MessageEmbed()
                        .setTitle(pername)
                        .setColor(0xE06666)
                        .setDescription(aniname)
                        .setImage(image)
                        .setFooter(`Belongs to ${claim}`);
                    msg.channel.send(imEmbed)
                } catch {
                    return msg.channel.send("I couldn't find that person")
                }
            });
        }
    }
    if ((command === "allcharacters") || (command === "allchar")) {
        if ((msg.channel.name != "waifu-rolling") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in the right channel`)
        let help = msg.content.endsWith("help");
        let unclaimed = msg.content.endsWith("unclaimed");
        if (help) {     //Explains what the command does
            msg.channel.send(`Search for characters or anime that's available\n${prefix}allchar <anime name>, ${prefix}allchar unclaimed, ${prefix}allchar`);
        } else {
            let animename = args.join(" ");
            if (!animename) {
                con.query(`SELECT * FROM roll ORDER BY animename`, (err, rows) => {
                    if (err) return msg.channel.send("I couldn't find that anime")
                    try {
                        let JSONrows = JSON.stringify(rows);
                        let parsedRows = JSON.parse(JSONrows);
                        let currentIndex = 0
                        let pagetotal = (Math.floor(parsedRows.length / 10) + 1)
                        function generateEmbed(start) {
                            let current = parsedRows.slice(start, 10 + start)
                            const embed = new Discord.MessageEmbed()
                                .setTitle(`There are a total of ${parsedRows.length} waifus/husbandos`)
                                .setColor(0xE06666)
                                .setThumbnail(parsedRows[start].image)
                                .setFooter(`Page 1/${pagetotal}`)
                            let finrows = '';
                            current.forEach((row) => {
                                finrows += `\n**${row.name}**(*${row.animename}*) - Claimed by: ${row.claimedby}`;
                            })
                            embed.setDescription(finrows)
                            return embed
                        }
                        msg.channel.send(generateEmbed(0)).then(message => {
                            // exit if there is only one page of guilds (no need for all of this)
                            if (parsedRows.length <= 10) return
                            // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
                            message.react('⬅️')
                            message.react('➡️')
                            const collector = message.createReactionCollector(
                                // only collect left and right arrow reactions from the message author
                                (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === msg.author.id,
                                // time out after a minute
                                { time: 60000 }
                            )
                            collector.on('collect', r => {
                                r.emoji.name === '⬅️' ? currentIndex -= 10 : currentIndex += 10;
                                if (currentIndex < 0) {
                                    currentIndex = 0;
                                    return;
                                }
                                if (currentIndex > parsedRows.length) {
                                    currentIndex -= 10;
                                    return;
                                }
                                if (currentIndex === parsedRows.length) return;
                                function generateEmbed2(start) {
                                    let current = parsedRows.slice(start, 10 + start)
                                    const embed2 = new Discord.MessageEmbed()
                                        .setTitle(`There are a total of ${parsedRows.length} waifus/husbandos`)
                                        .setColor(0xE06666)
                                        .setThumbnail(parsedRows[start].image)
                                        .setFooter(`Page ${(start / 10) + 1}/${pagetotal}`)
                                    let finrows = '';
                                    current.forEach((row) => {
                                        finrows += `\n**${row.name}**(*${row.animename}*) - Claimed by: ${row.claimedby}`;
                                    })
                                    embed2.setDescription(finrows)
                                    return embed2
                                }
                                message.reactions.cache.clear();
                                message.edit(generateEmbed2(currentIndex))
                            });
                        })
                    } catch (er) {
                        console.log(er)
                        return msg.channel.send("I couldn't find that anime")
                    }
                });
            } else if ((!help) && (!unclaimed)) {
                con.query(`SELECT * FROM roll WHERE animename LIKE "%${animename}%" ORDER BY name`, (err, rows) => {
                    if (err) return msg.channel.send("I couldn't find that anime")
                    try {
                        let JSONrows = JSON.stringify(rows);
                        let parsedRows = JSON.parse(JSONrows);
                        let currentIndex = 0
                        let pagetotal = (Math.floor(parsedRows.length / 10) + 1)
                        let aniname = rows[0].animename;
                        function generateEmbed(start) {
                            let current = parsedRows.slice(start, 10 + start)
                            const embed = new Discord.MessageEmbed()
                                .setTitle(`${aniname} has ${parsedRows.length} waifus/husbandos`)
                                .setColor(0xE06666)
                                .setThumbnail(parsedRows[start].image)
                                .setFooter(`Page 1/${pagetotal}`)
                            let finrows = '';
                            current.forEach((row) => {
                                finrows += `\n**${row.name}** - Claimed by: ${row.claimedby}`;
                            })
                            embed.setDescription(finrows)
                            return embed
                        }
                        msg.channel.send(generateEmbed(0)).then(message => {
                            // exit if there is only one page of guilds (no need for all of this)
                            if (parsedRows.length <= 10) return
                            // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
                            message.react('⬅️')
                            message.react('➡️')
                            const collector = message.createReactionCollector(
                                // only collect left and right arrow reactions from the message author
                                (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === msg.author.id,
                                // time out after a minute
                                { time: 60000 }
                            )
                            collector.on('collect', r => {
                                r.emoji.name === '⬅️' ? currentIndex -= 10 : currentIndex += 10;
                                if (currentIndex < 0) {
                                    currentIndex = 0;
                                    return;
                                }
                                if (currentIndex > parsedRows.length) {
                                    currentIndex -= 10;
                                    return;
                                }
                                if (currentIndex === parsedRows.length) return;
                                function generateEmbed2(start) {
                                    let current = parsedRows.slice(start, 10 + start)
                                    const embed2 = new Discord.MessageEmbed()
                                        .setTitle(`${aniname} has ${parsedRows.length} waifus/husbandos`)
                                        .setColor(0xE06666)
                                        .setThumbnail(parsedRows[start].image)
                                        .setFooter(`Page ${(start / 10) + 1}/${pagetotal}`)
                                    let finrows = '';
                                    current.forEach((row) => {
                                        finrows += `\n**${row.name}** - Claimed by: ${row.claimedby}`;
                                    })
                                    embed.setDescription(finrows)
                                    return embed2
                                }
                                message.reactions.cache.clear();
                                message.edit(generateEmbed2(currentIndex))
                            });
                        })
                    } catch (er) {
                        console.log(er)
                        return msg.channel.send("I couldn't find that anime")
                    }
                });
            } if (unclaimed) {
                con.query(`SELECT * FROM unclaimed ORDER BY animename`, (err, rows) => {
                    if (err) return msg.channel.send("I couldn't find that anime")
                    try {
                        let JSONrows = JSON.stringify(rows);
                        let parsedRows = JSON.parse(JSONrows);
                        let currentIndex = 0
                        let pagetotal = (Math.floor(parsedRows.length / 10) + 1)
                        function generateEmbed(start) {
                            let current = parsedRows.slice(start, 10 + start)
                            const embed = new Discord.MessageEmbed()
                                .setTitle(`There are a total of ${parsedRows.length} unclaimed waifus/husbandos`)
                                .setColor(0xE06666)
                                .setThumbnail(parsedRows[start].image)
                                .setFooter(`Page 1/${pagetotal}`)
                            let finrows = '';
                            current.forEach((row) => {
                                finrows += `\n**${row.name}** - (*${row.animename}*)`;
                            })
                            embed.setDescription(finrows)
                            return embed
                        }
                        msg.channel.send(generateEmbed(0)).then(message => {
                            // exit if there is only one page of guilds (no need for all of this)
                            if (parsedRows.length <= 10) return
                            // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
                            message.react('⬅️')
                            message.react('➡️')
                            const collector = message.createReactionCollector(
                                // only collect left and right arrow reactions from the message author
                                (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === msg.author.id,
                                // time out after a minute
                                { time: 60000 }
                            )
                            collector.on('collect', r => {
                                r.emoji.name === '⬅️' ? currentIndex -= 10 : currentIndex += 10;
                                if (currentIndex < 0) {
                                    currentIndex = 0;
                                    return;
                                }
                                if (currentIndex > parsedRows.length) {
                                    currentIndex -= 10;
                                    return;
                                }
                                if (currentIndex === parsedRows.length) return;
                                function generateEmbed2(start) {
                                    let current = parsedRows.slice(start, 10 + start)
                                    const embed2 = new Discord.MessageEmbed()
                                        .setTitle(`There are a total of ${parsedRows.length} unclaimed waifus/husbandos`)
                                        .setColor(0xE06666)
                                        .setThumbnail(parsedRows[start].image)
                                        .setFooter(`Page ${(start / 10) + 1}/${pagetotal}`)
                                    let finrows = '';
                                    current.forEach((row) => {
                                        finrows += `\n**${row.name}** - (*${row.animename}*)`;
                                    })
                                    embed2.setDescription(finrows)
                                    return embed2
                                }
                                message.reactions.cache.clear();
                                message.edit(generateEmbed2(currentIndex))
                            });
                        })
                    } catch (er) {
                        console.log(er)
                        return msg.channel.send("I couldn't find that anime")
                    }
                });
            }
        }
    }
    if (command === "divorce") {
        if ((msg.channel.name != "waifu-rolling") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${rollchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Remove one of your claims\n${prefix}divorce <person name>`);
        } else {
            let character = args.join(" ");
            if (!character) return msg.channel.send("You've gotta give me a claim to divorce");
            con.query(`SELECT * FROM claimed WHERE name LIKE "%${character}%" AND id LIKE "${author.username}"`, (err, rows) => {
                if (rows.length < 1) {
                    return msg.channel.send("You don't have that character");
                } else {
                    con.query(`DELETE FROM claimed WHERE name LIKE "%${character}%" AND id LIKE "${author.username}"`);
                    con.query(`SELECT * FROM roll WHERE name = "%${character}%"`, (err, rows) => {
                        let anime = rows[0].animename
                        con.query(`UPDATE roll SET availability = 'Unclaimed' WHERE name LIKE "%${character}%"`)
                        con.query(`UPDATE roll SET claimedby = 'None' WHERE name LIKE "%${character}%"`)
                        con.query(`INSERT INTO unclaimed (name, animename, availability) VALUES ("${character}", "${anime}", 'Unclaimed')`)
                        msg.channel.send("Divorce Successful");
                    });
                }
            });
        }
    }
    if (command === "resetclaim") {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`**This is a moderator only command**\nReset ALL the claims for everyone\n${prefix}resetclaim`);
        } else {
            let admin = msg.member.hasPermission("ADMINISTRATOR");
            if (!admin) return msg.reply("You are not worthy :smirk:")
            con.query(`DELETE FROM claimed`);
            con.query(`DELETE FROM unclaimed`);
            con.query(`UPDATE roll SET availability = 'Unclaimed'`)
            con.query(`UPDATE roll SET claimedby = 'None'`)
            con.query(`INSERT INTO unclaimed SELECT * FROM roll WHERE availability = 'Unclaimed';`)
            msg.channel.send("The claims have been reset")
        }
    }
    if (command === "trade") {
        if ((msg.channel.name != "waifu-rolling") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${rollchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Offer a waifu in exchange for one of theirs\n${prefix}trade <user>?<waifu of your choice>`);
        } else {
            const tradeargs = msg.content.slice(prefix.length + command.length).trim().split("?")
            let tradewaifu = tradeargs[1];
            if (!tradewaifu) return msg.channel.send("You didn't say who you wanted to trade")
            if (!user) return msg.channel.send("You didn't mention a user to trade with")
            con.query(`SELECT * FROM trading`, (err, rows) => {
                if (rows.length > 0) return msg.channel.send("There is an active trading event")
                con.query(`SELECT * FROM claimed WHERE id = "${author.username}" AND name LIKE "%${tradewaifu}%"`, (err, rows) => {
                    if (rows.length < 1) return msg.channel.send("You don't have that waifu")
                    let tradeoffer = rows[0].name;
                    con.query(`SELECT * FROM claimed WHERE id = "${user.username}"`, (err, rows) => {
                        if (rows.length < 1) return msg.channel.send("That user doesn't have any waifus")
                        con.query(`INSERT INTO trading (id, waifu) VALUES ("${author.username}", "${tradeoffer}")`)
                        con.query(`INSERT INTO trading (id, waifu) VALUES ("${user.username}", 'Undecided')`)
                        msg.channel.send(`<@${user.username}>, choose who you'd like to trade back with\nUse ${prefix}tradeback <waifu of your choice>`)
                    });
                })
            });
        }
    }
    if (command === "tradeback") {
        if ((msg.channel.name != "waifu-rolling") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${rollchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Present your offer to the one given to you\nUse ${prefix}endtrade to stop the trading event\n${prefix}tradeback <Waifu of your choice>`);
        } else {
            con.query(`SELECT * FROM trading WHERE id = "${author.username}"`, (err, rows) => {
                if (rows.length < 1) return msg.channel.send("You aren't in the current trading event")
                if (rows[0].id === `${author.id}`) return msg.channel.send("You aren't the person who is supposed to trade back")
                let tradewaifu = args.join(" ");
                if (!tradewaifu) return msg.channel.send("You didn't say who you wanted to trade")
                con.query(`SELECT * FROM claimed WHERE id = "${author.username}" AND name LIKE "%${tradewaifu}%"`, (err, rows) => {
                    if (rows.length < 1) return msg.channel.send("You don't have that waifu")
                    let tradeback = rows[0].name;
                    con.query(`UPDATE trading SET waifu = "${tradeback}" WHERE id = "${author.username}"`)
                    con.query(`SELECT * FROM trading`, (err, rows) => {
                        let ogtrader = rows[0].id
                        let ogoffer = rows[0].waifu;
                        msg.channel.send(`${ogtrader}, do you accept the offer of **${ogoffer}** for **${tradeback}**?\nUse ${prefix}accept or ${prefix}decline`)
                    })
                })
            })
        }
    }
    if (command === "accept") {
        if ((msg.channel.name != "waifu-rolling") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${rollchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Accept the offer given to you\nCan only be used if you initiated the trade\n${prefix}accept`);
        } else {
            con.query(`SELECT * FROM trading`, (err, rows) => {
                if (rows.length < 1) return msg.channel.send("There ins't an active trading event")
                let ogtrader = rows[0].id;
                let ogoffer = rows[0].waifu;
                let recip = rows[1].id;
                let recipoffer = rows[1].waifu;
                if (ogtrader != author.id) return msg.channel.send("You aren't the original trader")
                con.query(`UPDATE claimed SET name = "${recipoffer}" WHERE name = "${ogoffer}" AND id = "${ogtrader}"`)
                con.query(`UPDATE claimed SET name = "${ogoffer}" WHERE name = "${recipoffer}" AND id = "${recip}"`)
                con.query(`UPDATE roll SET claimedby = "${recip}" WHERE name = "${ogoffer}" AND claimedby = "${ogtrader}"`)
                con.query(`UPDATE roll SET claimedby = "${ogtrader}" WHERE name = "${recipoffer}" AND claimedby = "${recip}"`)
                con.query(`DELETE FROM trading`)
                msg.channel.send(`Trading successful!\n__${ogtrader}__ traded their **${ogoffer}** for __${recip}'s__ **${recipoffer}**`)
            });
        }
    }
    if (command === "decline") {
        if ((msg.channel.name != "waifu-rolling") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${rollchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Decline the offer given to you\nCan only be used if you initiated the trade\n${prefix}decline`);
        } else {
            con.query(`SELECT * FROM trading`, (err, rows) => {
                if (rows.length < 1) return msg.channel.send("There isn't an active trading event")
                let ogtrader = rows[0].id;
                let recip = rows[1].id;
                if (ogtrader != author.id) return msg.channel.send("You aren't the original trader")
                con.query(`DELETE FROM trading`)
                msg.channel.send(`Trading cancelled\n__${ogtrader}__ declined __${recip}'s__ offer`)
            });
        }
    }
    if (command === "endtrade") {
        if ((msg.channel.name != "waifu-rolling") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${rollchan}`)
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`End the current trading event if you are in it\n${prefix}endtrade`);
        } else {
            con.query(`SELECT * FROM trading`, (err, rows) => {
                if (rows.length < 1) return msg.channel.send("There isn't an active trading event")
                let ogtrader = rows[0].id;
                let recip = rows[1].id;
                if ((ogtrader != author.id) && (recip != author.id) && (author.id != '250072488929787924')) return msg.channel.send("You aren't one of the people trading")
                con.query(`DELETE FROM trading`)
                msg.channel.send(`The trading was called off`)
            });
        }
    }
});
client.login(token)