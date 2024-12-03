export enum TiktokCommentVisibleStatus {
  /**
   * 所有 TikTok 用户均可公开查看的评论（及评论回复）。
   */
  Public = 'PUBLIC',
  /**
   * 视频发布者的隐藏评论（及评论回复）以及所有 TikTok 用户均可公开查看的评论（及评论回复）。
   */
  All = 'ALL',
  /**
   * 评论回复已隐藏，无法公开浏览。
   */
  Hidden = 'HIDDEN',
}

export enum TiktokCommentSortFields {
  like = 'likes',
  reply = 'replies',
  createTime = 'create_time',
}

export enum TiktokSortOrder {
  Desc = 'desc',
  Asc = 'asc',
  /**
   * 利用算法自动进行评论（及评论回复）排序。
   */
  Smart = 'smart',
}

export enum TiktokGetApiType {
  GetSelfVideoComment,
  GetCommentReply,
}

export interface TiktokRequestHeaderRegular {
  /**
   * 经 TikTok 创作者授权的访问令牌。若想获取访问令牌，需使用/tt_user/oauth2/token/接口。
   */
  'Access-Token': string
}

export interface TiktokResponseHeaderRegular {
  /**
   * 收到返回时的(GMT)日期和时间 。示例： Fri, 13 Aug 2021 08:04:42 GMT
   */
  Date: string
  /**
   * 接口请求的唯一标识符。
   */
  'X-Tt-Logid': string
}

export const TiktokGetApiPath = {
  [TiktokGetApiType.GetSelfVideoComment]: ['v1.3/business/comment/list/'],
  [TiktokGetApiType.GetCommentReply]: ['v1.3/business/comment/reply/list/'],
}

export type TiktokGetApiQuery = {
  [TiktokGetApiType.GetSelfVideoComment]: {
    business_id: string
    video_id: string
    comment_ids?: string[]
    include_replies?: boolean
    status?: TiktokCommentVisibleStatus.All | TiktokCommentVisibleStatus.Public
    sort_field?: TiktokCommentSortFields
    sort_order?: TiktokSortOrder
    cursor?: number
    /**
     * default: 20, min: 1, max: 30 注意: 受信任与安全政策影响，接口可能会返回少于 max_count 的评论数，即使返回参数has_more 为 true。
     */
    max_count?: number
  }
}

export interface TiktokResponseBase {
  /**
   * 接口请求的唯一标识符。注意: 请记录此字段，用于所有接口请求。此字段对于问题报告和故障排查十分重要。
   */
  request_id: string
  /**
   * 返回码。完整返回码列表及描述，可查看 https://business-api.tiktok.com/portal/docs?id=1737172488964097
   */
  code: number
  /**
   * 返回信息。
   */
  message: string
}

export type TiktokResponseData<T> = T & TiktokResponseBase
export type TiktokResponseDataMap = {
  [TiktokGetApiType.GetSelfVideoComment]: {}
}

export interface TiktokComment {
  /**
   * 评论或评论回复的唯一标识符。示例： 6990565363377392901
   */
  comment_id: string
  /**
   * 评论或评论回复对应的自有视频的唯一标识符。示例： 6990565363377392901
   */
  video_id: string
  /**
   * @deprecated, use unique_identifier
   * 发表评论或评论回复的用户在开发者应用和 TikTok 账户范围内的唯一标识符。本字段将在下个 API 版本中废弃。推荐您使用 unique_identifier 识别 TikTok 用户，因为该用户标识符在多个 API 之间保持一致。
   */
  user_id: string
  /**
   * 发表评论或评论回复的用户的全球统一标识符。该标识符在多个 API 之间保持一致，方便集成和参数的互相参照。示例：+ABc1D2/E0fGhijklMNOrD34vDW/zDiZUNRH5Jyahue6OcA7b8ZpwnqXV9u1Uh+k
   */
  unique_identifier: string
  /**
   * 评论或评论回复发表的日期和时间，采用 Unix/Epoch 格式。示例：1627617835
   */
  create_time: string
  /**
   * 评论或评论回复的文本内容。示例："This is a comment #comment 🙂"
   */
  text: string
  likes: number
  replies: number
  /**
   * 评论或评论回复是否由发布对应视频的用户本人创建。
   */
  owner: boolean
  /**
   * 发布对应视频的用户是否点赞了此评论或评论回复。
   */
  liked: boolean
  /**
   * 发布对应视频的用户是否置顶了此评论或评论回复。
   */
  pinned: boolean
  /**
   * 该评论回复的可见状态。
   */
  status: TiktokCommentVisibleStatus.Public | TiktokCommentVisibleStatus.Hidden
  /**
   * 发布此评论或评论回复的TikTok账户的唯一用户名。
   */
  username: string
}

export interface AccessTokenResponse extends TiktokResponseBase {
  data: {
    access_token: string
    token_type: string
    scope: string
    /**
     * in seconds
     */
    expires_in: number
    /**
     * 用于刷新访问令牌的刷新令牌。注意：请保留此字段，用于刷新access_token。
     */
    refresh_token: string
    refresh_token_expires_in: number
    open_id: string
  }
}
