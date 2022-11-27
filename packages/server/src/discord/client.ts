import {Injectable} from '@nestjs/common'
import {Client, IntentsBitField, Partials} from 'discord.js'
import {Player} from 'discord-player'
import {ConfigService} from '@nestjs/config'
import {DiscordEvents} from './discord.events'
import {DiscordMusicPlayer} from './DiscordMusicPlayer'

@Injectable()
export class DiscordClient {

    private readonly discordEvents = new DiscordEvents()

    constructor(private readonly configService: ConfigService) {
        const token = this.configService.get<string>('DISCORD_TOKEN')
        this.login(token)
        this.discordEvents.registerEvents(this)
    }

    public client = new Client({
        partials: [Partials.Message, Partials.Channel],
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMessages,
            // IntentsBitField.Flags.GuildMessageReactions,
            // IntentsBitField.Flags.GuildMembers,
            // IntentsBitField.Flags.GuildPresences,
            IntentsBitField.Flags.GuildVoiceStates,
            IntentsBitField.Flags.MessageContent,
        ],
    })

    private player = new Player(this.client)

    public discordMusicPlayer = new DiscordMusicPlayer(this.player)

    private login(token: string) {
        this.client.login(token)
            .catch((e) => console.error(e))
    }
}
