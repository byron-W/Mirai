const Discord = require("discord.js");
const client = new Discord.Client();
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix;
const pink = config.pink;
const green = config.green;

client.on("message", msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed
    if (!msg.content.startsWith(prefix)) return;

    //Command list
    if (command === "help") {      //Shows how to run the command
        let bicon = client.user.avatarURL();
        let sicon = msg.guild.iconURL();
        let hembed = new Discord.MessageEmbed()        //Sends a fancy display of execution information
            .setAuthor("Mirai", bicon)
            .setTitle("__**My Commands**__")
            .setDescription(`The prefix is "${prefix}"\nTo view the commands, follow the examples given under each category`)
            .setColor(pink)
            .setThumbnail(sicon)
            .addField("__Anime/Manga Commands__", `For the cultured people\n${prefix}amhelp`, true)
            .addField("__Voice Game Commands__", `Play games in the voice chats!\n${prefix}vchelp`, true)
            .addField("__Waifu Commands__", `Roll and claim your favorite waifus\n${prefix}waifuhelp`, true)
            .addField("__Economy Commands__", `Buy special roles and get coins\n${prefix}econhelp`, true)
            .addField("__Moderation Commands__", `Only usable by admins/mods\n${prefix}modhelp`, true)
            .addField("__Misc. Commands__", `Just some other random commands\n${prefix}mischelp`, true)
            .addField("For help with any of the other bots on the server", `Use ${prefix}botcommands <@bot>`)
        msg.channel.send(hembed);
    }
    if (command === "amhelp") {      //Shows how to run the command
        let bicon = client.user.avatarURL();
        let sicon = msg.guild.iconURL();
        let hembed = new Discord.MessageEmbed()//Sends a fancy display of execution information
            .setAuthor("Mirai", bicon)
            .setTitle("__**Anime/Manga Commands**__")
            .setDescription(`**anime** -Find an anime\n**manga** -Find a manga\n**aniseason** -Show all anime from a season\n**anischedule** -Show the anime airing on a day of the week\n**maluser** -Search for a MyAnimeList user`)
            .setColor(pink)
            .setThumbnail(sicon)
            .setFooter("For more information on a command, put help after the command. All anime is provided by MyAnimeList")
        msg.channel.send(hembed);
    }
    if (command === "vchelp") {      //Shows how to run the command
        let bicon = client.user.avatarURL();
        let sicon = msg.guild.iconURL();
        let hembed = new Discord.MessageEmbed()        //Sends a fancy display of execution information
            .setAuthor("Mirai", bicon)
            .setTitle("__**Voice Chat Commands**__")
            .setDescription(`**join** -Get ready for the game\n**opgame** -Start the game\n**guess** -Guess the song that's playing\n**hint** -Get the answer, but scrambled\n**answer** -Give up and reveal the answer\n**quit** -End the game and leave the vc\n**stop** -Stop the game\n**volume** -Change the volume of the song\n**songlinks** -Get the links for all the songs featured`)
            .setColor(pink)
            .setThumbnail(sicon)
            .addField("To request more songs to be added", "Go to #suggestions and send the youtube video of the anime song")
            .addField("__Anime Ending and OST commands are here.__", "Replace 'op' with 'ed' or 'ost' in the command to use them")
            .setFooter("For more information on a command, put help after the command")
        msg.channel.send(hembed);
    }
    if (command === "waifuhelp") {      //Shows how to run the command
        let bicon = client.user.avatarURL();
        let sicon = msg.guild.iconURL();
        let hembed = new Discord.MessageEmbed()        //Sends a fancy display of execution information
            .setAuthor("Mirai", bicon)
            .setTitle("__**Waifu/Husbando Claiming Commands**__")
            .setDescription(`**roll** -Roll for a waifu for 5000 coins and claim for free\n**myclaims** -See how many people you've claimed\n**image** -Display a character\n**allcharacters** -Show all available characters from an anime\n**divorce** -Release your waifu back to wild\n\
                            **trade** -Trade your waifu for someone else's\n**endtrade** -End the trade if you're in it`)
            .setColor(pink)
            .setThumbnail(sicon)
            .addField("To request more characters to be added, go to #bot-suggestions", `We'll try to add as many as possible`)
            .setFooter("For more information on a command, put help after the command")
        msg.channel.send(hembed);
    }
    if (command === "econhelp") {      //Shows how to run the command
        let bicon = client.user.avatarURL();
        let sicon = msg.guild.iconURL();
        let hembed = new Discord.MessageEmbed()        //Sends a fancy display of execution information
            .setAuthor("Mirai", bicon)
            .setTitle("__**Economy Commands**__")
            .setDescription(`**coins** -Display a user's coins\n**deposit** -Deposit up to 50% of your coins\n**withdraw** -Withdraw any amount of coins\n**buyrole** -Purchase a role from the shop\n**buylimitedrole** -Purchase the limited role from the shop\n\
                            **daily** -Collect your daily coins\n**gamble** -Take a risk with your money\n**rob** -Try to take someone's coins\n**givecoins** -Give a user some of your coins\n**myroles** -Display a user's roles\n**deletemyrole** -Delete one of your purchased roles\n**shop** -Display all roles that are for sale\n\
                            **leaderboard** -Display the top 5 richest people in the server`)
            .setColor(pink)
            .setThumbnail(sicon)
            .setFooter("For more information on a command, put help after the command")
        msg.channel.send(hembed);
    }
    if (command === "modhelp") {      //Shows how to run the command
        let bicon = client.user.avatarURL();
        let sicon = msg.guild.iconURL();
        let hembed = new Discord.MessageEmbed()        //Sends a fancy display of execution information
            .setAuthor("Mirai", bicon)
            .setTitle("__**Moderation Commands**__")
            .setDescription(`**ban** -Ban a user\n**kick** -Kick a user\n**mute** -Mute a user\n**purge** -Purge a set amount of messages\n**devcmd** -Developer commands`)
            .setColor(pink)
            .setThumbnail(sicon)
        // .addField("purgeuser", `Purges messages from a user\n${prefix}purgeuser <user>`, true)
            .setFooter("For more information on a command, put help after the command")
        msg.channel.send(hembed);
    }
    if (command === "mischelp") {      //Shows how to run the command
        let bicon = client.user.avatarURL();
        let sicon = msg.guild.iconURL();
        let hembed = new Discord.MessageEmbed()        //Sends a fancy display of execution information
            .setAuthor("Mirai", bicon)
            .setTitle("__**Misc. Commands**__")
            .setDescription(`**meme** -Get some fire memes\n**animeme** -Get some cultured memes\n**say** -Make me say something\n**potato** -For a special bean\n**bruh** -For bruh moments\n**bigbruh** -For even bigger bruh moments\n**stfu** -Some people need to hear this\n**serverinfo** -Display information about the server\n**botinfo** -Display information about me :)\n**userinfo** -Display information about a user\n**avatar** -Display a user's avatar\n**rules** -Show the rules of the server\n**dev** -Show a message from the developer`)
            .setColor(pink)
            .setThumbnail(sicon)
            .setFooter("For more information on a command, put help after the command")
        msg.channel.send(hembed);
    }
    if (command === "rules") {     //Shows how to run the command
        let nsfw = msg.guild.channels.cache.find(ch => ch.name === "nsfw")
        let dissension = msg.guilds.channels.cache.find(ch => ch.name === "dissension")
        let help = msg.content.endsWith("help");
        if (help) {     //Explains what the command does
            msg.channel.send(`Show the laws of the land\nI'll fuck you up if you don't follow them\n${prefix}rules`);
        } else {        //If the user isn't asking for help
            let sicon = msg.guild.iconUR();
            let rules = new Discord.MessageEmbed()       //Sends a fancy display of execution information
                .setTitle("__**Rules**__")
                .setDescription("Not following these can lead to mute, kick, or ban")
                .setThumbnail(sicon)
                .setColor(green)
                .addField("Rule #1", "Be mindful and respectful of others.There is a difference between joking around and bullying someone.")
                .addField("Rule #2", `The chats names are pretty self-explanatory so go there for their respective purposes\
                       (NSFW goes in ${nsfw}, arguments go in ${dissension}, etc...)`)
                .addField("Rule #3", `If y\'all have any problems with anything or anyone, either contact the owner or an admin.`)
                .addField("Rule #4", "Don't ask to be an admin or mod. I'll decide that on my own.")
                .addField("Rule #5", "Spamming will lead to getting muted or possibly banned. Decided at our own discretion.")
                .addField("Rule #6", "I'm pretty lenient with the rules so don't fuck it up for everyone. Follow them")
                .addField("Rule #7", "Remember that everyone is here to enjoy themselves. Have fun")
            msg.channel.send(rules);
        }
    }
    if (command === "devcmd") {
        let admin = msg.member.hasPermission("ADMINISTRATOR");
        if (!admin) return msg.channel.send("You are not worthy :smirk:");
        let secreticon = "https://i.kym-cdn.com/photos/images/original/001/265/980/58e.jpg"
        let secretembed = new Discord.MessageEmbed()
            .setTitle("You have accessed the secret developer commands")
            .setThumbnail(secreticon)
            .addField("Goodnight", `Says goodnight to me\nGoodnight/goodnight/Gn/gn`, true)
            .addField("devcoins", `Add coins to someone's wallet\n${prefix}devc`, true)
            .addField("opdev", `Test a song using the database ID\n${prefix}opdev`, true)
            .addField("restart", `Restart the anime song that's playing\n${prefix}opres`, true)
            .addField("addrow", `Add a song to the song list\n${prefix}addop`, true)
            .addField("updaterow", `Update info for a row\n${prefix}updaterow`, true)
            .addField("rowinfo", `Show data on a song\n${prefix}rowinfo`, true)
            .addField("addclaim", `Add a character to the roll list\n${prefix}ac`, true)
            .addField("resetclaim", `Reset the claims\n${prefix}resetclaim`, true)
        msg.author.send(secretembed);
    }
});
client.login(token);        //Token for the bot to use this file