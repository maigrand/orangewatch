import {Module} from '@nestjs/common'
import {DiscordClient} from './client'
import {ConfigModule} from '@nestjs/config'
//import {DiscordEvents} from './discord.events'
import {DiscordController} from './discord.controller'
import {DiscordService} from './discord.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {PlaylistEntity} from './entities/playlist.entity'
import {UserEntity} from './entities/user.entity'
import {RoleEntity} from './entities/role.entity'
import {PermissionEntity} from './entities/permission.entity'

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([PlaylistEntity, UserEntity, RoleEntity, PermissionEntity])],
    controllers: [DiscordController],
    providers: [DiscordClient, DiscordService]
})
export class DiscordModule {
}
