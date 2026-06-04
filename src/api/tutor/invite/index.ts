import request from '@/config/axios'

export interface TutorInviteRecordVO {
  id: number
  inviterUserId: number
  inviterNickname?: string
  inviteeUserId: number
  inviteeNickname?: string
  inviteCode?: string
  source?: string
  rewardPoint?: number
  rewardStatus: number
  registerIp?: string
  deviceId?: string
  createTime?: Date
}

export const getTutorInviteRecordPage = async (params) => {
  return await request.get<PageResult<TutorInviteRecordVO[]>>({
    url: `/tutor/invite-records/page`,
    params
  })
}
