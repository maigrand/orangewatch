import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./typeorm.service";
import { ApiModule } from "./api/api.module";
import {DiscordModule} from './discord/discord.module'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
        ApiModule,
        DiscordModule,
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {
}
