import request from '@/config/axios'

export interface TutorPointAdjustReqVO {
  userId: number
  point: number
  remark: string
}

export const adjustTutorPoint = async (data: TutorPointAdjustReqVO) => {
  return await request.put<boolean>({ url: `/tutor/points/adjust`, data })
}
