import request from '@/config/axios'

export interface TutorRecommendConfigVO {
  scene: string
  cityCode?: string
  abGroup: string
  distanceWeight: number
  ratingWeight: number
  activeWeight: number
  topWeight: number
}

export const getRecommendConfig = async (params: Partial<TutorRecommendConfigVO>) => {
  return await request.get<TutorRecommendConfigVO>({ url: '/tutor/recommend-config/get', params })
}

export const saveRecommendConfig = async (data: TutorRecommendConfigVO) => {
  return await request.put({ url: '/tutor/recommend-config/save', data })
}
