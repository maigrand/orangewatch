import {Injectable} from '@nestjs/common'
import {DiscordClient} from './client'
import {Snowflake} from 'discord.js'
import {InjectRepository} from '@nestjs/typeorm'
import {RoleEntity} from './entities/role.entity'
import {Repository} from 'typeorm'
import {UserEntity} from './entities/user.entity'
import {PermissionEntity} from './entities/permission.entity'

@Injectable()
export class DiscordService {
    constructor(private readonly discordClient: DiscordClient,
                @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
                @InjectRepository(RoleEntity) private roleRepository: Repository<RoleEntity>,
                @InjectRepository(PermissionEntity) private permissionRepository: Repository<PermissionEntity>) {
        this.registerPermissions(['test', 'admin'])
    }

    findGuilds() {
        return this.discordClient.client.guilds.cache
    }

    findQueue(guildId: Snowflake) {
        return this.discordClient.discordMusicPlayer.getQueueByGuild(guildId)
    }

    createPermission(permission: string) {
        return this.permissionRepository.insert({
            name: permission
        })
    }

    async registerPermissions(permissions: string[]) {
        for (const permission of permissions) {
            const permissionEntity: PermissionEntity[] = await this.permissionRepository.find({
                where: {
                    name: permission
                }
            })
            if (!permissionEntity || permissionEntity.length === 0) {
                await this.permissionRepository.insert({name: permission})
            }
        }
    }

    // insertQueue(queueId: string) {
    //     this.discordClient.discordMusicPlayer.play()
    // }
}
