export class AppConfig {
  private static _instance: AppConfig
  public static get instance(): AppConfig {
    return this._instance || (this._instance = new AppConfig())
  }

  // base
  port: number

  constructor() {
    this.port = parseInt(process.env.PORT) || 3000
  }
}
