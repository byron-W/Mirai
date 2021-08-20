module.exports = {
	name: 'stepbrothers',
	description: 'GO THE FUCK TO SLEEP',
	usage: '',
	aliases: ['stepbrother', 'stepbro', 'brothers', 'brother'],
	cooldown: 2,
	class: 'fun',
	args: false,
	execute(msg) {
		let steparray = ['BRANDON HAS A MANGINA', 'IM GONNA ROLL YOU INTO A LITTLE BALL AND PUT YOU UP MY VAGINA'];
		const ranpin = Math.floor(Math.random() * steparray.length);
		msg.channel.send(steparray[ranpin])
	},
}