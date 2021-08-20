const ytdl = require("ytdl-core");
const streamOptions = { begin: 0 };

module.exports = {
    name: 'restart',
    description: `Restart the song that's playing`,
    usage: '',
    cooldown: 3,
    class: 'moderation',
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
                        if (rows.length < 1) {
                            return msg.channel.send("I couldn't find any OP songs")
                        }
                        let song = rows[0].songlink;
                        const stream = ytdl("https://www.youtube.com/watch?v=" + song, { filter: format => format.container === 'mp4', quality: 'highestaudio' });
                        clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                            .on("error", err => {
                                msg.channel.send(rows[0].songlink)
                                msg.channel.send(rows[0].songid)
                                return catchErr(err, msg, `${module.exports.name}.js`, "Error ocurred in restarting song")
                            });
                        clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        msg.channel.send("The game has officially started, again");
                        msg.channel.send(songid)
                    });
                } if (rows[0].gametype === "ED") {
                    con.query(`SELECT * FROM edsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                        if (rows.length < 1) {
                            return msg.channel.send("I couldn't find any ED songs")
                        }
                        let song = rows[0].songlink;
                        const stream = ytdl("https://www.youtube.com/watch?v=" + song, { filter: format => format.container === 'mp4', quality: 'highestaudio' });
                        clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                            .on("error", err => {
                                msg.channel.send(rows[0].songlink)
                                msg.channel.send(rows[0].songid)
                                return catchErr(err, msg, `${module.exports.name}.js`, "Error ocurred in restarting song")
                            });
                        clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        msg.channel.send("The game has officially started, again");
                        msg.channel.send(songid)
                    });
                } if (rows[0].gametype === "OST") {
                    con.query(`SELECT * FROM ostsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                        if (rows.length < 1) {
                            return msg.channel.send("I couldn't find any OST songs")
                        }
                        let song = rows[0].songlink;
                        const stream = ytdl("https://www.youtube.com/watch?v=" + song, { filter: format => format.container === 'mp4', quality: 'highestaudio' });
                        clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                            .on("error", err => {
                                msg.channel.send(rows[0].songlink)
                                msg.channel.send(rows[0].songid)
                                return catchErr(err, msg, `${module.exports.name}.js`, "Error ocurred in restarting song")
                            });
                        clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        msg.channel.send("The game has officially started, again");
                        msg.channel.send(songid)
                    });
                }
            });
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}