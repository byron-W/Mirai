const ytdl = require("ytdl-core");
const streamOptions = { seek: 0, volume: 0.5 };

module.exports = {
    name: 'stop',
    description: 'Stop all games and vibe in the voice channel',
    usage: '',
    cooldown: 10,
    class: 'vc',
    args: false,
    execute(msg, args, con) {
        let clientVoiceConnection = msg.guild.voice.connection;
        if (!clientVoiceConnection) return msg.channel.send(`I have to be in a voice channel to stop the games`)
        clientVoiceConnection.dispatcher.end();
        const stream = ytdl("https://www.youtube.com/watch?v=-lGFpyuuchg", { filter: 'audioonly', quality: 'highestaudio' });
        clientVoiceConnection.play(stream, streamOptions)     //Plays the song
            .on("error", error => {
                console.log(error)
                msg.channel.send("[Chinese Rap](https://www.youtube.com/watch?v=-lGFpyuuchg)")
                return msg.channel.send("Error ocurred in playing intermission song")
            });
        con.query(`UPDATE randomsong SET activity = "Inactive"`)
        clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
        msg.channel.send("Games stopped");
    },
}