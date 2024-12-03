import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosInstance } from 'axios'
import { AppConfig } from 'src/config/configuration'
import { AvailableScopes } from 'src/constant'
import { TokenRepoService } from 'src/data/token.repo'
import { AccessTokenResponse } from 'src/model/tiktok'
import { SECOND } from 'src/util/time'

@Injectable()
export class TiktokService {
  private readonly axiosInstance: AxiosInstance

  private readonly logger = new Logger(TiktokService.name)

  @Inject()
  private readonly tokenRepoService: TokenRepoService

  private readonly clientId: string
  private readonly clientSecret: string
  private readonly redirectUrl: string

  constructor(private readonly configService: ConfigService<AppConfig>) {
    const baseUrl = this.configService.get('tiktokBaseUrl', { infer: true })
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 15 * SECOND,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    this.axiosInstance.interceptors.request.use((config) => {
      this.logger.log(
        `${config.method} request to ${config.url} with query: ${JSON.stringify(config.params)} and data: ${JSON.stringify(config.data)}`,
      )

      return config
    })
    this.axiosInstance.interceptors.response.use((response) => {
      this.logger.log(
        `${response.config.method} response from ${response.config.url} with data: ${JSON.stringify(response.data)}`,
      )
      return response
    })
    this.clientId = this.configService.get('appClientId', { infer: true })
    this.clientSecret = this.configService.get('appSecret', { infer: true })
    this.redirectUrl = this.configService.get('appRedirectUrl', { infer: true })
  }

  async getAccessToken(code: string) {
    const url = '/v1.3/tt_user/oauth2/token/'
    const result = await this.axiosInstance.post(url, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      auth_code: code,
      redirect_uri: this.redirectUrl,
    })
    return result.data as AccessTokenResponse
  }

  generateLoginUrl(token: string) {
    const appClientId = this.configService.get('appClientId', { infer: true })
    const redirectUrl = this.configService.get('appRedirectUrl', {
      infer: true,
    })
    return `https://www.tiktok.com/v2/auth/authorize?client_key=${appClientId}&scope=${AvailableScopes.join(',')}&response_type=code&redirect_uri=${redirectUrl}&state=${JSON.stringify({ token })}`
  }
}
