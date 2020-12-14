const Discord = require("discord.js");
const { prefix, red } = require("../config.json");

module.exports = {
    name: 'updaterow',
    description: 'Update a row in the database',
    usage: '<table> | <request> | <fix> | <songid>',
    cooldown: 5,
    class: 'devcmd',
    args: true,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let table = linkargs[0].toLowerCase();
            let request = linkargs[1].toLowerCase();
            let fix = JSON.stringify(linkargs[2]);
            let songid = parseInt(linkargs[3]);
            if ((!table) || (!request) || (!fix) || (!songid)) return msg.channel.send("You didn't tell me what to change")
            try {
                con.query(`UPDATE ${table} SET ${request} = ${fix} WHERE songid = ${songid}`, (err, rows) => {
                    if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                });
                con.query(`SELECT * FROM ${table} WHERE songid = ${songid}`, (err, rows) => {
                    if (err) return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                    let infoembed = new Discord.MessageEmbed()
                        .setTitle(`New info for row #${songid}`)
                        .addField("Songname:", rows[0].songname)
                        .addField("Altname:", rows[0].altname)
                        .addField("Link:", `[${rows[0].songlink}](${"https://www.youtube.com/watch?v=" + rows[0].songlink})`)
                        .setColor(red)
                    return msg.channel.send(infoembed)
                })
            } catch (err) {
                if (err) return catchErr(err, msg, `${module.exports.name}.js`, "You fucked up somewhere")
            }
        } catch (err) {
            if (err) return catchErr(err, msg, `${module.exports.name}.js`, `Remember the format\n${prefix}rowupdate <table> | <request> | <fix> | <songid>`)
        }
    },
}