import request from '@/config/axios'

export interface TutorPointPackageVO {
  id: number
  name: string
  point: number
  bonusPoint?: number
  payPrice: number
  status: number
  sort?: number
  createTime?: Date
}

export interface TutorPointRechargeOrderVO {
  id: number
  orderNo: string
  userId: number
  packageId?: number
  packageName?: string
  point: number
  bonusPoint?: number
  payPrice: number
  payStatus: number
  arrivalStatus: number
  payChannelCode?: string
  payTime?: Date
  createTime?: Date
}

export const getTutorPointPackagePage = async (params) => {
  return await request.get<PageResult<TutorPointPackageVO[]>>({
    url: `/tutor/point-packages/page`,
    params
  })
}

export const getTutorPointPackage = async (id: number) => {
  return await request.get<TutorPointPackageVO>({ url: `/tutor/point-packages/get`, params: { id } })
}

export const createTutorPointPackage = async (data: TutorPointPackageVO) => {
  return await request.post<boolean>({ url: `/tutor/point-packages/create`, data })
}

export const updateTutorPointPackage = async (data: TutorPointPackageVO) => {
  return await request.put<boolean>({ url: `/tutor/point-packages/update`, data })
}

export const deleteTutorPointPackage = async (id: number) => {
  return await request.delete<boolean>({ url: `/tutor/point-packages/delete`, params: { id } })
}

export const getTutorPointRechargeOrderPage = async (params) => {
  return await request.get<PageResult<TutorPointRechargeOrderVO[]>>({
    url: `/tutor/point-recharge-orders/page`,
    params
  })
}
