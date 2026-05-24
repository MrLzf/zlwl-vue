import request from '@/config/axios'

export interface TutorCertificationVO {
  id: number
  userId: number
  teacherProfileId: number
  realName: string
  idCardNoMask: string
  educationFileUrl?: string
  teacherCertFileUrl?: string
  status: number
  statusName?: string
  rejectReason?: string
  auditorId?: number
  auditTime?: Date
  createTime?: Date
}

export interface TutorCertificationAuditReqVO {
  id: number
  status: number
  rejectReason?: string
}

export const getTutorCertificationPage = async (params: any) => {
  return await request.get({ url: `/tutor/certification/page`, params })
}

export const auditTutorCertification = async (data: TutorCertificationAuditReqVO) => {
  return await request.put({ url: `/tutor/certification/audit`, data })
}
