import {Guild, GuildMember, TextChannel} from 'discord.js'
import {Player, QueryType, Queue} from 'discord-player'

type IQueue = {
    channel: TextChannel | null
}

type InteractionResponse = {
    content: string,
    ephemeral?: boolean
}

type ValidRequestResponse = {
    isValid: boolean,
    interactionResponse?: InteractionResponse
}

export class DiscordMusicPlayer {
    constructor(private player: Player) {
        this.init()
    }

    public getQueue(guild: Guild, channel: TextChannel): Queue<IQueue> {
        const queue: Queue<IQueue> = this.player.getQueue(guild)
        if (!queue) {
            return this.player.createQueue(guild, {
                leaveOnEnd: false,
                leaveOnStop: false,
                leaveOnEmpty: false,
                leaveOnEmptyCooldown: 1000,
                leaveOnEndCooldown: 1000,
                autoSelfDeaf: true,
                ytdlOptions: {
                    filter: 'audioonly',
                    highWaterMark: 1 << 30,
                    dlChunkSize: 0,
                },
                initialVolume: 20,
                bufferingTimeout: 3000,
                spotifyBridge: true,
                disableVolume: false,
                volumeSmoothness: 0.5,
                metadata: {
                    channel: channel
                }
            })
        }
        return queue
    }

    public async play(
        guild: Guild,
        member: GuildMember,
        botVoiceChannelId: string,
        query: string,
        queue: Queue<IQueue>
    ): Promise<InteractionResponse> {
        const memberVoiceChannel = member.voice.channel
        //const memberVoiceChannelId = member.voice.channelId

        // if (!memberVoiceChannelId) {
        //     return {
        //         content: 'You are not in a voice channel!',
        //         ephemeral: true,
        //     }
        // }

        // if (botVoiceChannelId && memberVoiceChannelId !== botVoiceChannelId) {
        //     return {
        //         content: 'You are not in my voice channel!',
        //         ephemeral: true,
        //     }
        // }

        const validRequest = this.isValidRequest(member, botVoiceChannelId)
        if (!validRequest.isValid) {
            return validRequest.interactionResponse
        }

        if (queue.setPaused()) {
            queue.setPaused(false)
            return {
                content: 'Unpause',
                ephemeral: true,
            }
        }

        const searchResult = await this.player
            .search(query, {
                requestedBy: member.user,
                searchEngine: QueryType.AUTO
            })
            .catch((e) => console.error(e))

        if (!searchResult || !searchResult.tracks.length) {
            return {
                content: `❌ | Track **${query}** not found!`
            }
        }

        try {
            if (!queue.connection) {
                await queue.connect(memberVoiceChannel)
            }
        } catch {
            this.player.deleteQueue(guild)
            return {
                content: 'Could not join your voice channel!'
            }
        }

        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0])
        const title = searchResult.playlist ? searchResult.playlist.title : searchResult.tracks[0].title

        if (!queue.playing) {
            await queue.play()
            return {
                content: `playing ${title}`,
                ephemeral: true,
            }
        }

        return {
            content: `add to queue ${title}`,
            ephemeral: true,
        }
    }

    public async stop(member: GuildMember, botVoiceChannelId: string, queue: Queue<IQueue>): Promise<InteractionResponse> {
        const validRequest = this.isValidRequest(member, botVoiceChannelId)
        if (!validRequest.isValid) {
            return validRequest.interactionResponse
        }

        queue.setPaused(true)
        return {
            content: 'Stopped',
        }
    }

    public async skip(member: GuildMember, botVoiceChannelId: string, queue: Queue<IQueue>): Promise<InteractionResponse> {
        const validRequest = this.isValidRequest(member, botVoiceChannelId)
        if (!validRequest.isValid) {
            return validRequest.interactionResponse
        }

        queue.skip()
        return {
            content: 'Skipped',
        }
    }

    public async nowplaying(queue: Queue<IQueue>): Promise<InteractionResponse> {
        const track = queue.nowPlaying()
        return {
            content: `${track.title} - ${track.url}`,
            ephemeral: true,
        }
    }

    private isValidRequest(member: GuildMember, botVoiceChannelId: string): ValidRequestResponse {
        const memberVoiceChannelId = member.voice.channelId

        if (!memberVoiceChannelId) {
            return {
                isValid: false,
                interactionResponse: {
                    content: 'You are not in a voice channel!',
                    ephemeral: true,
                }
            }
        }

        if (botVoiceChannelId && memberVoiceChannelId !== botVoiceChannelId) {
            return {
                isValid: false,
                interactionResponse: {
                    content: 'You are not in my voice channel!',
                    ephemeral: true,
                }
            }
        }

        return {
            isValid: true
        }
    }

    private init() {
        this.player.on('error', (queue, error) => {
            console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`)
        })
        this.player.on('connectionError', (queue, error) => {
            console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`)
        })
        this.player.on('trackStart', async (queue: Queue<IQueue>, track) => {
            await queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`)
        })
    }
}
