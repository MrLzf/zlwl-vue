import request from '@/config/axios'

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

export const getTutorContactPage = async (params: any) => {
  return await request.get({ url: `/tutor/contacts/page`, params })
}
