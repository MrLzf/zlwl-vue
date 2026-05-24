<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      class="-mb-15px"
      :model="queryParams"
      :inline="true"
      label-width="82px"
    >
      <el-form-item label="匹配编号" prop="matchId">
        <el-input
          v-model="queryParams.matchId"
          placeholder="匹配编号"
          clearable
          class="!w-150px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评价人" prop="reviewerUserId">
        <el-input
          v-model="queryParams.reviewerUserId"
          placeholder="评价人用户编号"
          clearable
          class="!w-170px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="被评价人" prop="targetUserId">
        <el-input
          v-model="queryParams.targetUserId"
          placeholder="被评价人用户编号"
          clearable
          class="!w-170px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="星级" prop="rating">
        <el-select v-model="queryParams.rating" placeholder="全部" clearable class="!w-120px">
          <el-option v-for="rating in [5, 4, 3, 2, 1]" :key="rating" :label="`${rating} 星`" :value="rating" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-120px">
          <el-option label="正常" :value="0" />
          <el-option label="隐藏" :value="1" />
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
      <el-table-column label="匹配编号" align="center" prop="matchId" width="110" />
      <el-table-column label="评价人" align="center" prop="reviewerUserId" width="110" />
      <el-table-column label="被评价人" align="center" prop="targetUserId" width="110" />
      <el-table-column label="星级" align="center" prop="rating" width="120">
        <template #default="{ row }">
          <el-rate v-model="row.rating" disabled />
        </template>
      </el-table-column>
      <el-table-column label="标签" align="center" prop="tags" min-width="140" />
      <el-table-column label="内容" align="center" prop="content" min-width="220" />
      <el-table-column label="匿名展示" align="center" width="100">
        <template #default="{ row }">
          <el-tag :type="row.anonymousDisplay ? 'warning' : 'info'">
            {{ row.anonymousDisplay ? '匿名' : '实名' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 0 ? 'success' : 'info'">
            {{ row.status === 0 ? '正常' : '隐藏' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180"
      />
      <el-table-column label="操作" align="center" fixed="right" width="110">
        <template #default="{ row }">
          <el-button
            v-hasPermi="['tutor:review:update-status']"
            link
            :type="row.status === 0 ? 'danger' : 'primary'"
            @click="handleStatus(row)"
          >
            {{ row.status === 0 ? '隐藏' : '恢复' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script setup lang="ts" name="TutorReview">
import { dateFormatter } from '@/utils/formatTime'
import * as ReviewApi from '@/api/tutor/review'

const message = useMessage()
const loading = ref(true)
const total = ref(0)
const list = ref<ReviewApi.TutorReviewVO[]>([])
const queryFormRef = ref()
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  matchId: undefined,
  reviewerUserId: undefined,
  targetUserId: undefined,
  rating: undefined,
  status: undefined,
  createTime: []
})

const getList = async () => {
  loading.value = true
  try {
    const data = await ReviewApi.getTutorReviewPage(queryParams)
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

const handleStatus = async (row: ReviewApi.TutorReviewVO) => {
  const nextStatus = row.status === 0 ? 1 : 0
  await message.confirm(`确认${nextStatus === 1 ? '隐藏' : '恢复'}该评价吗？`)
  await ReviewApi.updateTutorReviewStatus(row.id, nextStatus)
  message.success('操作成功')
  await getList()
}

onMounted(() => {
  getList()
})
</script>
