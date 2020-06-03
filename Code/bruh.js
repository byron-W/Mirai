const ytdl = require("ytdl-core");
const streamOptions = { seek: 0, volume: 0.5 };

module.exports = {
    name: 'bruh',
    description: 'For bruh moments',
    usage: '',
    cooldown: 5,
    class: 'fun',
    args: false,
    execute(msg, args, con, linkargs, client) {
        msg.channel.send(`Mrs. Obama, I'd like to report a bruh moment`, { files: ["./Reactions/bruh.gif"] });
        let VoiceChannel = msg.guild.channels.cache.find(m => m.name === "Cool People Chat");       //Finds the voice channel for music
        if (!VoiceChannel) return msg.channel.send("Rip Cool People Chat")
        try {
            client.voice.joinChannel(VoiceChannel)     //Joins the voice chat
                .then(connection => {
                    const stream = ytdl("https://www.youtube.com/watch?v=2ZIpFytCSVc", { filter: 'audioonly', quality: 'highestaudio' });
                    connection.play(stream, streamOptions)
                        .on("error", err => {
                            console.log(err)
                            return msg.channel.send("Bigger bruh moment")
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