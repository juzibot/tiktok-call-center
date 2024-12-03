import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { AppConfig } from './config/configuration'
import { DataModule } from './data/data.module'
import { RabbitModule } from './rabbit/rabbit.module'
import { TiktokModule } from './tiktok/tiktok.module'

@Module({
  imports: [
    AuthModule,
    DataModule,
    TiktokModule,
    RabbitModule,
    ConfigModule.forRoot({
      load: [() => AppConfig.instance],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        return {
          type: 'mongodb',
          url: config.get<string>('mongoUri'),
          database: 'tiktok_call_center',
          entities: require('./data/entity'),
          synchronize: true,
          useUnifiedTopology: true,
        }
      },
    }),
    EventEmitterModule.forRoot({
      verboseMemoryLeak: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
