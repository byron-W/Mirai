module.exports = {
    name: 'divorce',
    description: 'Remove one of your claims',
    usage: '<character>',
    cooldown: 5,
    class: 'waifu',
    args: true,
    execute(msg, args, con) {
        try {
            let author = msg.author;
            let character = args.join(" ");
            con.query(`SELECT * FROM claimed WHERE name LIKE "%${character}%" AND id = "${author.id}"`, (err, rows) => {
                if (rows.length < 1) {
                    return msg.channel.send("You don't have that character");
                } else {
                    let name = rows[0].name
                    msg.reply(`Do you really want to go through with divorcing **${name}**? Say "yes" or "no" to make your decision `)
                    const yes = m => m.content.includes('yes') && m.author.id === msg.author.id;
                    const no = m => m.content.includes('no') && m.author.id === msg.author.id;
                    const yescollector = msg.channel.createMessageCollector(yes, { time: 15000 });
                    const nocollector = msg.channel.createMessageCollector(no, { time: 15000 });
                    yescollector.on('collect', m => {
                        yescollector.stop();
                        nocollector.stop();
                        con.query(`DELETE FROM claimed WHERE name = "${name}" AND id = "${author.id}"`);
                        con.query(`SELECT * FROM roll WHERE name = "${name}"`, (err, rows) => {
                            let anime = rows[0].animename
                            let image = rows[0].image
                            con.query(`UPDATE roll SET availability = 'Unclaimed' WHERE name = "${name}"`)
                            con.query(`UPDATE roll SET claimedby = 'None' WHERE name = "${name}"`)
                            con.query(`UPDATE roll SET claimuser = 'None' WHERE name = "${name}"`)
                            con.query(`INSERT INTO unclaimed (name, animename, availability, image, claimedby, claimuser) VALUES ("${name}", "${anime}", 'Unclaimed', "${image}", "None", "None")`)
                            return msg.channel.send("Divorce Successful, I hope you made the right choice :(");
                        });
                        yescollector.on('end', collected => {
                            return msg.channel.send("You took to long man, divorce called off")
                        });
                    });
                    nocollector.on('collect', m => {
                        nocollector.stop();
                        yescollector.stop();
                        msg.channel.send(":heart:IN THE NAME OF LOVE:heart:, you have called off the divorce :)");
                        nocollector.on('end', collected => {
                            return msg.channel.send("You took to long man, divorce called off")
                        });
                    });
                }
            });
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}