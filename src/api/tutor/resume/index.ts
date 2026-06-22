import request from '@/config/axios'
import { TutorPublishAuditReqVO } from '@/api/tutor/demand'

export interface TutorResumePageReqVO extends PageParam {
  userId?: number | string
  title?: string
  cityCode?: string
  subject?: string
  teachMode?: number
  freeTrialEnabled?: boolean
  status?: number
  auditStatus?: number
}

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

export interface TutorTeacherEntryReqVO {
  mobile: string
  title: string
  cityCode: string
  subjects: string
  teachModes: string
  hourlyPrice: number
  educationLevel: string
  schoolName?: string
  major?: string
  hasTeacherCertificate?: boolean
  serviceRadiusKm: number
  freeTrialEnabled?: boolean
  freeTrialMinutes?: number
  teachingYears?: number
  intro: string
  longitude?: number
  latitude?: number
}

export const getTutorResumePage = async (params: TutorResumePageReqVO) => {
  return await request.get<PageResult<TutorTeacherResumeVO[]>>({ url: `/tutor/resume/page`, params })
}

export const createTutorTeacherEntry = async (data: TutorTeacherEntryReqVO) => {
  return await request.post<TutorTeacherResumeVO>({ url: `/tutor/resume/create`, data })
}

export const auditTutorResume = async (data: TutorPublishAuditReqVO) => {
  return await request.put({ url: `/tutor/resume/audit`, data })
}

export const offlineTutorResume = async (id: number) => {
  return await request.put({ url: `/tutor/resume/offline`, params: { id } })
}
