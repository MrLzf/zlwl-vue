<template>
  <ContentWrap>
    <el-form ref="queryFormRef" class="-mb-15px" :model="queryParams" :inline="true" label-width="82px">
      <el-form-item label="举报人" prop="reporterUserId">
        <el-input v-model="queryParams.reporterUserId" placeholder="举报人用户编号" clearable class="!w-160px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="被举报人" prop="targetUserId">
        <el-input v-model="queryParams.targetUserId" placeholder="被举报人用户编号" clearable class="!w-170px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="目标类型" prop="targetType">
        <el-select v-model="queryParams.targetType" placeholder="全部" clearable class="!w-140px">
          <el-option v-for="item in targetTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="原因" prop="reasonType">
        <el-select v-model="queryParams.reasonType" placeholder="全部" clearable class="!w-150px">
          <el-option v-for="item in reasonTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-140px">
          <el-option label="待处理" :value="0" />
          <el-option label="已处理" :value="10" />
          <el-option label="已驳回" :value="20" />
        </el-select>
      </el-form-item>
      <el-form-item label="举报时间" prop="createTime">
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
      <el-table-column label="举报人" align="center" min-width="150">
        <template #default="{ row }">{{ row.reporterNickname || '-' }}（{{ row.reporterUserId }}）</template>
      </el-table-column>
      <el-table-column label="被举报人" align="center" prop="targetUserId" width="110" />
      <el-table-column label="目标" align="center" min-width="150">
        <template #default="{ row }">{{ getTargetTypeLabel(row.targetType) }} #{{ row.targetId || '-' }}</template>
      </el-table-column>
      <el-table-column label="原因" align="center" prop="reasonType" width="120">
        <template #default="{ row }">{{ getReasonTypeLabel(row.reasonType) }}</template>
      </el-table-column>
      <el-table-column label="内容" align="center" prop="content" min-width="220" />
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template #default="{ row }"><el-tag :type="getStatusTag(row.status)">{{ getStatusLabel(row.status) }}</el-tag></template>
      </el-table-column>
      <el-table-column label="处理结果" align="center" prop="handleResult" width="110">
        <template #default="{ row }">{{ row.handleResult ? getHandleResultLabel(row.handleResult) : '-' }}</template>
      </el-table-column>
      <el-table-column label="处理备注" align="center" prop="handleRemark" min-width="160" />
      <el-table-column label="举报时间" align="center" prop="createTime" :formatter="dateFormatter" width="180" />
      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row)">详情</el-button>
          <el-button v-if="row.status === 0" v-hasPermi="['tutor:complaint:handle']" link type="danger" @click="openHandle(row)">处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>

  <el-dialog v-model="detailVisible" title="举报详情" width="760px">
    <el-descriptions v-if="currentRow" :column="2" border>
      <el-descriptions-item label="举报编号">{{ currentRow.id }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{ getStatusLabel(currentRow.status) }}</el-descriptions-item>
      <el-descriptions-item label="举报人">{{ currentRow.reporterNickname || '-' }}（{{ currentRow.reporterUserId }}）</el-descriptions-item>
      <el-descriptions-item label="被举报人">{{ currentRow.targetUserId || '-' }}</el-descriptions-item>
      <el-descriptions-item label="目标">{{ getTargetTypeLabel(currentRow.targetType) }} #{{ currentRow.targetId || '-' }}</el-descriptions-item>
      <el-descriptions-item label="原因">{{ getReasonTypeLabel(currentRow.reasonType) }}</el-descriptions-item>
      <el-descriptions-item label="举报内容" :span="2">{{ currentRow.content || '-' }}</el-descriptions-item>
      <el-descriptions-item label="图片证据" :span="2">{{ currentRow.evidenceUrls || '-' }}</el-descriptions-item>
      <el-descriptions-item label="处理结果">{{ currentRow.handleResult ? getHandleResultLabel(currentRow.handleResult) : '-' }}</el-descriptions-item>
      <el-descriptions-item label="处理人">{{ currentRow.handlerId || '-' }}</el-descriptions-item>
      <el-descriptions-item label="处理备注" :span="2">{{ currentRow.handleRemark || '-' }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>

  <el-dialog v-model="handleVisible" title="处理举报" width="560px">
    <el-form ref="handleFormRef" :model="handleForm" :rules="handleRules" label-width="90px">
      <el-form-item label="处理结果" prop="handleResult">
        <el-radio-group v-model="handleForm.handleResult">
          <el-radio v-for="item in handleResultOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="处理备注" prop="handleRemark">
        <el-input v-model="handleForm.handleRemark" type="textarea" :rows="4" maxlength="200" show-word-limit placeholder="请输入处理说明、处罚方式或驳回原因" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitHandle">确认处理</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="TutorComplaint">
import type { FormRules } from 'element-plus'
import { dateFormatter } from '@/utils/formatTime'
import * as ComplaintApi from '@/api/tutor/complaint'

const message = useMessage()
const targetTypeOptions = [{ label: '家长需求', value: 10 }, { label: '教师简历', value: 20 }, { label: '用户', value: 30 }, { label: '评价', value: 40 }]
const reasonTypeOptions = [{ label: '虚假信息', value: 10 }, { label: '联系方式异常', value: 20 }, { label: '骚扰欺诈', value: 30 }, { label: '违规内容', value: 40 }, { label: '其他', value: 90 }]
const handleResultOptions = [{ label: '处理并处罚', value: 10 }, { label: '驳回举报', value: 20 }, { label: '仅备注', value: 30 }]

const loading = ref(true)
const total = ref(0)
const list = ref<ComplaintApi.TutorComplaintVO[]>([])
const queryFormRef = ref()
const queryParams = reactive({ pageNo: 1, pageSize: 10, reporterUserId: undefined, targetUserId: undefined, targetType: undefined, reasonType: undefined, status: undefined, createTime: [] })
const detailVisible = ref(false)
const handleVisible = ref(false)
const submitLoading = ref(false)
const currentRow = ref<ComplaintApi.TutorComplaintVO>()
const handleFormRef = ref()
const handleForm = reactive({ id: 0, handleResult: 10, handleRemark: '' })
const handleRules: FormRules = {
  handleResult: [{ required: true, message: '处理结果不能为空', trigger: 'change' }],
  handleRemark: [{ required: true, message: '处理备注不能为空', trigger: 'blur' }]
}

const getList = async () => {
  loading.value = true
  try {
    const data = await ComplaintApi.getTutorComplaintPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const handleQuery = () => { queryParams.pageNo = 1; getList() }
const resetQuery = () => { queryFormRef.value.resetFields(); handleQuery() }
const openDetail = (row: ComplaintApi.TutorComplaintVO) => { currentRow.value = row; detailVisible.value = true }
const openHandle = (row: ComplaintApi.TutorComplaintVO) => {
  currentRow.value = row
  Object.assign(handleForm, { id: row.id, handleResult: 10, handleRemark: '' })
  handleVisible.value = true
}
const submitHandle = async () => {
  await handleFormRef.value.validate()
  await message.confirm('确认提交该举报处理结果吗？')
  submitLoading.value = true
  try {
    await ComplaintApi.handleTutorComplaint({ ...handleForm })
    message.success('处理成功')
    handleVisible.value = false
    await getList()
  } finally {
    submitLoading.value = false
  }
}
const getTargetTypeLabel = (value: number) => targetTypeOptions.find((item) => item.value === value)?.label || '-'
const getReasonTypeLabel = (value: number) => reasonTypeOptions.find((item) => item.value === value)?.label || '-'
const getHandleResultLabel = (value: number) => handleResultOptions.find((item) => item.value === value)?.label || '-'
const getStatusLabel = (status: number) => status === 10 ? '已处理' : status === 20 ? '已驳回' : '待处理'
const getStatusTag = (status: number) => status === 10 ? 'success' : status === 20 ? 'info' : 'warning'

onMounted(() => getList())
</script>
