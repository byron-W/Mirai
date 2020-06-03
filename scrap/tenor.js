//const Discord = require("discord.js");
//const client = new Discord.Client();
//const superagent = require('superagent');
//const tokenfile = require("../token.json");
//const token = tokenfile.token;
//const apikey = tokenfile.tenor_apikey;
//const config = require("../config.json");
//const prefix = config.prefix;
//const cyan = config.cyan;

//client.on("message", async msg => {
//    if (!msg.guild) return;     //Doesn't allow command to be run outside the server

//    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
//    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

//    if (!msg.content.startsWith(prefix)) return;

//    //Crying command
//    if (command === "cry") {       //Shows how to run the command
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`You can cry away all those bad feelings\n${prefix}cry`);
//        } else {
//            let gen = await msg.channel.send("Generating...");
//            let { body } = await superagent
//                .get("https://api.tenor.com/v1/search?q=anime%20cry&limit=50&key=" + apikey).catch(error => {
//                    console.log(error);
//                    gen.delete();
//                    return msg.channel.send("Sorry but I couldn't pull any gifs :(");
//                });
//            const randomNumber = (Math.floor(Math.random() * 50) + 1);
//            const cryembed = new Discord.RichEmbed()
//                .setTitle(`**There there ${msg.author.username}, go ahead and let out those feelings**`)
//                .setColor(cyan)
//                .setImage(body.results[randomNumber].media[0].gif.url)
//                .setFooter("Gifs provided by courtesy of Tenor")
//            msg.channel.send(cryembed);
//            gen.delete();
//        }
//    }
//    if (command === "dance") {       //Shows how to run the command
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`Get down and boogie!\n${prefix}dance`);
//        } else {
//            let gen = await msg.channel.send("Generating...");
//            let { body } = await superagent
//                .get("https://api.tenor.com/v1/search?q=anime%20dance&limit=50&key=" + apikey).catch(error => {
//                    console.log(error);
//                    gen.delete();
//                    return msg.channel.send("Sorry but I couldn't pull any gifs :(");
//                });
//            const randomNumber = (Math.floor(Math.random() * 50) + 1);
//            const danceembed = new Discord.RichEmbed()
//                .setTitle(`Let's boogie **${msg.author.username}**`)
//                .setColor(cyan)
//                .setImage(body.results[randomNumber].media[0].gif.url)
//                .setFooter("Gifs provided by courtesy of Tenor")
//            msg.channel.send(danceembed);
//            gen.delete();
//        }
//    }

