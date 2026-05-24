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
