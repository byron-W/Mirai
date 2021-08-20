const superagent = require('superagent');
const { loadmeme } = require('../config.json');

module.exports = {
	name: 'woof',
	description: 'Show some cute dogs',
	aliases: ['doggo', 'dogs', 'dog'],
	usage: '',
	cooldown: 1,
	class: 'fun',
	args: false,
	async execute(msg, args, con, linkargs, client, catchErr) {
		const loading = client.emojis.cache.get(loadmeme);
		let gen = await msg.channel.send(`Generating... ${loading}`);
		let { body } = await superagent
			.get("https://random.dog/woof.json").catch(err => {
				gen.delete()
				catchErr(err, msg, `${module.exports.name}.js`, "I couldn't pull an image :(")
				return;
			});
		msg.channel.send(body.url)
		gen.delete();
	},
}