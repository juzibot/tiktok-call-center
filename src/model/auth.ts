export interface AuthQuery {
  code: string
  scopes: string
  state: string
}

export interface AuthObject {
  code: string
  scopes: string[]
  token: string
}
