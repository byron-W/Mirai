const ytdl = require("ytdl-core");
const streamOptions = { begin: 0 };

module.exports = {
    name: 'stop',
    description: 'Stop all games and vibe in the voice channel',
    usage: '',
    cooldown: 10,
    class: 'vc',
    args: false,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let clientVoiceConnection = msg.guild.voice.connection;
            if (!clientVoiceConnection) return msg.channel.send(`I have to be in a voice channel to stop the games`)
            clientVoiceConnection.dispatcher.end();
            let random = Math.floor(Math.random() * 2) + 1;
            if (random === 1) {
                const stream = ytdl("https://www.youtube.com/watch?v=-lGFpyuuchg", { filter: format => format.container === 'mp4', quality: 'highestaudio' });
                clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                    .on("error", err => {
                        catchErr(err, msg, `${module.exports.name}.js`, "There isn't a song playing");
                        return;
                    });
                con.query(`UPDATE randomsong SET activity = "Inactive"`)
                clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                msg.channel.send("Games stopped");
            } if (random === 2) {
                const stream = ytdl("https://www.youtube.com/watch?v=01yGLd6Fu14", { filter: format => format.container === 'mp4', quality: 'highestaudio' });
                clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                    .on("error", err => {
                        catchErr(err, msg, `${module.exports.name}.js`, "There isn't a song playing");
                        return;
                    });
                con.query(`UPDATE randomsong SET activity = "Inactive"`)
                clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                msg.channel.send("Games stopped");
            }
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Error ocurred in playing intermission song")
        }
    },
}