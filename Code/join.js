const ytdl = require("ytdl-core");
const streamOptions = { begin: 0 };

module.exports = {
    name: 'join',
    description: 'Join the voice chat and get ready to start a game',
    usage: '',
    cooldown: 10,
    class: 'vc',
    args: false,
    execute(msg, args, con, linkargs, client, catchErr) {
        let vcconnect = msg.member.voice.channel
        try {
            vcconnect.join()     //Joins the voice chat
                .then(connection => {
                    let random = Math.floor(Math.random() * 2) + 1;
                    if (random === 1) {
                        const stream = ytdl("https://www.youtube.com/watch?v=dSdWL3LqZto", { filter: format => format.container === 'mp4', quality: 'highestaudio' });
                        connection.play(stream, streamOptions)     //Plays the song
                            .on("error", err => {
                                return catchErr(err, msg, `${module.exports.name}.js`, "Error ocurred in playing intermission song")
                            })
                        con.query(`UPDATE randomsong SET activity = "Inactive"`)
                        connection.dispatcher.setBitrate(connection.channel.bitrate)
                        msg.channel.send("I'm ready to play!");
                    }
                    if (random === 2) {
                        const stream = ytdl("https://www.youtube.com/watch?v=i9AT3jjAP0Y", { filter: format => format.container === 'mp4', quality: 'highestaudio' });
                        connection.play(stream, streamOptions)     //Plays the song
                            .on("error", err => {
                                return catchErr(err, msg, `${module.exports.name}.js`, "Error ocurred in playing intermission song")
                            })
                        con.query(`UPDATE randomsong SET activity = "Inactive"`)
                        connection.dispatcher.setBitrate(connection.channel.bitrate)
                        msg.channel.send("I'm ready to play!");
                    }
                })
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Sorry I couldn't join the voice chat :(")
        }
    },
}