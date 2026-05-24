import request from '@/config/axios'

export interface TutorDemandPageReqVO extends PageParam {
  userId?: number | string
  title?: string
  cityCode?: string
  subject?: string
  grade?: string
  teachMode?: number
  status?: number
  auditStatus?: number
}

export interface TutorDemandVO {
  id: number
  userId: number
  title: string
  grade: string
  subjects: string
  teachMode: number
  teachModeName?: string
  budgetMin?: number
  budgetMax?: number
  description?: string
  cityCode: string
  cityName: string
  longitude?: number
  latitude?: number
  distanceVisible?: boolean
  contactMobileMask?: string
  contactWechatMask?: string
  status: number
  statusName?: string
  auditStatus: number
  auditStatusName?: string
  rejectReason?: string
  viewCount?: number
  contactViewCount?: number
  matchCount?: number
  expireTime?: Date
  createTime?: Date
}

export interface TutorPublishAuditReqVO {
  id: number
  auditStatus: number
  rejectReason?: string
}

export const getTutorDemandPage = async (params: TutorDemandPageReqVO) => {
  return await request.get<PageResult<TutorDemandVO[]>>({ url: `/tutor/demand/page`, params })
}

export const auditTutorDemand = async (data: TutorPublishAuditReqVO) => {
  return await request.put({ url: `/tutor/demand/audit`, data })
}

export const offlineTutorDemand = async (id: number) => {
  return await request.put({ url: `/tutor/demand/offline`, params: { id } })
}
