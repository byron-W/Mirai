const ytdl = require("ytdl-core");
const streamOptions = { seek: 0, volume: 0.5 };

module.exports = {
    name: 'bigbruh',
    description: 'For bigger bruh moments',
    usage: '',
    cooldown: 5,
    class: 'fun',
    args: false,
    execute(msg, args, con, linkargs, client) {
        msg.channel.send(`These bruh levels have never been reached before`, { files: ["./Reactions/big bruh.gif"] });
        let VoiceChannel = msg.guild.channels.cache.find(m => m.name === "Cool People Chat");       //Finds the voice channel for music
        if (!VoiceChannel) return msg.channel.send("Rip Cool People Chat")
        try {
            client.voice.joinChannel(VoiceChannel)     //Joins the voice chat
                .then(connection => {
                    const stream = ytdl("https://www.youtube.com/watch?v=4XkN3SA_q1c", { filter: 'audioonly', quality: 'highestaudio' });
                    connection.play(stream, streamOptions)
                        .on("error", err => {
                            console.log(err)
                            return msg.channel.send("Bruh moment")
                        })
                        .on("finish", () => {
                            connection.disconnect();
                        })
                });
        } catch (error) {
            console.log(error);
            return msg.channel.send("Sorry I couldn't join the voice chat :(")
        }
    },
}