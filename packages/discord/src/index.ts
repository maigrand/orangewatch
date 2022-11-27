import 'dotenv/config'
import 'reflect-metadata'
import {container} from 'tsyringe'
import {DiscordClient} from './client'
import {Events, GuildMember, Interaction, TextChannel} from 'discord.js'
import {DiscordMusicPlayer} from './player'
import {commandsNames} from './register-slash-commands'

const TOKEN = process.env.DISCORD_TOKEN

const start = async () => {
    try {
        const discordClient = container.resolve(DiscordClient)
        await discordClient.login(TOKEN)
        const client = discordClient.client

        const discordMusicPlayer = new DiscordMusicPlayer(discordClient.player)

        client.once('ready', async (e) => {
            console.log(`ready ${client.user.tag}`)
        })

        client.on(Events.InteractionCreate, async (interaction: Interaction) => {
            if (!interaction.isChatInputCommand()) {
                return
            }

            if (!commandsNames.includes(interaction.commandName)) {
                return
            }

            const queue = discordMusicPlayer.getQueue(interaction.guild, interaction.channel as TextChannel)
            const member: GuildMember = interaction.member as GuildMember
            const botVoiceChannelId = interaction.guild.members.me.voice.channelId

            if (interaction.commandName === 'play') {
                const query = interaction.options.getString('query')

                const response = await discordMusicPlayer.play(interaction.guild, member, botVoiceChannelId, query, queue)

                await interaction.reply({
                    content: response.content,
                    ephemeral: response.ephemeral ? response.ephemeral : undefined
                })

                return
            }

            if (interaction.commandName === 'stop') {
                const response = await discordMusicPlayer.stop(member, botVoiceChannelId, queue)

                await interaction.reply({
                    content: response.content,
                    ephemeral: response.ephemeral ? response.ephemeral : undefined
                })

                return
            }

            if (interaction.commandName === 'skip') {
                const response = await discordMusicPlayer.skip(member, botVoiceChannelId, queue)

                await interaction.reply({
                    content: response.content,
                    ephemeral: response.ephemeral ? response.ephemeral : undefined
                })

                return
            }

            if (interaction.commandName === 'nowplaying') {
                const response = await discordMusicPlayer.nowplaying(queue)

                await interaction.reply({
                    content: response.content,
                    ephemeral: response.ephemeral ? response.ephemeral : undefined
                })
            }
        })

    } catch (e) {
        console.error(e)
    }
}

process.on('unhandledRejection', (e) => {
    console.error(e)
    process.exit(1)
})

start()
