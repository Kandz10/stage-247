const { Client, Intents } = require("discord.js")
const ytdl = require("ytdl-core"); 
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");
const client = new Client({
    shards: "auto", 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send(`giờ thì vào đây dán link này  vào https://uptimerobot.com`));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`)); 
//TOKEN vào đây
client.login(process.env.TOKEN);

const Channels = ["879249660047392809"]; /// ID stage hoặc voice 

client.on("ready", async () => {
    for(const channelId of Channels){
        joinChannel(channelId);       
        await new Promise(res => setTimeout(() => res(2), 500))
    }

    function joinChannel(channelId) {
        client.channels.fetch(channelId).then(channel => {
            const VoiceConnection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
            });
              const resource = createAudioResource(ytdl("https://youtu.be/DWcJFNfaw9c"), {
                inlineVolume: true
            }); //youtube link
            resource.volume.setVolume(0.2);
            const player = createAudioPlayer()
            VoiceConnection.subscribe(player);
            player.play(resource);
            player.on("idle", () => {
                try{
                    player.stop()
                } catch (e) { }
                try{
                    VoiceConnection.destroy()
                } catch (e) { }
                joinChannel(channel.id)
            })
        }).catch(console.error)
    }
})

client.on("voiceStateUpdate", async (oldState, newState) => {
    if(newState.channelId && newState.channel.type === "GUILD_STAGE_VOICE" && newState.guild.me.voice.suppress) {
        try{
            await newState.guild.me.voice.setSuppressed(false)
        }catch (e) {

        }
    }
})
client.on("warn", console.log)
client.on("debug", console.log)
client.on("rateLimit", console.log)