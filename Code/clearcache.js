module.exports = {
    name: 'clearcache',
    description: 'Clear the database of non-guild members',
    usage: '',
    cooldown: 10,
    class: 'devcmd',
    args: false,
    async execute(msg, args, con) {
        msg.reply(`Are you 100% sure you want to clear the cache? Say "yes" or "no" to make your decision `)
        const yes = m => m.content.includes('yes') && m.author.id === msg.author.id;
        const no = m => m.content.includes('no') && m.author.id === msg.author.id;
        const yescollector = msg.channel.createMessageCollector(yes, { time: 10000 });
        const nocollector = msg.channel.createMessageCollector(no, { time: 15000 });
        yescollector.on('collect', async m => {
            yescollector.stop();
            nocollector.stop();
            let guildmem = msg.guild.members.cache.array().map(id => id.id);
            con.query(`SELECT id FROM dailytimer`, (err, rows) => {
                let JSONrows = JSON.stringify(rows);
                let parsedRows = JSON.parse(JSONrows);
                parsedRows.forEach((mem) => {
                    if (!guildmem.includes(mem.id)) con.query(`DELETE FROM dailytimer WHERE id = ${mem.id}`)
                })
            });
            con.query(`SELECT id FROM robtimer`, (err, rows) => {
                let JSONrows = JSON.stringify(rows);
                let parsedRows = JSON.parse(JSONrows);
                parsedRows.forEach((mem) => {
                    if (!guildmem.includes(mem.id)) con.query(`DELETE FROM robtimer WHERE id = ${mem.id}`)
                })
            });
            con.query(`SELECT id FROM rolltimer`, (err, rows) => {
                let JSONrows = JSON.stringify(rows);
                let parsedRows = JSON.parse(JSONrows);
                parsedRows.forEach((mem) => {
                    if (!guildmem.includes(mem.id)) con.query(`DELETE FROM rolltimer WHERE id = ${mem.id}`)
                })
            });
            con.query(`SELECT id FROM deposittimer`, (err, rows) => {
                let JSONrows = JSON.stringify(rows);
                let parsedRows = JSON.parse(JSONrows);
                parsedRows.forEach((mem) => {
                    if (!guildmem.includes(mem.id)) con.query(`DELETE FROM deposittimer WHERE id = ${mem.id}`)
                })
            });
            con.query(`SELECT id FROM withdrawtimer`, (err, rows) => {
                let JSONrows = JSON.stringify(rows);
                let parsedRows = JSON.parse(JSONrows);
                parsedRows.forEach((mem) => {
                    if (!guildmem.includes(mem.id)) con.query(`DELETE FROM withdrawtimer WHERE id = ${mem.id}`)
                })
            });
            con.query(`SELECT id FROM coins`, (err, rows) => {
                let JSONrows = JSON.stringify(rows);
                let parsedRows = JSON.parse(JSONrows);
                parsedRows.forEach((mem) => {
                    if (!guildmem.includes(mem.id)) con.query(`DELETE FROM coins WHERE id = ${mem.id}`)
                })
            });
            con.query(`SELECT id FROM boughtroles`, (err, rows) => {
                let JSONrows = JSON.stringify(rows);
                let parsedRows = JSON.parse(JSONrows);
                parsedRows.forEach((mem) => {
                    if (!guildmem.includes(mem.id)) con.query(`DELETE FROM boughtroles WHERE id = ${mem.id}`)
                })
            });
            con.query(`SELECT id FROM claimed`, (err, rows) => {
                let JSONrows = JSON.stringify(rows);
                let parsedRows = JSON.parse(JSONrows);
                parsedRows.forEach((mem) => {
                    if (!guildmem.includes(mem.id)) con.query(`DELETE FROM claimed WHERE id = ${mem.id}`)
                })
            });
            con.query(`SELECT id FROM giveaway`, (err, rows) => {
                let JSONrows = JSON.stringify(rows);
                let parsedRows = JSON.parse(JSONrows);
                parsedRows.forEach((mem) => {
                    if (!guildmem.includes(mem.id)) con.query(`DELETE FROM giveaway WHERE id = ${mem.id}`)
                })
            });
            con.query(`SELECT claimedby FROM roll`, (err, rows) => {
                let JSONrows = JSON.stringify(rows);
                let parsedRows = JSON.parse(JSONrows);
                let checkclaim = parsedRows.map(claim => claim.claimedby)
                console.log(checkclaim)
                var outputArray = [];
                var count = 0;
                var start = false;
                for (j = 0; j < checkclaim.length; j++) {
                    for (k = 0; k < outputArray.length; k++) {
                        if (checkclaim[j] == outputArray[k]) {
                            start = true;
                        }
                    }
                    count++;
                    if (count == 1 && start == false) {
                        outputArray.push(checkclaim[j]);
                    }
                    start = false;
                    count = 0;
                }
                outputArray.forEach((mem) => {
                    if (mem === "None") return;
                    if (!guildmem.includes(mem)) {
                        con.query(`SELECT * FROM roll WHERE claimedby = ${mem}`, (err, rows) => {
                            let claimrows = JSON.stringify(rows);
                            let parsedclaims = JSON.parse(claimrows);
                            parsedclaims.forEach((claim) => {
                                console
                                con.query(`INSERT INTO unclaimed (name, animename, availability, image, claimedby, claimuser) VALUES ("${claim.name}", "${claim.animename}", 'Unclaimed', "${claim.image}", "None", "None")`)
                                con.query(`UPDATE roll SET availability = 'Unclaimed' WHERE claimedby = ${mem} AND name = '${claim.name}'`)
                                con.query(`UPDATE roll SET claimuser = 'None' WHERE claimedby = ${mem} AND name = '${claim.name}'`)
                                con.query(`UPDATE roll SET claimedby = 'None' WHERE claimedby = ${mem} AND name = '${claim.name}'`)
                            })
                        })
                    }
                })
            });
            await msg.channel.send("Done?")
            yescollector.on('end', collected => {
                return msg.channel.send("I don't have all day bro, im out")
            });
        });
        nocollector.on('collect', m => {
            nocollector.stop();
            yescollector.stop();
            return msg.channel.send("And the endless march of time continues");
            nocollector.on('end', collected => {
                return msg.channel.send("I don't have all day bro, im out")
            });
        });
    }
}