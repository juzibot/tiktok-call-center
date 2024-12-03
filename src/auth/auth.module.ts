import { Module } from '@nestjs/common'
import { DataModule } from 'src/data/data.module'
import { TiktokModule } from 'src/tiktok/tiktok.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [DataModule, TiktokModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
