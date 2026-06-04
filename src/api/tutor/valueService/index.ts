import request from '@/config/axios'

export interface TutorValueServiceConfigVO {
  id: number
  serviceType: number
  name: string
  pointPrice: number
  durationHours: number
  targetType: number
  status: number
  sort?: number
  description?: string
  createTime?: Date
}

export const getTutorValueServiceConfigPage = async (params) => {
  return await request.get<PageResult<TutorValueServiceConfigVO[]>>({
    url: `/tutor/value-service-configs/page`,
    params
  })
}

export const getTutorValueServiceConfig = async (id: number) => {
  return await request.get<TutorValueServiceConfigVO>({
    url: `/tutor/value-service-configs/get`,
    params: { id }
  })
}

export const createTutorValueServiceConfig = async (data: TutorValueServiceConfigVO) => {
  return await request.post<boolean>({ url: `/tutor/value-service-configs/create`, data })
}

export const updateTutorValueServiceConfig = async (data: TutorValueServiceConfigVO) => {
  return await request.put<boolean>({ url: `/tutor/value-service-configs/update`, data })
}

export const deleteTutorValueServiceConfig = async (id: number) => {
  return await request.delete<boolean>({
    url: `/tutor/value-service-configs/delete`,
    params: { id }
  })
}
