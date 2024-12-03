import { Module } from '@nestjs/common'
import { DataModule } from 'src/data/data.module'
import { RabbitModule } from 'src/rabbit/rabbit.module'
import { TiktokModule } from 'src/tiktok/tiktok.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [DataModule, TiktokModule, RabbitModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
