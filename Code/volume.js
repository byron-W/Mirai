module.exports = {
    name: 'volume',
    description: 'Change the volume to a percentage between 1 and 200',
    usage: '<number>',
    aliases: ['vol'],
    cooldown: 10,
    class: 'vc',
    args: true,
    execute(msg, args, con, linkargs, client, catchErr) {
        let clientVoiceConnection = msg.guild.voice.connection;
        if (!clientVoiceConnection) return msg.channel.send(`I have to be in a voice channel to change the volume`)
        let uservolume = parseInt(args[0])
        if (isNaN(uservolume)) return msg.channel.send("That's not a number")
        if (uservolume > 200) return msg.channel.send("I can't set the volume past 200%")
        let newvolume = uservolume / 100;
        try {
            clientVoiceConnection.dispatcher.setVolume(newvolume)
            return msg.channel.send(`The volume has been sent to ${uservolume}%`)
        } catch (err) {
            if (err) return catchErr(err, msg, `${module.exports.name}.js`, "I failed to change the volume")
        }
    },
}