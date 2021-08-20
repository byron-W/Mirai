module.exports = {
	name: 'goodmorning',
	description: 'WAKE THE FUCK UP',
	usage: '',
	aliases: ['gm', 'gmorning', 'morning'],
	cooldown: 2,
	class: 'fun',
	args: false,
	execute(msg) {
		if (msg.author.id === '250072488929787924') return msg.channel.send(`*goodmorning* :heart: :blush:`, { files: ["../reactions/waking.gif"] });
	},
}