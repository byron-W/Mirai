const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const streamOptions = { begin: 0 };
const { red } = require("../config.json");

module.exports = {
    name: 'answer',
    description: `Give up and reveal the answer`,
    usage: '',
    cooldown: 2,
    class: 'vc',
    args: false,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let clientVoiceConnection = msg.guild.voice.connection;
            if (!clientVoiceConnection) return msg.channel.send(`I'm not in a voice channel`)
            con.query(`SELECT * FROM randomsong WHERE id = ${0} AND activity = "Active"`, (err, rows) => {
                if (err) return msg.channel.send("Time's up!")
                if (rows.length < 1) return msg.channel.send("Time's up!");
                if (!rows[0].gametype) return msg.channel.send("Time's up!");
                if ((rows[0].gametype != "OP") && (rows[0].gametype != "ED") && (rows[0].gametype != "OST")) return msg.channel.send("Time's up!");
                const songid = rows[0].number;
                if (rows[0].gametype === "OP") {
                    con.query(`SELECT * FROM opsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                        let song = rows[0].songlink;
                        let songname = rows[0].songname;
                        let altname = rows[0].altname;
                        try {
                            clientVoiceConnection.dispatcher.end()
                            let endembed = new Discord.MessageEmbed()
                                .setTitle(`Aww looks like everyone gave up\nNo one wins this round :(`)
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
                        let altname = rows[0].altname;
                        try {
                            clientVoiceConnection.dispatcher.end()
                            let endembed = new Discord.MessageEmbed()
                                .setTitle(`Aww looks like everyone gave up\nNo one wins this round :(`)
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
                            return catchErr(err, msg, `${module.exports.name}.js`, "Dev");
                        }
                    });
                } if (rows[0].gametype === "OST") {
                    con.query(`SELECT * FROM ostsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                        let song = rows[0].songlink;
                        let songname = rows[0].songname;
                        let altname = rows[0].altname;
                        try {
                            clientVoiceConnection.dispatcher.end()
                            let endembed = new Discord.MessageEmbed()
                                .setTitle(`Aww looks like everyone gave up\nNo one wins this round :(`)
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