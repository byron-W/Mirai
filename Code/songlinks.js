const Discord = require("discord.js");
const { red } = require("../config.json");

module.exports = {
    name: 'songlinks',
    description: 'Get the youtube playlist links for all songs featured on the bot',
    usage: '',
    aliases: ['sl'],
    cooldown: 10,
    class: 'info',
    args: false,
    execute(msg) {
        let linkembed = new Discord.MessageEmbed()
            .setTitle("Youtube Playlists for anime songs")
            .setDescription("[Link for OPs](https://www.youtube.com/playlist?list=PLjVabt8Kb-425NzP8La-lnzLz2yriOLea)\n[Link for EDs](https://www.youtube.com/playlist?list=PLjVabt8Kb-43FlbE0e0aMiVddH2ChIsu9)\n[Link for OSTs](https://www.youtube.com/playlist?list=PLjVabt8Kb-42AQqVIWAO4SVCIELJkzDFE)\n\
                                [Link for Intermission Songs](https://www.youtube.com/playlist?list=PLjVabt8Kb-40mRu4iHGNwv8mwdVTLpdGk)")
            .setColor(red)
        return msg.channel.send(linkembed)
    },
}