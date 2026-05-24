import request from '@/config/axios'

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

export const getTutorReviewPage = async (params: any) => {
  return await request.get({ url: `/tutor/reviews/page`, params })
}

export const updateTutorReviewStatus = async (id: number, status: number) => {
  return await request.put({ url: `/tutor/reviews/status`, data: { id, status } })
}
