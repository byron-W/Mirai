//const Discord = require("discord.js");
//const client = new Discord.Client();
//const tokenfile = require("../token.json");
//const token = tokenfile.token;
//const config = require("../config.json");
//const prefix = config.prefix;
//const blue = config.blue;

//client.on("message", async msg => {
//    if (!msg.guild) return;     //Doesn't allow command to be run outside the server

//    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
//    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

//    if (!msg.content.startsWith(prefix)) return;

//    //Genrelist for anime and manga
//    if ((command === "genrelist") || (command === "glist")) {
//        let help = msg.content.endsWith("help");
//        let sub = msg.content.endsWith("sub");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`I'll show you the genre list for kitsu\nTo view the subgenres, use ${prefix}genrelist sub\n${prefix}genrelist`);
//        } else if (sub) {
//            let gen = await msg.channel.send("Generating...");
//            let listsuboneembed = new Discord.RichEmbed()
//                .setTitle("Here's a list of all the genres")
//                .setColor(blue)
//                .setDescription(`Like regular genres, you can search multiple by putting a comma in between without spaces\n${prefix}sganime Action,Magic or ${prefix}sgmanga Action,Magic`)
//                .addField("Action Subgenres: ", "Battle Royale--Gunfights--Martial Arts--Ninja--Space Battles--Sword Play--Samurai")
//                .addField("Comedy Subgenres", "Absurdist Humor--Breaking the Fourth Wall--Parody--Satire--Slapstic--\nViolent Retribution For Accidental Infringement--Super Deformed")
//                .addField("Ecchi Subgenres", "Lingerie--Pantsu--Sexual Fantasies")
//                .addField("Fantasy Subgenres", "Angel--Comtemporary Fantasy--Dark Fantasy--Diety--Demon--Dragon--Elf--\nHigh Fantasy--Magic--Mermaid")
//                .addField("Psychological Subgenres", "Dementia")
//                .addField("Romance Subgenres", "Love Polygon--Shoujou Ai--Shounen Ai--Slow When It Comes To Love--\nSudden Girlfriend Appearance--Teacher X Student--Unrequited Love ")
//                .addField("Science Fiction Subgenres", "Alien--Humanoid Alien--Cyberpunk--Genetic Modification--Mecha--Power Suit--Robot--Android--Piloted Robot--Robot Helper--Super Robot--Transforming Craft--\nSpace Opera--Space Travel--Steampunk--Time Travel")
//                .addField("Sexual Abuse Subgenres", "Superhero")
//                .setFooter("Information provided by courtesy of Kitsu")
//            msg.channel.send(listsuboneembed)
//            gen.delete();
//        } else if ((!help) && (!sub)) {
//            let gen = await msg.channel.send("Generating...");
//            let listoneembed = new Discord.RichEmbed()
//                .setTitle("Here's a list of all the genres for both anime and manga:")
//                .setColor(blue)
//                .setDescription(`To view the subgenres, use ${prefix}genrelist sub\nIf you would like to search for more than one genre, please separate with commas and no spaces\n${prefix}sganime Action,Adventure or ${prefix}sgmanga Action,Adventure`)
//                .addField("Action", "__Subgenres:__ 7", true)
//                .addField("Adventure", "__Subgenres:__ None", true)
//                .addField("Anime Influenced", "__Subgenres:__ None", true)
//                .addField("Anthropomorphism", "__Subgenres:__ None", true)
//                .addField("Blackmail", "Subgenres: None", true)
//                .addField("Comedy", "__Subgenres:__ 7", true)
//                .addField("Detective", "__Subgenres:__ None", true)
//                .addField("Drama", "__Subgenres:__ None", true)
//                .addField("Ecchi", "__Subgenres:__ 3", true)
//                .addField("Fantasy", "__Subgenres:__ 10", true)
//                .addField("Ghost", "__Subgenres:__ None", true)
//                .addField("Harem", "__Subgenres:__ None", true)
//                .addField("Henshin", "__Subgenres:__ None", true)
//                .addField("Horror", "__Subgenres:__ None", true)
//                .addField("Incest", "__Subgenres:__ None", true)
//                .addField("Magical Girl", "__Subgenres:__ None", true)
//                .addField("Mystery", "__Subgenres:__ None", true)
//                .addField("Parasite", "__Subgenres:__ None", true)
//                .addField("Psychological", "__Subgenres:__ 1", true)
//                .addField("Romance", "__Subgenres:__ 7", true)
//                .addField("Science Fiction", "__Subgenres:__ 16", true)
//            let listtwoembed = new Discord.RichEmbed()
//                .setColor(blue)
//                .addField("Sexual Abuse", "__Subgenres:__ 1", true)
//                .addField("Supernatural", "__Subgenres:__ None", true)
//                .addField("Thriller", "__Subgenres:__ None", true)
//                .addField("Vampire", "__Subgenres:__ None", true)
//                .addField("Virtual Reality", "__Subgenres:__ None", true)
//                .addField("Zombie", "__Subgenres:__ None", true)
//                .setFooter("Information provided by courtesy of Kitsu")
//            msg.channel.send(listoneembed);
//            msg.channel.send(listtwoembed);
//            gen.delete();
//        }
//    }
//});
//client.login(token);        //Token for the bot to use this file