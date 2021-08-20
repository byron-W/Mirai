module.exports = {
	name: 'goodnight',
	description: 'GO THE FUCK TO SLEEP',
	usage: '',
	aliases: ['gn', 'gnight', 'night'],
	cooldown: 2,
	class: 'fun',
	args: false,
	execute(msg) {
		if (msg.author.id === '250072488929787924') return msg.channel.send(`*goodnight* :heart: :sleeping:`, { files: ["../Mirai/Reactions/sleeping.gif"] });
	},
}