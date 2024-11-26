import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppConfig } from './config/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => AppConfig.instance],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
