const Discord = require("discord.js");
const { red } = require("../config.json");

module.exports = {
    name: 'hint',
    description: `Reveal a scrambled version of the answer for help`,
    usage: '',
    cooldown: 3,
    class: 'vc',
    args: false,
    execute(msg, args, con) {
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
                        return msg.channel.send(hintembed)
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
                        return msg.channel.send(hintembed)
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
                        return msg.channel.send(hintembed)
                    } catch (err) {
                        console.log(err);
                        return msg.channel.send("Error occured in giving a hint");
                    }
                });
            }
        });
    },
}