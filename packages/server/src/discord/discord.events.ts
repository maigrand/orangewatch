import {DiscordClient} from './client'
import {
    ActionRowBuilder, ButtonBuilder,
    Client, EmbedBuilder,
    Events,
    GuildMember,
    Interaction, Message,
    PermissionsBitField,
    REST,
    Routes,
    SlashCommandBuilder, Snowflake,
    TextChannel,
    ButtonStyle, ComponentEmojiResolvable
} from 'discord.js'
import {Injectable} from '@nestjs/common'
//import {commandsNames} from '@orange-watch/discord/src/register-slash-commands'

type ButtonOption = {
    emoji?: ComponentEmojiResolvable
    label?: string
    style: Exclude<ButtonStyle, ButtonStyle.Link>
    customId: string
}

//@Injectable()
export class DiscordEvents {
    // constructor(private readonly discordClient: DiscordClient) {
    //     this.registerEvents(discordClient.client)
    // }

    // private discordMusicPlayer = new DiscordMusicPlayer(this.discordClient.player)

    registerEvents(discordClient: DiscordClient) {
        const client = discordClient.client
        const discordMusicPlayer = discordClient.discordMusicPlayer

        client.once(Events.ClientReady, () => {
            console.log(`ready ${client.user.tag}`)
        })

        client.on(Events.InteractionCreate, async (interaction: Interaction) => {
            if (!interaction.isChatInputCommand()) {
                return
            }

            // if (!commandsNames.includes(interaction.commandName)) {
            //     return
            // }

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

            if (interaction.commandName === 'register') {
                const memberPermissions = interaction.memberPermissions
                await interaction.deferReply({ephemeral: true})
                if (!memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
                    await interaction.editReply({
                        content: 'not admin',
                    })
                    return
                }

                const rest = new REST({version: '10'}).setToken(client.token)

                try {
                    console.log('Started refreshing application [/] commands.')

                    await rest.put(Routes.applicationCommands(client.user.id), { body: this.commands })

                    console.log('Successfully reloaded application [/] commands.')
                    await interaction.editReply({
                        content: 'Successfully reloaded application [/] commands.',
                    })
                } catch (error) {
                    console.error(error)
                }

            }

            if (interaction.commandName === 'purge') {
                const memberPermissions = interaction.memberPermissions
                await interaction.deferReply({ephemeral: true})
                if (!memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
                    await interaction.editReply({
                        content: 'not admin',
                    })
                    return
                }

                const channel:TextChannel = interaction.options.getChannel('channel') as TextChannel
                const messages = await this.fetchAllMessages(channel.id, client)
                const checkDate = new Date()
                checkDate.setDate(checkDate.getDate() - 14)
                const messagesIds = messages
                    .filter((message) => message.createdTimestamp > checkDate.valueOf())
                    .map((message) => message.id)
                await channel.bulkDelete(messagesIds)

                const oldMessagesIds = messages
                    .filter((message) => message.createdTimestamp <= checkDate.valueOf())
                    .map((message) => message.id)

                for (const id of oldMessagesIds) {
                    const msg = await channel.messages.fetch(id)
                    await msg.delete()
                }

                await interaction.editReply({
                    content: `deleted ${messagesIds.length + oldMessagesIds.length} messages`
                })

                return
            }

            if (interaction.commandName === 'testplayer') {
                const emb = new EmbedBuilder()
                //emb.setTitle('player')

                const queueTrackNames = queue.tracks.map((q, i) => `${i}. ${q.title} \n`).join(' ')

                emb.setAuthor({
                    name: 'Kavinsky - Nightcall (Drive Original Movie Soundtrack) (Official Audio)',
                    iconURL: undefined,
                    url: 'https://www.youtube.com/watch?v=MV_3Dpw-BRY'
                })
                emb.setFooter({
                    text: 'requested by mai#1234',
                    iconURL: undefined
                })
                emb.setTimestamp()
                emb.setDescription(!!queueTrackNames ? queueTrackNames : 'empty')

                const buttons: ButtonOption[] = [
                    {
                        style: ButtonStyle.Primary,
                        label: 'previous',
                        emoji: '⏮',
                        customId: 'previous',
                    },
                    {
                        style: ButtonStyle.Danger,
                        label: 'pause',
                        emoji: '⏸',
                        customId: 'pause',
                    },
                    {
                        style: ButtonStyle.Primary,
                        label: 'next',
                        emoji: '⏭',
                        customId: 'next',
                    },
                ]

                const message = await interaction.channel.messages.fetch('1043853866208346162')
                await message.edit({
                    embeds: [emb],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>({
                            components: buttons.map((buttonOption) => {
                                return new ButtonBuilder({
                                    customId: buttonOption.customId,
                                    label: buttonOption.label,
                                    emoji: buttonOption.emoji,
                                    style: buttonOption.style,
                                    type: 2
                                })
                            })
                        })
                    ]
                })
                // const message = await interaction.channel.send({
                //     embeds: [emb],
                //     components: [
                //         new ActionRowBuilder<ButtonBuilder>({
                //             components: buttons.map((buttonOption) => {
                //                 return new ButtonBuilder({
                //                     emoji: buttonOption.emoji,
                //                     style: buttonOption.style,
                //                     type: 2,
                //                     label: buttonOption.label,
                //                     customId: buttonOption.customId,
                //                 })
                //             })
                //         })
                //     ]
                // })

                await interaction.reply({
                    content: 'ok'
                })
                await interaction.deleteReply()

            }
        })
    }

    private readonly commands = [
        new SlashCommandBuilder()
            .setName('play')
            .setDescription('Play a song!')
            .addStringOption(option => {
                option.setName('query')
                option.setDescription('WIP')
                return option
            }),
        new SlashCommandBuilder()
            .setName('stop')
            .setDescription('Stop a song!'),
        new SlashCommandBuilder()
            .setName('skip')
            .setDescription('Skip a song!'),
        new SlashCommandBuilder()
            .setName('nowplaying')
            .setDescription('Now playing song'),
        new SlashCommandBuilder()
            .setName('register')
            .setDescription('admin only')
            .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
        new SlashCommandBuilder()
            .setName('save')
            .setDescription('save'),
        new SlashCommandBuilder()
            .setName('get')
            .setDescription('get'),
        new SlashCommandBuilder()
            .setName('purge')
            .setDescription('purge all messages')
            .addChannelOption((channel) => {
                channel.setRequired(true)
                channel.setName('channel')
                channel.setDescription('select channel to purge')
                return channel
            })
            .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
        new SlashCommandBuilder()
            .setName('testplayer')
            .setDescription('test player'),
    ]

    private async fetchAllMessages(channelId: string | Snowflake, client: Client):Promise<Message[]> {
        const channel:TextChannel = await client.channels.cache.get(channelId) as TextChannel
        let messages = [];

        // Create message pointer
        let message = await channel.messages
            .fetch({ limit: 1 })
            .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

        while (message) {
            await channel.messages
                .fetch({ limit: 100, before: message.id })
                .then(messagePage => {
                    messagePage.forEach(msg => messages.push(msg));

                    // Update our message pointer to be last message in page of messages
                    message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
                })
        }

        return messages
    }
}
