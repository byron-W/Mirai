const Discord = require("discord.js");
const { purple, prefix } = require("../config.json");
const mee6 = { username: 'MEE6', id: '159985870458322944', prefix: '!', excmd: 'rank', ss: 'https://discord.gg/mee6', web: 'https://mee6.xyz/', cmdweb: false, nsfw: false }
const corona = { username: 'Corona-Chan', id: '657215950420049941', prefix: '!hps', excmd: 'coronavirus', ss: 'https://discord.gg/BNTAapF', web: 'https://top.gg/bot/657215950420049941', cmdweb: false, nsfw: false }
const idlerpg = { username: 'IdleRPG', id: '424606447867789312', prefix: 'rpg$ or mention', excmd: 'deaths', ss: 'https://discord.gg/MSBatf6', web: 'https://idlerpg.travitia.xyz/', cmdweb: true, cmdlink: 'https://idlerpg.travitia.xyz/commands/', nsfw: false }
const kawaii = { username: 'KawaiiBot', id: '195244363339530240', prefix: '+', excmd: 'dog', ss: 'https://discord.gg/wGwgWJW', web: 'https://kawaiibot.xyz/', cmdweb: false, nsfw: true }
const notsobot = { username: 'NotSoBot', id: '439205512425504771', prefix: ',', excmd: 'badmeme', ss: 'https://discord.gg/9Ukuw9V', web: 'https://notsobot.com/', cmdweb: true, cmdlink: 'https://mods.nyc/help/', nsfw: true }
const yag = { username: 'YAGPDG.xyz', id: '204255221017214977', prefix: '-', excmd: 'advice', ss: 'https://discord.gg/4udtcA5', web: 'https://yagpdb.xyz/', cmdweb: false, nsfw: false }
const myuu = { username: 'Myuu', id: '438057969251254293', prefix: '.', excmd: 'pokedex', ss: 'https://discord.gg/aJbWQjU', web: 'https://myuu.xyz/', cmdweb: false, nsfw: false }
const nadeko = { username: 'Nadeko', id: '116275390695079945', prefix: 'n.', excmd: 'say', ss: 'https://discord.gg/nadekobot', web: 'https://nadeko.bot/', cmdweb: true, cmdlink: 'https://nadeko.bot/commands', nsfw: true }
const ecchi = { username: 'Ecchi Boy', id: '438759579124236298', prefix: '>>', excmd: 'boobs', ss: 'https://discord.gg/XQqc5pj', web: 'https://ecchibot.privateger.me/', cmdweb: false, nsfw: true }
const owo = { username: 'owo', id: '289066747443675143', prefix: '>', excmd: 'dance', ss: 'https://discord.gg/aNKde73', web: 'https://top.gg/bot/289066747443675143', cmdweb: false, nsfw: false }
const karuta = { username: 'Karuta', id: '646937666251915264', prefix: 'k!', excmd: 'drop', ss: 'https://discord.gg/karuta', web: 'https://top.gg/bot/646937666251915264', cmdweb: false, nsfw: false }
const rythm = { username: 'Rythm', id: '235088799074484224', prefix: 'm', excmd: 'play', ss: 'https://discord.gg/cf3tNMW', web: 'https://rythmbot.co/', cmdweb: true, cmdlink: 'https://rythmbot.co/features#list', nsfw: false }
const tatsu = { username: 'Tatsumaki', id: '172002275412279296', prefix: 't!', excmd: 'profile', ss: 'https://discord.gg/0xyZL4m5TyYTzVGY', web: 'https://tatsu.gg/', cmdweb: true, cmdlink: 'https://tatsu.gg/commands.html', nsfw: false }
const waifu = { username: 'WaifuBot', id: '472141928578940958', prefix: 'w.', excmd: 'ranks', ss: 'https://discord.gg/rZ3ejF2', web: 'https://waifubot.net/', cmdweb: false, nsfw: false }
const aki = { username: 'Aki', id: '709826686367170671', prefix: prefix, excmd: 'stfu', ss: 'https://discord.gg/gERxcQa', web: `https://hanime.tv/`, cmdweb: false, nsfw: false }
const mirai = { username: 'Mirai', id: '573682924730449931', prefix: prefix, excmd: 'stfu', ss: 'https://discord.gg/gERxcQa', web: `https://hanime.tv/`, cmdweb: false, nsfw: false }
const memer = { username: 'Dank Memer', id: '270904126974590976', prefix: 'pls', excmd: 'airpods', ss: 'https://discord.com/invite/meme', web: 'https://dankmemer.lol/', cmdweb: true, cmdlink: 'https://dankmemer.lol/commands', nsfw: true }
const mudae = { username: 'Mudae', id: '432610292342587392', prefix: '$', excmd: 'mymarry', ss: 'https://discord.com/invite/EEGkGSh', web: 'https://top.gg/bot/432610292342587392', cmdweb: false, nsfw: false }
const mudamaid = { username: 'Mudamaid', id: '496338891641454612', prefix: '$', excmd: 'mymarry', ss: 'https://discord.com/invite/EEGkGSh', web: 'https://top.gg/bot/432610292342587392', cmdweb: false, nsfw: false }

