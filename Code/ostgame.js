const ytdl = require("ytdl-core");
const streamOptions = { begin: 0 };

module.exports = {
    name: 'ostgame',
    description: 'Play an anime original soundtrack and try to guess it',
    usage: '',
    cooldown: 5,
    class: 'vc',
    args: false,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            if (!msg.guild.voice.connection) return msg.channel.send(`I'm not in a voice channel`)
            let clientVoiceConnection = msg.guild.voice.connection;
            con.query(`SELECT * FROM randomsong WHERE id = ${0} AND (gametype = "OP" OR gametype = "ED")`, (err, rows) => {
                if ((rows[0].activity === "Active") || (rows[1].activity === "Active")) return msg.channel.send(`You aren't playing the OST game right now, use ${prefix}gtop to stop all games`);
                con.query(`SELECT * FROM ostsongs`, (err, rows) => {
                    let numofsongs = rows.length;
                    con.query(`SELECT * FROM randomsong WHERE gametype = "OST"`, (err, rows) => {
                        const getrand = (songs, list) => {
                            const rand = Math.floor(Math.random() * numofsongs) + 1;
                            return list.includes(rand) ? getrand(songs, list) : rand;
                        }
                        let randomid = getrand(numofsongs, [rows[0].number, rows[1].number, rows[2].number, rows[3].number, rows[4].number])
                        con.query(`UPDATE randomsong SET number = ${rows[3].number} WHERE id = ${4} AND gametype = "OST"`)
                        con.query(`UPDATE randomsong SET number = ${rows[2].number} WHERE id = ${3} AND gametype = "OST"`)
                        con.query(`UPDATE randomsong SET number = ${rows[1].number} WHERE id = ${2} AND gametype = "OST"`)
                        con.query(`UPDATE randomsong SET number = ${rows[0].number} WHERE id = ${1} AND gametype = "OST"`)
                        con.query(`UPDATE randomsong SET number = ${randomid} WHERE id = ${0} AND gametype = "OST"`)
                        con.query(`SELECT * FROM randomsong WHERE id = ${0} AND gametype = "OST"`, (err, rows) => {
                            const songid = rows[0].number;
                            con.query(`SELECT * FROM ostsongs WHERE songid = ${songid}`, (err, rows) => {
                                if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                                if (rows.length < 1) {
                                    return msg.channel.send("I couldn't find any songs")
                                }
                                try {
                                    let song = rows[0].songlink;
                                    const stream = ytdl("https://www.youtube.com/watch?v=" + song, { filter: format => format.container === 'mp4', quality: 'highestaudio' });
                                    clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                                        .on("error", err => {
                                            msg.channel.send(rows[0].songlink)
                                            msg.channel.send(rows[0].songid)
                                            return catchErr(err, msg, `${module.exports.name}.js`, "Error ocurred in playing OST song")
                                        })
                                        .on("finish", () => {
                                            con.query(`UPDATE randomsong SET activity = "Inactive"`)
                                        })
                                    con.query(`UPDATE randomsong SET activity = "Active" WHERE id = ${0} AND gametype = "OST"`)
                                    clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                                    msg.channel.send("The game has officially started!");
                                } catch {
                                    msg.channel.send(rows[0].songlink)
                                    msg.channel.send(rows[0].songid)
                                    return catchErr(err, msg, `${module.exports.name}.js`, "Error ocurred in playing OST song")
                                }
                            });
                        });
                    });
                });
            });
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}