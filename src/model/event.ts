export const ClientCommandPrefix = 'client.command'
export interface ClientCommandEventPayload {
  token: string
  traceId: string
  dataString: string
}
