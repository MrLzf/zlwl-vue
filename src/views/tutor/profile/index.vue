<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      class="-mb-15px"
      :model="queryParams"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="身份" prop="role">
        <el-select v-model="queryParams.role" placeholder="全部" clearable class="!w-140px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TUTOR_USER_ROLE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
      <el-form-item label="认证状态" prop="certificationStatus">
        <el-select
          v-model="queryParams.certificationStatus"
          placeholder="全部"
          clearable
          class="!w-160px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TUTOR_AUDIT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号"
          clearable
          class="!w-180px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入昵称"
          clearable
          class="!w-180px"
          @keyup.enter="handleQuery"
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
      <el-table-column label="档案编号" align="center" prop="id" width="100" />
      <el-table-column label="用户编号" align="center" prop="userId" width="100" />
      <el-table-column label="昵称" align="center" prop="nickname" min-width="120" />
      <el-table-column label="手机号" align="center" prop="mobile" min-width="130" />
      <el-table-column label="身份" align="center" prop="role" width="100">
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.TUTOR_USER_ROLE" :value="row.role" />
        </template>
      </el-table-column>
      <el-table-column label="城市" align="center" min-width="130">
        <template #default="{ row }">{{ row.cityName || '-' }} / {{ row.cityCode || '-' }}</template>
      </el-table-column>
      <el-table-column label="认证状态" align="center" prop="certificationStatus" width="120">
        <template #default="{ row }">
          <dict-tag
            v-if="row.certificationStatus !== undefined && row.certificationStatus !== null"
            :type="DICT_TYPE.TUTOR_AUDIT_STATUS"
            :value="row.certificationStatus"
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center" prop="point" width="100" />
      <el-table-column label="最近定位" align="center" min-width="170">
        <template #default="{ row }">{{ row.locationAddress || '-' }}</template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180"
      />
      <el-table-column label="操作" align="center" fixed="right" width="120">
        <template #default="{ row }">
          <el-button
            v-hasPermi="['tutor:point:adjust']"
            link
            type="primary"
            @click="openPointDialog(row)"
          >
            积分调整
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

  <el-dialog v-model="pointDialogVisible" title="积分调整" width="520px">
    <el-form
      ref="pointFormRef"
      :model="pointForm"
      :rules="pointRules"
      label-width="90px"
    >
      <el-form-item label="用户编号">{{ pointForm.userId }}</el-form-item>
      <el-form-item label="当前积分">{{ currentPoint }}</el-form-item>
      <el-form-item label="变动积分" prop="point">
        <el-input-number v-model="pointForm.point" :min="-99999" :max="99999" class="!w-240px" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="pointForm.remark"
          type="textarea"
          :rows="3"
          maxlength="120"
          show-word-limit
          placeholder="请输入积分调整原因"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="pointDialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="pointLoading" @click="submitPointAdjust">确认调整</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="TutorProfile">
import type { FormRules } from 'element-plus'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as ProfileApi from '@/api/tutor/profile'
import * as PointApi from '@/api/tutor/point'

const message = useMessage()
const loading = ref(true)
const total = ref(0)
const list = ref<ProfileApi.TutorUserProfileVO[]>([])
const queryFormRef = ref()
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  role: undefined,
  cityCode: undefined,
  certificationStatus: undefined,
  mobile: undefined,
  nickname: undefined
})

const pointDialogVisible = ref(false)
const pointLoading = ref(false)
const pointFormRef = ref()
const currentPoint = ref(0)
const pointForm = reactive({
  userId: 0,
  point: 0,
  remark: ''
})
const pointRules: FormRules = {
  point: [
    {
      validator: (_rule, value, callback) => {
        if (!value) {
          callback(new Error('变动积分不能为 0'))
          return
        }
        callback()
      },
      trigger: 'blur'
    }
  ],
  remark: [{ required: true, message: '调整备注不能为空', trigger: 'blur' }]
}

const getList = async () => {
  loading.value = true
  try {
    const data = await ProfileApi.getTutorProfilePage(queryParams)
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

const openPointDialog = (row: ProfileApi.TutorUserProfileVO) => {
  pointForm.userId = row.userId
  pointForm.point = 0
  pointForm.remark = ''
  currentPoint.value = row.point || 0
  pointDialogVisible.value = true
}

const submitPointAdjust = async () => {
  await pointFormRef.value.validate()
  await message.confirm(
    `确认给用户 ${pointForm.userId} ${pointForm.point > 0 ? '增加' : '扣减'} ${Math.abs(
      pointForm.point
    )} 积分吗？`
  )
  pointLoading.value = true
  try {
    await PointApi.adjustTutorPoint({ ...pointForm })
    message.success('积分调整成功')
    pointDialogVisible.value = false
    await getList()
  } finally {
    pointLoading.value = false
  }
}

onMounted(() => {
  getList()
})
</script>
