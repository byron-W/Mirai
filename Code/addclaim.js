const Discord = require("discord.js");

module.exports = {
    name: 'addclaim',
    description: 'Add a claim to database',
    aliases: ['addc', 'ac'],
    usage: '<name> | <anime name> | <image from myanimelist>',
    cooldown: 5,
    class: 'devcmd',
    args: true,
    execute(msg, args, con, linkargs) {
        con.query(`SELECT * FROM roll`, (err, rows) => {
            if (err) return msg.channel.send("I couldn't find the table")
            let rollrank = rows.length + 1;
            con.query(`SELECT * FROM unclaimed`, (err, rows) => {
                let name = linkargs[0];
                let anime = linkargs[1];
                let image = linkargs[2];
                if ((!name) || (!anime) || (!image)) return msg.channel.send("You didn't supply the right the information")
                con.query(`INSERT INTO unclaimed (name, animename, availability, image, charid) VALUES("${name}", "${anime}", 'Unclaimed', '${image}', ${rollrank})`, (err, rows) => {
                    if (err) {
                        console.log(err)
                        return msg.channel.send("Error occured (unclaimed)")
                    }
                    con.query(`INSERT INTO roll (name, animename, availability, image, claimedby, charid) VALUES("${name}", "${anime}", "Unclaimed", '${image}', 'None', ${rollrank}, 'None')`, (err, rows) => {
                        if (err) {
                            console.log(err)
                            return msg.channel.send("Error occured (roll)")
                        }
                        con.query(`SELECT * FROM roll WHERE name LIKE "%${name}%"`, (err, rows) => {
                            if (err) return msg.channel.send("I couldn't find that person")
                            let pername = rows[0].name;
                            let aniname = rows[0].animename;
                            let image = rows[0].image;
                            let imEmbed = new Discord.MessageEmbed()
                                .setTitle(pername)
                                .setDescription(aniname)
                                .setImage(image)
                                .setColor(0xE06666)
                            msg.channel.send(imEmbed)
                        });
                    });
                });
            });
        });
    },
}