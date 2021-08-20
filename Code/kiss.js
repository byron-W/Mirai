const superagent = require("superagent");
const { loadmeme, cyan } = require("../config.json");
const { tenor_apikey } = require("../token.json");
const Discord = require("discord.js");

module.exports = {
	name: 'kiss',
	description: `Give someone a kiss, heck even give one to me :flushed:`,
	aliases: ['french', 'smooch', 'mwah'],
	usage: '',
	cooldown: 2,
	class: 'fun',
	args: true,
	async execute(msg, args, con, linkargs, client, catchErr) {
		let user = msg.mentions.members.first();
		let botmen = msg.mentions.has(client.user.id);
		if (user.id === msg.author.id) {
			msg.channel.send("That's kinda sad ngl. You could always just give me a kiss :flushed:");
			return;
		}
		const loading = client.emojis.cache.get(loadmeme);
		let gen = await msg.channel.send(`Generating... ${loading}`);
		const randomNumber = (Math.floor(Math.random() * 50) + 1);
		let { body } = await superagent
			.get("https://api.tenor.com/v1/search?q=anime%20kiss&limit=50&key=" + tenor_apikey).catch(err => {
				gen.delete()
				catchErr(err, msg, `${module.exports.name}.js`, "I couldn't pull any gifs :(")
				return;
			});
		if ((user) && (!botmen) && (user.id !== msg.author.id)) {
			const kuembed = new Discord.MessageEmbed()
				.setDescription(`**${user.displayName} you got kissed by ${msg.author.username} :heart:**`)
				.setColor(cyan)
				.setImage(body.results[randomNumber].media[0].gif.url)
				.setFooter("Gifs provided by courtesy of Tenor")
			msg.channel.send(kuembed);
			gen.delete();
		} else if (botmen) {
			const kbembed = new Discord.MessageEmbed()
				.setDescription(`**Love you too :kissing_heart:**`)
				.setColor(cyan)
				.setImage(body.results[randomNumber].media[0].gif.url)
				.setFooter("Gifs provided by courtesy of Tenor")
			msg.channel.send(kbembed);
			gen.delete();
		} if ((!user) && (!help) && (!botmen)) {
			gen.delete();
			msg.channel.send("You didn't mention a user to kiss").then(sentMessage => {
				sentMessage.delete(5000)
			});
		}
	},
}