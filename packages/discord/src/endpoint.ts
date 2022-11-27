import {container} from 'tsyringe'
import {DiscordClient} from './client'

export type IGuild = {
    id: string
}

export function getGuilds() {
    const discordClient = container.resolve(DiscordClient)
    const client = discordClient.client
    const guilds = client.guilds.cache

    return guilds.map((guild) => {
        const iGuild: IGuild = {
            id: guild.id
        }
        return iGuild
    })
}
