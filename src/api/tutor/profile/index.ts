import request from '@/config/axios'

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

export const getTutorProfilePage = async (params: any) => {
  return await request.get({ url: `/tutor/profiles/page`, params })
}
