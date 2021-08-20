module.exports = {
	name: 'sonic',
	description: 'GO THE FUCK TO SLEEP',
	usage: '',
	aliases: ['imfastasfuckboi'],
	cooldown: 2,
	class: 'fun',
	args: false,
	execute(msg) {
		let sonicarray = ['SONIC FEET AND BDSM', 'COCK RING', 'WHITE PRIVILLEGE', 'MIXED RACE COUPLE', 'FURRY COUPLE', 'THEY BOMBED THE FURRY', 'FURRY BROMANCE', 'Uh oh stinky', 'SSB SONIC', 'SON OF THE UGH', 'SONIC ABDUCTION', 'MUSHROOM PLANET', 'DR EGGNUTS', 'FLOSSING', 'ROCKONASANCE', 'SEX ATTIC', 'OLIVE GARDEN GIFT CARD', 'SONIC GOT THE YEEZYS', 'SONIC SEX']
		const ranpin = Math.floor(Math.random() * sonicarray.length);
		msg.channel.send(sonicarray[ranpin])
	},
}