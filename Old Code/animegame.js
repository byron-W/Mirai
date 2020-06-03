const Discord = require("discord.js");
const client = new Discord.Client();
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix;
const red = config.red
const mysql = require("mysql");
const sqlpass = tokenfile.sqlpass;
const ytdl = require("ytdl-core");
const streamOptions = { seek: 0, volume: 0.5 };

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: sqlpass,
    database: "petuniabase",
    flags: '-SESSION_TRACK'
});
con.connect(err => {
    if (err) throw err;
    console.log("Anime Guessing connected to database");
});
client.on("message", async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server
    const anichan = msg.guild.channels.cache.find(r => r.name === "anime-games")

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    if (!msg.content.startsWith(prefix)) return;
    if (command === "join") {       //Shows how to run the command
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Can only be used while in a voice channel\nGet ready to start the game\n${prefix}join`);
        } else {        //If the user isn't asking for help
            if ((msg.channel.name != "anime-games") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${anichan}`)
            const vcconnect = msg.member.voice.channel
            if (!vcconnect) return msg.channel.send("You must be in a voice channel to use this command")
            try {
                vcconnect.join()     //Joins the voice chat
                    .then(connection => {
                        const stream = ytdl("https://www.youtube.com/watch?v=o0MQ3OJKKe4", { filter: 'audioonly', quality: 'highestaudio' });
                        connection.play(stream, streamOptions)     //Plays the song
                            .on("error", error => {
                                console.log(error)
                                msg.channel.send(`[Hot Nigga - Gay Parody](https://www.youtube.com/watch?v=o0MQ3OJKKe4)`)
                                return msg.channel.send("Error ocurred in playing intermission song")
                            })
                            .on("finish", () => {
                                msg.channel.send("You took too long to choose a game so im out")
                                connection.disconnect();
                            });
                        con.query(`UPDATE randomsong SET activity = "Inactive"`)
                        msg.channel.send("I'm ready to play!");
                        connection.dispatcher.setBitrate(connection.channel.bitrate)
                    })
            } catch (error) {
                console.log(error);
                msg.channel.send("Sorry I couldn't join the voice chat :(").then(sentMessage => {
                    sentMessage.delete(5000)
                });
            }
        }
    }
    if (command === "opgame") {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Can only be used while in a voice channel\nGuess the anime op\n${prefix}opgame`);
        } else {
            if ((msg.channel.name != "anime-games") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${anichan}`)
            let VoiceChannel = msg.member.voice.channel;       //Finds the voice channel for music
            if (!VoiceChannel) return msg.channel.send("You must be in a voice channel to play")
            let clientVoiceConnection = msg.guild.voice.connection;
            if (!clientVoiceConnection) return msg.channel.send(`I'm not in a voice channel`)
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
        }
    }
    if (command === "edgame") {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Can only be used while in a voice channel\nGuess the anime ed\n${prefix}edgame`);
        } else {
            if ((msg.channel.name != "anime-games") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${anichan}`)
            let VoiceChannel = msg.member.voice.channel;       //Finds the voice channel for music
            if (!VoiceChannel) return msg.channel.send("You must be in a voice channel to play")
            let clientVoiceConnection = msg.guild.voice.connection;
            if (!clientVoiceConnection) return msg.channel.send(`I'm not in a voice channel`)
            con.query(`SELECT * FROM randomsong WHERE id = ${0} AND (gametype = "OP" OR gametype = "OST")`, (err, rows) => {
                if ((rows[0].activity === "Active") || (rows[1].activity === "Active")) return msg.channel.send(`You aren't playing the ED game right now, use ${prefix}stop to stop all games`);
                con.query(`SELECT * FROM edsongs`, (err, rows) => {
                    let numofsongs = rows.length;
                    con.query(`SELECT * FROM randomsong WHERE gametype = "ED"`, (err, rows) => {
                        const getrand = (songs, list) => {
                            const rand = Math.floor(Math.random() * numofsongs) + 1;
                            return list.includes(rand) ? getrand(songs, list) : rand;
                        }
                        let randomid = getrand(numofsongs, [rows[0].number, rows[1].number, rows[2].number, rows[3].number, rows[4].number])
                        con.query(`UPDATE randomsong SET number = ${rows[3].number} WHERE id = ${4} AND gametype = "ED"`)
                        con.query(`UPDATE randomsong SET number = ${rows[2].number} WHERE id = ${3} AND gametype = "ED"`)
                        con.query(`UPDATE randomsong SET number = ${rows[1].number} WHERE id = ${2} AND gametype = "ED"`)
                        con.query(`UPDATE randomsong SET number = ${rows[0].number} WHERE id = ${1} AND gametype = "ED"`)
                        con.query(`UPDATE randomsong SET number = ${randomid} WHERE id = ${0} AND gametype = "ED"`)
                        con.query(`SELECT * FROM randomsong WHERE id = ${0} AND gametype = "ED"`, (err, rows) => {
                            const songid = rows[0].number;
                            con.query(`SELECT * FROM edsongs WHERE songid = ${songid}`, (err, rows) => {
                                if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                                if (rows.length < 1) {
                                    return msg.channel.send("I couldn't find any songs")
                                }
                                try {
                                    let song = rows[0].songlink;
                                    const stream = ytdl("https://www.youtube.com/watch?v=" + song, { filter: 'audioonly', quality: 'highestaudio' });
                                    clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                                        .on("error", error => {
                                            console.log(rows[0].songid)
                                            console.log(rows[0].songlink)
                                            msg.channel.send(rows[0].songlink)
                                            msg.channel.send(rows[0].songid)
                                            console.log(error)
                                            return msg.channel.send("Error ocurred in playing ED song")
                                        })
                                        .on("finish", () => {
                                            con.query(`UPDATE randomsong SET activity = "Inactive"`)
                                        })
                                    con.query(`UPDATE randomsong SET activity = "Active" WHERE id = ${0} AND gametype = "ED"`)
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
        }
    }
    if (command === "ostgame") {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Can only be used while in a voice channel\nGuess the anime ost\n${prefix}ostgame`);
        } else {
            if ((msg.channel.name != "anime-games") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${anichan}`)
            let VoiceChannel = msg.member.voice.channel;       //Finds the voice channel for music
            if (!VoiceChannel) return msg.channel.send("You must be in a voice channel to play")
            let clientVoiceConnection = msg.guild.voice.connection;
            if (!clientVoiceConnection) return msg.channel.send(`I'm not in a voice channel`)
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
                                if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                                if (rows.length < 1) {
                                    return msg.channel.send("I couldn't find any songs")
                                }
                                try {
                                    let song = rows[0].songlink;
                                    const stream = ytdl("https://www.youtube.com/watch?v=" + song, { filter: 'audioonly', quality: 'highestaudio' });
                                    clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                                        .on("error", error => {
                                            console.log(rows[0].songid)
                                            console.log(rows[0].songlink)
                                            msg.channel.send(rows[0].songlink)
                                            msg.channel.send(rows[0].songid)
                                            console.log(error)
                                            return msg.channel.send("Error ocurred in playing OST song")
                                        })
                                        .on("finish", () => {
                                            con.query(`UPDATE randomsong SET activity = "Inactive"`)
                                        })
                                    con.query(`UPDATE randomsong SET activity = "Active" WHERE id = ${0} AND gametype = "OST"`)
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
        }
    }
    if (command === "opdev") {
        let admin = msg.member.hasPermission("ADMINISTRATOR");
        if (!admin) return msg.reply("You are not worthy :smirk:")
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Test an anime op\n${prefix}opdev <song ID>`);
        } else {
            let VoiceChannel = msg.member.voice.channel;       //Finds the voice channel for music
            if (!VoiceChannel) return msg.channel.send("You must be in a voice channel to play")
            let clientVoiceConnection = msg.guild.voice.connection;
            if (!clientVoiceConnection) return msg.channel.send(`I'm not in a voice channel`)
            let devsong = parseInt(args[0]);
            if (!devsong) return msg.channel.send("You didn't supply a song ID")
            con.query(`SELECT * FROM opsongs WHERE songid = ${devsong}`, (err, rows) => {
                if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                if (rows.length < 1) {
                    return msg.channel.send("I couldn't find any OP songs")
                }
                try {
                    clientVoiceConnection.dispatcher.end();
                    let song = rows[0].songlink;
                    let finallink = ("https://youtube.com/watch?v=" + song)
                    msg.channel.send(finallink);
                    console.log(rows[0].songid)
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
                } catch {
                    console.log(rows[0].songid)
                    console.log(rows[0].songlink)
                    msg.channel.send(rows[0].songlink)
                    msg.channel.send(rows[0].songid)
                    console.log(error)
                    return msg.channel.send("Sorry I got a bad video")
                }
            });
        }
    }
    if (command === "eddev") {
        let mod = msg.member.hasPermission("ADMINISTRATOR");
        if (!mod) return msg.reply("You are not worthy :smirk:")
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Test an anime ed\n${prefix}eddev <song ID>`);
        } else {
            let VoiceChannel = msg.member.voice.channel;       //Finds the voice channel for music
            if (!VoiceChannel) return msg.channel.send("You must be in a voice channel to play")
            let clientVoiceConnection = msg.guild.voice.connection;
            if (!clientVoiceConnection) return msg.channel.send(`I'm not in a voice channel`)
            let devsong = parseInt(args[0]);
            if (!devsong) return msg.channel.send("You didn't supply a song ID")
            con.query(`SELECT * FROM edsongs WHERE songid = ${devsong}`, (err, rows) => {
                if (err) return msg.channel.send("I couldn't find any songs")
                if (rows.length < 1) {
                    return msg.channel.send("I couldn't find any songs")
                }
                try {
                    clientVoiceConnection.dispatcher.end();
                    let song = rows[0].songlink;
                    let finallink = ("https://youtube.com/watch?v=" + song)
                    msg.channel.send(finallink);
                    console.log(rows[0].songid)
                    const stream = ytdl(finallink, { filter: 'audioonly', quality: 'highestaudio' });
                    clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                        .on("error", error => {
                            console.log(rows[0].songid)
                            console.log(rows[0].songlink)
                            msg.channel.send(rows[0].songlink)
                            msg.channel.send(rows[0].songid)
                            console.log(error)
                            return msg.channel.send("Error ocurred in playing ED song")
                        });
                    clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                    msg.channel.send("Song started");
                } catch {
                    console.log(rows[0].songid)
                    console.log(rows[0].songlink)
                    msg.channel.send(rows[0].songlink)
                    msg.channel.send(rows[0].songid)
                    console.log(error)
                    return msg.channel.send("Sorry I got a bad video")
                }
            });
        }
    }
    if (command === "ostdev") {
        let admin = msg.member.hasPermission("ADMINISTRATOR");
        if (!admin) return msg.reply("You are not worthy :smirk:")
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Test an anime ost\n${prefix}ostdev <song ID>`);
        } else {
            let VoiceChannel = msg.member.voice.channel;       //Finds the voice channel for music
            if (!VoiceChannel) return msg.channel.send("You must be in a voice channel to play")
            let clientVoiceConnection = msg.guild.voice.connection;
            if (!clientVoiceConnection) return msg.channel.send(`I'm not in a voice channel`)
            let devsong = parseInt(args[0]);
            if (!devsong) return msg.channel.send("You didn't supply a song ID")
            con.query(`SELECT * FROM ostsongs WHERE songid = ${devsong}`, (err, rows) => {
                if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                if (rows.length < 1) {
                    return msg.channel.send("I couldn't find any songs")
                }
                try {
                    clientVoiceConnection.dispatcher.end();
                    let song = rows[0].songlink;
                    let finallink = ("https://youtube.com/watch?v=" + song)
                    msg.channel.send(finallink);
                    console.log(rows[0].songid)
                    const stream = ytdl(finallink, { filter: 'audioonly', quality: 'highestaudio' });
                    clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                        .on("error", error => {
                            console.log(rows[0].songid)
                            console.log(rows[0].songlink)
                            msg.channel.send(rows[0].songlink)
                            msg.channel.send(rows[0].songid)
                            console.log(error)
                            return msg.channel.send("Error ocurred in playing OST song")
                        });
                    clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                    msg.channel.send("Song started");
                } catch {
                    console.log(rows[0].songid)
                    console.log(rows[0].songlink)
                    msg.channel.send(rows[0].songlink)
                    msg.channel.send(rows[0].songid)
                    console.log(error)
                    return msg.channel.send("Sorry I got a bad video")
                }
            });
        }
    }
    if (command === "restart") {
        let mod = msg.member.hasPermission("MANAGE_MESSAGES");
        if (!mod) return msg.reply("You are not worthy :smirk:")
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Restart the anime song\n${prefix}restart`);
        }
        if ((msg.channel.name != "anime-games") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${anichan}`)
        let VoiceChannel = msg.member.voice.channel;       //Finds the voice channel for music
        if (!VoiceChannel) return msg.channel.send("You must be in a voice channel to play")
        let clientVoiceConnection = msg.guild.voice.connection;
        if (!clientVoiceConnection) return msg.channel.send(`I'm not in a voice channel`)
        con.query(`SELECT * FROM randomsong WHERE id = ${0} AND activity = "Active"`, (err, rows) => {
            if (err) return msg.channel.send("Time's up!")
            if (rows.length < 1) return msg.channel.send("Time's up!");
            if (!rows[0].gametype) return msg.channel.send("Time's up!");
            if ((rows[0].gametype != "OP") && (rows[0].gametype != "ED") && (rows[0].gametype != "OST")) return msg.channel.send("Time's up!");
            const songid = rows[0].number;
            if (rows[0].gametype === "OP") {
                con.query(`SELECT * FROM opsongs WHERE songid = ${songid}`, (err, rows) => {
                    if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                    if (rows.length < 1) {
                        return msg.channel.send("I couldn't find any OP songs")
                    }
                    try {
                        let song = rows[0].songlink;
                        const stream = ytdl("https://www.youtube.com/watch?v=" + song, { filter: 'audioonly', quality: 'highestaudio' });
                        clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                            .on("error", error => {
                                console.log(rows[0].songid)
                                console.log(rows[0].songlink)
                                msg.channel.send(rows[0].songlink)
                                msg.channel.send(rows[0].songid)
                                console.log(error)
                                return msg.channel.send("Error ocurred in playing song")
                            });
                        clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        msg.channel.send("The game has officially started!");
                        msg.channel.send(songid)
                    } catch (er) {
                        console.log(er)
                        console.log(rows[0].songlink)
                        return msg.channel.send("Sorry I got a bad video")
                    }
                });
            } if (rows[0].gametype === "ED") {
                con.query(`SELECT * FROM edsongs WHERE songid = ${songid}`, (err, rows) => {
                    if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                    if (rows.length < 1) {
                        return msg.channel.send("I couldn't find any ED songs")
                    }
                    try {
                        let song = rows[0].songlink;
                        const stream = ytdl("https://www.youtube.com/watch?v=" + song, { filter: 'audioonly', quality: 'highestaudio' });
                        clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                            .on("error", error => {
                                console.log(rows[0].songid)
                                console.log(rows[0].songlink)
                                msg.channel.send(rows[0].songlink)
                                msg.channel.send(rows[0].songid)
                                console.log(error)
                                return msg.channel.send("Error ocurred in playing song")
                            });
                        clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        msg.channel.send("The game has officially started!");
                        msg.channel.send(songid)
                    } catch (er) {
                        console.log(er)
                        console.log(rows[0].songlink)
                        return msg.channel.send("Sorry I got a bad video")
                    }
                });
            } if (rows[0].gametype === "OST") {
                con.query(`SELECT * FROM ostsongs WHERE songid = ${songid}`, (err, rows) => {
                    if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                    if (rows.length < 1) {
                        return msg.channel.send("I couldn't find any OST songs")
                    }
                    try {
                        let song = rows[0].songlink;
                        const stream = ytdl("https://www.youtube.com/watch?v=" + song, { filter: 'audioonly', quality: 'highestaudio' });
                        clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                            .on("error", error => {
                                console.log(rows[0].songid)
                                console.log(rows[0].songlink)
                                msg.channel.send(rows[0].songlink)
                                msg.channel.send(rows[0].songid)
                                console.log(error)
                                return msg.channel.send("Error ocurred in playing song")
                            });
                        clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        msg.channel.send("The game has officially started!");
                        msg.channel.send(songid)
                    } catch (er) {
                        console.log(er)
                        console.log(rows[0].songlink)
                        console.log(rows[0].songid)
                        msg.channel.send(rows[0].songlink)
                        msg.channel.send(rows[0].songid)
                        return msg.channel.send("Sorry I got a bad video")
                    }
                });
            }
        });
    }
    if (command === "guess") {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Can only be used while in a voice channel\nGuess the anime op that's playing in the voice channel\n${prefix}guess <Anime Name>`);
        } else {
            if ((msg.channel.name != "anime-games") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${anichan}`)
            let userVoiceChannel = msg.member.voice.channel;      //Finds the voice channel for music
            if (!userVoiceChannel) return msg.channel.send(`You must be in a voice channel to guess`)
            let clientVoiceConnection = msg.guild.voice.connection;
            if (!clientVoiceConnection) return msg.channel.send(`I'm not in a voice channel`)
            con.query(`SELECT * FROM randomsong WHERE id = ${0} AND activity = "Active"`, (err, rows) => {
                if (err) return msg.channel.send("Time's up!")
                if (rows.length < 1) return msg.channel.send("Time's up!");
                if (!rows[0].gametype) return msg.channel.send("Time's up!");
                if ((rows[0].gametype != "OP") && (rows[0].gametype != "ED") && (rows[0].gametype != "OST")) return msg.channel.send("Time's up!");
                const guess = args.join(" ").toLowerCase();
                const songid = rows[0].number;
                if (rows[0].gametype === "OP") {
                    con.query(`SELECT * FROM opsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                        let song = rows[0].songlink;
                        let songname = rows[0].songname;
                        let altname = rows[0].altname
                        let ansname = rows[0].ansname;
                        let ansaltname = rows[0].ansaltname;
                        if (guess != ansname) {
                            if (guess != ansaltname) return msg.channel.send("Sorry but you're incorrect. Try again!")
                        }
                        try {
                            clientVoiceConnection.dispatcher.end()
                            con.query(`SELECT * FROM coins WHERE id = '${msg.author.id}'`, (err, rows) => {
                                let coins = rows[0].coins
                                let newamt = coins + 2000;
                                con.query(`UPDATE coins SET coins = ${newamt} WHERE id = '${msg.author.id}'`)
                            });
                            let endembed = new Discord.MessageEmbed()
                                .setTitle(`${msg.author.username} is correct and gains 2000 coins!`)
                            if (songname === altname) {
                                endembed.setDescription(`The answer was ${songname}`)
                            } else {
                                endembed.setDescription(`The answer was ${songname}/${altname}`)
                            }
                            endembed.setColor(red)
                            endembed.setAuthor(msg.author.username, msg.author.avatarURL())
                            con.query(`UPDATE randomsong SET activity = "Inactive" WHERE gametype = "OP"`)
                            msg.channel.send("https://www.youtube.com/watch?v=" + song);
                            msg.channel.send(endembed);
                            const stream = ytdl("https://www.youtube.com/watch?v=cARXjGO_-lMcARXjGO_-lM", { filter: 'audioonly', quality: 'highestaudio' });
                            clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                                .on("error", error => {
                                    console.log(error)
                                    msg.channel.send("[The Tip Top Polka, Spongebob](https://www.youtube.com/watch?v=cARXjGO_-lMcARXjGO_-lM)")
                                    return msg.channel.send("Error ocurred in playing intermission song")
                                });
                            clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        } catch (err) {
                            console.log(err);
                            return msg.channel.send("Error occured in ending game");
                        }
                    });
                } if (rows[0].gametype === "ED") {
                    con.query(`SELECT * FROM edsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                        let song = rows[0].songlink;
                        let songname = rows[0].songname;
                        let altname = rows[0].altname
                        let ansname = rows[0].ansname;
                        let ansaltname = rows[0].ansaltname;
                        if (guess != ansname) {
                            if (guess != ansaltname) return msg.channel.send("Sorry but you're incorrect. Try again!")
                        }
                        try {
                            clientVoiceConnection.dispatcher.end()
                            con.query(`SELECT * FROM coins WHERE id = '${msg.author.id}'`, (err, rows) => {
                                let coins = rows[0].coins
                                let newamt = coins + 4000;
                                con.query(`UPDATE coins SET coins = ${newamt} WHERE id = '${msg.author.id}'`)
                            });
                            let endembed = new Discord.MessageEmbed()
                                .setTitle(`${msg.author.username} is correct and gains 4000 coins!`)
                            if (songname === altname) {
                                endembed.setDescription(`The answer was ${songname}`)
                            } else {
                                endembed.setDescription(`The answer was ${songname}/${altname}`)
                            }
                            endembed.setColor(red)
                            endembed.setAuthor(msg.author.username, msg.author.avatarURL())
                            con.query(`UPDATE randomsong SET activity = "Inactive" WHERE gametype = "ED"`)
                            msg.channel.send("https://www.youtube.com/watch?v=" + song);
                            msg.channel.send(endembed);
                            const stream = ytdl("https://www.youtube.com/watch?v=G3jIu65Fgq4", { filter: 'audioonly', quality: 'highestaudio' });
                            clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                                .on("error", error => {
                                    console.log(error)
                                    msg.channel.send(`[Basshunter - Dota](https://www.youtube.com/watch?v=G3jIu65Fgq4)`)
                                    return msg.channel.send("Error ocurred in playing intermission song")
                                });
                            clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        } catch (err) {
                            console.log(err);
                            return msg.channel.send("Error occured in ending game");
                        }
                    });
                } if (rows[0].gametype === "OST") {
                    con.query(`SELECT * FROM ostsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                        let song = rows[0].songlink;
                        let songname = rows[0].songname;
                        let altname = rows[0].altname
                        let ansname = rows[0].ansname;
                        let ansaltname = rows[0].ansaltname;
                        if (guess != ansname) {
                            if (guess != ansaltname) return msg.channel.send("Sorry but you're incorrect. Try again!")
                        }
                        try {
                            clientVoiceConnection.dispatcher.end()
                            con.query(`SELECT * FROM coins WHERE id = '${msg.author.id}'`, (err, rows) => {
                                let coins = rows[0].coins
                                let newamt = coins + 6000;
                                con.query(`UPDATE coins SET coins = ${newamt} WHERE id = '${msg.author.id}'`)
                            });
                            let endembed = new Discord.MessageEmbed()
                                .setTitle(`${msg.author.username} is correct and gains 6000 coins!`)
                            if (songname === altname) {
                                endembed.setDescription(`The answer was ${songname}`)
                            } else {
                                endembed.setDescription(`The answer was ${songname}/${altname}`)
                            }
                            endembed.setColor(red)
                            endembed.setAuthor(msg.author.username, msg.author.avatarURL())
                            con.query(`UPDATE randomsong SET activity = "Inactive" WHERE gametype = "OST"`)
                            msg.channel.send("https://www.youtube.com/watch?v=" + song);
                            msg.channel.send(endembed);
                            const stream = ytdl("https://www.youtube.com/watch?v=ukLMmpoq15Q", { filter: 'audioonly', quality: 'highestaudio' });
                            clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                                .on("error", error => {
                                    console.log(error)
                                    msg.channel.send(`(Despacito on recorder)[https://www.youtube.com/watch?v=ukLMmpoq15Q]`)
                                    return msg.channel.send("Error ocurred in playing intermission song")
                                });
                            clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        } catch (err) {
                            console.log(err);
                            return msg.channel.send("Error occured in ending game");
                        }
                    });
                }
            });
        }
    }
    if (command === "hint") {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Can only be used while in a voice channel\nShow the scrambled answer for the game\n${prefix}hint`);
        } else {
            if ((msg.channel.name != "anime-games") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${anichan}`)
            let userVoiceChannel = msg.member.voice.channel;      //Finds the voice channel for music
            if (!userVoiceChannel) return msg.channel.send(`You must be in a voice channel to see the answer`)
            let clientVoiceConnection = msg.guild.voice.connection;
            if (!clientVoiceConnection) return msg.channel.send(`I'm not in a voice channel`)
            function scramble(a) {
                a = a.split("");
                for (var b = a.length - 1; 0 < b; b--) {
                    var c = Math.floor(Math.random() * (b + 1));
                    d = a[b];
                    a[b] = a[c];
                    a[c] = d
                }
                return a.join("")
            }
            con.query(`SELECT * FROM randomsong WHERE id = ${0} AND activity = "Active"`, (err, rows) => {
                if (err) return msg.channel.send("Time's up!")
                if (rows.length < 1) return msg.channel.send("Time's up!");
                if (!rows[0].gametype) return msg.channel.send("Time's up!");
                if ((rows[0].gametype != "OP") && (rows[0].gametype != "ED") && (rows[0].gametype != "OST")) return msg.channel.send("Time's up!");
                const songid = rows[0].number;
                if (rows[0].gametype === "OP") {
                    con.query(`SELECT * FROM opsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                        let songname = rows[0].songname;
                        let altname = rows[0].altname;
                        let finname = '';
                        let namespl = songname.split(/ +/g);
                        namespl.forEach((row) => {
                            finname += `${scramble(row)} `;
                        })
                        let finalt = '';
                        let altspl = altname.split(/ +/g)
                        altspl.forEach((row) => {
                            finalt += `${scramble(row)} `;
                        })
                        try {
                            let hintembed = new Discord.MessageEmbed()
                                .setTitle(`Hmmmm looks like someone needs a hint`)
                            if (songname === altname) {
                                hintembed.addField(`Scrambled name:`, finname)
                            } else {
                                hintembed.addField(`Scrambled name:`, finname)
                                hintembed.addField(`Scrambled altname:`, finalt)
                            }
                            hintembed.setColor(red)
                            hintembed.setAuthor(msg.author.username, msg.author.avatarURL())
                            msg.channel.send(hintembed)
                        } catch (err) {
                            console.log(err);
                            return msg.channel.send("Error occured in giving a hint");
                        }
                    });
                } if (rows[0].gametype === "ED") {
                    con.query(`SELECT * FROM edsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                        let songname = rows[0].songname;
                        let altname = rows[0].altname;
                        try {
                            let hintembed = new Discord.MessageEmbed()
                                .setTitle(`Hmmmm looks like someone needs a hint`)
                            if (songname === altname) {
                                hintembed.addField(`Scrambled name:`, scramble(songname))
                            } else {
                                hintembed.addField(`Scrambled name:`, scramble(songname))
                                hintembed.addField(`Scrambled altname:`, scramble(altname))
                            }
                            hintembed.setColor(red)
                            hintembed.setAuthor(msg.author.username, msg.author.avatarURL())
                            msg.channel.send(hintembed)
                        } catch (err) {
                            console.log(err);
                            return msg.channel.send("Error occured in giving a hint");
                        }
                    });
                } if (rows[0].gametype === "OST") {
                    con.query(`SELECT * FROM ostsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                        let songname = rows[0].songname;
                        let altname = rows[0].altname;
                        try {
                            let hintembed = new Discord.MessageEmbed()
                                .setTitle(`Hmmmm looks like someone needs a hint`)
                            if (songname === altname) {
                                hintembed.addField(`Scrambled name:`, scramble(songname))
                            } else {
                                hintembed.addField(`Scrambled name:`, scramble(songname))
                                hintembed.addField(`Scrambled altname:`, scramble(altname))
                            }
                            hintembed.setColor(red)
                            hintembed.setAuthor(msg.author.username, msg.author.avatarURL())
                            msg.channel.send(hintembed)
                        } catch (err) {
                            console.log(err);
                            return msg.channel.send("Error occured in giving a hint");
                        }
                    });
                }
            });
        }
    }
    if (command === "answer") {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Can only be used while in a voice channel\nShow the answer for the current song\n${prefix}answer`);
        } else {
            if ((msg.channel.name != "anime-games") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${anichan}`)
            let userVoiceChannel = msg.member.voice.channel;      //Finds the voice channel for music
            if (!userVoiceChannel) return msg.channel.send(`You must be in a voice channel to see the answer`)
            let clientVoiceConnection = msg.guild.voice.connection;
            if (!clientVoiceConnection) return msg.channel.send(`I'm not in a voice channel`)
            con.query(`SELECT * FROM randomsong WHERE id = ${0} AND activity = "Active"`, (err, rows) => {
                if (err) return msg.channel.send("Time's up!")
                if (rows.length < 1) return msg.channel.send("Time's up!");
                if (!rows[0].gametype) return msg.channel.send("Time's up!");
                if ((rows[0].gametype != "OP") && (rows[0].gametype != "ED") && (rows[0].gametype != "OST")) return msg.channel.send("Time's up!");
                const songid = rows[0].number;
                if (rows[0].gametype === "OP") {
                    con.query(`SELECT * FROM opsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                        let song = rows[0].songlink;
                        let songname = rows[0].songname;
                        let altname = rows[0].altname;
                        try {
                            clientVoiceConnection.dispatcher.end()
                            let endembed = new Discord.MessageEmbed()
                                .setTitle(`Aww looks like everyone gave up\nNo one wins this round :(`)
                            if (songname === altname) {
                                endembed.setDescription(`The answer was ${songname}`)
                            } else {
                                endembed.setDescription(`The answer was ${songname}/${altname}`)
                            }
                            endembed.setColor(red)
                            endembed.setAuthor(msg.author.username, msg.author.avatarURL())
                            con.query(`UPDATE randomsong SET activity = "Inactive" WHERE gametype = "OST"`)
                            msg.channel.send("https://www.youtube.com/watch?v=" + song);
                            msg.channel.send(endembed);
                            const stream = ytdl("https://www.youtube.com/watch?v=cARXjGO_-lMcARXjGO_-lM", { filter: 'audioonly', quality: 'highestaudio' });
                            clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                                .on("error", error => {
                                    console.log(error)
                                    msg.channel.send("[The Tip Top Polka, Spongebob](https://www.youtube.com/watch?v=cARXjGO_-lMcARXjGO_-lM)")
                                    return msg.channel.send("Error ocurred in playing intermission song")
                                });
                            clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        } catch (err) {
                            console.log(err);
                            return msg.channel.send("Error occured in ending game");
                        }
                    });
                } if (rows[0].gametype === "ED") {
                    con.query(`SELECT * FROM edsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                        let song = rows[0].songlink;
                        let songname = rows[0].songname;
                        let altname = rows[0].altname;
                        try {
                            clientVoiceConnection.dispatcher.end()
                            let endembed = new Discord.MessageEmbed()
                                .setTitle(`Aww looks like everyone gave up\nNo one wins this round :(`)
                            if (songname === altname) {
                                endembed.setDescription(`The answer was ${songname}`)
                            } else {
                                endembed.setDescription(`The answer was ${songname}/${altname}`)
                            }
                            endembed.setColor(red)
                            endembed.setAuthor(msg.author.username, msg.author.avatarURL())
                            con.query(`UPDATE randomsong SET activity = "Inactive" WHERE gametype = "ED"`)
                            msg.channel.send("https://www.youtube.com/watch?v=" + song);
                            msg.channel.send(endembed);
                            const stream = ytdl("https://www.youtube.com/watch?v=G3jIu65Fgq4", { filter: 'audioonly', quality: 'highestaudio' });
                            clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                                .on("error", error => {
                                    console.log(error)
                                    msg.channel.send(`[Basshunter - Dota](https://www.youtube.com/watch?v=G3jIu65Fgq4)`)
                                    return msg.channel.send("Error ocurred in playing intermission song")
                                });
                            clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        } catch (err) {
                            console.log(err);
                            return msg.channel.send("Error occured in ending game");
                        }
                    });
                } if (rows[0].gametype === "OST") {
                    con.query(`SELECT * FROM ostsongs WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return msg.channel.send(`Error occured in query for songid #${songid}`)
                        let song = rows[0].songlink;
                        let songname = rows[0].songname;
                        let altname = rows[0].altname;
                        try {
                            clientVoiceConnection.dispatcher.end()
                            let endembed = new Discord.MessageEmbed()
                                .setTitle(`Aww looks like everyone gave up\nNo one wins this round :(`)
                            if (songname === altname) {
                                endembed.setDescription(`The answer was ${songname}`)
                            } else {
                                endembed.setDescription(`The answer was ${songname}/${altname}`)
                            }
                            endembed.setColor(red)
                            endembed.setAuthor(msg.author.username, msg.author.avatarURL())
                            con.query(`UPDATE randomsong SET activity = "Inactive" WHERE gametype = "OST"`)
                            msg.channel.send("https://www.youtube.com/watch?v=" + song);
                            msg.channel.send(endembed);
                            const stream = ytdl("https://www.youtube.com/watch?v=ukLMmpoq15Q", { filter: 'audioonly', quality: 'highestaudio' });
                            clientVoiceConnection.play(stream, streamOptions)     //Plays the song
                                .on("error", error => {
                                    console.log(error)
                                    msg.channel.send(`(Despacito on recorder)[https://www.youtube.com/watch?v=ukLMmpoq15Q]`)
                                    return msg.channel.send("Error ocurred in playing intermission song")
                                });
                            clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
                        } catch (err) {
                            console.log(err);
                            return msg.channel.send("Error occured in ending game");
                        }
                    });
                }
            });
        }
    }
    if (command === "quit") {       //Shows how to run the command
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Can only be used while in a voice channel\nMakes me leave the voice channel\n${prefix}quit`);
        } else {
            if ((msg.channel.name != "anime-games") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${anichan}`)
            let userVoiceChannel = msg.member.voice.channel;      //Finds the voice channel for music
            if (!userVoiceChannel) return msg.channel.send(`You must be in a voice channel to stop the game`)
            let clientVoiceConnection = msg.guild.voice.connection;
            if (!clientVoiceConnection) return msg.channel.send(`I have to be in a voice channel to quit`)
            clientVoiceConnection.disconnect();
            con.query(`UPDATE randomsong SET activity = "Inactive"`)
            msg.channel.send("Game Ended! I look forward to playing again!");
        }
    }
    if ((command === "volume") || (command === "vol")) {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Can only be used while in a voice channel\nSet the volume to a percentage between 1 and 200\n${prefix}vol <volume>`);
        } else {
            if ((msg.channel.name != "anime-games") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${anichan}`)
            let userVoiceChannel = msg.member.voice.channel;      //Finds the voice channel for music
            if (!userVoiceChannel) return msg.channel.send(`You must be in a voice channel to change the volume`)
            let clientVoiceConnection = msg.guild.voice.connection;
            if (!clientVoiceConnection) return msg.channel.send(`I have to be in a voice channel to change the volume`)
            let uservolume = parseInt(args[0])
            if (uservolume > 200) return msg.channel.send("I can't set the volume past 200%")
            let newvolume = uservolume / 100;
            try {
                clientVoiceConnection.dispatcher.setVolume(newvolume)
                msg.channel.send(`The volume has been sent to ${uservolume}%`)
            } catch (err) {
                console.log(err);
                msg.channel.send("I failed to change the volume")
            }
        }
    }
    if ((command === "songlinks") || (command === "sl")) {
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Get the youtube playlist links for all the songs\n${prefix}sl`);
        } else {
            let linkembed = new Discord.MessageEmbed()
                .setTitle("Youtube Playlists for anime songs")
                .setDescription("[Link for OPs](https://www.youtube.com/playlist?list=PLjVabt8Kb-425NzP8La-lnzLz2yriOLea)\n[Link for EDs](https://www.youtube.com/playlist?list=PLjVabt8Kb-43FlbE0e0aMiVddH2ChIsu9)\n[Link for OSTs](https://www.youtube.com/playlist?list=PLjVabt8Kb-42AQqVIWAO4SVCIELJkzDFE)")
                .setColor(red)
            msg.channel.send(linkembed)
        }
    }
    if (command === "stop") {       //Shows how to run the command
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Can only be used while in a voice channel\nStop all games\n${prefix}stop`);
        } else {
            if ((msg.channel.name != "anime-games") && (msg.author.id != '250072488929787924')) return msg.channel.send(`You aren't in ${anichan}`)
            let userVoiceChannel = msg.member.voice.channel;      //Finds the voice channel for music
            if (!userVoiceChannel) return msg.channel.send(`You must be in a voice channel to stop the game`)
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
            msg.channel.send("Songs stopped");
        }
    }
    //if (command === "ballsackz") {
    //    con.query('SELECT * FROM ostsongs', (err, rows) => {
    //        let JSONroles = JSON.stringify(rows);
    //        let parsedRoles = JSON.parse(JSONroles);
    //        if (parsedRoles === null) return msg.channel.send("bruh");
    //        parsedRoles.forEach((row) => {
    //            let stringname = JSON.stringify(row.songname)
    //            let lowername = stringname.toLowerCase();
    //            let stringaltname = JSON.stringify(row.altname)
    //            let loweraltname = stringaltname.toLowerCase();
    //            let songid = row.songid
    //            con.query(`UPDATE ostsongs SET ansname = ${lowername} WHERE songid = ${songid}`)
    //            con.query(`UPDATE ostsongs SET ansaltname = ${loweraltname} WHERE songid = ${songid}`)
    //        })
    //        msg.channel.send("done")
    //    })
    //}
    if (command === "addsong") {
        let admin = msg.member.hasPermission("ADMINISTRATOR");
        if (!admin) return msg.reply("You are not worthy :smirk:")
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`**This is an admin only command**\nAdds a song to the list\n${prefix}addsong <table>|<end of youtube link>|<name>|<alt name>`);
        } else {
            try {
                if (!args[0]) return msg.channel.send("You didn't supply anything to add")
                const linkargs = msg.content.slice(prefix.length + command.length).trim().split("|")
                let table = linkargs[0].toLowerCase();
                let songlink = JSON.stringify(linkargs[1]);
                let songname = JSON.stringify(linkargs[2]);
                let altname = JSON.stringify(linkargs[3]);
                let ansname = songname.toLowerCase();
                let ansaltname = altname.toLowerCase();
                con.query(`SELECT * FROM ${table}`, (err, rows) => {
                    if (err) return msg.channel.send(`Error occured in query for ${table}`)
                    let rank = rows.length + 1;
                    con.query(`INSERT INTO ${table} (songlink, songname, altname, songid, ansname, ansaltname) VALUES(${songlink}, ${songname}, ${altname}, ${rank}, ${ansname}, ${ansaltname})`, (err, rows) => {
                        if (err) {
                            console.log(err)
                            return msg.channel.send("Error occured")
                        }
                        con.query(`SELECT * FROM ${table} WHERE songid = ${rank}`, (err, rows) => {
                            let infoembed = new Discord.MessageEmbed()
                                .setTitle(`New info for row #${rows[0].songid}`)
                                .addField("Songname:", rows[0].songname)
                                .addField("Altname:", rows[0].altname)
                                .addField("Link:", `[${rows[0].songlink}](${"https://www.youtube.com/watch?v=" + rows[0].songlink})`)
                                .setColor(red)
                            msg.channel.send(infoembed)
                        });
                    })
                    numofsongs = rank;
                });
            } catch {
                return msg.channel.send(`Remember the format\n${prefix}addsong <table>|<end of youtube link>|<name>|<alt name>`)
            }
        }
    }
    if (command === "updaterow") {
        let admin = msg.member.hasPermission("ADMINISTRATOR");
        if (!admin) return msg.reply("You are not worthy :smirk:")
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`**This is a admin only command**\nUpdates a song link, name, or altname\n${prefix}rowupdate <table>|<request>|<fix>|<songid>`);
        } else {
            try {
                const linkargs = msg.content.slice(prefix.length + command.length).trim().split("|")
                let table = linkargs[0].toLowerCase();
                let request = linkargs[1].toLowerCase();
                let fix = JSON.stringify(linkargs[2]);
                let songid = parseInt(linkargs[3]);
                if ((!table) || (!request) || (!fix) || (!songid)) return msg.channel.send("You didn't tell me what to change")
                try {
                    con.query(`UPDATE ${table} SET ${request} = ${fix} WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return msg.channel.send(`Error occured in update query`)
                    });
                    con.query(`SELECT * FROM ${table} WHERE songid = ${songid}`, (err, rows) => {
                        if (err) return msg.channel.send(`Error occured in query for songid #${songid} in ${table}`)
                        let infoembed = new Discord.MessageEmbed()
                            .setTitle(`New info for row #${songid}`)
                            .addField("Songname:", rows[0].songname)
                            .addField("Altname:", rows[0].altname)
                            .addField("Link:", `[${rows[0].songlink}](${"https://www.youtube.com/watch?v=" + rows[0].songlink})`)
                            .setColor(red)
                        msg.channel.send(infoembed)
                    })
                } catch (err) {
                    console.log(err)
                    return msg.channel.send("You fucked up somewhere")
                }
            } catch (err) {
                return msg.channel.send(`Remember the format\n${prefix}rowupdate <table>|<request>|<fix>|<songid>`)
            }
        }
    }
    if (command === "rowinfo") {
        let admin = msg.member.hasPermission("ADMINISTRATOR");
        if (!admin) return msg.reply("You are not worthy :smirk:")
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`**This is a admin only command**\nShow info on a data entry\n${prefix}rowinfo <table>|<request>|<search>`);
        } else {
            try {
                const linkargs = msg.content.slice(prefix.length + command.length).trim().split("|")
                let table = linkargs[0].toLowerCase();
                let request = linkargs[1].toLowerCase();
                if ((!table) || (!request) || (!linkargs[2])) return msg.channel.send("You didn't tell me what to show")
                if (request === "songid") {
                    let songid = parseInt(linkargs[2]);
                    con.query(`SELECT * FROM ${table}`, (err, rows) => {
                        if (err) return msg.channel.send(`Error occured in query for ${table}`)
                        let maxid = rows.length;
                        con.query(`SELECT * FROM ${table} WHERE ${request} = ${songid}`, (err, rows) => {
                            if (err) return msg.channel.send(`Error occured in query for songid #${songid} in ${table}`)
                            if (rows.length < 1) return msg.channel.send(`Can't find that song\nMax is ${maxid}`)
                            let songlink = rows[0].songlink;
                            let fulllink = "https://www.youtube.com/watch?v=" + songlink;
                            let songname = rows[0].songname;
                            let altname = rows[0].altname;
                            let infoembed = new Discord.MessageEmbed()
                                .setTitle(`Info for #${songid}`)
                                .addField("Anime Name", `${songname}/${altname}`)
                                .addField("Songlink", `[${songlink}](${fulllink})`)
                                .setColor(red)
                            msg.channel.send(infoembed)
                        });
                    });
                } else {
                    let search = linkargs[2];
                    con.query(`SELECT * FROM ${table} WHERE ${request} LIKE "%${search}%"`, (err, rows) => {
                        if (err) return msg.channel.send(`Error occured in query for ${search} in ${table}`)
                        if (rows.length < 1) return msg.channel.send("Couldn't find any results")
                        let JSONrows = JSON.stringify(rows);
                        let parsedRows = JSON.parse(JSONrows);
                        let currentIndex = 0
                        let pagetotal = (Math.floor(parsedRows.length / 10) + 1)
                        function generateEmbed(start) {
                            let current = parsedRows.slice(start, 10 + start)
                            const embed = new Discord.MessageEmbed()
                                .setTitle(`Search results for "${search}" in __${table}__`)
                                .setColor(red)
                                .setFooter(`Page 1/${pagetotal}`)
                            current.forEach(g => embed.addField(g.songid, `**Songname:** ${g.songname} **Altname:** ${g.altname} **Link:** [${g.songlink}](${"https://www.youtube.com/watch?v=" + g.songlink})`))
                            return embed
                        }
                        msg.channel.send(generateEmbed(0)).then(message => {
                            // exit if there is only one page of guilds (no need for all of this)
                            if (parsedRows.length <= 10) return
                            // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
                            message.react('⬅️')
                            message.react('➡️')
                            const collector = message.createReactionCollector(
                                // only collect left and right arrow reactions from the message author
                                (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === msg.author.id,
                                // time out after a minute
                                { time: 60000 }
                            )
                            collector.on('collect', r => {
                                r.emoji.name === '⬅️' ? currentIndex -= 10 : currentIndex += 10;
                                if (currentIndex < 0) {
                                    currentIndex = 0;
                                    return;
                                }
                                if (currentIndex > parsedRows.length) {
                                    currentIndex -= 10;
                                    return;
                                }
                                if (currentIndex === parsedRows.length) return;
                                function generateEmbed2(start) {
                                    let current = parsedRows.slice(start, 10 + start)
                                    const embed2 = new Discord.MessageEmbed()
                                        .setTitle(`Search results for "${search}" in __${table}__`)
                                        .setColor(red)
                                        .setFooter(`Page ${(start / 10) + 1}/${pagetotal}`)
                                    current.forEach(g => embed.addField(g.songid, `**Songname:** ${g.songname} **Altname:** ${g.altname} **Link:** [${g.songlink}](${"https://www.youtube.com/watch?v=" + g.songlink})`))
                                    return embed2
                                }
                                message.reactions.cache.clear();
                                message.edit(generateEmbed2(currentIndex))
                            });
                        })
                    });
                }
            } catch (err) {
                return msg.channel.send(`Remember the format\n${prefix}rowinfo <table>|<request>|<search>`)
            }
        }
    }
});
client.login(token)