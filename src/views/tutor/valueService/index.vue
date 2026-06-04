<template>
  <ContentWrap>
    <el-form ref="queryFormRef" class="-mb-15px" :model="queryParams" :inline="true" label-width="82px">
      <el-form-item label="服务名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入服务名称" clearable class="!w-180px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="服务类型" prop="serviceType">
        <el-select v-model="queryParams.serviceType" placeholder="全部" clearable class="!w-150px">
          <el-option v-for="item in serviceTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="目标类型" prop="targetType">
        <el-select v-model="queryParams.targetType" placeholder="全部" clearable class="!w-150px">
          <el-option v-for="item in targetTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-140px">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button v-hasPermi="['tutor:value-service:create']" type="primary" plain @click="openForm()">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" width="90" />
      <el-table-column label="服务名称" align="center" prop="name" min-width="150" />
      <el-table-column label="服务类型" align="center" prop="serviceType" width="110">
        <template #default="{ row }">{{ getServiceTypeLabel(row.serviceType) }}</template>
      </el-table-column>
      <el-table-column label="适用目标" align="center" prop="targetType" width="110">
        <template #default="{ row }">{{ getTargetTypeLabel(row.targetType) }}</template>
      </el-table-column>
      <el-table-column label="价格" align="center" prop="pointPrice" width="110">
        <template #default="{ row }">{{ row.pointPrice }} 积分</template>
      </el-table-column>
      <el-table-column label="生效时长" align="center" prop="durationHours" width="120">
        <template #default="{ row }">{{ row.durationHours }} 小时</template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template #default="{ row }"><dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="row.status" /></template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" width="90" />
      <el-table-column label="说明" align="center" prop="description" min-width="180" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180" />
      <el-table-column label="操作" align="center" fixed="right" width="120">
        <template #default="{ row }">
          <el-button v-hasPermi="['tutor:value-service:update']" link type="primary" @click="openForm(row)">编辑</el-button>
          <el-button v-hasPermi="['tutor:value-service:delete']" link type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>

  <el-dialog v-model="formVisible" :title="formData.id ? '编辑增值服务' : '新增增值服务'" width="620px">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="服务名称" prop="name"><el-input v-model="formData.name" placeholder="请输入服务名称" /></el-form-item>
      <el-form-item label="服务类型" prop="serviceType">
        <el-select v-model="formData.serviceType" class="!w-240px">
          <el-option v-for="item in serviceTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="适用目标" prop="targetType">
        <el-select v-model="formData.targetType" class="!w-240px">
          <el-option v-for="item in targetTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="积分价格" prop="pointPrice"><el-input-number v-model="formData.pointPrice" :min="1" class="!w-240px" /></el-form-item>
      <el-form-item label="生效时长" prop="durationHours"><el-input-number v-model="formData.durationHours" :min="1" class="!w-240px" /><span class="ml-8px text-12px text-gray-500">小时</span></el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort"><el-input-number v-model="formData.sort" :min="0" class="!w-240px" /></el-form-item>
      <el-form-item label="说明" prop="description"><el-input v-model="formData.description" type="textarea" :rows="3" maxlength="200" show-word-limit /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="formVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitForm">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="TutorValueService">
import type { FormRules } from 'element-plus'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as ValueServiceApi from '@/api/tutor/valueService'

const message = useMessage()
const { t } = useI18n()
const serviceTypeOptions = [{ label: '加速', value: 10 }, { label: '加急', value: 20 }, { label: '置顶', value: 30 }]
const targetTypeOptions = [{ label: '家长需求', value: 10 }, { label: '教师简历', value: 20 }, { label: '不限', value: 30 }]

const loading = ref(true)
const total = ref(0)
const list = ref<ValueServiceApi.TutorValueServiceConfigVO[]>([])
const queryFormRef = ref()
const queryParams = reactive({ pageNo: 1, pageSize: 10, name: undefined, serviceType: undefined, targetType: undefined, status: undefined })

const formVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref()
const formData = reactive({ id: undefined as number | undefined, name: '', serviceType: 10, pointPrice: 10, durationHours: 24, targetType: 30, status: 0, sort: 0, description: '' })
const rules: FormRules = {
  name: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
  serviceType: [{ required: true, message: '服务类型不能为空', trigger: 'change' }],
  targetType: [{ required: true, message: '目标类型不能为空', trigger: 'change' }],
  pointPrice: [{ required: true, message: '积分价格不能为空', trigger: 'blur' }],
  durationHours: [{ required: true, message: '生效时长不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
}

const getList = async () => {
  loading.value = true
  try {
    const data = await ValueServiceApi.getTutorValueServiceConfigPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const handleQuery = () => { queryParams.pageNo = 1; getList() }
const resetQuery = () => { queryFormRef.value.resetFields(); handleQuery() }
const openForm = (row?: ValueServiceApi.TutorValueServiceConfigVO) => {
  Object.assign(formData, row ? { ...row } : { id: undefined, name: '', serviceType: 10, pointPrice: 10, durationHours: 24, targetType: 30, status: 0, sort: 0, description: '' })
  formVisible.value = true
}
const submitForm = async () => {
  await formRef.value.validate()
  submitLoading.value = true
  try {
    formData.id ? await ValueServiceApi.updateTutorValueServiceConfig(formData as ValueServiceApi.TutorValueServiceConfigVO) : await ValueServiceApi.createTutorValueServiceConfig(formData as ValueServiceApi.TutorValueServiceConfigVO)
    message.success(t('common.updateSuccess'))
    formVisible.value = false
    await getList()
  } finally {
    submitLoading.value = false
  }
}
const handleDelete = async (id: number) => {
  await message.delConfirm()
  await ValueServiceApi.deleteTutorValueServiceConfig(id)
  message.success(t('common.delSuccess'))
  await getList()
}
const getServiceTypeLabel = (value: number) => serviceTypeOptions.find((item) => item.value === value)?.label || '-'
const getTargetTypeLabel = (value: number) => targetTypeOptions.find((item) => item.value === value)?.label || '-'

onMounted(() => getList())
</script>
