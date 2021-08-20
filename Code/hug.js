const superagent = require("superagent");
const { loadmeme, cyan } = require("../config.json");
const { tenor_apikey } = require("../token.json");
const Discord = require("discord.js");

module.exports = {
	name: 'hug',
	description: `Show some love with a warm hug. I could use one too ngl :pleading_face:`,
	aliases: ['embrace', 'squeeze'],
	usage: '',
	cooldown: 2,
	class: 'fun',
	args: true,
	async execute(msg, args, con, linkargs, client, catchErr) {
		let user = msg.mentions.members.first();
		let botmen = msg.mentions.has(client.user.id);
		if (user.id === msg.author.id) {
			msg.channel.send("Seems like someone needs a hug. Just give me one :heart:");
			return;
		}
		const loading = client.emojis.cache.get(loadmeme);
		let gen = await msg.channel.send(`Generating... ${loading}`);
		if ((user) && (!botmen) && (user.id !== msg.author.id)) {
			let { body } = await superagent
				.get("https://api.tenor.com/v1/search?q=anime%20hug&limit=50&key=" + tenor_apikey).catch(err => {
					gen.delete()
					catchErr(err, msg, `${module.exports.name}.js`, "I couldn't pull any gifs :(")
					return;
				});
			const randomNumber = (Math.floor(Math.random() * 50) + 1);
			const huembed = new Discord.MessageEmbed()
				.setDescription(`**${user.displayName}, you got hugged by ${msg.author.username}**`)
				.setColor(cyan)
				.setImage(body.results[randomNumber].media[0].gif.url)
				.setFooter("Gifs provided by courtesy of Tenor")
			msg.channel.send(huembed);
			gen.delete();
		} else if (botmen) {
			const hbembed = new Discord.MessageEmbed()
				.setDescription(`**Awww thanks, I needed that :heart:**`)
				.setColor(cyan)
				.setImage("https://media.giphy.com/media/yu7COGOe9c9Rm/giphy.gif")
			msg.channel.send(hbembed);
			gen.delete();
		} if ((!user) && (!help) && (!botmen)) {
			gen.delete();
			msg.channel.send("You didn't mention a user to hug").then(sentMessage => {
				sentMessage.delete(5000)
			});
		}
	},
}