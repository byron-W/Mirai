const ytdl = require("ytdl-core");
const streamOptions = { seek: 0, volume: 0.5 };

module.exports = {
    name: 'restart',
    description: `Restart the song that's playing`,
    usage: '',
    cooldown: 3,
    class: 'moderation',
    args: false,
    execute(msg, args, con) {
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
                    if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                    if (rows.length < 1) {
                        return msg.channel.send("I couldn't find any OP songs")
                    }
                    try {
                        let song = rows[0].songlink;
                        const stream = ytdl("https://www.youtube.com/watch?v=" + song, { filter: 'audioonly', quality: 'highestaudio' });
                        clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                            .on("error", error => {
                                console.log(rows[0].songid)
                                console.log(rows[0].songlink)
                                msg.channel.send(rows[0].songlink)
                                msg.channel.send(rows[0].songid)
                                console.log(error)
                                return msg.channel.send("Error ocurred in playing song")
                            });
                        clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        msg.channel.send("The game has officially started, again");
                        msg.channel.send(songid)
                    } catch (er) {
                        console.log(er)
                        console.log(rows[0].songlink)
                        console.log(rows[0].songid)
                        msg.channel.send(rows[0].songlink)
                        msg.channel.send(rows[0].songid)
                        return msg.channel.send("Sorry I got a bad video")
                    }
                });
            } if (rows[0].gametype === "ED") {
                con.query(`SELECT * FROM edsongs WHERE songid = ${songid}`, (err, rows) => {
                    if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                    if (rows.length < 1) {
                        return msg.channel.send("I couldn't find any ED songs")
                    }
                    try {
                        let song = rows[0].songlink;
                        const stream = ytdl("https://www.youtube.com/watch?v=" + song, { filter: 'audioonly', quality: 'highestaudio' });
                        clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                            .on("error", error => {
                                console.log(rows[0].songid)
                                console.log(rows[0].songlink)
                                msg.channel.send(rows[0].songlink)
                                msg.channel.send(rows[0].songid)
                                console.log(error)
                                return msg.channel.send("Error ocurred in playing song")
                            });
                        clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        msg.channel.send("The game has officially started, again");
                        msg.channel.send(songid)
                    } catch (er) {
                        console.log(er)
                        console.log(rows[0].songlink)
                        console.log(rows[0].songid)
                        msg.channel.send(rows[0].songlink)
                        msg.channel.send(rows[0].songid)
                        return msg.channel.send("Sorry I got a bad video")
                    }
                });
            } if (rows[0].gametype === "OST") {
                con.query(`SELECT * FROM ostsongs WHERE songid = ${songid}`, (err, rows) => {
                    if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                    if (rows.length < 1) {
                        return msg.channel.send("I couldn't find any OST songs")
                    }
                    try {
                        let song = rows[0].songlink;
                        const stream = ytdl("https://www.youtube.com/watch?v=" + song, { filter: 'audioonly', quality: 'highestaudio' });
                        clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                            .on("error", error => {
                                console.log(rows[0].songid)
                                console.log(rows[0].songlink)
                                msg.channel.send(rows[0].songlink)
                                msg.channel.send(rows[0].songid)
                                console.log(error)
                                return msg.channel.send("Error ocurred in playing song")
                            });
                        clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        msg.channel.send("The game has officially started, again");
                        msg.channel.send(songid)
                    } catch (er) {
                        console.log(er)
                        console.log(rows[0].songlink)
                        console.log(rows[0].songid)
                        msg.channel.send(rows[0].songlink)
                        msg.channel.send(rows[0].songid)
                        return msg.channel.send("Sorry I got a bad video")
                    }
                });
            }
        });
    },
}