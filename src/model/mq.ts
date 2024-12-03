export interface MqCommandMessage {
  traceId: string
  commandType: string
  data: string
}

export enum MqMessageType {
  command = 'command',
  event = 'event',
}

export enum MqEventType {
  dong = 'dong',
  login = 'login',
  loginUrl = 'loginUrl',
}
