module.exports = {
    name: 'deletemyrole',
    description: `Remove one of your economy roles`,
    usage: '<role>',
    aliases: ['dmr', 'deleterole', 'dmyr'],
    class: 'economy',
    cooldown: 5,
    args: true,
    execute(msg, args, con) {
        let author = msg.author;
        let roleName = args.join(" ");
        let mentionedRole = msg.guild.roles.cache.find(r => r.name === roleName);
        if (!mentionedRole) return msg.channel.send("That role doesn't exist");
        const member = msg.guild.member(author);
        if (!member.roles.cache.find(f => f.name === roleName)) return msg.channel.send("You don't have that role")
        con.query(`SELECT * FROM boughtroles WHERE roles = '${roleName}' AND id = "${author.id}"`, (err, rows) => {
            if (rows.length < 1) {
                return msg.channel.send("You don't have that role");
            } else {
                con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                    if (err) throw err;
                    if (rows.length < 1) con.query(`INSERT INTO coins (id, coins, bank, total, username) VALUES ("${author.id}", 0, 0, 0, "${msg.author.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}")`)
                    let coins = rows[0].coins;
                    con.query(`SELECT * FROM roles WHERE name = '${roleName}'`, (err, rows) => {
                        if (err) throw err;
                        let price = rows[0].value;
                        if (price > coins) return msg.channel.send("You're too broke to buy this");
                        let newbal = coins + price;
                        con.query(`UPDATE coins SET coins = ${newbal} WHERE id = "${author.id}"`);
                        con.query(`SELECT * FROM coins WHERE id = "${author.id}"`, (err, rows) => {
                            let checkcoins = rows[0].coins;
                            if (checkcoins != newbal) con.query(`UPDATE coins SET coins = ${newbal} WHERE id = "${author.id}"`);
                        });
                        con.query(`DELETE FROM boughtroles WHERE roles = '${roleName}' AND id = "${author.id}"`);
                        member.roles.remove(mentionedRole).catch(console.error)
                        return msg.channel.send(`You have sold ${mentionedRole.toString()} and gained ${price} coins`);
                    })
                })
            }
        });
    },
}