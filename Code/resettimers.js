module.exports = {
    name: 'resettimers',
    description: 'Reset the timers for all users',
    usage: '',
    cooldown: 10,
    class: 'devcmd',
    args: false,
    execute(msg, args, con) {
        msg.reply(`Are you 100% sure you want to reset the timers for everyone? Say "yes" or "no" to make your decision `)
        const yes = m => m.content.includes('yes') && m.author.id === msg.author.id;
        const no = m => m.content.includes('no') && m.author.id === msg.author.id;
        const yescollector = msg.channel.createMessageCollector(yes, { time: 10000 });
        const nocollector = msg.channel.createMessageCollector(no, { time: 15000 });
        yescollector.on('collect', m => {
            yescollector.stop();
            nocollector.stop();
            con.query(`UPDATE dailytimer SET lastclaimed = 'Unclaimed'`);
            con.query(`UPDATE rolltimer SET lastused = 'Unused'`);
            con.query(`UPDATE rolltimer SET uses = 0`);
            con.query(`UPDATE deposittimer SET lastused = 'Unused'`);
            con.query(`UPDATE withdrawtimer SET lastused = 'Unused'`);
            con.query(`UPDATE robtimer SET lastused = 'Unused'`);
            return msg.channel.send("The timers have been reset")
            yescollector.on('end', collected => {
                return msg.channel.send("I don't have all day bro, im out")
            });
        });
        nocollector.on('collect', m => {
            nocollector.stop();
            yescollector.stop();
            return msg.channel.send("And the endless march of time continues");
            nocollector.on('end', collected => {
                return msg.channel.send("I don't have all day bro, im out")
            });
        });
    }
}