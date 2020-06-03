//const Discord = require("discord.js");
//const client = new Discord.Client();
//const tokenfile = require("../token.json");
//const token = tokenfile.token;
//const config = require("../config.json");
//const prefix = config.prefix;
//const mustard = config.mustard;
//const mysql = require("mysql");
//const sqlpass = tokenfile.sqlpass;

//var con = mysql.createConnection({
//    host: "localhost",
//    user: "root",
//    password: sqlpass,
//    database: "petuniabase"
//});
//con.connect(err => {
//    if (err) throw err;
//    console.log("Poll connected to database");
//});
//client.on("message", async msg => {
//    if (!msg.guild) return;     //Doesn't allow command to be run outside the server

//    const args = msg.content.slice(prefix.length).trim().split(/ +/);      //Takes away the prefix and command to make the array 0 based. Equals everything after
//    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

//    if (!msg.content.startsWith(prefix)) return;

//    let author = msg.author;

//    if ((command === "poll") || (command === "p")) {
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`**This is a moderator only command**\nCreates a poll\n${prefix}poll <name&Answer 1&Answer 2&etc...>`);
//        } else {
//            let mod = msg.member.hasPermission("MANAGE_MESSAGES");
//            if (!mod) return msg.reply("You are not worthy :smirk:")
//            if (!args[0]) return msg.channel.send("You didn't supply a question or answers")
//            con.query(`SELECT * FROM poll`, (err, rows) => {
//                if (err) throw err;
//                if (rows.length >= 0) return msg.channel.send("There's already an active poll")
//                let answers = '';
//                let rank = 1;
//                let pollrank = 1;
//                const questionargs = msg.content.slice(prefix.length + command.length).trim().split("&")
//                let question = questionargs[0]
//                questionargs.shift();
//                questionargs.forEach((arg) => {
//                    answers += `\n#${rank++} ${arg}`
//                    con.query(`INSERT INTO poll (createdby, questions, votes, questionid, question) VALUES ("${author.username}", '${arg}', 0, ${pollrank++}, '${question}')`)

//                })
//                con.query(`INSERT INTO poll (createdby, questions, votes, questionid, question) VALUES("${author.username}", 'pollquestion', 0, ${rank}, '${question}')`)
//                let pollembed = new Discord.RichEmbed()
//                    .setTitle(`Poll: ${question}`)
//                    .setColor(mustard)
//                    .setDescription(answers)
//                    .setFooter(`Poll created by ${author.username}`, author.avatarURL)
//                msg.channel.send(pollembed);
//            });
//        }
//    }
//    if ((command === "vote") || (command === "v")) {
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`Votes on the poll\n${prefix}vote <question number>`);
//        } else {
//            con.query(`SELECT * FROM poll`, (err, rows) => {
//                let vote = parseInt(args[0]);
//                if (!vote) return msg.channel.send("You've gotta tell me where you wanna vote")
//                if (err) throw err;
//                if (rows < 1) return msg.channel.send("There isn't an active poll")
//                con.query(`SELECT * FROM poll WHERE questionid = ${vote}`, (err, rows) => {
//                    if (err) throw err;
//                    if (rows < 1) return msg.channel.send("That question doesn't exist")
//                    let question = rows[0].questions;
//                    let currentvote = rows[0].votes;
//                    let finalvotes = currentvote + 1;
//                    con.query(`SELECT * FROM voted WHERE id = "${author.username}"`, (err, rows) => {
//                        if (err) throw err;
//                        if (rows.length > 0) return msg.channel.send("You have already voted")
//                        con.query(`UPDATE poll SET votes = ${finalvotes} WHERE questionid = ${vote}`)
//                        con.query(`INSERT INTO voted (id) VALUES ("${author.username}")`)
//                        let voteembed = new Discord.RichEmbed()
//                            .setTitle(`Your vote was added to __${question}__`)
//                            .setColor(mustard)
//                        msg.channel.send(voteembed);
//                    });
//                });
//            });
//        }
//    }
//    if ((command === "pollstats") || (command === "pstats")) {
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`Shows the current poll\n${prefix}pollstats`);
//        } else {
//            let mod = msg.member.hasPermission("MANAGE_MESSAGES");
//            if (!mod) return msg.reply("You are not worthy :smirk:")
//            con.query(`SELECT * FROM poll`, (err, rows) => {
//                if (err) throw err;
//                if (rows < 1) return msg.channel.send("There isn't an active poll")
//                con.query(`SELECT * FROM poll LIMIT ${rows.length - 1}`, (err, rows) => {
//                    let JSONroles = JSON.stringify(rows);
//                    let parsedRoles = JSON.parse(JSONroles);
//                    var rank = 1;
//                    let finmsg = '';
//                    let creator = rows[0].createdby;
//                    parsedRoles.forEach((row) => {
//                        finmsg += `\n#${rank++} ${row.questions} - Votes: ${row.votes}`;
//                    })
//                    con.query(`SELECT question FROM poll WHERE questions = 'pollquestion'`, (err, rows) => {
//                        if (err) throw err;
//                        if (rows.length < 1) return msg.channel.send("There isn't an active poll")
//                        let pollquestion = rows[0].question;
//                        let pollembed = new Discord.RichEmbed()
//                            .setTitle(`Poll: ${pollquestion}`)
//                            .setColor(mustard)
//                            .setDescription(finmsg)
//                            .setFooter(`Poll created by ${creator}`)
//                        msg.channel.send(pollembed);
//                    });
//                });
//            });
//        }
//    }
//    if ((command === "pollend") || (command === "pend")) {
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`**This is a moderator only command**\nEnds a poll\n${prefix}pollend`);
//        } else {
//            con.query(`SELECT * FROM poll`, (err, rows) => {
//                if (err) throw err;
//                if (rows < 1) return msg.channel.send("There isn't an active poll")
//                con.query(`SELECT * FROM poll LIMIT ${rows.length - 1}`, (err, rows) => {
//                    let JSONroles = JSON.stringify(rows);
//                    let parsedRoles = JSON.parse(JSONroles);
//                    var rank = 1;
//                    let finmsg = '';
//                    let creator = rows[0].createdby;
//                    parsedRoles.forEach((row) => {
//                        finmsg += `\n#${rank++} ${row.questions} - Votes: ${row.votes}`;
//                    })
//                    con.query(`SELECT question FROM poll WHERE questions = 'pollquestion'`, (err, rows) => {
//                        if (err) throw err;
//                        if (rows < 1) return msg.channel.send("There isn't an active poll")
//                        let pollquestion = rows[0].question;
//                        let pollembed = new Discord.RichEmbed()
//                            .setTitle(`Poll: ${pollquestion}`)
//                            .setColor(mustard)
//                            .setDescription(finmsg)
//                            .setFooter(`Poll created by ${creator}`)
//                        msg.channel.send(pollembed);
//                        con.query(`DELETE FROM poll`);
//                        con.query(`DELETE FROM voted`);
//                        msg.channel.send("Poll has successfully ended\nHere are the results")
//                    });
//                });
//            });
//        }
//    }
//});
//client.login(token);