module.exports = {
    name: 'botinfo',
    description: 'Show info about a bot in the server',
    aliases: ['binfo', 'botcmd', 'bot'],
    usage: '<bot>',
    cooldown: 3,
    class: 'info',
    args: true,
    execute(msg) {
        let botids = [mee6.id, corona.id, idlerpg.id, kawaii.id, notsobot.id, yag.id, myuu.id, nadeko.id, ecchi.id, owo.id, karuta.id, rythm.id, tatsu.id, waifu.id, aki.id, mirai.id, memer.id, mudae.id, mudamaid.id]
        let botlist = [mee6, corona, idlerpg, kawaii, notsobot, yag, myuu, nadeko, ecchi, owo, karuta, rythm, tatsu, waifu, aki, mirai, memer, mudae, mudamaid]
        let nsfw = (msg.content.endsWith("nsfw") || msg.content.endsWith("NSFW"));
        if (nsfw) {
            let nsfwbots = new Discord.MessageEmbed()
                .setTitle("__**List of bots with NSFW Commands**__")
                .setColor("#DC143C")
            let botname = '';
            botlist.forEach(f => {
                if (!f.nsfw) return
                botname += `\n**${f.username}**`;
            })
                .setDescription(botname)
            return msg.channel.send(nsfwbots);
        } else {
            let bots = msg.guild.roles.cache.get('463813655243390994').members.map(m => m.user.id);
            let botmen = msg.mentions.members.first();
            if (!botmen) return msg.channel.send(`You gotta give me a bot`);
            if (!bots.includes(botmen.id)) return msg.channel.send("That's not a bot on this server")
            let checkid = botids.includes(botmen.id)
            if (!checkid) {
                let botembed = new Discord.MessageEmbed()      //Sends a fancy display of execution information if the command isn't asking for help
                    .setTitle(`__**${botmen.user.username}'s Information**__`)
                    .setColor(purple)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Created On", `${botmen.user.createdAt.getMonth()}/${botmen.user.createdAt.getDate()}/${botmen.user.createdAt.getFullYear()}`)
                    .addField("Joined On", `${botmen.joinedAt.getMonth()}/${botmen.joinedAt.getDate()}/${botmen.joinedAt.getFullYear()}`, true)
                    .addField("Discord ID", botmen.id, true)
                return msg.channel.send(botembed);
            } else {
                function getinfo(idmatch) {
                    return idmatch === botmen.id
                }
                let botinfo = botids.findIndex(getinfo)
                let finalinfo = botlist[botinfo]
                let botembed = new Discord.MessageEmbed()      //Sends a fancy display of execution information if the command isn't asking for help
                    .setTitle(`__**${botmen.user.username}'s Information**__`)
                    .setColor(purple)
                    .setThumbnail(botmen.user.avatarURL())
                    .addField("Created On", `${botmen.user.createdAt.getMonth()}/${botmen.user.createdAt.getDate()}/${botmen.user.createdAt.getFullYear()}`)
                    .addField("Joined On", `${botmen.joinedAt.getMonth()}/${botmen.joinedAt.getDate()}/${botmen.joinedAt.getFullYear()}`, true)
                    .addField("Discord ID", botmen.id, true)
                    .addField("Prefix", finalinfo.prefix)
                    .addField("Ex. Command", `${finalinfo.prefix}${finalinfo.excmd}`, true)
                    .addField("Command list", `${finalinfo.prefix}help`, true)
                if (finalinfo.cmdweb) {
                    botembed.addField("Other info", `[Support Server](${finalinfo.ss})\n[Official Website](${finalinfo.web})\n[Command Website](${finalinfo.cmdlink})`)
                } else {
                    botembed.addField("Other info", `[Support Server](${finalinfo.ss})\n[Official Website](${finalinfo.web})`)
                }
                if (finalinfo.nsfw) {
                    botembed.setFooter("NSFW Commands Available", botmen.user.displayAvatarURL())
                } else {
                    botembed.setFooter("NSFW Commands Not Available", botmen.user.displayAvatarURL())
                }
                return msg.channel.send(botembed);
            }
        }
    },
}