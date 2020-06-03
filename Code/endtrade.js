module.exports = {
    name: 'endtrade',
    description: `End the current trade you're in`,
    args: false,
    usage: '',
    cooldown: 10,
    class: 'waifu',
    execute(msg, args, con) {
        let author = msg.author;
        con.query(`SELECT * FROM trading`, (err, rows) => {
            if (rows.length < 1) return msg.channel.send("There isn't an active trading event")
            let ogtrader = rows[0].id;
            let recip = rows[1].id;
            if ((ogtrader != author.id) && (recip != author.id) && (author.id != '250072488929787924')) return msg.channel.send("You aren't one of the people trading")
            con.query(`DELETE FROM trading`)
            return msg.channel.send(`The trading was called off`)
        });
    }
}