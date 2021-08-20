const superagent = require("superagent");
const { loadmeme, cyan } = require("../config.json");
const { tenor_apikey } = require("../token.json");
const Discord = require("discord.js");

module.exports = {
	name: 'roundhouse',
	description: `Kick someone who deserves it, or doesn't. I don't care`,
	aliases: ['brucelee'],
	usage: '',
	cooldown: 2,
	class: 'fun',
	args: true,
	async execute(msg, args, con, linkargs, client, catchErr) {
		let user = msg.mentions.members.first();
		let botmen = msg.mentions.has(client.user.id);
		if (user.id === msg.author.id) {
			msg.channel.send("Unless you're really flexible, I'm not sure that's possible")
			return;
		}
		const loading = client.emojis.cache.get(loadmeme);
		let gen = await msg.channel.send(`Generating... ${loading}`);
		if ((user) && (!botmen) && (user.id !== msg.author.id)) {
			let { body } = await superagent
				.get("https://api.tenor.com/v1/search?q=anime%20kick&limit=50&key=" + tenor_apikey).catch(err => {
					gen.delete()
					catchErr(err, msg, `${module.exports.name}.js`, "I couldn't pull any gifs :(")
					return;
				});
			const randomNumber = (Math.floor(Math.random() * 50) + 1);
			const suembed = new Discord.MessageEmbed()
				.setDescription(`**${user.displayName}, you got kicked by ${msg.author.username}**`)
				.setColor(cyan)
				.setImage(body.results[randomNumber].media[0].gif.url)
				.setFooter("Gifs provided by courtesy of Tenor")
			msg.channel.send(suembed);
			gen.delete();
		} else if (botmen) {
			const sbembed = new Discord.MessageEmbed()
				.setDescription(`**I'll go Bruce Lee on yo ass if you don't stop :anger:**`)
				.setColor(cyan)
				.setImage("https://media3.giphy.com/media/fwEFU48Uo0Vvq/giphy.gif")
			msg.channel.send(sbembed);
			gen.delete();
		} if ((!user) && (!help) && (!botmen)) {
			gen.delete();
			msg.channel.send("You didn't mention a user to kick").then(sentMessage => {
				sentMessage.delete(5000)
			});
		}
	},
}