import request from '@/config/axios'

export interface TutorReviewPageReqVO extends PageParam {
  matchId?: number | string
  reviewerUserId?: number | string
  targetUserId?: number | string
  rating?: number
  status?: number
  createTime?: string[]
}

export interface TutorReviewVO {
  id: number
  matchId: number
  reviewerUserId: number
  targetUserId: number
  rating: number
  tags?: string
  content?: string
  anonymousDisplay?: boolean
  status: number
  createTime?: Date
}

export const getTutorReviewPage = async (params: TutorReviewPageReqVO) => {
  return await request.get<PageResult<TutorReviewVO[]>>({ url: `/tutor/reviews/page`, params })
}

export const updateTutorReviewStatus = async (id: number, status: number) => {
  return await request.put({ url: `/tutor/reviews/status`, data: { id, status } })
}
