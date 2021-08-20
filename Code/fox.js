const superagent = require('superagent');
const { loadmeme } = require('../config.json');

module.exports = {
	name: 'fox',
	description: 'Show some cute foxes, although the pics are more aesthetic',
	aliases: ['foxy', 'foxes'],
	usage: '',
	cooldown: 1,
	class: 'fun',
	args: false,
	async execute(msg, args, con, linkargs, client, catchErr) {
		const loading = client.emojis.cache.get(loadmeme);
		let gen = await msg.channel.send(`Generating... ${loading}`);
		let { body } = await superagent
			.get("https://randomfox.ca/floof/").catch(err => {
				gen.delete()
				catchErr(err, msg, `${module.exports.name}.js`, "I couldn't pull an image :(")
				return;
			});
		msg.channel.send(body.image)
		gen.delete();
	},
}