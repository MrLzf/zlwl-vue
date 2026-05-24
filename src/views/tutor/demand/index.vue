<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      class="-mb-15px"
      :model="queryParams"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入需求标题"
          clearable
          class="!w-200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户编号" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户编号"
          clearable
          class="!w-160px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="城市编码" prop="cityCode">
        <el-input
          v-model="queryParams.cityCode"
          placeholder="请输入城市编码"
          clearable
          class="!w-160px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="科目" prop="subject">
        <el-select v-model="queryParams.subject" placeholder="全部" clearable class="!w-160px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.TUTOR_SUBJECT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <el-select v-model="queryParams.grade" placeholder="全部" clearable class="!w-160px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.TUTOR_GRADE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="授课模式" prop="teachMode">
        <el-select v-model="queryParams.teachMode" placeholder="全部" clearable class="!w-160px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TUTOR_TEACH_MODE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-160px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TUTOR_PUBLISH_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" placeholder="全部" clearable class="!w-160px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TUTOR_AUDIT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
      <el-table-column label="标题" align="center" prop="title" min-width="180" />
      <el-table-column label="用户编号" align="center" prop="userId" width="100" />
      <el-table-column label="城市" align="center" prop="cityName" width="110" />
      <el-table-column label="年级" align="center" prop="grade" width="100" />
      <el-table-column label="科目" align="center" prop="subjects" min-width="120">
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.TUTOR_SUBJECT" :value="row.subjects" />
        </template>
      </el-table-column>
      <el-table-column label="授课模式" align="center" prop="teachMode" width="110">
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.TUTOR_TEACH_MODE" :value="row.teachMode" />
        </template>
      </el-table-column>
      <el-table-column label="预算" align="center" min-width="120">
        <template #default="{ row }">{{ formatBudget(row) }}</template>
      </el-table-column>
      <el-table-column label="发布状态" align="center" prop="status" width="110">
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.TUTOR_PUBLISH_STATUS" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="auditStatus" width="110">
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.TUTOR_AUDIT_STATUS" :value="row.auditStatus" />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180"
      />
      <el-table-column label="操作" align="center" fixed="right" width="210">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row)">详情</el-button>
          <el-button
            v-if="row.auditStatus === AuditStatus.WAITING"
            v-hasPermi="['tutor:demand:audit']"
            link
            type="success"
            @click="handleAudit(row, AuditStatus.APPROVED)"
          >
            通过
          </el-button>
          <el-button
            v-if="row.auditStatus === AuditStatus.WAITING"
            v-hasPermi="['tutor:demand:audit']"
            link
            type="danger"
            @click="handleAudit(row, AuditStatus.REJECTED)"
          >
            拒绝
          </el-button>
          <el-button
            v-if="row.status !== PublishStatus.OFFLINE"
            v-hasPermi="['tutor:demand:offline']"
            link
            type="danger"
            @click="handleOffline(row)"
          >
            下架
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

  <el-dialog v-model="detailVisible" title="需求详情" width="760px">
    <el-descriptions v-if="currentRow" :column="2" border>
      <el-descriptions-item label="标题" :span="2">{{ currentRow.title }}</el-descriptions-item>
      <el-descriptions-item label="用户编号">{{ currentRow.userId }}</el-descriptions-item>
      <el-descriptions-item label="城市">{{ currentRow.cityName }}</el-descriptions-item>
      <el-descriptions-item label="年级">{{ currentRow.grade }}</el-descriptions-item>
      <el-descriptions-item label="科目">
        <dict-tag :type="DICT_TYPE.TUTOR_SUBJECT" :value="currentRow.subjects" />
      </el-descriptions-item>
      <el-descriptions-item label="授课模式">
        <dict-tag :type="DICT_TYPE.TUTOR_TEACH_MODE" :value="currentRow.teachMode" />
      </el-descriptions-item>
      <el-descriptions-item label="预算">{{ formatBudget(currentRow) }}</el-descriptions-item>
      <el-descriptions-item label="联系方式">
        {{ currentRow.contactMobileMask || '-' }} / {{ currentRow.contactWechatMask || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="数据">
        浏览 {{ currentRow.viewCount || 0 }}，联系 {{ currentRow.contactViewCount || 0 }}，匹配
        {{ currentRow.matchCount || 0 }}
      </el-descriptions-item>
      <el-descriptions-item label="拒绝原因" :span="2">
        {{ currentRow.rejectReason || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="描述" :span="2">
        {{ currentRow.description || '-' }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup lang="ts" name="TutorDemand">
import { ElMessageBox } from 'element-plus'
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as DemandApi from '@/api/tutor/demand'

const enum AuditStatus {
  WAITING = 10,
  APPROVED = 20,
  REJECTED = 30
}

const enum PublishStatus {
  OFFLINE = 40
}

const message = useMessage()
const loading = ref(true)
const total = ref(0)
const list = ref<DemandApi.TutorDemandVO[]>([])
const queryFormRef = ref()
const detailVisible = ref(false)
const currentRow = ref<DemandApi.TutorDemandVO>()
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: undefined,
  title: undefined,
  cityCode: undefined,
  subject: undefined,
  grade: undefined,
  teachMode: undefined,
  status: undefined,
  auditStatus: undefined
})

const getList = async () => {
  loading.value = true
  try {
    const data = await DemandApi.getTutorDemandPage(queryParams)
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

const openDetail = (row: DemandApi.TutorDemandVO) => {
  currentRow.value = row
  detailVisible.value = true
}

const handleAudit = async (row: DemandApi.TutorDemandVO, auditStatus: AuditStatus) => {
  const isReject = auditStatus === AuditStatus.REJECTED
  let rejectReason = ''
  if (isReject) {
    const { value } = await ElMessageBox.prompt('请输入拒绝原因', '拒绝需求', {
      confirmButtonText: '确认拒绝',
      cancelButtonText: '取消',
      inputPattern: /\S+/,
      inputErrorMessage: '拒绝原因不能为空'
    })
    rejectReason = value
  } else {
    await message.confirm(`确认通过「${row.title}」吗？`)
  }
  await DemandApi.auditTutorDemand({ id: row.id, auditStatus, rejectReason })
  message.success('审核成功')
  await getList()
}

const handleOffline = async (row: DemandApi.TutorDemandVO) => {
  await message.confirm(`确认下架「${row.title}」吗？`)
  await DemandApi.offlineTutorDemand(row.id)
  message.success('下架成功')
  await getList()
}

const formatBudget = (row: DemandApi.TutorDemandVO) => {
  if (row.budgetMin === undefined && row.budgetMax === undefined) return '-'
  return `${row.budgetMin || 0}-${row.budgetMax || 0} 元/小时`
}

onMounted(() => {
  getList()
})
</script>
