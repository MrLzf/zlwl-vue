import request from '@/config/axios'

export interface WalletRechargeVO {
  id: number
  walletId: number
  payPrice: number
  bonusPrice: number
  totalPrice: number
  packageId: number
  payStatus: boolean
  payOrderId: number
  payChannelCode: string
  payTime: string
  createTime: string
}

export const getRechargePage = async (params: any) => {
  return await request.get({ url: '/pay/wallet-recharge/page', params })
}
