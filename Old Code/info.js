const Discord = require("discord.js");
const client = new Discord.Client();
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix
const purple = config.purple;
const devblue = config.dev_blue;

client.on('message', async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    if (!msg.content.startsWith(prefix)) return;

    const mee6 = '159985870458322944'
    const corona = '657215950420049941'
    const idlerpg = '424606447867789312'
    const kawaii = '195244363339530240'
    const notsobot = '439205512425504771'
    const yag = '204255221017214977'
    const myuu = '438057969251254293'
    const nadeko = '116275390695079945'
    const ecchi = '438759579124236298'
    const owo = '289066747443675143'
    const karuta = '646937666251915264'
    const rythm = '235088799074484224'
    const pokecord = '365975655608745985'
    const tatsu = '172002275412279296'
    const waifu = '472141928578940958'
    const aki = '709826686367170671'
    const mirai = '573682924730449931'
    const memer = '270904126974590976'
    //Bot information command
    if ((command === "botinfo") || (command === "binfo")) {       //Shows how to run the command
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Display information about a bot on the server\n${prefix}botinfo`);
        } else {        //If the user isn't asking for help
            let botids = [mee6, corona, idlerpg, kawaii, notsobot, yag, myuu, nadeko, ecchi, owo, karuta, rythm, pokecord, tatsu, waifu, aki, mirai, memer]
            let botmen = msg.mentions.members.first();
            if (!botmen) return msg.channel.send(`You gotta give me a bot`);
            let checkid = botids.includes(botmen.id)
            if (!checkid) return msg.channel.send(`You gotta give me a bot`);
            let botembed = new Discord.MessageEmbed()      //Sends a fancy display of execution information if the command isn't asking for help
                .setTitle(`__**${botmen.user.username}'s Information**__`)
                .setColor(purple)
                .setThumbnail(botmen.user.avatarURL())
                .addField("Created On", `${botmen.user.createdAt.getMonth()}/${botmen.user.createdAt.getDate()}/${botmen.user.createdAt.getFullYear()}`)
                .addField("Joined On", `${botmen.joinedAt.getMonth()}/${botmen.joinedAt.getDate()}/${botmen.joinedAt.getFullYear()}`, true)
                .addField("Discord ID", botmen.id, true)
                .setFooter(`Use ${prefix}botcmd to see how to use the bot`)
            msg.channel.send(botembed);
        }
    }
    //User information command
    if ((command === "userinfo") || (command === "uinfo")) {        //Shows how to run the command
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`I'll show lots of information about a user\n${prefix}userinfo *or* ${prefix}userinfo <user>`);
        } else {        //If the user isn't asking for help
            let member = msg.mentions.members.first();
            let user = msg.mentions.users.first();
            if (member) {
                let ucolor = member.roles.highest.color;      //The user's role's color
                let umenicon = user.avatarURL();
                let umenembed = new Discord.MessageEmbed()       //Sends a fancy display of execution information if the command isn't asking for help
                    .setTitle("__**User Information**__")
                    .setAuthor(user.username, umenicon)
                    .setColor(ucolor)
                    .setThumbnail(umenicon)
                    .addField("Username", user.username)
                    .addField("Created Account", `${user.createdAt.getMonth()}/${user.createdAt.getDate()}/${user.createdAt.getFullYear()}`)
                    .addField("User Joined", `${member.joinedAt.getMonth()}/${member.joinedAt.getDate()}/${member.joinedAt.getFullYear()}`)
                    .addField("Highest Role:", member.roles.highest.toString())
                    .addField("# of Roles", member.roles.cache.size)
                    .addField("Discord ID", member.id)
                msg.channel.send(umenembed);
            } else {
                let author = msg.author;
                let rcolor = msg.member.roles.highest.color;      //The user's role's color
                let uicon = msg.author.avatarURL();
                let autembed = new Discord.MessageEmbed()       //Sends a fancy display of execution information if the command isn't asking for help
                    .setTitle("__**Your Information**__")
                    .setAuthor(author.username, uicon)
                    .setColor(rcolor)
                    .setThumbnail(uicon)
                    .addField("Username", author.username)
                    .addField("Created Account", `${author.createdAt.getMonth()}/${author.createdAt.getDate()}/${author.createdAt.getFullYear()}`)
                    .addField("You Joined", `${msg.member.joinedAt.getMonth()}/${msg.member.joinedAt.getDate()}/${msg.member.joinedAt.getFullYear()}`)
                    .addField("Highest Role:", msg.member.roles.highest.toString())
                    .addField("# of Roles", msg.member.roles.cache.size)
                    .addField("Discord ID", msg.member.id)
                msg.channel.send(autembed);
            }
        }
    }
    //Server information command
    if ((command === "serverinfo") || (command === "sinfo")) {        //Shows how to run the command
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`I'll show lots of information about this server\n${prefix}serverinfo`);
        } else {        //If the user isn't asking for help
            let sicon = msg.guild.iconURL();
            let serverembed = new Discord.MessageEmbed()       //Sends a fancy display of execution information if the command isn't asking for help
                .setTitle("__**Server Information**__")
                .setColor(purple)
                .setThumbnail(sicon)
                .addField("Server Name", msg.guild.name)
                .addField("Created On", `${msg.guild.createdAt.getMonth()}/${msg.guild.createdAt.getDate()}/${msg.guild.createdAt.getFullYear()}`)
                .addField("You Joined", `${msg.member.joinedAt.getMonth()}/${msg.member.joinedAt.getDate()}/${msg.member.joinedAt.getFullYear()}`)
                .addField("Total Members", msg.guild.memberCount)
                .addField("# of Roles", msg.guild.roles.cache.size)
                .addField("# of Boosts", msg.guild.premiumSubscriptionCount)
                .addField("# of Emojis", msg.guild.emojis.cache.size)
            msg.channel.send(serverembed);
        }
    }
    //Developer information command
    if (command === "dev") {        //Shows how to run the command
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`I'll show you some information about my creator\nThings like the @, pfp, and etc...\n${prefix}dev`);
        } else {        //If the user isn't asking for help
            let devembed = new Discord.MessageEmbed()      //Sends a fancy display of execution information
                .setTitle("__**The Developer**__")
                .setColor(devblue)
                .setDescription("I made this bot so I can practice my skills\nI hope you enjoy using it")
                .setThumbnail("https://cdn.myanimelist.net/images/userimages/7078240.jpg")
                .setFooter(`Thanks for taking the time to check this out :)\nUse ${prefix}devcmd to view developer commands if you're worthy`)
                .addField("Discord:", "Godly_Otaku#6676")
                .addField("Instagram:", "godly.otaku\n https://www.instagram.com/godly.otaku/")
                .addField("MyAnimeList:", "Godly_Otaku\n https://myanimelist.net/profile/Godly_Otaku")
                //.addField("Github:", "This is where I put all my source code for the bots\n https://github.com/Godly-Otaku/The-Big-3")
                .addField("For recommendations or bugs spotted, DM me on my @'s listed above", "I will respond and try to help as soon as possible")
                .addField("Here's a link to the main server", "https://discord.gg/gERxcQa")
            msg.channel.send(devembed);
        }
    }
    if (command === "avatar") {        //Shows how to run the command
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`I'll show someone's avatar\n${prefix}avatar *or* ${prefix}avatar <user>`);
        } else {        //If the user isn't asking for help
            let member = msg.mentions.members.first();
            let user = msg.mentions.users.first();
            if (member) {
                let ucolor = member.roles.highest.color;      //The user's role's color
                let umenicon = user.avatarURL();
                let umenembed = new Discord.MessageEmbed()       //Sends a fancy display of execution information if the command isn't asking for help
                    .setTitle(`__**${user.username}'s Avatar**__`)
                    .setColor(ucolor)
                    .setThumbnail(umenicon)
                    .setURL(umenicon)
                msg.channel.send(umenembed);
            } else {
                let rcolor = msg.member.roles.highest.color;      //The user's role's color
                let uicon = msg.author.avatarURL();
                let autembed = new Discord.MessageEmbed()       //Sends a fancy display of execution information if the command isn't asking for help
                    .setTitle("__**Your Avatar**__")
                    .setColor(rcolor)
                    .setThumbnail(uicon)
                    .setURL(uicon)
                msg.channel.send(autembed);
            }
        }
    }
});
client.login(token);        //Token for the bot to use this file