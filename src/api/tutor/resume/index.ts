import request from '@/config/axios'
import { TutorPublishAuditReqVO } from '@/api/tutor/demand'

export interface TutorTeacherResumeVO {
  id: number
  userId: number
  title: string
  subjects: string
  teachModes: string
  hourlyPrice?: number
  freeTrialEnabled?: boolean
  freeTrialMinutes?: number
  teachingExperience?: string
  availableTimes?: string
  cityCode: string
  cityName: string
  longitude?: number
  latitude?: number
  serviceRadiusKm?: number
  contactMobileMask?: string
  contactWechatMask?: string
  status: number
  statusName?: string
  auditStatus: number
  auditStatusName?: string
  rejectReason?: string
  ratingAvg?: number
  reviewCount?: number
  viewCount?: number
  contactViewCount?: number
  matchCount?: number
  createTime?: Date
}

export const getTutorResumePage = async (params: any) => {
  return await request.get({ url: `/tutor/resume/page`, params })
}

export const auditTutorResume = async (data: TutorPublishAuditReqVO) => {
  return await request.put({ url: `/tutor/resume/audit`, data })
}

export const offlineTutorResume = async (id: number) => {
  return await request.put({ url: `/tutor/resume/offline`, params: { id } })
}