//    //Slapping command
//    if (command === "slap") {       //Shows how to run the command
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`You can slap a user or even me\nDon't fucking slap me\nI'll kill you bruh\n${prefix}slap <user>`);
//        } else {
//            let gen = await msg.channel.send("Generating...");
//            let user = msg.mentions.members.first();
//            let botmen = msg.isMemberMentioned(client.user);
//            if ((user) && (!botmen)) {
//                let { body } = await superagent
//                    .get("https://api.tenor.com/v1/search?q=anime%20slap&limit=50&key=" + apikey).catch(error => {
//                        console.log(error);
//                        gen.delete();
//                        return msg.channel.send("Sorry but I couldn't pull any gifs :(");
//                    });
//                const randomNumber = (Math.floor(Math.random() * 50) + 1);
//                const suembed = new Discord.RichEmbed()
//                    .setTitle(`**${user.displayName}, you got slapped by ${msg.author.username}**`)
//                    .setColor(cyan)
//                    .setImage(body.results[randomNumber].media[0].gif.url)
//                    .setFooter("Gifs provided by courtesy of Tenor")
//                msg.channel.send(suembed);
//                gen.delete();
//            } else if (botmen) {
//                const sbembed = new Discord.RichEmbed()
//                    .setTitle(`**You better watch out before I pop off**`)
//                    .setColor(cyan)
//                    .setImage("https://giffiles.alphacoders.com/109/109057.gif")
//                msg.channel.send(sbembed);
//                gen.delete();
//            } if ((!user) && (!help) && (!botmen)) {
//                gen.delete();
//                msg.channel.send("You didn't mention a user to slap").then(sentMessage => {
//                    sentMessage.delete(5000)
//                });
//            }
//        }
//    }
//    //Slapping command
//    if (command === "roundhouse") {       //Shows how to run the command
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`You can fuck up a user or even me\nI'll kill you bruh if you try me\n${prefix}roundhouse <user>`);
//        } else {
//            let gen = await msg.channel.send("Generating...");
//            let user = msg.mentions.members.first();
//            let botmen = msg.isMemberMentioned(client.user);
//            if ((user) && (!botmen)) {
//                let { body } = await superagent
//                    .get("https://api.tenor.com/v1/search?q=anime%20kick&limit=50&key=" + apikey).catch(error => {
//                        console.log(error);
//                        gen.delete();
//                        return msg.channel.send("Sorry but I couldn't pull any gifs :(");
//                    });
//                const randomNumber = (Math.floor(Math.random() * 50) + 1);
//                const suembed = new Discord.RichEmbed()
//                    .setTitle(`**${user.displayName}, you got kicked by ${msg.author.username}**`)
//                    .setColor(cyan)
//                    .setImage(body.results[randomNumber].media[0].gif.url)
//                    .setFooter("Gifs provided by courtesy of Tenor")
//                msg.channel.send(suembed);
//                gen.delete();
//            } else if (botmen) {
//                const sbembed = new Discord.RichEmbed()
//                    .setTitle(`**I'll go Bruce Lee on your ass if you don't stop :anger:**`)
//                    .setColor(cyan)
//                    .setImage("https://media3.giphy.com/media/fwEFU48Uo0Vvq/giphy.gif")
//                msg.channel.send(sbembed);
//                gen.delete();
//            } if ((!user) && (!help) && (!botmen)) {
//                gen.delete();
//                msg.channel.send("You didn't mention a user to slap").then(sentMessage => {
//                    sentMessage.delete(5000)
//                });
//            }
//        }
//    }
//    //Hugging command
//    if (command === "hug") {       //Shows how to run the command
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`You can hug a user or even me\nI appreciate all hugs given to me :smile:\n${prefix}hug <user>`);
//        } else {
//            let gen = await msg.channel.send("Generating...");
//            let user = msg.mentions.members.first();
//            let botmen = msg.isMemberMentioned(client.user);
//            if ((user) && (!botmen)) {
//                let { body } = await superagent
//                    .get("https://api.tenor.com/v1/search?q=anime%20hug&limit=50&key=" + apikey).catch(error => {
//                        console.log(error);
//                        gen.delete();
//                        return msg.channel.send("Sorry but I couldn't pull any gifs :(");
//                    });
//                const randomNumber = (Math.floor(Math.random() * 50) + 1);
//                const huembed = new Discord.RichEmbed()
//                    .setTitle(`**${user.displayName}, you got hugged by ${msg.author.username}**`)
//                    .setColor(cyan)
//                    .setImage(body.results[randomNumber].media[0].gif.url)
//                    .setFooter("Gifs provided by courtesy of Tenor")
//                msg.channel.send(huembed);
//                gen.delete();
//            } else if (botmen) {
//                const hbembed = new Discord.RichEmbed()
//                    .setTitle(`**Awww thanks, I needed that :heart:**`)
//                    .setColor(cyan)
//                    .setImage("https://media.giphy.com/media/yu7COGOe9c9Rm/giphy.gif")
//                msg.channel.send(hbembed);
//                gen.delete();
//            } if ((!user) && (!help) && (!botmen)) {
//                gen.delete();
//                msg.channel.send("You didn't mention a user to hug").then(sentMessage => {
//                    sentMessage.delete(5000)
//                });
//            }

//        }
//    }

//    //Kissing command
//    if (command === "kiss") {       //Shows how to run the command
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`You can kiss a user or even me\nI appreciate all kisses given:kissing_heart:\n${prefix}kiss <user>`);
//        } else {
//            let gen = await msg.channel.send("Generating...");
//            let user = msg.mentions.members.first();
//            let botmen = msg.isMemberMentioned(client.user);
//            if ((user) && (!botmen)) {
//                let { body } = await superagent
//                    .get("https://api.tenor.com/v1/search?q=anime%20kiss&limit=50&key=" + apikey).catch(error => {
//                        console.log(error);
//                        gen.delete();
//                        return msg.channel.send("Sorry but I couldn't pull any gifs :(");
//                    });
//                const randomNumber = (Math.floor(Math.random() * 50) + 1);
//                const kuembed = new Discord.RichEmbed()
//                    .setTitle(`**${user.displayName} you got kissed by ${msg.author.username} :heart:**`)
//                    .setColor(cyan)
//                    .setImage(body.results[randomNumber].media[0].gif.url)
//                    .setFooter("Gifs provided by courtesy of Tenor")
//                msg.channel.send(kuembed);
//                gen.delete();
//            } else if (botmen) {
//                let { body } = await superagent
//                    .get("https://api.tenor.com/v1/search?q=anime%20kiss&limit=50&key=" + apikey).catch(error => {
//                        console.log(error);
//                        gen.delete();
//                        return msg.channel.send("Sorry but I couldn't pull any gifs :(");
//                    });
//                const randomNumber = (Math.floor(Math.random() * 50) + 1);
//                const kbembed = new Discord.RichEmbed()
//                    .setTitle(`**Love you too :kissing_heart:**`)
//                    .setColor(cyan)
//                    .setImage(body.results[randomNumber].media[0].gif.url)
//                    .setFooter("Gifs provided by courtesy of Tenor")
//                msg.channel.send(kbembed);
//                gen.delete();
//            } if ((!user) && (!help) && (!botmen)) {
//                gen.delete();
//                msg.channel.send("You didn't mention a user to kiss").then(sentMessage => {
//                    sentMessage.delete(5000)
//                });
//            }
//        }
//    }
//});
//client.login(token)