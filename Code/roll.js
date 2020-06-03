const Discord = require("discord.js");
const { pink } = require("../config.json");
const moment = require("moment")

module.exports = {
    name: 'roll',
    description: 'Roll a waifu for 5k coins and claim for free',
    aliases: ['r'],
    usage: '',
    cooldown: 1,
    class: 'waifu',
    args: false,
    execute(msg, args, con, linkargss, client) {
        let author = msg.author;
        con.query(`SELECT * FROM coins WHERE id = '${author.id}'`, (err, rows) => {
            if (err) return msg.channel.send("You're too broke")
            let coins = rows[0].coins;
            if (coins < 5000) return msg.reply("You are too broke to roll")
            con.query(`SELECT * FROM rolltimer WHERE id = "${author.id}"`, (err, rows) => {
                if (rows.length < 1) return msg.channel.send("Say something so i can recognize you")
                if (rows[0].lastused != moment().format('k')) con.query(`UPDATE rolltimer SET uses = 0 WHERE id = "${author.id}"`)
                con.query(`SELECT * FROM rolltimer WHERE id = "${author.id}"`, (err, rows) => {
                    let usedtimes = rows[0].uses;
                    if (usedtimes > 5) return msg.channel.send("You've used up your rolls for the hour")
                    con.query(`SELECT * FROM unclaimed`, (err, rows) => {
                        let numofpeeps = rows.length;
                        con.query(`SELECT * FROM randomroll`, (err, rows) => {
                            const randomid = Math.floor(Math.random() * numofpeeps)
                            if (rows.length < 1) con.query(`INSERT INTO randomroll (number) VALUES (${randomid})`)
                            con.query(`UPDATE randomroll SET number = ${randomid}`)
                            con.query(`SELECT * FROM randomroll`, (err, rows) => {
                                const claimid = rows[0].number;
                                con.query(`SELECT * FROM rolltimer WHERE id = "${author.id}"`, (err, rows) => {
                                    let useamt = parseInt(rows[0].uses);
                                    con.query(`UPDATE rolltimer SET uses = ${useamt + 1} WHERE id = "${author.id}"`)
                                    con.query(`SELECT * FROM unclaimed`, (err, rows) => {
                                        if (err) throw err;
                                        try {
                                            con.query(`UPDATE rolltimer SET lastused = "${moment().format(`k`)}" WHERE id = "${author.id}"`)
                                            let anime = rows[claimid].animename;
                                            let name = rows[claimid].name;
                                            let image = rows[claimid].image;
                                            let rollembed = new Discord.MessageEmbed()
                                                .setTitle(name)
                                                .setDescription(anime)
                                                .setImage(image)
                                                .setColor(0xE06666)
                                            msg.channel.send(rollembed).then(
                                                // Create the reactionCollector
                                                m => {
                                                    m.react('💖');
                                                    let filter = (reaction, user) => reaction.emoji.name === '💖' && user.id !== client.user.id;
                                                    let collector = m.createReactionCollector(filter, { time: 15000 });
                                                    collector.on('collect', r => {
                                                        collector.stop();
                                                        m.reactions.cache.clear();
                                                    });
                                                    collector.on('end', collected => {
                                                        if (collected.get('💖')) {
                                                            let userID = collected.get('💖').users.cache.lastKey();
                                                            let claimingUser = collected.get('💖').users.cache.get(userID);
                                                            let claimedEmbed = new Discord.MessageEmbed()
                                                                .setTitle(name)
                                                                .setColor(pink)
                                                                .setDescription(`${anime}\n\nRolled by: ${author.username}`)
                                                                .setImage(image)
                                                                .setFooter(`Claimed by ${claimingUser.username}`,
                                                                    claimingUser.avatarURL());
                                                            m.edit(claimedEmbed).then(me => {
                                                                me.channel.send(`<@${userID}> has claimed ${name} !`);
                                                            })
                                                            let fincoin = coins - 5000;
                                                            con.query(`UPDATE roll SET availability = 'Claimed' WHERE name = "${name}" AND animename = "${anime}"`)
                                                            con.query(`UPDATE roll SET claimedby = "${claimingUser.id}" WHERE name = "${name}" AND animename  = "${anime}"`)
                                                            con.query(`UPDATE roll SET claimuser = '${claimingUser.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}' WHERE name = "${name}" AND animename = "${anime}"`)
                                                            con.query(`DELETE FROM unclaimed WHERE name = "${name}" AND animename = "${anime}"`)
                                                            con.query(`INSERT INTO claimed (name, id, username) VALUES ("${name}", "${claimingUser.id}", "${claimingUser.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}") `)
                                                            con.query(`UPDATE coins SET coins = ${fincoin} WHERE id = "${claimingUser.id}"`)
                                                            con.query(`SELECT * FROM coins  WHERE id = "${claimingUser.id}"`, (err, rows) => {
                                                                if (rows[0].coins != fincoin) con.query(`UPDATE coins SET coins = ${fincoin} WHERE id = "${claimingUser.id}"`)
                                                            })
                                                        }
                                                        m.reactions.cache.clear();
                                                    });
                                                }
                                            );

                                        } catch (error) {
                                            console.log(error)
                                            return msg.channel.send("Looks like we're out of people to roll")
                                        }
                                    })
                                });
                            });
                        });
                    });
                })
            })
        })
    },
}