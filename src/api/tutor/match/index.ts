import request from '@/config/axios'

export interface TutorMatchVO {
  id: number
  demandId: number
  resumeId: number
  parentUserId: number
  teacherUserId: number
  source?: string
  status: number
  statusName?: string
  parentConfirmTime?: Date
  teacherConfirmTime?: Date
  matchedTime?: Date
  createTime?: Date
}

export const getTutorMatchPage = async (params: any) => {
  return await request.get({ url: `/tutor/matches/page`, params })
}
