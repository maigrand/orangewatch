import {Controller, Get, Param} from '@nestjs/common'
import {DiscordService} from './discord.service'

@Controller('/api/v1/discord')
export class DiscordController {
    constructor(private readonly discordService: DiscordService) {
    }

    @Get('guilds')
    findGuilds() {
        return this.discordService.findGuilds()
    }

    @Get('guilds/:guildId/queue')
    findQueue(@Param() params) {
        return this.discordService.findQueue(params.guildId)
    }
}
