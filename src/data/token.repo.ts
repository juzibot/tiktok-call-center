import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectId, Repository } from 'typeorm'
import { TokenModel } from './entity'

@Injectable()
export class TokenRepoService {
  @InjectRepository(TokenModel)
  private readonly repo: Repository<TokenModel>

  async save(tokenModel: TokenModel) {
    return await this.repo.save(tokenModel)
  }

  async updateToken(id: string, token: Partial<TokenModel>) {
    const _id = new ObjectId(id)
    return this.repo.update({ _id }, token)
  }

  async getTokenById(id: string) {
    return this.repo.findOneBy({ _id: new ObjectId(id) })
  }

  async getTokenByToken(token: string) {
    return this.repo.findOneBy({ token })
  }
}
