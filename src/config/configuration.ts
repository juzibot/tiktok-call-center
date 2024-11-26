export class AppConfig {
  private static _instance: AppConfig
  public static get instance(): AppConfig {
    return this._instance || (this._instance = new AppConfig())
  }

  // base
  port: number
  tiktokBaseUrl: string

  constructor() {
    this.port = parseInt(process.env.PORT) || 3000
    this.tiktokBaseUrl =
      process.env.TIKTOK_BASE_URL || 'https://business-api.tiktok.com/open_api/'
  }
}
