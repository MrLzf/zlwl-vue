import request from '@/config/axios'

export interface TutorMatchPageReqVO extends PageParam {
  demandId?: number | string
  resumeId?: number | string
  parentUserId?: number | string
  teacherUserId?: number | string
  status?: number
  createTime?: string[]
}

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

export const getTutorMatchPage = async (params: TutorMatchPageReqVO) => {
  return await request.get<PageResult<TutorMatchVO[]>>({ url: `/tutor/matches/page`, params })
}
