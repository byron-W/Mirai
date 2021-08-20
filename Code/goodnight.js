module.exports = {
	name: 'goodnight',
	description: 'GO THE FUCK TO SLEEP',
	usage: '',
	aliases: ['gn', 'gnight', 'night'],
	cooldown: 2,
	class: 'fun',
	args: false,
	execute(msg) {
		if (author.id === devid) return msg.channel.send(`*goodnight* :heart: :sleeping:`, { files: ["./reactions/sleeping.gif"] });
	},
}