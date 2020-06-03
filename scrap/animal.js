//const Discord = require("discord.js");
//const client = new Discord.Client();
//const superagent = require('superagent');
//const tokenfile = require("../token.json");
//const token = tokenfile.token;
//const config = require("../config.json");
//const prefix = config.prefix;

//client.on("message", async msg => {
//    if (!msg.guild) return;     //Doesn't allow command to be run outside the server

//    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
//    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

//    if (!msg.content.startsWith(prefix)) return;

//    if (command === "woof") {      //Shows how to run the command
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`I'll pull cute images and gifs of dogs from the internet\nThey're so fucking cute omg AAAAAA\n${prefix}woof`);
//        } else {        //If the user isn't asking for help
//            let gen = await msg.channel.send("Generating...")
//            let { body } = await superagent
//                .get("https://random.dog/woof.json").catch(error => {
//                    console.log(error);
//                    gen.delete();
//                    return msg.channel.send("I couldn't pull an image :(");
//                });
//            msg.channel.send(body.url)
//            gen.delete();       //Deletes the "Generating..." message
//        }
//    }
//    if (command === "meow") {       //Shows how to run the command
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`I'll pull cute images and gifs of cats from the internet\nThey're cute but dogs are better in my opnion\n${prefix}meow`);
//        } else {        //If the user isn't asking for help
//            let gen = await msg.channel.send("Generating...");
//            let { body } = await superagent
//                .get("http://aws.random.cat/meow").catch(error => {
//                    console.log(error);
//                    gen.delete();
//                    return msg.channel.send("I couldn't pull an image :(");
//                });
//            msg.channel.send(body.file);
//            gen.delete();       //Deletes the "Generating..." message
//        }
//    }
//    if (command === "fox") {       //Shows how to run the command
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`I'll pull cute images and gifs of foxes from the internet\nThese pics are more aesthetic\n${prefix}fox`);
//        } else {        //If the user isn't asking for help
//            let gen = await msg.channel.send("Generating...");
//            let { body } = await superagent
//                .get("https://randomfox.ca/floof/").catch(error => {
//                    console.log(error);
//                    gen.delete();
//                    return msg.channel.send("I couldn't pull an image :(");
//                });
//            msg.channel.send(body.image);
//            gen.delete();       //Deletes the "Generating..." message
//        }
//    }
//});
//client.login(token);        //Token for the bot to use this file