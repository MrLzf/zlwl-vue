import request from '@/config/axios'

export interface TutorCityVO {
  id: number
  name: string
  code: string
  pinyin: string
  province: string
  opened: boolean
  hot: boolean
  serviceConfig?: string
  auditSlaHours?: number
  defaultRadiusKm?: number
  contactPointCost?: number
  sort: number
  status: number
  createTime?: Date
}

// 查询家教城市列表
export const getTutorCityList = async () => {
  return await request.get<TutorCityVO[]>({ url: `/tutor/city/list` })
}

// 更新家教城市运营状态
export const updateTutorCity = async (
  data: Pick<TutorCityVO, 'id' | 'opened' | 'hot' | 'sort' | 'status'>
) => {
  return await request.put<boolean>({ url: `/tutor/city/update`, data })
}

export const updateTutorCityRules = async (
  data: Pick<TutorCityVO, 'id' | 'auditSlaHours' | 'defaultRadiusKm' | 'contactPointCost'>
) => {
  return await request.put<boolean>({ url: `/tutor/city/rules`, data })
}
