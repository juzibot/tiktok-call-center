import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ConsumeMessage } from 'amqplib'
import { ClientCommandPrefix } from 'src/model/event'
import { MqCommandMessage, MqEventType, MqMessageType } from 'src/model/mq'
import { v4 } from 'uuid'

@Injectable()
export class RabbitProcessor {
  private readonly logger = new Logger(RabbitProcessor.name)

  @Inject()
  private readonly eventEmitter: EventEmitter2

  @Inject()
  private readonly amqpConnection: AmqpConnection

  @RabbitSubscribe({
    exchange: 'tiktok.message.to.server',
    routingKey: 'command',
    queue: 'tiktok.command.queue',
  })
  handleMessage(message: MqCommandMessage, amqpMsg: ConsumeMessage) {
    const token = amqpMsg.properties.appId as string
    if (!token) {
      this.logger.error(`handleMessage(${message}) token is empty`)
      return
    } else {
      this.logger.log(`handleMessage(${JSON.stringify(message)}) from ${token}`)
    }

    this.eventEmitter.emit(`${ClientCommandPrefix}.${message.commandType}`, {
      token,
      traceId: message.traceId,
      dataString: message.data,
    })
  }

  sendSuccessResponseToExchange(
    token: string,
    request: MqCommandMessage,
    data: any,
  ) {
    this.amqpConnection.publish('tiktok.message.to.client', token, {
      traceId: request.traceId,
      type: MqMessageType.command,
      data: JSON.stringify(data),
    })
  }

  sendErrorResponseToExchange(
    token: string,
    request: MqCommandMessage,
    code: number,
    error: Error,
  ) {
    this.amqpConnection.publish('tiktok.message.to.client', token, {
      traceId: request.traceId,
      type: MqMessageType.command,
      data: '{}',
      code,
      error: error.message,
    })
  }

  sendEventToExchange(token: string, eventType: MqEventType, data: any) {
    this.amqpConnection.publish('tiktok.message.to.client', token, {
      traceId: v4(),
      type: MqMessageType.event,
      eventType,
      data: JSON.stringify(data),
    })
  }
}
