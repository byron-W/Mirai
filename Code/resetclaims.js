module.exports = {
    name: 'resetclaims',
    description: 'Reset claims for all users',
    usage: '',
    cooldown: 10,
    class: 'admin',
    args: false,
    execute(msg, args, con, linkargs, client, catchErr) {
        try {
            msg.reply(`Are you 100% sure you want to reset the claims for everyone? Say "yes" or "no" to make your decision `)
            const yes = m => m.content.includes('yes') && m.author.id === msg.author.id;
            const no = m => m.content.includes('no') && m.author.id === msg.author.id;
            const yescollector = msg.channel.createMessageCollector(yes, { time: 10000 });
            const nocollector = msg.channel.createMessageCollector(no, { time: 15000 });
            yescollector.on('collect', m => {
                yescollector.stop();
                nocollector.stop();
                con.query(`DELETE FROM claimed`);
                con.query(`DELETE FROM unclaimed`);
                con.query(`UPDATE roll SET availability = 'Unclaimed'`)
                con.query(`UPDATE roll SET claimedby = 'None'`)
                con.query(`UPDATE roll SET claimuser = 'None'`)
                con.query(`INSERT INTO unclaimed SELECT * FROM roll WHERE availability = 'Unclaimed';`)
                return msg.channel.send("The claims have been released into the wild")
                yescollector.on('end', collected => {
                    return msg.channel.send("I don't have all day bro, im out")
                });
            });
            nocollector.on('collect', m => {
                nocollector.stop();
                yescollector.stop();
                return msg.channel.send("You have chosen to spare everyone, wise decision");
                nocollector.on('end', collected => {
                    return msg.channel.send("I don't have all day bro, im out")
                });
            });
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}