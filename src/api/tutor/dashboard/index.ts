import request from '@/config/axios'

export interface TutorDashboardSummaryVO {
  userCount: number
  parentCount: number
  teacherCount: number
  demandCount: number
  resumeCount: number
  showingDemandCount: number
  showingResumeCount: number
  certificationPendingCount: number
  demandPendingCount: number
  resumePendingCount: number
  contactViewCount: number
  matchSuccessCount: number
  reviewCount: number
}

export const getTutorDashboardSummary = async () => {
  return await request.get<TutorDashboardSummaryVO>({ url: `/tutor/dashboard/summary` })
}

export const getTrend = async (days: number) => {
  return await request.get<any[]>({ url: `/tutor/dashboard/trend`, params: { days } })
}

export const getFunnel = async () => {
  return await request.get<any[]>({ url: `/tutor/dashboard/funnel` })
}
