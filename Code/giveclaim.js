module.exports = {
    name: 'giveclaim',
    description: `Give a user one of your claims`,
    usage: '<user> <character>',
    aliases: ['donate'],
    class: 'waifu',
    cooldown: 5,
    args: true,
    execute(msg, args, con, linkargs) {
        let user = msg.mentions.users.first();
        let author = msg.author;
        let tradewaifu = linkargs[1];
        if (!tradewaifu) return msg.channel.send("You didn't say who you wanted to trade")
        if (!user) return msg.channel.send("You didn't mention a user to trade with")
        con.query(`SELECT * FROM claimed WHERE id = "${author.id}" AND name LIKE "%${tradewaifu}%"`, (err, rows) => {
            if (rows.length < 1) return msg.channel.send("You don't have that waifu")
            let tradeoffer = rows[0].name;
            msg.reply(`Do you really want to give ${user.username} your **${tradeoffer}**? Say "yes" or "no" to make your decision `)
            const yes = m => m.content.includes('yes') && m.author.id === msg.author.id;
            const no = m => m.content.includes('no') && m.author.id === msg.author.id;
            const yescollector = msg.channel.createMessageCollector(yes, { time: 20000 });
            const nocollector = msg.channel.createMessageCollector(no, { time: 20000 });
            yescollector.on('collect', m => {
                yescollector.stop();
                nocollector.stop();
                con.query(`UPDATE roll SET claimedby = "${user.id}" WHERE claimedby = "${msg.author.id}" AND name = "${tradeoffer}"`)
                con.query(`UPDATE roll SET claimuser = "${user.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}" WHERE name = "${tradeoffer}" AND claimuser = "${msg.author.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}"`)
                con.query(`UPDATE claimed SET id = "${user.id}" WHERE id = "${msg.author.id}" AND name = "${tradeoffer}"`)
                con.query(`UPDATE claimed SET username = "${user.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}" WHERE id = "${msg.author.username.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}" AND name = "${tradeoffer}"`)
                return msg.channel.send("Donation Successful, I hope you made the right choice :(");
                yescollector.on('end', collected => {
                    return msg.channel.send("You took to long man, donation called off")
                });
            });
            nocollector.on('collect', m => {
                nocollector.stop();
                yescollector.stop();
                return msg.channel.send(":heart:IN THE NAME OF LOVE:heart:, you have kept your claim :)");
                nocollector.on('end', collected => {
                    return msg.channel.send("You took to long man, donation called off")
                });
            });
        });
    },
}