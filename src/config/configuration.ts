export class AppConfig {
  private static _instance: AppConfig
  public static get instance(): AppConfig {
    return this._instance || (this._instance = new AppConfig())
  }

  // base
  port: number
  tiktokBaseUrl: string
  mqUri: string
  mongoUri: string

  // tiktok app
  appClientId: string
  appSecret: string
  appRedirectUrl: string

  constructor() {
    this.port = parseInt(process.env.PORT) || 3000
    this.tiktokBaseUrl =
      process.env.TIKTOK_BASE_URL || 'https://business-api.tiktok.com/open_api/'
    this.mqUri =
      process.env.MQ_URI || 'amqp://private:private@172.31.38.140:5672'
    this.mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017'

    this.appClientId = process.env.APP_CLIENT_ID || '7443750260494581777'
    this.appSecret =
      process.env.APP_SECRET || 'e0d48c80089adb893129286a32de52e89ca5c929'
    this.appRedirectUrl =
      process.env.APP_REDIRECT_URL ||
      'https://tiktok-cb.xiaoshuzhiai.com/auth/redirect'
  }
}
