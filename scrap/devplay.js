const ytdl = require("ytdl-core");
const streamOptions = { begin: 0 };

module.exports = {
    name: 'devplay',
    description: 'Test a song from the database',
    usage: '<table> | <devsong>',
    cooldown: 10,
    class: 'devcmd',
    args: true,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let clientVoiceConnection = msg.guild.voice.connection;
            if (!clientVoiceConnection) return msg.channel.send(`I'm not in a voice channel`)
            let table = linkargs[0].toLowerCase();
            let devsong = parseInt(linkargs[1]);
            if ((!devsong) || (!table)) return msg.channel.send("You didn't supply a song ID or a table")
            con.query(`SELECT * FROM ${table} WHERE songid = ${devsong}`, (err, rows) => {
                if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                if (rows.length < 1) {
                    return msg.channel.send("I couldn't find any songs")
                }
                try {
                    let song = rows[0].songlink;
                    const stream = ytdl("https://youtube.com/watch?v=" + song, { filter: format => format.container === 'mp4', quality: 'highestaudio' });
                    clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                        .on("error", err => {
                            msg.channel.send(rows[0].songlink)
                            msg.channel.send(rows[0].songid)
                            return catchErr(err, msg, `${module.exports.name}.js`, "Error ocurred in playing anime song")
                        });
                    clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                    msg.channel.send("Song started\n" + "https://youtube.com/watch?v=" + song);
                } catch (err) {
                    msg.channel.send(rows[0].songlink)
                    msg.channel.send(rows[0].songid)
                    return catchErr(err, msg, `${module.exports.name}.js`, "Error ocurred in playing anime song")
                }
            });
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}