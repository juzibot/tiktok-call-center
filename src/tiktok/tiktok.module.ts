import { Module } from '@nestjs/common'
import { DataModule } from 'src/data/data.module'
import { TiktokService } from './tiktok.service'

@Module({
  imports: [DataModule],
  providers: [TiktokService],
  exports: [TiktokService],
})
export class TiktokModule {}
