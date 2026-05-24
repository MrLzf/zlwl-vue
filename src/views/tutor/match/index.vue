<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      class="-mb-15px"
      :model="queryParams"
      :inline="true"
      label-width="82px"
    >
      <el-form-item label="需求编号" prop="demandId">
        <el-input
          v-model="queryParams.demandId"
          placeholder="需求编号"
          clearable
          class="!w-150px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="简历编号" prop="resumeId">
        <el-input
          v-model="queryParams.resumeId"
          placeholder="简历编号"
          clearable
          class="!w-150px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="家长用户" prop="parentUserId">
        <el-input
          v-model="queryParams.parentUserId"
          placeholder="家长用户编号"
          clearable
          class="!w-160px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="教师用户" prop="teacherUserId">
        <el-input
          v-model="queryParams.teacherUserId"
          placeholder="教师用户编号"
          clearable
          class="!w-160px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-160px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TUTOR_MATCH_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
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
      <el-table-column label="关联发布" align="center" min-width="150">
        <template #default="{ row }">
          <div>需求：{{ row.demandId || '-' }}</div>
          <div>简历：{{ row.resumeId || '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="家长用户" align="center" prop="parentUserId" width="110" />
      <el-table-column label="教师用户" align="center" prop="teacherUserId" width="110" />
      <el-table-column label="来源" align="center" prop="source" width="120" />
      <el-table-column label="确认状态" align="center" prop="status" min-width="130">
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.TUTOR_MATCH_STATUS" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="确认时间" align="center" min-width="240">
        <template #default="{ row }">
          <div>家长：{{ row.parentConfirmTime ? formatDate(row.parentConfirmTime) : '-' }}</div>
          <div>教师：{{ row.teacherConfirmTime ? formatDate(row.teacherConfirmTime) : '-' }}</div>
          <div>成功：{{ row.matchedTime ? formatDate(row.matchedTime) : '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
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

<script setup lang="ts" name="TutorMatch">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter, formatDate } from '@/utils/formatTime'
import * as MatchApi from '@/api/tutor/match'

const loading = ref(true)
const total = ref(0)
const list = ref<MatchApi.TutorMatchVO[]>([])
const queryFormRef = ref()
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  demandId: undefined,
  resumeId: undefined,
  parentUserId: undefined,
  teacherUserId: undefined,
  status: undefined,
  createTime: []
})

const getList = async () => {
  loading.value = true
  try {
    const data = await MatchApi.getTutorMatchPage(queryParams)
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

onMounted(() => {
  getList()
})
</script>
