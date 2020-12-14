const ytdl = require("ytdl-core");
const streamOptions = { begin: 0 };

module.exports = {
    name: 'bruh',
    description: 'For bruh moments',
    usage: '',
    cooldown: 5,
    class: 'fun',
    args: false,
    execute(msg, args, con, linkargs, client, catchErr) {
        msg.channel.send(`Mrs. Obama, I'd like to report a bruh moment`, { files: ["./Reactions/bruh.gif"] });
        let VoiceChannel = msg.guild.channels.cache.find(m => m.name === "Cool People Chat");       //Finds the voice channel for music
        if (!VoiceChannel) return msg.channel.send("Rip Cool People Chat")
        try {
            client.voice.joinChannel(VoiceChannel)     //Joins the voice chat
                .then(connection => {
                    const stream = ytdl("https://www.youtube.com/watch?v=2ZIpFytCSVc&ab_channel=JameBenedict", { filter: format => format.container === 'mp4', quality: 'highestaudio' });
                    connection.play(stream, streamOptions)
                        .on("error", err => {
                            return catchErr(err, msg, `${module.exports.name}.js`, "Bruh Moment")
                        })
                        .on("finish", () => {
                            connection.disconnect();
                        })
                });
        } catch (error) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Sorry I couldn't join the voice chat :(")
        }
    },
}