import { payloads } from '@juzi/wechaty-puppet'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { RequiredScopes } from 'src/constant'
import { TokenModel, TokenStatus } from 'src/data/entity'
import { TokenRepoService } from 'src/data/token.repo'
import { AuthObject } from 'src/model/auth'
import { ClientCommandEventPayload, ClientCommandPrefix } from 'src/model/event'
import { MqEventType } from 'src/model/mq'
import { RabbitProcessor } from 'src/rabbit/rabbit.processor'
import { TiktokService } from 'src/tiktok/tiktok.service'
import { SECOND } from 'src/util/time'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  @Inject()
  private readonly tokenRepoService: TokenRepoService

  @Inject()
  private readonly tiktokService: TiktokService

  @Inject()
  private readonly rabbit: RabbitProcessor

  async auth(authObject: AuthObject) {
    this.logger.log(`auth(${JSON.stringify(authObject)})`)

    if (!RequiredScopes.every((scope) => authObject.scopes.includes(scope))) {
      throw new Error('权限不足')
    }

    const accessTokenResponse = await this.tiktokService.getAccessToken(
      authObject.code,
    )
    const now = Date.now()
    const tokenModel: TokenModel = {
      token: authObject.token,
      status: TokenStatus.Active,
      accessToken: accessTokenResponse.data.access_token,
      accessTokenExpireTime: new Date(
        now + accessTokenResponse.data.expires_in * SECOND,
      ),
      refreshToken: accessTokenResponse.data.refresh_token,
      refreshTokenExpireTime: new Date(
        now + accessTokenResponse.data.refresh_token_expires_in * SECOND,
      ),
      openId: accessTokenResponse.data.open_id,
    }
    await this.tokenRepoService.save(tokenModel)
  }

  @OnEvent(`${ClientCommandPrefix}.start`)
  async handleClientStart(data: ClientCommandEventPayload) {
    const tokenModel = await this.tokenRepoService.getTokenByToken(data.token)
    if (!tokenModel) {
      this.logger.error(`tokenModel not found for token: ${data.token}`)
      return
    }
    if (tokenModel.status === TokenStatus.Active) {
      this.rabbit.sendEventToExchange(data.token, MqEventType.login, {
        contactId: tokenModel.openId,
      } as payloads.EventLogin)
    } else {
      this.rabbit.sendEventToExchange(data.token, MqEventType.loginUrl, {
        url: this.tiktokService.generateLoginUrl(data.token),
      } as payloads.EventLoginUrl)
    }
  }
}
