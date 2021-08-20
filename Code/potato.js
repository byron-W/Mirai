module.exports = {
	name: 'potato',
	description: 'Made for our special potato',
	usage: '',
	aliases: ['beans', 'limabeans', 'yang'],
	cooldown: 2,
	class: 'fun',
	args: false,
	execute(msg) {
		msg.channel.send(`:potato:`, { files: ["../Mirai/Reactions/potato.jpg"] });
	},
}