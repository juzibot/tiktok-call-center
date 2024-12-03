import { Column, Entity, Index, ObjectId, ObjectIdColumn } from 'typeorm'

@Entity()
@Index('token-index', ['token'], { unique: true })
export class TokenModel {
  @ObjectIdColumn()
  _id?: ObjectId

  @Column()
  token: string

  @Column()
  status: TokenStatus

  @Column()
  accessToken: string

  @Column()
  accessTokenExpireTime: Date

  @Column()
  refreshToken: string

  @Column()
  refreshTokenExpireTime: Date

  @Column()
  openId: string
}

export enum TokenStatus {
  Active,
  Inactive,
}
