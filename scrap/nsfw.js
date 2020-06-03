//const Discord = require("discord.js");
//const client = new Discord.Client();
//const superagent = require('superagent');
//const tokenfile = require("../token.json");
//const token = tokenfile.token;
//const config = require("../config.json");
//const prefix = config.prefix;
//const magenta = config.magenta
//const loadnsfw = config.loading_nsfw

//client.on("message", async msg => {
//    if (!msg.guild) return;     //Doesn't allow command to be run outside the server

//    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
//    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

//    if (!msg.content.startsWith(prefix)) return;

//    if ((command === "rule34") || (command === "r34")) {       //Shows how to run the command
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`I'll pull a random nsfw pic from r/rule34\n${prefix}r34 or ${prefix}r34 <search>`);
//        } else {
//            if (!msg.channel.nsfw) {
//                return msg.channel.send("You must be in a nsfw channel to use this command").then(sentMessage => {
//                    sentMessage.delete(5000)
//                });
//            }
//            if ((msg.content.includes("loli")) || (msg.content.includes("Loli")) || (msg.content.includes("LOLI"))) return msg.channel.send("Sorry but lolis violate Discord's TOS")
//            let ransite = Math.floor(Math.random() * 2) + 1;
//            let search = args.join(" ");
//            if (search) {
//                let ssite = '';
//                if (ransite === 1) ssite = "%20site:imgur.com";
//                if (ransite === 2) ssite = "%20site:i.redd.it";
//                const loading = client.emojis.get(loadnsfw);
//                let gen = await msg.channel.send(`Generating... ${loading}`);
//                const { body } = await superagent
//                    .get("https://www.reddit.com/r/rule34/search.json?q=" + search + ssite + "&restrict_sr=on&limit=100&include_over_18=1&type=link").catch(error => {
//                        console.log(error);
//                        gen.delete();
//                        return msg.channel.send("Sorry but I couldn't pull any pics :(");
//                    });
//                try {
//                    const randomnumber = Math.floor(Math.random() * body.data.children.length);
//                    let chosen = body.data.children[randomnumber].data.url;
//                    let hen = new Discord.RichEmbed()
//                        .setColor(magenta)
//                        .setDescription(`Your search: ${search}`)
//                        .setFooter(`Pictures provided by r/rule34`)
//                    msg.channel.send(chosen);
//                    msg.channel.send(hen);
//                    gen.delete();
//                } catch (error) {
//                    console.log(error);
//                    gen.delete();
//                    return msg.channel.send("I couldn't find any pics with that search")
//                }
//            } else {
//                return msg.channel.send("Give me something to look up")
//            }
//        }
//    }
//    if ((command === "hentai") || (command === "hen")) {       //Shows how to run the command
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`I'll pull a random nsfw pic from r/hentai\n${prefix}hen or ${prefix}hen <search>`);
//        } else {
//            if (!msg.channel.nsfw) {
//                return msg.channel.send("You must be in a nsfw channel to use this command").then(sentMessage => {
//                    sentMessage.delete(5000)
//                });
//            }
//            let ransite = Math.floor(Math.random() * 2) + 1;
//            if ((msg.content.includes("loli")) || (msg.content.includes("Loli")) || (msg.content.includes("LOLI"))) return msg.channel.send("Sorry but lolis violate Discord's TOS")
//            let search = args.join(" ");
//            if (search) {
//                let ssite = '';
//                if (ransite === 1) ssite = "%20site:imgur.com";
//                if (ransite === 2) ssite = "%20site:i.redd.it";
//                const loading = client.emojis.get(loadnsfw);
//                let gen = await msg.channel.send(`Generating... ${loading}`);
//                const { body } = await superagent
//                    .get("https://www.reddit.com/r/hentai/search.json?q=" + search + ssite + "&restrict_sr=on&limit=100&include_over_18=1&type=link").catch(error => {
//                        console.log(error);
//                        gen.delete();
//                        return msg.channel.send("Sorry but I couldn't pull any pics :(");
//                    });
//                try {
//                    const randomnumber = Math.floor(Math.random() * body.data.children.length);
//                    let chosen = body.data.children[randomnumber].data.url;
//                    let hen = new Discord.RichEmbed()
//                        .setColor(magenta)
//                        .setDescription(`Your search: ${search}`)
//                        .setFooter(`Pictures provided by r/hentai`)
//                    msg.channel.send(chosen);
//                    msg.channel.send(hen);
//                    gen.delete();
//                } catch (error) {
//                    console.log(error);
//                    gen.delete();
//                    return msg.channel.send("I couldn't find any pics with that search")
//                }
//            } else {
//                return msg.channel.send("Give me something to look up")
//            }
//        }
//    }
//    if ((command === "danbooru") || (command === "dan")) {       //Shows how to run the command
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`I'll pull a random nsfw pic from danbooru\n${prefix}dan or ${prefix}dan <search>`);
//        } else {
//            return msg.channel.send("Sorry this command is disabled until I get a good internet provider :disappointed:");
//            if (!msg.channel.nsfw) {
//                return msg.channel.send("You must be in a nsfw channel to use this command").then(sentMessage => {
//                    sentMessage.delete(5000)
//                });
//            }
//            if ((msg.content.includes("loli")) || (msg.content.includes("Loli")) || (msg.content.includes("LOLI"))) return msg.channel.send("Sorry but lolis violate Discord's TOS")
//            let search = args.join("_");
//            let usersearch = args.join(" ");
//            if (search) {
//                const loading = client.emojis.get(loadnsfw);
//                let gen = await msg.channel.send(`Generating... ${loading}`);
//                const { body } = await superagent
//                    .get("https://danbooru.donmai.us/posts.json?tags=" + search + "%20rating:e&limit=1000").catch(error => {
//                        console.log(error);
//                        gen.delete();
//                        return msg.channel.send("Sorry but I couldn't pull any pics :(");
//                    });
//                try {
//                    const randomnumber = Math.floor(Math.random() * body.length);
//                    let chosen = body[randomnumber].file_url;
//                    let dan = new Discord.RichEmbed()
//                        .setColor(magenta)
//                        .setDescription(`Your search: ${usersearch}`)
//                        .setFooter(`Pictures provided by Danbooru`)
//                    msg.channel.send(chosen);
//                    msg.channel.send(dan);
//                    gen.delete();
//                } catch (error) {
//                    console.log(error);
//                    gen.delete();
//                    return msg.channel.send("I couldn't find any pics with that search")
//                }
//            } else {
//                const loading = client.emojis.get(loadnsfw);
//                let gen = await msg.channel.send(`Generating... ${loading}`);
//                const { body } = await superagent
//                    .get("https://danbooru.donmai.us/posts.json?limit=1000%20rating:e").catch(error => {
//                        console.log(error);
//                        gen.delete();
//                        return msg.channel.send("Sorry but I couldn't pull any pics :(");
//                    });
//                try {
//                    const randomnumber = Math.floor(Math.random() * body.length);
//                    let chosen = body[randomnumber].file_url;
//                    msg.channel.send(chosen);
//                    gen.delete();
//                } catch (error) {
//                    console.log(error);
//                    gen.delete();
//                    return msg.channel.send("I couldn't find any pics")
//                }
//            }
//        }
//    }
//});
//client.login(token)