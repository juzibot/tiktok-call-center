import { Inject, Injectable, Logger } from '@nestjs/common'
import { TokenModel, TokenStatus } from 'src/data/entity'
import { TokenRepoService } from 'src/data/token.repo'
import { AuthObject } from 'src/model/auth'
import { TiktokService } from 'src/tiktok/tiktok.service'
import { SECOND } from 'src/util/time'

const requiredScopes = [
  'comment.list',
  'comment.list.manage',
  'video.list',
  'user.info.basic',
]

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  @Inject()
  private readonly tokenRepoService: TokenRepoService

  @Inject()
  private readonly tiktokService: TiktokService

  async auth(authObject: AuthObject) {
    this.logger.log(`auth(${JSON.stringify(authObject)})`)

    if (!requiredScopes.every((scope) => authObject.scopes.includes(scope))) {
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
}
