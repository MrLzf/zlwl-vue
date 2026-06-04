<template>
  <ContentWrap>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="积分包配置" name="package">
        <el-form ref="packageQueryFormRef" class="-mb-15px" :model="packageQueryParams" :inline="true" label-width="68px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="packageQueryParams.name" placeholder="请输入积分包名称" clearable class="!w-200px" @keyup.enter="handlePackageQuery" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="packageQueryParams.status" placeholder="全部" clearable class="!w-140px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="handlePackageQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
            <el-button @click="resetPackageQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
            <el-button v-hasPermi="['tutor:point-package:create']" type="primary" plain @click="openPackageForm()">
              <Icon icon="ep:plus" class="mr-5px" /> 新增
            </el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="packageLoading" class="mt-20px" :data="packageList" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column label="编号" align="center" prop="id" width="90" />
          <el-table-column label="名称" align="center" prop="name" min-width="150" />
          <el-table-column label="积分" align="center" prop="point" width="100" />
          <el-table-column label="赠送积分" align="center" prop="bonusPoint" width="110" />
          <el-table-column label="支付金额" align="center" prop="payPrice" width="120">
            <template #default="{ row }">{{ fenToYuan(row.payPrice) }} 元</template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status" width="100">
            <template #default="{ row }"><dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="row.status" /></template>
          </el-table-column>
          <el-table-column label="排序" align="center" prop="sort" width="90" />
          <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180" />
          <el-table-column label="操作" align="center" fixed="right" width="120">
            <template #default="{ row }">
              <el-button v-hasPermi="['tutor:point-package:update']" link type="primary" @click="openPackageForm(row)">编辑</el-button>
              <el-button v-hasPermi="['tutor:point-package:delete']" link type="danger" @click="handlePackageDelete(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination v-model:limit="packageQueryParams.pageSize" v-model:page="packageQueryParams.pageNo" :total="packageTotal" @pagination="getPackageList" />
      </el-tab-pane>

      <el-tab-pane label="充值订单" name="order">
        <el-form ref="orderQueryFormRef" class="-mb-15px" :model="orderQueryParams" :inline="true" label-width="82px">
          <el-form-item label="订单号" prop="orderNo">
            <el-input v-model="orderQueryParams.orderNo" placeholder="请输入订单号" clearable class="!w-200px" @keyup.enter="handleOrderQuery" />
          </el-form-item>
          <el-form-item label="用户编号" prop="userId">
            <el-input v-model="orderQueryParams.userId" placeholder="请输入用户编号" clearable class="!w-150px" @keyup.enter="handleOrderQuery" />
          </el-form-item>
          <el-form-item label="支付状态" prop="payStatus">
            <el-select v-model="orderQueryParams.payStatus" placeholder="全部" clearable class="!w-140px">
              <el-option label="待支付" :value="0" />
              <el-option label="已支付" :value="10" />
              <el-option label="已关闭" :value="20" />
            </el-select>
          </el-form-item>
          <el-form-item label="到账状态" prop="arrivalStatus">
            <el-select v-model="orderQueryParams.arrivalStatus" placeholder="全部" clearable class="!w-140px">
              <el-option label="未到账" :value="0" />
              <el-option label="已到账" :value="10" />
              <el-option label="到账失败" :value="20" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker v-model="orderQueryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-240px" />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleOrderQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
            <el-button @click="resetOrderQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="orderLoading" class="mt-20px" :data="orderList" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column label="订单编号" align="center" prop="orderNo" min-width="180" />
          <el-table-column label="用户编号" align="center" prop="userId" width="100" />
          <el-table-column label="积分包" align="center" prop="packageName" min-width="140" />
          <el-table-column label="到账积分" align="center" min-width="110">
            <template #default="{ row }">{{ row.point || 0 }} + {{ row.bonusPoint || 0 }}</template>
          </el-table-column>
          <el-table-column label="支付金额" align="center" prop="payPrice" width="120">
            <template #default="{ row }">{{ fenToYuan(row.payPrice) }} 元</template>
          </el-table-column>
          <el-table-column label="支付状态" align="center" width="100">
            <template #default="{ row }"><el-tag :type="getPayStatusTag(row.payStatus)">{{ getPayStatusLabel(row.payStatus) }}</el-tag></template>
          </el-table-column>
          <el-table-column label="到账状态" align="center" width="100">
            <template #default="{ row }"><el-tag :type="row.arrivalStatus === 10 ? 'success' : 'warning'">{{ row.arrivalStatus === 10 ? '已到账' : row.arrivalStatus === 20 ? '失败' : '未到账' }}</el-tag></template>
          </el-table-column>
          <el-table-column label="支付渠道" align="center" prop="payChannelCode" width="110" />
          <el-table-column label="支付时间" align="center" prop="payTime" :formatter="dateFormatter" width="180" />
          <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180" />
        </el-table>
        <Pagination v-model:limit="orderQueryParams.pageSize" v-model:page="orderQueryParams.pageNo" :total="orderTotal" @pagination="getOrderList" />
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>

  <el-dialog v-model="packageFormVisible" :title="packageForm.id ? '编辑积分包' : '新增积分包'" width="560px">
    <el-form ref="packageFormRef" :model="packageForm" :rules="packageRules" label-width="90px">
      <el-form-item label="名称" prop="name"><el-input v-model="packageForm.name" placeholder="请输入积分包名称" /></el-form-item>
      <el-form-item label="积分" prop="point"><el-input-number v-model="packageForm.point" :min="1" class="!w-240px" /></el-form-item>
      <el-form-item label="赠送积分" prop="bonusPoint"><el-input-number v-model="packageForm.bonusPoint" :min="0" class="!w-240px" /></el-form-item>
      <el-form-item label="支付金额" prop="payPrice"><el-input-number v-model="packageForm.payPrice" :min="1" class="!w-240px" /><span class="ml-8px text-12px text-gray-500">单位：分</span></el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="packageForm.status">
          <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort"><el-input-number v-model="packageForm.sort" :min="0" class="!w-240px" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="packageFormVisible = false">取消</el-button>
      <el-button type="primary" :loading="packageSubmitLoading" @click="submitPackageForm">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="TutorPointPackage">
