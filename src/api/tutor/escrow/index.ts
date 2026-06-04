import request from '@/config/axios'

export interface TutorEscrowTradeVO {
  id?: number
  appointmentId?: number
  parentUserId?: number
  teacherUserId?: number
  amount?: number
  status?: number
  refundReason?: string
  adminRemark?: string
}

export const getEscrowTradePage = async (params: any) => {
  return await request.get({ url: '/tutor/escrow-trade/page', params })
}

export const handleEscrowTrade = async (id: number, data: any) => {
  return await request.put({ url: `/tutor/escrow-trade/${id}/handle`, data })
}
