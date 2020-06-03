module.exports = {
    name: 'purge',
    description: `Delete up to 100 messages at a time`,
    aliases: ['prune', 'clear'],
    usage: '<# of messages>',
    cooldown: 5,
    class: 'moderation',
    args: true,
    async execute(msg, args) {
        let numofmsg = parseInt(args[0]);     //The number of messages that the user decides
        if (!numofmsg) return msg.channel.send(`You didn't specify how many messages to delete`)
        numofmsg = Math.round(numofmsg);        //Rounds the number of messages
        let actualnum = numofmsg + 1;
        if (actualnum > 100) actualnum = 100;
        try {
            msg.channel.bulkDelete(actualnum, true)
            if (numofmsg > 100) numofmsg = 100;
            await msg.channel.send(`Successfully deleted ${numofmsg} messages!`).then(delmsg => {
                delmsg.delete({ timeout: 3000 });
            })
        } catch (error) {
            console.log(error)
            return msg.channel.send("You have input a number");
        }
    },
}