import type { FormRules } from 'element-plus'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { fenToYuan } from '@/utils'
import * as PointPackageApi from '@/api/tutor/pointPackage'

const message = useMessage()
const { t } = useI18n()
const activeTab = ref('package')

const packageLoading = ref(true)
const packageTotal = ref(0)
const packageList = ref<PointPackageApi.TutorPointPackageVO[]>([])
const packageQueryFormRef = ref()
const packageQueryParams = reactive({ pageNo: 1, pageSize: 10, name: undefined, status: undefined })

const orderLoading = ref(true)
const orderTotal = ref(0)
const orderList = ref<PointPackageApi.TutorPointRechargeOrderVO[]>([])
const orderQueryFormRef = ref()
const orderQueryParams = reactive({ pageNo: 1, pageSize: 10, orderNo: undefined, userId: undefined, payStatus: undefined, arrivalStatus: undefined, createTime: [] })

const packageFormVisible = ref(false)
const packageSubmitLoading = ref(false)
const packageFormRef = ref()
const packageForm = reactive({ id: undefined as number | undefined, name: '', point: 100, bonusPoint: 0, payPrice: 100, status: 0, sort: 0 })
const packageRules: FormRules = {
  name: [{ required: true, message: '积分包名称不能为空', trigger: 'blur' }],
  point: [{ required: true, message: '积分不能为空', trigger: 'blur' }],
  payPrice: [{ required: true, message: '支付金额不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
}

const getPackageList = async () => {
  packageLoading.value = true
  try {
    const data = await PointPackageApi.getTutorPointPackagePage(packageQueryParams)
    packageList.value = data.list
    packageTotal.value = data.total
  } finally {
    packageLoading.value = false
  }
}
const getOrderList = async () => {
  orderLoading.value = true
  try {
    const data = await PointPackageApi.getTutorPointRechargeOrderPage(orderQueryParams)
    orderList.value = data.list
    orderTotal.value = data.total
  } finally {
    orderLoading.value = false
  }
}
const handlePackageQuery = () => { packageQueryParams.pageNo = 1; getPackageList() }
const resetPackageQuery = () => { packageQueryFormRef.value.resetFields(); handlePackageQuery() }
const handleOrderQuery = () => { orderQueryParams.pageNo = 1; getOrderList() }
const resetOrderQuery = () => { orderQueryFormRef.value.resetFields(); handleOrderQuery() }
const openPackageForm = (row?: PointPackageApi.TutorPointPackageVO) => {
  Object.assign(packageForm, row ? { ...row } : { id: undefined, name: '', point: 100, bonusPoint: 0, payPrice: 100, status: 0, sort: 0 })
  packageFormVisible.value = true
}
const submitPackageForm = async () => {
  await packageFormRef.value.validate()
  packageSubmitLoading.value = true
  try {
    packageForm.id ? await PointPackageApi.updateTutorPointPackage(packageForm as PointPackageApi.TutorPointPackageVO) : await PointPackageApi.createTutorPointPackage(packageForm as PointPackageApi.TutorPointPackageVO)
    message.success(t('common.updateSuccess'))
    packageFormVisible.value = false
    await getPackageList()
  } finally {
    packageSubmitLoading.value = false
  }
}
const handlePackageDelete = async (id: number) => {
  await message.delConfirm()
  await PointPackageApi.deleteTutorPointPackage(id)
  message.success(t('common.delSuccess'))
  await getPackageList()
}
const getPayStatusLabel = (status: number) => status === 10 ? '已支付' : status === 20 ? '已关闭' : '待支付'
const getPayStatusTag = (status: number) => status === 10 ? 'success' : status === 20 ? 'info' : 'warning'

onMounted(() => {
  getPackageList()
  getOrderList()
})
</script>
