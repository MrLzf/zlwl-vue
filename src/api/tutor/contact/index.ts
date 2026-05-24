import request from '@/config/axios'

export interface TutorContactPageReqVO extends PageParam {
  viewerUserId?: number | string
  targetType?: string
  targetId?: number | string
  targetUserId?: number | string
  createTime?: string[]
}

export interface TutorContactVO {
  id: number
  viewerUserId: number
  viewerNickname?: string
  viewerMobile?: string
  targetType: string
  targetId: number
  targetUserId: number
  targetNickname?: string
  targetMobile?: string
  pointCost: number
  freeReuseUntil?: Date
  viewedMobile?: boolean
  viewedWechat?: boolean
  createTime?: Date
}

export const getTutorContactPage = async (params: TutorContactPageReqVO) => {
  return await request.get<PageResult<TutorContactVO[]>>({ url: `/tutor/contacts/page`, params })
}
