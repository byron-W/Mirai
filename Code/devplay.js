const ytdl = require("ytdl-core");
const streamOptions = { seek: 0, volume: 0.5 };

module.exports = {
    name: 'devplay',
    description: 'Test a song from the database',
    usage: '<table> | <devsong>',
    cooldown: 10,
    class: 'devcmd',
    args: false,
    execute(msg, args, con, linkargs) {
        let clientVoiceConnection = msg.guild.voice.connection;
        if (!clientVoiceConnection) return msg.channel.send(`I'm not in a voice channel`)
        let table = linkargs[0].toLowerCase();
        let devsong = parseInt(linkargs[1]);
        if ((!devsong) || (!table)) return msg.channel.send("You didn't supply a song ID or a table")
        con.query(`SELECT * FROM ${table} WHERE songid = ${devsong}`, (err, rows) => {
            if (err) return msg.channel.send(`Error occured in query for songid #${devsong} in ${table}`)
            if (rows.length < 1) {
                return msg.channel.send("I couldn't find any songs")
            }
            try {
                clientVoiceConnection.dispatcher.end();
                let song = rows[0].songlink;
                let finallink = ("https://youtube.com/watch?v=" + song)
                msg.channel.send(finallink);
                const stream = ytdl(finallink, { filter: 'audioonly', quality: 'highestaudio' });
                clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                    .on("error", error => {
                        console.log(rows[0].songid)
                        console.log(rows[0].songlink)
                        msg.channel.send(rows[0].songlink)
                        msg.channel.send(rows[0].songid)
                        console.log(error)
                        return msg.channel.send("Error ocurred in playing OP song")
                    });
                clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                msg.channel.send("Song started");
            } catch (error) {
                console.log(rows[0].songid)
                console.log(rows[0].songlink)
                msg.channel.send(rows[0].songlink)
                msg.channel.send(rows[0].songid)
                console.log(error)
                return msg.channel.send("Sorry I got a bad video")
            }
        });
    },
}