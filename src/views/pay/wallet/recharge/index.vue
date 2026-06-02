<template>
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="支付状态" prop="payStatus">
        <el-select v-model="queryParams.payStatus" placeholder="请选择支付状态" clearable class="!w-240px">
          <el-option label="已支付" :value="true" />
          <el-option label="未支付" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
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
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="钱包编号" align="center" prop="walletId" />
      <el-table-column label="支付金额" align="center" prop="payPrice">
        <template #default="{ row }"> {{ fenToYuan(row.payPrice) }} 元</template>
      </el-table-column>
      <el-table-column label="赠送金额" align="center" prop="bonusPrice">
        <template #default="{ row }"> {{ fenToYuan(row.bonusPrice) }} 元</template>
      </el-table-column>
      <el-table-column label="到账金额" align="center" prop="totalPrice">
        <template #default="{ row }"> {{ fenToYuan(row.totalPrice) }} 元</template>
      </el-table-column>
      <el-table-column label="支付状态" align="center" prop="payStatus">
        <template #default="scope">
          <el-tag :type="scope.row.payStatus ? 'success' : 'warning'">
            {{ scope.row.payStatus ? '已支付' : '未支付' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="支付渠道" align="center" prop="payChannelCode" />
      <el-table-column
        label="支付时间"
        align="center"
        prop="payTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
    </el-table>
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { fenToYuan } from '@/utils'
import * as WalletRechargeApi from '@/api/pay/wallet/recharge'

defineOptions({ name: 'WalletRecharge' })

const loading = ref(true)
const total = ref(0)
const list = ref([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  payStatus: null,
  createTime: []
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await WalletRechargeApi.getRechargePage(queryParams)
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
