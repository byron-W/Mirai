//const Discord = require("discord.js");
//const client = new Discord.Client();
//const ytdl = require("ytdl-core");
//const tokenfile = require("../token.json");
//const token = tokenfile.token;
//const config = require("../config.json");
//const prefix = config.prefix;
//const streamOptions = { seek: 0, volume: 1 };

//client.on("message", msg => {
//    if (!msg.guild) return;     //Doesn't allow command to be run outside the server

//    const args = msg.content.slice(prefix.length).trim().split(/ +/g);      //Takes away the prefix and command to make the array 0 based. Equals everything after
//    const command = args.shift().toLowerCase();     //The string directly after the prefix. No space allowed

//    if (!msg.content.startsWith(prefix)) return;

//    if (command === "join") {       //Shows how to run the command
//        if (msg.channel.name != "music") return msg.channel.send("You must be in the correct channel to use this command")
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`Can only be used while in a voice channel\nMake me join the voice chat\n${prefix}join`);
//        } else {        //If the user isn't asking for help
//            let VoiceChannel = msg.member.voiceChannel;       //Finds the voice channel for music
//            if (!VoiceChannel) return msg.channel.send("You must be in a voice channel to use this command")
//            console.log(VoiceChannel.name + " channel found and is a " + VoiceChannel.type + " channel!");
//            try {
//                VoiceChannel.join()     //Joins the voice chat
//                    .then(connection => {
//                        msg.channel.send("I've joined the voice chat!");
//                    })
//            } catch (error) {
//                console.log(error);
//                msg.channel.send("Sorry I couldn't join the voice chat :(").then(sentMessage => {
//                    sentMessage.delete(5000)
//                });
//            }
//        }
//    }
//    if (command === "leave") {
//        if (msg.channel.name != "music") return msg.channel.send("You must be in the correct channel to use this command")
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`Can only be used while in a voice channel\nMakes me leave the voice channel\n${prefix}leave`);
//        } else {
//            let userVoiceChannel = msg.member.voiceChannel;      //Finds the voice channel for music
//            if (!userVoiceChannel) return msg.channel.send(`You must be in a voice channel to use this command`)
//            let clientVoiceConnection = msg.guild.voiceConnection;
//            if (!clientVoiceConnection) return msg.channel.send(`I have to be in a voice channel to leave`)
//            clientVoiceConnection.disconnect();
//            msg.channel.send("Successfully left the voice chat!");
//        }
//    }
//    if (command === "play") {
//        if (msg.channel.name != "music") return msg.channel.send("You must be in the correct channel to use this command")
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`Can only be used while in a voice channel\nPlay any video from youtube\n${prefix}play <youtube link>`);
//        } else {
//            let userVoiceChannel = msg.member.voiceChannel;      //Finds the voice channel for music
//            if (!userVoiceChannel) return msg.channel.send(`You must be in a voice channel to use this command`)
//            let clientVoiceConnection = msg.guild.voiceConnection;
//            if (!clientVoiceConnection) return msg.channel.send(`I have to be in a voice channel to play songs`)
//            let song = args[0];
//            if (!song) return msg.channel.send("You didn't supply a song to play");
//            try {
//                const stream = ytdl(song, { filter: 'audioonly', quality: 'highestaudio' });
//                clientVoiceConnection.playStream(stream, streamOptions)     //Plays the song
//                    .on("end", () => {
//                        msg.channel.send("Song ended");
//                    })
//                    .on("error", error => {
//                        console.log(error);
//                        msg.channel.send("An error occured :(").then(sentMessage => {
//                            sentMessage.delete(5000)
//                        });
//                    })
//                clientVoiceConnection.dispatcher.setBitrate(clientVoiceConnection.channel.bitrate)
//            } catch (err) {
//                console.log(err);
//                msg.channel.send("I couldn't find that song")
//            }
//        }
//    }
//    if (command === "stop") {
//        if (msg.channel.name != "music") return msg.channel.send("You must be in the correct channel to use this command")
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`Can only be used while in a voice channel\nStop audio that's currently playing\n${prefix}stop`);
//        } else {
//            let userVoiceChannel = msg.member.voiceChannel;      //Finds the voice channel for music
//            if (!userVoiceChannel) return msg.channel.send(`You must be in a voice channel to use this command`)
//            let clientVoiceConnection = msg.guild.voiceConnection;
//            if (!clientVoiceConnection) return msg.channel.send(`I have to be in a voice channel to stop songs`)
//            try {
//                clientVoiceConnection.dispatcher.end()     //Stops the song
//            } catch (err) {
//                console.log(err);
//                return msg.channel.send("There is no song playing");
//            }
//        }
//    }
//    if (command === "pause") {
//        if (msg.channel.name != "music") return msg.channel.send("You must be in the correct channel to use this command")
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`Can only be used while in a voice channel\nPause audio that's currently playing\n${prefix}pause`);
//        } else {
//            let userVoiceChannel = msg.member.voiceChannel;      //Finds the voice channel for music
//            if (!userVoiceChannel) return msg.channel.send(`You must be in a voice channel to use this command`)
//            let clientVoiceConnection = msg.guild.voiceConnection;
//            if (!clientVoiceConnection) return msg.channel.send(`I have to be in a voice channel to stop songs`)
//            try {
//                clientVoiceConnection.dispatcher.pause()     //Pauses the song
//            } catch (err) {
//                console.log(err);
//                return msg.channel.send("There is no song playing");
//            }
//        }
//    }
//    if (command === "resume") {
//        if (msg.channel.name != "music") return msg.channel.send("You must be in the correct channel to use this command")
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`Can only be used while in a voice channel\nResume audio that's paused\n${prefix}stop`);
//        } else {
//            let userVoiceChannel = msg.member.voiceChannel;      //Finds the voice channel for music
//            if (!userVoiceChannel) return msg.channel.send(`You must be in a voice channel to use this command`)
//            let clientVoiceConnection = msg.guild.voiceConnection;
//            if (!clientVoiceConnection) return msg.channel.send(`I have to be in a voice channel to stop songs`)
//            try {
//                clientVoiceConnection.dispatcher.resume()     //Resumes the song
//            } catch (err) {
//                console.log(err);
//                return msg.channel.send("There is either no song that's paused or no song playing");
//            }
//        }
//    }
//    if ((command === "volume") || (command === "vol")) {
//        if (msg.channel.name != "music") return msg.channel.send("You must be in the correct channel to use this command")
//        let help = msg.content.endsWith("help");
//        if (help) {     //Explains what the command does
//            msg.channel.send(`Can only be used while in a voice channel\nSet the volume to a percentage between 1 and 200\n${prefix}vol <volume>`);
//        } else {
//            let userVoiceChannel = msg.member.voiceChannel;      //Finds the voice channel for music
//            if (!userVoiceChannel) return msg.channel.send(`You must be in a voice channel to use this command`)
//            let clientVoiceConnection = msg.guild.voiceConnection;
//            if (!clientVoiceConnection) return msg.channel.send(`I have to be in a voice channel to play songs`)
//            let uservolume = parseInt(args[0])
//            if (uservolume > 200) return msg.channel.send("I can't set the volume past 200%")
//            let newvolume = uservolume / 100;
//            try {
//                clientVoiceConnection.dispatcher.setVolume(newvolume)
//                msg.channel.send(`The volume has been sent to ${uservolume}%`)
//            } catch (err) {
//                console.log(err);
//                msg.channel.send("I failed to change the volume")
//            }
//        }
//    }
//});
//client.login(token);        //Token for the bot to use this file
