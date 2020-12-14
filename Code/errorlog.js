const { MessageAttachment } = require("discord.js");

module.exports = {
    name: 'errorlog',
    description: 'Get error logs',
    usage: '',
    cooldown: 10,
    class: 'devcmd',
    args: false,
    execute(msg, args, con, linkargs, client, catchErr) {
        const bruh = new Date(Date.now())
        if (!args[0]) {
            try {
                let data = new MessageAttachment(`./Logs/Error/${bruh.getMonth() + 1}_${bruh.getDate()}_${bruh.getFullYear()}.txt`);
                msg.reply("Today's error log", data);
            } catch (err) {
                return catchErr(err, msg, `${module.exports.name}.js`, "There isn't an error log for today");
            }
        } else {
            try {
                let path = args[0];
                let data = new MessageAttachment(`./Logs/Error/${path}.txt`);
                msg.reply(`${path}'s error log`, data);
            } catch (err) {
                return catchErr(err, msg, `${module.exports.name}.js`, "There isn't an error logs for that day");
            }
        }
    },
}