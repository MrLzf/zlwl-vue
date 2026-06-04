import request from '@/config/axios'

export interface TutorAppointmentVO {
  id?: number
  parentUserId?: number
  teacherUserId?: number
  resumeId?: number
  startTime?: string
  endTime?: string
  status?: number
  remark?: string
}

export const getAppointmentPage = async (params: any) => {
  return await request.get({ url: '/tutor/trial-appointment/page', params })
}
