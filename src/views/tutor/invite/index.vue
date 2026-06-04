<template>
  <ContentWrap>
    <el-form ref="queryFormRef" class="-mb-15px" :model="queryParams" :inline="true" label-width="82px">
      <el-form-item label="邀请人" prop="inviterUserId">
        <el-input v-model="queryParams.inviterUserId" placeholder="邀请人用户编号" clearable class="!w-160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="被邀请人" prop="inviteeUserId">
        <el-input v-model="queryParams.inviteeUserId" placeholder="被邀请人用户编号" clearable class="!w-170px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="邀请码" prop="inviteCode">
        <el-input v-model="queryParams.inviteCode" placeholder="请输入邀请码" clearable class="!w-150px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="奖励状态" prop="rewardStatus">
        <el-select v-model="queryParams.rewardStatus" placeholder="全部" clearable class="!w-140px">
          <el-option label="待奖励" :value="0" />
          <el-option label="已奖励" :value="10" />
          <el-option label="已拦截" :value="20" />
        </el-select>
      </el-form-item>
      <el-form-item label="邀请时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-240px" />
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
      <el-table-column label="邀请人" align="center" min-width="150">
        <template #default="{ row }">{{ row.inviterNickname || '-' }}（{{ row.inviterUserId }}）</template>
      </el-table-column>
      <el-table-column label="被邀请人" align="center" min-width="160">
        <template #default="{ row }">{{ row.inviteeNickname || '-' }}（{{ row.inviteeUserId }}）</template>
      </el-table-column>
      <el-table-column label="邀请码" align="center" prop="inviteCode" width="110" />
      <el-table-column label="来源" align="center" prop="source" width="120" />
      <el-table-column label="奖励积分" align="center" prop="rewardPoint" width="100" />
      <el-table-column label="奖励状态" align="center" prop="rewardStatus" width="100">
        <template #default="{ row }"><el-tag :type="getRewardStatusTag(row.rewardStatus)">{{ getRewardStatusLabel(row.rewardStatus) }}</el-tag></template>
      </el-table-column>
      <el-table-column label="注册 IP" align="center" prop="registerIp" min-width="130" />
      <el-table-column label="设备标识" align="center" prop="deviceId" min-width="150" />
      <el-table-column label="邀请时间" align="center" prop="createTime" :formatter="dateFormatter" width="180" />
    </el-table>
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts" name="TutorInvite">
import { dateFormatter } from '@/utils/formatTime'
import * as InviteApi from '@/api/tutor/invite'

const loading = ref(true)
const total = ref(0)
const list = ref<InviteApi.TutorInviteRecordVO[]>([])
const queryFormRef = ref()
const queryParams = reactive({ pageNo: 1, pageSize: 10, inviterUserId: undefined, inviteeUserId: undefined, inviteCode: undefined, rewardStatus: undefined, createTime: [] })

const getList = async () => {
  loading.value = true
  try {
    const data = await InviteApi.getTutorInviteRecordPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const handleQuery = () => { queryParams.pageNo = 1; getList() }
const resetQuery = () => { queryFormRef.value.resetFields(); handleQuery() }
const getRewardStatusLabel = (status: number) => status === 10 ? '已奖励' : status === 20 ? '已拦截' : '待奖励'
const getRewardStatusTag = (status: number) => status === 10 ? 'success' : status === 20 ? 'danger' : 'warning'

onMounted(() => getList())
</script>
