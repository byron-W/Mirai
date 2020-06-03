const ytdl = require("ytdl-core");
const streamOptions = { seek: 0, volume: 0.5 };

module.exports = {
    name: 'join',
    description: 'Join the voice chat and get ready to start a game',
    usage: '',
    cooldown: 10,
    class: 'vc',
    args: false,
    execute(msg, args, con) {
        let vcconnect = msg.member.voice.channel
        try {
            vcconnect.join()     //Joins the voice chat
                .then(connection => {
                    const stream = ytdl("https://www.youtube.com/watch?v=o0MQ3OJKKe4", { filter: 'audioonly', quality: 'highestaudio' });
                    connection.play(stream, streamOptions)     //Plays the song
                        .on("error", error => {
                            console.log(error)
                            msg.channel.send(`[Hot Nigga - Gay Parody](https://www.youtube.com/watch?v=o0MQ3OJKKe4)`)
                            return msg.channel.send("Error ocurred in playing intermission song")
                        })
                    con.query(`UPDATE randomsong SET activity = "Inactive"`)
                    connection.dispatcher.setBitrate(connection.channel.bitrate)
                    msg.channel.send("I'm ready to play!");
                })
        } catch (error) {
            console.log(error);
            return msg.channel.send("Sorry I couldn't join the voice chat :(")
        }
    },
}