const Discord = require("discord.js");
const client = new Discord.Client();
const tokenfile = require("../token.json");
const token = tokenfile.token;
const config = require("../config.json");
const prefix = config.prefix
const pink = config.pink

client.on('message', async msg => {
    if (!msg.guild) return;     //Doesn't allow command to be run outside the server

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

    if (!msg.content.startsWith(prefix)) return;

    /// Bot ID's
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
    const mudae = '432610292342587392'
    const mudamaid = '496338891641454612'
    //User information command
    if ((command === "botcommands") || (command === "botcmd")) {        //Shows how to run the command
        if (!args[0]) return msg.channel.send(`To use this command, you must mention one of the bots on this server\nEx: ${prefix}botcmd @<bot>`);
        let help = msg.content.endsWith("help");
        let nsfw = (msg.content.endsWith("nsfw") || msg.content.endsWith("NSFW"));
        if (help) {     //Explains what the command does
            msg.channel.send(`Get some information about a bot in the server\n${prefix}bhelp <bot>`);
        } else if (nsfw) {
            let nsfwbots = new Discord.MessageEmbed()
                .setTitle("__**List bots with NSFW Commands**__")
                .setColor("#DC143C")
                .setDescription("**Ecchi Bot**\n**KawaiiBot**\n**NotSoBot**\n**Nadeko**\n**Dank Memer**")
            msg.channel.send(nsfwbots);
        } else {        //If the user isn't asking for help
            let botids = [mee6, corona, idlerpg, kawaii, notsobot, yag, myuu, nadeko, ecchi, owo, karuta, rythm, pokecord, tatsu, waifu, aki, mirai, memer, mudae, mudamaid]
            let botmen = msg.mentions.members.first();
            let checkid = botids.includes(botmen.id)
            if (!checkid) return msg.channel.send(`You gotta give me a bot`);
            if (botmen.id === mee6) {
                let botinfo = new Discord.MessageEmbed()       //MEE6
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", "!")
                    .addField("Ex. Command", `!rank`)
                    .addField("Command list", `!help`)
                    .addField("Other info", "[Support Server](https://discord.gg/mee6)\n[Official Website](https://mee6.xyz/)")
                    .setFooter("NSFW Commands Not Available", "https://discordapp.com/assets/8becd37ab9d13cdfe37c08c496a9def3.svg")
                msg.channel.send(botinfo);
            } if (botmen.id === corona) {
                let botinfo = new Discord.MessageEmbed()       //Corona-chan
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", "!hps")
                    .addField("Ex. Command", `!hpscoronavirus`)
                    .addField("Command list", `!hpshelp`)
                    .addField("Other info", "[Support Server](https://discord.gg/BNTAapF)\n[Official Website](https://top.gg/bot/657215950420049941)")
                    .setFooter("NSFW Commands Not Available", "https://discordapp.com/assets/8becd37ab9d13cdfe37c08c496a9def3.svg")
                msg.channel.send(botinfo);
            } if (botmen.id === idlerpg) {
                let botinfo = new Discord.MessageEmbed()       //IdleRPG
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", "rpg$ or mention")
                    .addField("Ex. Command", `rpg$deaths`)
                    .addField("Command list", `rpg$help`)
                    .addField("Other info", "[Support Server](https://discord.gg/MSBatf6)\n[Official Website](https://idlerpg.travitia.xyz/)\n[Command Website](https://idlerpg.travitia.xyz/commands/)")
                    .setFooter("NSFW Commands Not Available", "https://discordapp.com/assets/8becd37ab9d13cdfe37c08c496a9def3.svg")
                msg.channel.send(botinfo);
            } if (botmen.id === kawaii) {
                let botinfo = new Discord.MessageEmbed()       //KawaiiBot
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", "+")
                    .addField("Ex. Command", `+dog`)
                    .addField("Command list", `+help`)
                    .addField("Other info", "[Support Server](https://discord.gg/wGwgWJW)\n[Official Website](https://kawaiibot.xyz/)")
                    .setFooter("NSFW Commands Available", "https://discordapp.com/assets/212e30e47232be03033a87dc58edaa95.svg")
                msg.channel.send(botinfo);
            } if (botmen.id === notsobot) {
                let botinfo = new Discord.MessageEmbed()       //NotSoBot
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", ",")
                    .addField("Ex. Command", `,badmeme`)
                    .addField("Command list", `,help`)
                    .addField("Other info", "[Support Server](https://discord.gg/9Ukuw9V)\n[Official Website](https://notsobot.com/)\n[Command Website](https://mods.nyc/help/)")
                    .setFooter("NSFW Commands Available", "https://discordapp.com/assets/212e30e47232be03033a87dc58edaa95.svg")
                msg.channel.send(botinfo);
            } if (botmen.id === yag) {
                let botinfo = new Discord.MessageEmbed()       //YAGPDG.xyz
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", "-")
                    .addField("Ex. Command", `-advice`)
                    .addField("Command list", `-help`)
                    .addField("Other info", "[Support Server](https://discord.gg/4udtcA5)\n[Official Website](https://yagpdb.xyz/)")
                    .setFooter("NSFW Commands Not Available", "https://discordapp.com/assets/8becd37ab9d13cdfe37c08c496a9def3.svg")
                msg.channel.send(botinfo);
            } if (botmen.id === myuu) {
                let botinfo = new Discord.MessageEmbed()       //Myuu
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", ".")
                    .addField("Ex. Command", `.pokedex`)
                    .addField("Command list", `.help`)
                    .addField("Other info", "[Support Server](https://discord.gg/aJbWQjU)\n[Official Website](https://myuu.xyz/)")
                    .setFooter("NSFW Commands Not Available", "https://discordapp.com/assets/8becd37ab9d13cdfe37c08c496a9def3.svg")
                msg.channel.send(botinfo);
            } if (botmen.id === nadeko) {
                let botinfo = new Discord.MessageEmbed()       //Nadeko
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", "n.")
                    .addField("Ex. Command", `n.say`)
                    .addField("Command list", `n.help`)
                    .addField("Other info", "[Support Server](https://discord.gg/nadekobot)\n[Official Website](https://nadeko.bot/)\n[Command Website](https://nadeko.bot/commands)")
                    .setFooter("NSFW Commands Available", "https://discordapp.com/assets/212e30e47232be03033a87dc58edaa95.svg")
                msg.channel.send(botinfo);
            } if (botmen.id === ecchi) {
                let botinfo = new Discord.MessageEmbed()       //Ecchi Bot
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", ">>")
                    .addField("Ex. Command", `>>boobs`)
                    .addField("Command list", `>>help`)
                    .addField("Other info", "[Support Server](https://discord.gg/XQqc5pj)\n[Official Website](https://ecchibot.privateger.me/)")
                    .setFooter("NSFW Commands Available", "https://discordapp.com/assets/212e30e47232be03033a87dc58edaa95.svg")
                msg.channel.send(botinfo);
            } if (botmen.id === owo) {
                let botinfo = new Discord.MessageEmbed()       //owo!
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", ">")
                    .addField("Ex. Command", `>dance`)
                    .addField("Command list", `>help`)
                    .addField("Other info", "[Support Server](https://discord.gg/aNKde73)\n[Official Website](https://top.gg/bot/289066747443675143)")
                    .setFooter("NSFW Commands Not Available", "https://discordapp.com/assets/8becd37ab9d13cdfe37c08c496a9def3.svg")
                msg.channel.send(botinfo);
            } if (botmen.id === rythm) {
                let botinfo = new Discord.MessageEmbed()       //Rythm Bot
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", "m")
                    .addField("Ex. Command", `mplay`)
                    .addField("Command list", `mhelp`)
                    .addField("Other info", "[Support Server](https://discord.gg/cf3tNMW)\n[Official Website](https://rythmbot.co/)\n[Command Website](https://rythmbot.co/features#list)")
                    .setFooter("NSFW Commands Not Available", "https://discordapp.com/assets/8becd37ab9d13cdfe37c08c496a9def3.svg")
                msg.channel.send(botinfo);
            } if (botmen.id === pokecord) {
                let botinfo = new Discord.MessageEmbed()       //Pokecord
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", "p!")
                    .addField("Ex. Command", `p!pokedex`)
                    .addField("Command list", `p!help`)
                    .addField("Other info", "[Support Server](https://discord.gg/xK73eeE)\n[Official Website](https://pokecord.com/)")
                    .setFooter("NSFW Commands Not Available", "https://discordapp.com/assets/8becd37ab9d13cdfe37c08c496a9def3.svg")
                msg.channel.send(botinfo);
            } if (botmen.id === tatsu) {
                let botinfo = new Discord.MessageEmbed()       //Tatsumaki
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", "t!")
                    .addField("Ex. Command", `t!profile`)
                    .addField("Command list", `t!help`)
                    .addField("Other info", "[Support Server](https://discord.gg/0xyZL4m5TyYTzVGY)\n[Official Website](https://tatsu.gg/)\n[Command Website](https://tatsu.gg/commands.html)")
                    .setFooter("NSFW Commands Not Available", "https://discordapp.com/assets/8becd37ab9d13cdfe37c08c496a9def3.svg")
                msg.channel.send(botinfo);
            } if (botmen.id === waifu) {
                let botinfo = new Discord.MessageEmbed()       //WaifuBot
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", "w.")
                    .addField("Ex. Command", `w.ranks`)
                    .addField("Command list", `w.help`)
                    .addField("Other info", "[Support Server](https://discord.gg/rZ3ejF2)\n[Official Website](https://waifubot.net/)")
                    .setFooter("NSFW Commands Not Available", "https://discordapp.com/assets/8becd37ab9d13cdfe37c08c496a9def3.svg")
                msg.channel.send(botinfo);
            } if ((botmen.id === aki) || (botmen.id === mirai)) {
                let bicon = client.user.avatarURL();
                let sicon = msg.guild.iconURL();
                let hembed = new Discord.MessageEmbed()        //For the Big 3
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
                    .setFooter("NSFW Commands Not Available", "https://discordapp.com/assets/8becd37ab9d13cdfe37c08c496a9def3.svg")
                msg.channel.send(hembed);
            } if (botmen.id === memer) {
                let botinfo = new Discord.MessageEmbed()       //Dank Memer
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", "pls")
                    .addField("Ex. Command", `pls airpods`)
                    .addField("Command list", `pls help`)
                    .addField("Other info", "[Support Server](https://discord.com/invite/meme)\n[Official Website](https://dankmemer.lol/)\n[Command Website](https://dankmemer.lol/commands)")
                    .setFooter("NSFW Commands Available", "https://discordapp.com/assets/212e30e47232be03033a87dc58edaa95.svg")
                msg.channel.send(botinfo);
            } if ((botmen.id === mudamaid) || (botmen.id === mudae)) {
                let botinfo = new Discord.MessageEmbed()       //Dank Memer
                    .setTitle(`__**${botmen.user.username}**__`)
                    .setColor("#DC143C")
                    .setAuthor(botmen.user.tag)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Prefix", "$")
                    .addField("Ex. Command", `$mymarry`)
                    .addField("Command list", `$help`)
                    .addField("Other info", "[Support Server](https://discord.com/invite/EEGkGSh)\n[Official Website](https://top.gg/bot/432610292342587392)")
                    .setFooter("NSFW Commands Not Available", "https://discordapp.com/assets/8becd37ab9d13cdfe37c08c496a9def3.svg")
                msg.channel.send(botinfo);
            } if ((!botmen) && (!help) && (!nsfw)) {
                return msg.channel.send(`To use this command, you must mention one of the bots on this server\nEx: ${prefix}botcmd @<bot>`)
            }
        }
    }
});
client.login(token);        //Token for the bot to use this file