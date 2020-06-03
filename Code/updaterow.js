const Discord = require("discord.js");
const { prefix, red } = require("../config.json");

module.exports = {
    name: 'updaterow',
    description: 'Update a row in the database',
    usage: '<table> | <request> | <fix> | <songid>',
    cooldown: 5,
    class: 'devcmd',
    args: true,
    execute(msg, args, con, linkargs) {
        try {
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
                    return msg.channel.send(infoembed)
                })
            } catch (err) {
                console.log(err)
                return msg.channel.send("You fucked up somewhere")
            }
        } catch (err) {
            return msg.channel.send(`Remember the format\n${prefix}rowupdate <table> | <request> | <fix> | <songid>`)
        }
    },
}