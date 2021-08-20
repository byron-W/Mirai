const Discord = require("discord.js");

module.exports = {
    name: 'buyrole',
    description: `Buy an economy role from the shop`,
    usage: '<role>',
    aliases: ['buyr', 'br'],
    class: 'economy',
    cooldown: 5,
    args: true,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let author = msg.author
            let itemName = args[0];
            let member = msg.guild.member(author);
            let mentionedRole = msg.guild.roles.cache.find(r => r.name === itemName)
            if (!mentionedRole) return msg.channel.send("That isn't in the store. Please check your spelling to make sure it's spelled exaclty how it's listed")
            if (member.roles.cache.find(f => f.name === itemName)) return msg.channel.send("You already have that role")
            con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, async (err, rows) => {
                if (err) return msg.channel.send("You broke nigga")
                if (!rows[0]) return msg.channel.send("You broke nigga")
                let coins = rows[0].coins;
                con.query(`SELECT * FROM roles WHERE name = '${itemName}'`, (err, rows) => {
                    if (err) return msg.channel.send("That isn't in the store. Please check your spelling to make sure it's spelled exaclty how it's listed")
                    let price = rows[0].value;
                    if (price > coins) return msg.channel.send("You're too broke to buy this");
                    let newbal = coins - price;
                    con.query(`UPDATE coins SET coins = ${newbal} WHERE id = "${author.id}"`);
                    con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                        let checkcoins = rows[0].coins;
                        if (checkcoins != newbal) con.query(`UPDATE coins SET coins = ${newbal} WHERE id = "${author.id}"`);
                    });
                    con.query(`INSERT INTO boughtroles (roles, id) VALUES ('${itemName}', "${author.id}")`);
                    member.roles.add(mentionedRole).catch(console.error)
                    let brembed = new Discord.MessageEmbed()
                        .setTitle(`You've successfully purchased ${mentionedRole.name}`)
                        .setColor(mentionedRole.color)
                    msg.reply(brembed);
                });
            });
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}
