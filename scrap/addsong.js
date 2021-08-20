const Discord = require("discord.js");
const { red, prefix } = require("../config.json");

module.exports = {
    name: 'addsong',
    description: 'Add an anime song to the database',
    usage: '<table> | <end of youtube link> | <name> | <altname>',
    cooldown: 5,
    class: 'devcmd',
    args: true,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let table = linkargs[0].toLowerCase();
            let songlink = JSON.stringify(linkargs[1]);
            let songname = JSON.stringify(linkargs[2]);
            let altname = JSON.stringify(linkargs[3]);
            let ansname = songname.toLowerCase();
            let ansaltname = altname.toLowerCase();
            con.query(`SELECT * FROM ${table}`, (err, rows) => {
                if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev");
                let rank = rows.length + 1;
                con.query(`INSERT INTO ${table} (songlink, songname, altname, songid, ansname, ansaltname) VALUES(${songlink}, ${songname}, ${altname}, ${rank}, ${ansname}, ${ansaltname})`, (err, rows) => {
                    if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                    con.query(`SELECT * FROM ${table} WHERE songid = ${rank}`, (err, rows) => {
                        if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
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
        } catch (err) {
              return catchErr(err, msg, `${module.exports.name}.js`, `Remember the format\n${prefix}addsong <table> | <end of youtube link> | <name> | <altname>`)
        }
    },
}