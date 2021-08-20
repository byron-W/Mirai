const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const streamOptions = { begin: 0 };
const { red } = require("../config.json");

module.exports = {
    name: 'guess',
    description: `Guess the anime song that's playing`,
    usage: '<anime name>',
    cooldown: 2,
    class: 'vc',
    args: true,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let clientVoiceConnection = msg.guild.voice.connection;
            if (!clientVoiceConnection) return msg.channel.send(`I'm not in a voice channel`)
            con.query(`SELECT * FROM randomsong WHERE id = ${0} AND activity = "Active"`, (err, rows) => {
                if (err) return msg.channel.send("Time's up!")
                if (rows.length < 1) return msg.channel.send("Time's up!");
                if (!rows[0].gametype) return msg.channel.send("Time's up!");
                if ((rows[0].gametype != "OP") && (rows[0].gametype != "ED") && (rows[0].gametype != "OST")) return msg.channel.send("Time's up!");
                const guess = args.join(" ").toLowerCase();
                const songid = rows[0].number;
                if (rows[0].gametype === "OP") {
                    con.query(`SELECT * FROM opsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                        let song = rows[0].songlink;
                        let songname = rows[0].songname;
                        let altname = rows[0].altname
                        let ansname = rows[0].ansname;
                        let ansaltname = rows[0].ansaltname;
                        if (guess != ansname) {
                            if (guess != ansaltname) return msg.channel.send("Sorry but you're incorrect. Try again!")
                        }
                        try {
                            clientVoiceConnection.dispatcher.end()
                            con.query(`SELECT * FROM coins WHERE id = '${msg.author.id}'`, (err, rows) => {
                                let coins = rows[0].coins
                                let newamt = coins + 2000;
                                con.query(`UPDATE coins SET coins = ${newamt} WHERE id = '${msg.author.id}'`)
                            });
                            let endembed = new Discord.MessageEmbed()
                                .setTitle(`${msg.author.username} is correct and gains 2000 coins!`)
                            if (songname === altname) {
                                endembed.setDescription(`The answer was ${songname}`)
                            } else {
                                endembed.setDescription(`The answer was ${songname}/${altname}`)
                            }
                            endembed.setColor(red)
                            endembed.setAuthor(msg.author.username, msg.author.avatarURL())
                            con.query(`UPDATE randomsong SET activity = "Inactive" WHERE gametype = "OP"`)
                            msg.channel.send("https://www.youtube.com/watch?v=" + song);
                            msg.channel.send(endembed);
                            const stream = ytdl("https://www.youtube.com/watch?v=cARXjGO_-lMcARXjGO_-lM", { filter: format => format.container === 'mp4', quality: 'highestaudio' });
                            clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                                .on("error", err => {
                                    return catchErr(err, msg, `${module.exports.name}.js`, "Error ocurred in playing intermission song")
                                });
                            clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        } catch (err) {
                            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                        }
                    });
                } if (rows[0].gametype === "ED") {
                    con.query(`SELECT * FROM edsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                        let song = rows[0].songlink;
                        let songname = rows[0].songname;
                        let altname = rows[0].altname
                        let ansname = rows[0].ansname;
                        let ansaltname = rows[0].ansaltname;
                        if (guess != ansname) {
                            if (guess != ansaltname) return msg.channel.send("Sorry but you're incorrect. Try again!")
                        }
                        try {
                            clientVoiceConnection.dispatcher.end()
                            con.query(`SELECT * FROM coins WHERE id = '${msg.author.id}'`, (err, rows) => {
                                let coins = rows[0].coins
                                let newamt = coins + 4000;
                                con.query(`UPDATE coins SET coins = ${newamt} WHERE id = '${msg.author.id}'`)
                            });
                            let endembed = new Discord.MessageEmbed()
                                .setTitle(`${msg.author.username} is correct and gains 4000 coins!`)
                            if (songname === altname) {
                                endembed.setDescription(`The answer was ${songname}`)
                            } else {
                                endembed.setDescription(`The answer was ${songname}/${altname}`)
                            }
                            endembed.setColor(red)
                            endembed.setAuthor(msg.author.username, msg.author.avatarURL())
                            con.query(`UPDATE randomsong SET activity = "Inactive" WHERE gametype = "ED"`)
                            msg.channel.send("https://www.youtube.com/watch?v=" + song);
                            msg.channel.send(endembed);
                            const stream = ytdl("https://www.youtube.com/watch?v=G3jIu65Fgq4", { filter: format => format.container === 'mp4', quality: 'highestaudio' });
                            clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                                .on("error", err => {
                                    return catchErr(err, msg, `${module.exports.name}.js`, "Error ocurred in playing intermission song")
                                });
                            clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        } catch (err) {
                            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                        }
                    });
                } if (rows[0].gametype === "OST") {
                    con.query(`SELECT * FROM ostsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                        let song = rows[0].songlink;
                        let songname = rows[0].songname;
                        let altname = rows[0].altname
                        let ansname = rows[0].ansname;
                        let ansaltname = rows[0].ansaltname;
                        if (guess != ansname) {
                            if (guess != ansaltname) return msg.channel.send("Sorry but you're incorrect. Try again!")
                        }
                        try {
                            clientVoiceConnection.dispatcher.end()
                            con.query(`SELECT * FROM coins WHERE id = '${msg.author.id}'`, (err, rows) => {
                                let coins = rows[0].coins
                                let newamt = coins + 6000;
                                con.query(`UPDATE coins SET coins = ${newamt} WHERE id = '${msg.author.id}'`)
                            });
                            let endembed = new Discord.MessageEmbed()
                                .setTitle(`${msg.author.username} is correct and gains 6000 coins!`)
                            if (songname === altname) {
                                endembed.setDescription(`The answer was ${songname}`)
                            } else {
                                endembed.setDescription(`The answer was ${songname}/${altname}`)
                            }
                            endembed.setColor(red)
                            endembed.setAuthor(msg.author.username, msg.author.avatarURL())
                            con.query(`UPDATE randomsong SET activity = "Inactive" WHERE gametype = "OST"`)
                            msg.channel.send("https://www.youtube.com/watch?v=" + song);
                            msg.channel.send(endembed);
                            const stream = ytdl("https://www.youtube.com/watch?v=ukLMmpoq15Q", { filter: format => format.container === 'mp4', quality: 'highestaudio' });
                            clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                                .on("error", err => {
                                    return catchErr(err, msg, `${module.exports.name}.js`, "Error ocurred in playing intermission song")
                                });
                            clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        } catch (err) {
                            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                        }
                    });
                }
            });
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}