<template>
  <ContentWrap>
    <el-form ref="queryFormRef" class="-mb-15px" :model="queryParams" :inline="true" label-width="82px">
      <el-form-item label="用户编号" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入用户编号" clearable class="!w-150px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="queryParams.mobile" placeholder="请输入手机号" clearable class="!w-170px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-140px">
          <el-option label="生效中" :value="10" />
          <el-option label="已过期" :value="20" />
          <el-option label="已关闭" :value="30" />
        </el-select>
      </el-form-item>
      <el-form-item label="到期时间" prop="expireTime">
        <el-date-picker v-model="queryParams.expireTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-240px" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" width="90" />
      <el-table-column label="用户编号" align="center" prop="userId" width="100" />
      <el-table-column label="昵称" align="center" prop="nickname" min-width="120" />
      <el-table-column label="手机号" align="center" prop="mobile" min-width="130" />
      <el-table-column label="会员等级" align="center" prop="levelName" min-width="120" />
      <el-table-column label="联系方式折扣" align="center" prop="contactDiscount" width="120">
        <template #default="{ row }">{{ row.contactDiscount ? `${row.contactDiscount} 折` : '-' }}</template>
      </el-table-column>
      <el-table-column label="每月赠送" align="center" prop="monthlyGiftPoint" width="110">
        <template #default="{ row }">{{ row.monthlyGiftPoint || 0 }} 积分</template>
      </el-table-column>
      <el-table-column label="赠送状态" align="center" prop="giftPointStatus" width="100">
        <template #default="{ row }"><el-tag :type="row.giftPointStatus === 10 ? 'success' : 'info'">{{ row.giftPointStatus === 10 ? '已赠送' : '待赠送' }}</el-tag></template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template #default="{ row }"><el-tag :type="getStatusTag(row.status)">{{ getStatusLabel(row.status) }}</el-tag></template>
      </el-table-column>
      <el-table-column label="生效时间" align="center" prop="startTime" :formatter="dateFormatter" width="180" />
      <el-table-column label="到期时间" align="center" prop="expireTime" :formatter="dateFormatter" width="180" />
      <el-table-column label="操作" align="center" fixed="right" width="100">
        <template #default="{ row }">
          <el-button v-if="row.status === 10" v-hasPermi="['tutor:vip:close']" link type="danger" @click="handleClose(row)">关闭</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts" name="TutorVip">
import { dateFormatter } from '@/utils/formatTime'
import * as VipApi from '@/api/tutor/vip'

const message = useMessage()
const loading = ref(true)
const total = ref(0)
const list = ref<VipApi.TutorVipRecordVO[]>([])
const queryFormRef = ref()
const queryParams = reactive({ pageNo: 1, pageSize: 10, userId: undefined, mobile: undefined, status: undefined, expireTime: [] })

const getList = async () => {
  loading.value = true
  try {
    const data = await VipApi.getTutorVipRecordPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const handleQuery = () => { queryParams.pageNo = 1; getList() }
const resetQuery = () => { queryFormRef.value.resetFields(); handleQuery() }
const handleClose = async (row: VipApi.TutorVipRecordVO) => {
  await message.confirm(`确认关闭用户 ${row.userId} 的 VIP 权益吗？`)
  await VipApi.closeTutorVipRecord(row.id)
  message.success('关闭成功')
  await getList()
}
const getStatusLabel = (status: number) => status === 10 ? '生效中' : status === 20 ? '已过期' : '已关闭'
const getStatusTag = (status: number) => status === 10 ? 'success' : status === 20 ? 'info' : 'danger'

onMounted(() => getList())
</script>
