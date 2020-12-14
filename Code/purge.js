module.exports = {
    name: 'purge',
    description: `Delete up to 100 messages at a time`,
    aliases: ['prune', 'clear'],
    usage: '<# of msg> or <user> <# of msg>',
    cooldown: 5,
    class: 'moderation',
    args: true,
    async execute(msg, args, con, linkargs, client, catchErr) {
        try {
            let numofmsg = parseInt(args[0]);     //The number of messages that the user decides
            if (!numofmsg) return msg.channel.send(`You didn't specify how many messages to delete`)
            numofmsg = Math.round(numofmsg);        //Rounds the number of messages
            let actualnum = numofmsg + 1;
            if (actualnum > 100) actualnum = 100;
            try {
                msg.channel.bulkDelete(actualnum, true)
                if (numofmsg > 100) numofmsg = 100;
                await msg.channel.send(`Successfully deleted ${numofmsg} message(s)!`).then(delmsg => {
                    delmsg.delete({ timeout: 1000 });
                })
            } catch (err) {
                catchErr(err, msg, `${module.exports.name}.js`, "You have input a number")
            }
        } catch (err) {
            return catchErr(err, msg, `${module.exports.name}.js`, "Dev")
        }
    },
}