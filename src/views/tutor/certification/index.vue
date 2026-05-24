<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      class="-mb-15px"
      :model="queryParams"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="用户编号" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户编号"
          clearable
          class="!w-180px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input
          v-model="queryParams.realName"
          placeholder="请输入真实姓名"
          clearable
          class="!w-200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-160px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TUTOR_AUDIT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提交时间" prop="createTime">
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
      <el-table-column label="用户编号" align="center" prop="userId" width="100" />
      <el-table-column label="真实姓名" align="center" prop="realName" min-width="120" />
      <el-table-column label="身份证" align="center" prop="idCardNoMask" min-width="160" />
      <el-table-column label="材料" align="center" min-width="160">
        <template #default="{ row }">
          <el-button
            v-if="row.educationFileUrl"
            link
            type="primary"
            @click="previewImage(row.educationFileUrl)"
          >
            学历材料
          </el-button>
          <el-button
            v-if="row.teacherCertFileUrl"
            link
            type="primary"
            @click="previewImage(row.teacherCertFileUrl)"
          >
            教师证
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="status" width="110">
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.TUTOR_AUDIT_STATUS" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="拒绝原因" align="center" prop="rejectReason" min-width="160" />
      <el-table-column
        label="提交时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180"
      />
      <el-table-column label="操作" align="center" fixed="right" width="170">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row)">详情</el-button>
          <el-button
            v-if="row.status === AuditStatus.WAITING"
            v-hasPermi="['tutor:certification:audit']"
            link
            type="success"
            @click="handleAudit(row, AuditStatus.APPROVED)"
          >
            通过
          </el-button>
          <el-button
            v-if="row.status === AuditStatus.WAITING"
            v-hasPermi="['tutor:certification:audit']"
            link
            type="danger"
            @click="handleAudit(row, AuditStatus.REJECTED)"
          >
            拒绝
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

  <el-dialog v-model="detailVisible" title="认证详情" width="720px">
    <el-descriptions v-if="currentRow" :column="2" border>
      <el-descriptions-item label="用户编号">{{ currentRow.userId }}</el-descriptions-item>
      <el-descriptions-item label="真实姓名">{{ currentRow.realName }}</el-descriptions-item>
      <el-descriptions-item label="身份证">{{ currentRow.idCardNoMask }}</el-descriptions-item>
      <el-descriptions-item label="审核状态">
        <dict-tag :type="DICT_TYPE.TUTOR_AUDIT_STATUS" :value="currentRow.status" />
      </el-descriptions-item>
      <el-descriptions-item label="审核人">{{ currentRow.auditorId || '-' }}</el-descriptions-item>
      <el-descriptions-item label="审核时间">
        {{ currentRow.auditTime ? formatDate(currentRow.auditTime) : '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="拒绝原因" :span="2">
        {{ currentRow.rejectReason || '-' }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup lang="ts" name="TutorCertification">
import { ElMessageBox } from 'element-plus'
import { createImageViewer } from '@/components/ImageViewer'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter, formatDate } from '@/utils/formatTime'
import * as CertificationApi from '@/api/tutor/certification'

const enum AuditStatus {
  WAITING = 10,
  APPROVED = 20,
  REJECTED = 30
}

const message = useMessage()
const loading = ref(true)
const total = ref(0)
const list = ref<CertificationApi.TutorCertificationVO[]>([])
const queryFormRef = ref()
const detailVisible = ref(false)
const currentRow = ref<CertificationApi.TutorCertificationVO>()
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: undefined,
  realName: undefined,
  status: undefined,
  createTime: []
})

const getList = async () => {
  loading.value = true
  try {
    const data = await CertificationApi.getTutorCertificationPage(queryParams)
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

const previewImage = (url: string) => {
  if (/\.(png|jpe?g|gif|webp|bmp)$/i.test(url)) {
    createImageViewer({ urlList: [url] })
    return
  }
  window.open(url, '_blank')
}

const openDetail = (row: CertificationApi.TutorCertificationVO) => {
  currentRow.value = row
  detailVisible.value = true
}

const handleAudit = async (row: CertificationApi.TutorCertificationVO, status: AuditStatus) => {
  const isReject = status === AuditStatus.REJECTED
  let rejectReason = ''
  if (isReject) {
    const { value } = await ElMessageBox.prompt('请输入拒绝原因', '拒绝认证', {
      confirmButtonText: '确认拒绝',
      cancelButtonText: '取消',
      inputPattern: /\S+/,
      inputErrorMessage: '拒绝原因不能为空'
    })
    rejectReason = value
  } else {
    await message.confirm(`确认通过「${row.realName}」的教师认证吗？`)
  }
  await CertificationApi.auditTutorCertification({ id: row.id, status, rejectReason })
  message.success('审核成功')
  await getList()
}

onMounted(() => {
  getList()
})
</script>
