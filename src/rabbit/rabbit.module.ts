import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RabbitProcessor } from './rabbit.processor'

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const mqUri = config.get<string>('mqUri')
        return {
          uri: mqUri,
          connectionInitOptions: { wait: false },
          exchanges: [
            {
              name: 'tiktok.message.to.client',
              type: 'direct',
            },
            {
              name: 'tiktok.message.to.server',
              type: 'direct',
            },
          ],
          channels: {
            'tiktok-channel': {
              prefetchCount: 10,
              default: true,
            },
          },
        }
      },
    }),
  ],
  providers: [RabbitProcessor],
  exports: [RabbitProcessor],
})
export class RabbitModule {}
