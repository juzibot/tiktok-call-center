import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TokenModel } from './entity'
import { TokenRepoService } from './token.repo'

@Module({
  imports: [TypeOrmModule.forFeature([TokenModel])],
  providers: [TokenRepoService],
  exports: [TokenRepoService],
})
export class DataModule {}
