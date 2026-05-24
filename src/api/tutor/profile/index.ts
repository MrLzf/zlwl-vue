import request from '@/config/axios'

export interface TutorProfilePageReqVO extends PageParam {
  userId?: number | string
  role?: number
  cityCode?: string
  certificationStatus?: number
  mobile?: string
  nickname?: string
  createTime?: string[]
}

export interface TutorUserProfileVO {
  id: number
  userId: number
  nickname?: string
  mobile?: string
  point?: number
  role: number
  cityCode?: string
  cityName?: string
  longitude?: number
  latitude?: number
  locationAddress?: string
  locationTime?: Date
  status?: number
  certificationStatus?: number
  createTime?: Date
}

export const getTutorProfilePage = async (params: TutorProfilePageReqVO) => {
  return await request.get<PageResult<TutorUserProfileVO[]>>({ url: `/tutor/profiles/page`, params })
}
