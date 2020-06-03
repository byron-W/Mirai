const ytdl = require("ytdl-core");
const streamOptions = { seek: 0, volume: 0.5 };

module.exports = {
    name: 'opgame',
    description: 'Play an anime opening and try to guess it',
    usage: '',
    cooldown: 5,
    class: 'vc',
    args: false,
    execute(msg, args, con) {
        try {
            if (!msg.guild.voice.connection) return msg.channel.send(`I'm not in a voice channel`)
            let clientVoiceConnection = msg.guild.voice.connection;
            con.query(`SELECT * FROM randomsong WHERE id = ${0} AND (gametype = "ED" OR gametype = "OST")`, (err, rows) => {
                if ((rows[0].activity === "Active") || (rows[1].activity === "Active")) return msg.channel.send(`You aren't playing the OP game right now, use ${prefix}stop to stop all games`);
                con.query(`SELECT * FROM opsongs`, (err, rows) => {
                    let numofsongs = rows.length;
                    con.query(`SELECT * FROM randomsong WHERE gametype = "OP"`, (err, rows) => {
                        const getrand = (songs, list) => {
                            const rand = Math.floor(Math.random() * numofsongs) + 1;
                            return list.includes(rand) ? getrand(songs, list) : rand;
                        }
                        let randomid = getrand(numofsongs, [rows[0].number, rows[1].number, rows[2].number, rows[3].number, rows[4].number])
                        con.query(`UPDATE randomsong SET number = ${rows[3].number} WHERE id = ${4} AND gametype = "OP"`)
                        con.query(`UPDATE randomsong SET number = ${rows[2].number} WHERE id = ${3} AND gametype = "OP"`)
                        con.query(`UPDATE randomsong SET number = ${rows[1].number} WHERE id = ${2} AND gametype = "OP"`)
                        con.query(`UPDATE randomsong SET number = ${rows[0].number} WHERE id = ${1} AND gametype = "OP"`)
                        con.query(`UPDATE randomsong SET number = ${randomid} WHERE id = ${0} AND gametype = "OP"`)
                        con.query(`SELECT * FROM randomsong WHERE id = ${0}  AND gametype = "OP"`, (err, rows) => {
                            const songid = rows[0].number;
                            con.query(`SELECT * FROM opsongs WHERE songid = ${songid}`, (err, rows) => {
                                if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                                if (rows.length < 1) {
                                    return msg.channel.send("I couldn't find any songs")
                                }
                                try {
                                    let song = rows[0].songlink;
                                    let finallink = ("https://youtube.com/watch?v=" + song)
                                    const stream = ytdl(finallink, { filter: 'audioonly', quality: 'highestaudio' });
                                    clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                                        .on("error", error => {
                                            console.log(rows[0].songid)
                                            console.log(rows[0].songlink)
                                            msg.channel.send(rows[0].songlink)
                                            msg.channel.send(rows[0].songid)
                                            console.log(error)
                                            return msg.channel.send("Error ocurred in playing OP song")
                                        })
                                        .on("finish", () => {
                                            con.query(`UPDATE randomsong SET activity = "Inactive"`)
                                        })
                                    con.query(`UPDATE randomsong SET activity = "Active" WHERE id = ${0} AND gametype = "OP"`)
                                    clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                                    msg.channel.send("The game has officially started!");
                                } catch {
                                    console.log(rows[0].songid)
                                    console.log(rows[0].songlink)
                                    msg.channel.send(rows[0].songlink)
                                    msg.channel.send(rows[0].songid)
                                    console.log(error)
                                    return msg.channel.send("Sorry I got a bad video")
                                }
                            });
                        });
                    });
                });
            });
        } catch {
            return msg.channel.send(`I'm not in a voice channel`)
        }
    },
}