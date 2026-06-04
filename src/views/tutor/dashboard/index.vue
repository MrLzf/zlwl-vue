<template>
  <ContentWrap>
    <el-row :gutter="16">
      <el-col v-for="item in cards" :key="item.label" :xs="24" :sm="12" :lg="6">
        <el-card shadow="never" class="mb-16px">
          <div class="text-14px text-gray-500">{{ item.label }}</div>
          <div class="mt-12px text-24px font-bold">{{ loading ? '-' : item.value }}</div>
          <div class="mt-8px text-12px text-gray-400">{{ item.remark }}</div>
        </el-card>
      </el-col>
    </el-row>
  </ContentWrap>

  <ContentWrap>
    <el-descriptions title="审核待办" :column="3" border>
      <el-descriptions-item label="认证审核">
        {{ summary.certificationPendingCount }}
      </el-descriptions-item>
      <el-descriptions-item label="需求审核">{{ summary.demandPendingCount }}</el-descriptions-item>
      <el-descriptions-item label="简历审核">{{ summary.resumePendingCount }}</el-descriptions-item>
    </el-descriptions>
  </ContentWrap>

  <el-row :gutter="16">
    <el-col :xs="24" :lg="14">
      <ContentWrap>
        <div class="mb-12px flex items-center justify-between">
          <span class="font-bold">运营趋势</span>
          <el-radio-group v-model="trendDays" size="small" @change="getCharts">
            <el-radio-button :label="7">7 天</el-radio-button>
            <el-radio-button :label="30">30 天</el-radio-button>
          </el-radio-group>
        </div>
        <Echart :height="320" :options="trendOptions" />
      </ContentWrap>
    </el-col>
    <el-col :xs="24" :lg="10">
      <ContentWrap>
        <div class="mb-12px font-bold">转化漏斗</div>
        <Echart :height="320" :options="funnelOptions" />
      </ContentWrap>
    </el-col>
  </el-row>
</template>

<script setup lang="ts" name="TutorDashboard">
import { EChartsOption } from 'echarts'
import * as DashboardApi from '@/api/tutor/dashboard'

const loading = ref(true)
const trendDays = ref(7)
const summary = ref<DashboardApi.TutorDashboardSummaryVO>({
  userCount: 0,
  parentCount: 0,
  teacherCount: 0,
  demandCount: 0,
  resumeCount: 0,
  showingDemandCount: 0,
  showingResumeCount: 0,
  certificationPendingCount: 0,
  demandPendingCount: 0,
  resumePendingCount: 0,
  contactViewCount: 0,
  matchSuccessCount: 0,
  reviewCount: 0
})

const cards = computed(() => [
  {
    label: '用户档案',
    value: summary.value.userCount,
    remark: `家长 ${summary.value.parentCount} / 教师 ${summary.value.teacherCount}`
  },
  {
    label: '发布内容',
    value: summary.value.demandCount + summary.value.resumeCount,
    remark: `需求 ${summary.value.demandCount} / 简历 ${summary.value.resumeCount}`
  },
  {
    label: '审核待办',
    value:
      summary.value.certificationPendingCount +
      summary.value.demandPendingCount +
      summary.value.resumePendingCount,
    remark: '认证、需求、简历待审核'
  },
  {
    label: '联系查看',
    value: summary.value.contactViewCount,
    remark: `匹配成功 ${summary.value.matchSuccessCount} / 评价 ${summary.value.reviewCount}`
  },
  {
    label: '展示中需求',
    value: summary.value.showingDemandCount,
    remark: '审核通过并展示中的家长需求'
  },
  {
    label: '展示中简历',
    value: summary.value.showingResumeCount,
    remark: '审核通过并展示中的教师简历'
  },
  {
    label: '匹配成功',
    value: summary.value.matchSuccessCount,
    remark: '双方确认的匹配记录'
  },
  {
    label: '评价数量',
    value: summary.value.reviewCount,
    remark: '当前可见评价'
  }
])

const trendOptions = reactive<EChartsOption>({
  tooltip: { trigger: 'axis' },
  legend: { data: ['用户', '发布', '联系', '匹配'] },
  grid: { left: 24, right: 16, bottom: 24, containLabel: true },
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value' },
  series: [
    { name: '用户', type: 'line', smooth: true, data: [] },
    { name: '发布', type: 'line', smooth: true, data: [] },
    { name: '联系', type: 'line', smooth: true, data: [] },
    { name: '匹配', type: 'line', smooth: true, data: [] }
  ]
})

const funnelOptions = reactive<EChartsOption>({
  tooltip: { trigger: 'item' },
  series: [
    {
      name: '转化漏斗',
      type: 'funnel',
      left: '8%',
      top: 24,
      bottom: 24,
      width: '84%',
      data: []
    }
  ]
})

const getSummary = async () => {
  loading.value = true
  try {
    summary.value = await DashboardApi.getTutorDashboardSummary()
  } finally {
    loading.value = false
  }
}

const getCharts = async () => {
  const [trend, funnel] = await Promise.all([
    DashboardApi.getTrend(trendDays.value),
    DashboardApi.getFunnel()
  ])
  ;(trendOptions.xAxis as any).data = trend.map((item) => item.date)
  ;(trendOptions.series as any)[0].data = trend.map((item) => item.users)
  ;(trendOptions.series as any)[1].data = trend.map((item) => item.publishes)
  ;(trendOptions.series as any)[2].data = trend.map((item) => item.contacts)
  ;(trendOptions.series as any)[3].data = trend.map((item) => item.matches)
  ;(funnelOptions.series as any)[0].data = funnel
}

onMounted(() => {
  getSummary()
  getCharts()
})
</script>
