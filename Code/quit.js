module.exports = {
    name: 'quit',
    description: 'Stop all games and leave the voice channel',
    usage: '',
    cooldown: 10,
    class: 'vc',
    args: false,
    execute(msg, args, con) {
        let clientVoiceConnection = msg.guild.voice.connection;
        if (!clientVoiceConnection) return msg.channel.send(`I have to be in a voice channel to quit`)
        clientVoiceConnection.disconnect();
        con.query(`UPDATE randomsong SET activity = "Inactive"`)
        return msg.channel.send("Game Ended! I look forward to playing again!");
    },
}