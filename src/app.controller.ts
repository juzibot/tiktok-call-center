import { All, Body, Controller, Logger, Query } from '@nestjs/common'

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)

  @All('callback')
  callback(@Query() query: any, @Body() body: any) {
    this.logger.log(
      `new callback received, query: ${JSON.stringify(query)}, body: ${JSON.stringify(body)}`,
    )
    return {}
  }
}
