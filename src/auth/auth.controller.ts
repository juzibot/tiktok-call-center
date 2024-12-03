import { Controller, Get, Inject, Query } from '@nestjs/common'
import { AuthObject, AuthQuery } from 'src/model/auth'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService

  @Get('redirect')
  async redirect(@Query() auth: AuthQuery) {
    console.log(auth.state)
    const authObject: AuthObject = {
      code: auth.code,
      scopes: auth.scopes.split(','),
      token: JSON.parse(auth.state).token,
    }
    await this.authService.auth(authObject)
    return {
      message: '登陆成功，请关闭页面',
    }
  }
}
