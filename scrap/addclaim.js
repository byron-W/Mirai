const Discord = require("discord.js");
const { light_pink } = require("../config.json");

module.exports = {
    name: 'addclaim',
    description: 'Add a claim to database',
    usage: '<name> | <anime name> | <image from myanimelist>',
    cooldown: 5,
    class: 'devcmd',
    args: true,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            con.query(`SELECT * FROM roll`, (err, rows) => {
                if (err) return catchErr(err, msg, `${module.exports.name}.js`)
                let rollrank = rows.length + 1;
                con.query(`SELECT * FROM unclaimed`, (err, rows) => {
                    if (err) return catchErr(err, msg, `${module.exports.name}.js`)
                    let name = linkargs[0];
                    let anime = linkargs[1];
                    let image = linkargs[2];
                    if ((!name) || (!anime) || (!image)) return msg.channel.send("You didn't supply the right the information")
                    con.query(`INSERT INTO unclaimed (name, animename, availability, image, claimedby, charid, claimuser) VALUES("${name}", "${anime}", 'Unclaimed', '${image}', 'None', ${rollrank}, 'None')`, (err, rows) => {
                        if (err) return catchErr(err, msg, `${module.exports.name}.js`)
                        con.query(`INSERT INTO roll (name, animename, availability, image, claimedby, charid, claimuser) VALUES("${name}", "${anime}", "Unclaimed", '${image}', 'None', ${rollrank}, 'None')`, (err, rows) => {
                            if (err) return catchErr(err, msg, `${module.exports.name}.js`)
                            con.query(`SELECT * FROM roll WHERE name LIKE "%${name}%"`, (err, rows) => {
                                if (err) return catchErr(err, msg, `${module.exports.name}.js`)
                                let pername = rows[0].name;
                                let aniname = rows[0].animename;
                                let image = rows[0].image;
                                let imEmbed = new Discord.MessageEmbed()
                                    .setTitle(pername)
                                    .setDescription(aniname)
                                    .setImage(image)
                                    .setColor(light_pink)
                                msg.channel.send(imEmbed)
                            });
                        });
                    });
                });
            });
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`)
        }
    },
}