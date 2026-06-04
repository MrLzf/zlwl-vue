import request from '@/config/axios'

export interface TutorVipRecordVO {
  id: number
  userId: number
  nickname?: string
  mobile?: string
  levelName?: string
  startTime?: Date
  expireTime?: Date
  status: number
  contactDiscount?: number
  monthlyGiftPoint?: number
  giftPointStatus?: number
  createTime?: Date
}

export const getTutorVipRecordPage = async (params) => {
  return await request.get<PageResult<TutorVipRecordVO[]>>({ url: `/tutor/vip-records/page`, params })
}

export const closeTutorVipRecord = async (id: number) => {
  return await request.put<boolean>({ url: `/tutor/vip-records/close`, params: { id } })
}
