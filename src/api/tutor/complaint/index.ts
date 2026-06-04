import request from '@/config/axios'

export interface TutorComplaintVO {
  id: number
  reporterUserId: number
  reporterNickname?: string
  targetUserId?: number
  targetType: number
  targetId?: number
  reasonType: number
  content?: string
  evidenceUrls?: string
  status: number
  handleResult?: number
  handleRemark?: string
  handlerId?: number
  handleTime?: Date
  createTime?: Date
}

export interface TutorComplaintHandleReqVO {
  id: number
  handleResult: number
  handleRemark: string
}

export const getTutorComplaintPage = async (params) => {
  return await request.get<PageResult<TutorComplaintVO[]>>({ url: `/tutor/complaints/page`, params })
}

export const handleTutorComplaint = async (data: TutorComplaintHandleReqVO) => {
  return await request.put<boolean>({ url: `/tutor/complaints/handle`, data })
}
