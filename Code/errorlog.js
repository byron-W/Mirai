const { MessageAttachment } = require("discord.js");
const fs = require("fs")
module.exports = {
    name: 'errorlog',
    description: 'Get error logs',
    usage: '',
    cooldown: 10,
    class: 'devcmd',
    args: false,
    execute(msg, args) {
        const bruh = new Date(Date.now())
        if (!args[0]) {
            const PATH = `./Logs/Error/${bruh.getMonth() + 1}_${bruh.getDate()}_${bruh.getFullYear()}.txt`
            if (!fs.existsSync(PATH)) {
                return msg.channel.send("There isn't an error log for today");
            }
            let data = new MessageAttachment(PATH);
            msg.reply("Today's error log", data);
        } else {
            const PATH = `./Logs/Error/${args[0]}.txt`
            if (!fs.existsSync(PATH)) {
                return msg.channel.send("There isn't an error log for that day");
            }
            let data = new MessageAttachment(PATH);
            msg.reply(`${args[0]}'s error log`, data);
        }
    },
}