const { MessageAttachment } = require("discord.js");
const fs = require('fs');
module.exports = {
    name: 'debuglog',
    description: 'Get debug logs',
    usage: '',
    cooldown: 10,
    class: 'devcmd',
    args: false,
    async execute(msg, args, con, linkargs, client, catchErr) {
        const bruh = new Date(Date.now())
        if (!args[0]) {
            const PATH = `./Logs/Debug/${bruh.getMonth() + 1}_${bruh.getDate()}_${bruh.getFullYear()}--Debug.txt`;
            try {
                const file = fs.readFile(PATH)
            } catch (err) {
                return msg.channel.send("There isn't a debug log for today");
            }
            let data = new MessageAttachment(PATH);
            msg.reply("Today's debug log", data);
        } else {
            const PATH = `${args[0]}--Debug.txt`;
            console.log(PATH)
            try {
                const file = fs.readFile(PATH)
            } catch (err) {
                return msg.channel.send("There isn't a debug log for that day");
            }
            let data = new MessageAttachment(PATH);
            msg.reply(`${args[0]}'s debug log`, data);
        }
    },
}