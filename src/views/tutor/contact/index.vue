<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      class="-mb-15px"
      :model="queryParams"
      :inline="true"
      label-width="82px"
    >
      <el-form-item label="查看人" prop="viewerUserId">
        <el-input
          v-model="queryParams.viewerUserId"
          placeholder="查看人用户编号"
          clearable
          class="!w-180px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目标类型" prop="targetType">
        <el-select v-model="queryParams.targetType" placeholder="全部" clearable class="!w-150px">
          <el-option label="需求" value="demand" />
          <el-option label="简历" value="resume" />
        </el-select>
      </el-form-item>
      <el-form-item label="目标编号" prop="targetId">
        <el-input
          v-model="queryParams.targetId"
          placeholder="目标编号"
          clearable
          class="!w-160px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="被查看人" prop="targetUserId">
        <el-input
          v-model="queryParams.targetUserId"
          placeholder="被查看人用户编号"
          clearable
          class="!w-180px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="查看时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
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
      <el-table-column label="查看人" align="center" min-width="180">
        <template #default="{ row }">
          {{ row.viewerNickname || '-' }} / {{ row.viewerMobile || '-' }}
          <div class="text-gray-400">ID: {{ row.viewerUserId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="目标" align="center" min-width="150">
        <template #default="{ row }">
          <el-tag>{{ formatTargetType(row.targetType) }}</el-tag>
          <span class="ml-6px">#{{ row.targetId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被查看人" align="center" min-width="180">
        <template #default="{ row }">
          {{ row.targetNickname || '-' }} / {{ row.targetMobile || '-' }}
          <div class="text-gray-400">ID: {{ row.targetUserId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="扣分" align="center" prop="pointCost" width="90">
        <template #default="{ row }">
          <el-tag :type="row.pointCost > 0 ? 'warning' : 'success'">{{ row.pointCost }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="复看状态" align="center" min-width="160">
        <template #default="{ row }">
          <el-tag :type="isReusable(row.freeReuseUntil) ? 'success' : 'info'">
            {{ isReusable(row.freeReuseUntil) ? '复看免费中' : '已过期' }}
          </el-tag>
          <div class="text-gray-400">
            {{ row.freeReuseUntil ? formatDate(row.freeReuseUntil) : '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="查看内容" align="center" width="130">
        <template #default="{ row }">
          <el-tag v-if="row.viewedMobile" class="mr-4px">手机</el-tag>
          <el-tag v-if="row.viewedWechat" type="success">微信</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="查看时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180"
      />
    </el-table>
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script setup lang="ts" name="TutorContact">
import { dateFormatter, formatDate } from '@/utils/formatTime'
import * as ContactApi from '@/api/tutor/contact'

const loading = ref(true)
const total = ref(0)
const list = ref<ContactApi.TutorContactVO[]>([])
const queryFormRef = ref()
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  viewerUserId: undefined,
  targetType: undefined,
  targetId: undefined,
  targetUserId: undefined,
  createTime: []
})

const getList = async () => {
  loading.value = true
  try {
    const data = await ContactApi.getTutorContactPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const formatTargetType = (targetType: string) => {
  return targetType === 'resume' ? '教师简历' : '家长需求'
}

const isReusable = (time?: Date) => {
  return !!time && new Date(time).getTime() > Date.now()
}

onMounted(() => {
  getList()
})
</script>
