const superagent = require("superagent");
const { loadmeme, cyan } = require("../config.json");
const { tenor_apikey } = require("../token.json");
const Discord = require("discord.js");

module.exports = {
	name: 'cry',
	description: 'Let the pain out',
	aliases: ['sob', 'weep', 'pain'],
	usage: '',
	cooldown: 2,
	class: 'fun',
	args: false,
	async execute(msg, args, con, linkargs, client, catchErr) {
		const loading = client.emojis.cache.get(loadmeme);
		let gen = await msg.channel.send(`Generating... ${loading}`);
		let { body } = await superagent
			.get("https://api.tenor.com/v1/search?q=anime%20cry&limit=50&key=" + tenor_apikey).catch(err => {
				gen.delete()
				catchErr(err, msg, `${module.exports.name}.js`, "I couldn't pull any gifs :(")
				return;
			});
		const randomNumber = (Math.floor(Math.random() * 50) + 1);
		const cryembed = new Discord.MessageEmbed()
			.setDescription(`*There there **${msg.author.username}***, go ahead and let out those feelings`)
			.setColor(cyan)
			.setImage(body.results[randomNumber].media[0].gif.url)
			.setFooter("Gifs provided by courtesy of Tenor")
		msg.channel.send(cryembed);
		gen.delete();
	},
}