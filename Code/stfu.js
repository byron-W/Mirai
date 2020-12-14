const ytdl = require("ytdl-core");
const streamOptions = { seek: 0, volume: 0.5 };

module.exports = {
    name: 'stfu',
    description: 'Some people need to hear this',
    usage: '',
    cooldown: 5,
    class: 'fun',
    args: false,
    execute(msg, args, con, linkargs, client, catchErr) {
        let user = msg.mentions.members.first();
        let botmen = msg.mentions.has(client.user);
        if ((user) && (!botmen)) {
            msg.channel.send(`${user.user}, please just shut the fuck up`, { files: ["./Reactions/stfu.gif"] });
        } if (botmen) {
            msg.reply(`I know you're not talking to me nigga`, { files: ["./Reactions/stfu.gif"] });
        }
        if (!user) {
            msg.channel.send(`Honestly bro, breathing is an option for you rn`, { files: ["./Reactions/stfu.gif"] });
        }
        let VoiceChannel = msg.guild.channels.cache.find(m => m.name === "Cool People Chat");       //Finds the voice channel for music
        if (!VoiceChannel) return msg.channel.send("Rip Cool People Chat")
        try {
            client.voice.joinChannel(VoiceChannel)     //Joins the voice chat
                .then(connection => {
                    const stream = ytdl("https://www.youtube.com/watch?v=4U7_Sfqwdl8", { filter: format => format.container === 'mp4', quality: 'highestaudio' });
                    connection.play(stream, streamOptions)
                        .on("error", err => {
                            return catchErr(err, msg, `${module.exports.name}.js`, "Oh lawd im dead")
                        })
                        .on("finish", () => {
                            connection.disconnect();
                        })
                });
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Sorry I couldn't join the voice chat :(")
        }
    },
}