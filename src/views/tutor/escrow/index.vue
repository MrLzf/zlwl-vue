<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="订单编号" prop="id" width="110" />
      <el-table-column label="预约编号" prop="appointmentId" width="110" />
      <el-table-column label="家长用户" prop="parentUserId" min-width="120" />
      <el-table-column label="教师用户" prop="teacherUserId" min-width="120" />
      <el-table-column label="担保金额" prop="amount" min-width="120" />
      <el-table-column label="状态" prop="status" width="120" />
      <el-table-column label="退款/争议原因" prop="refundReason" min-width="180" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handle(row, 'release')">释放</el-button>
          <el-button link type="warning" @click="handle(row, 'refund')">退款</el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>

<script setup lang="ts" name="TutorEscrow">
import * as EscrowApi from '@/api/tutor/escrow'

const message = useMessage()
const loading = ref(false)
const list = ref<EscrowApi.TutorEscrowTradeVO[]>([])
const queryParams = reactive({ pageNo: 1, pageSize: 10 })

const getList = async () => {
  loading.value = true
  try {
    const data = await EscrowApi.getEscrowTradePage(queryParams)
    list.value = data.list || []
  } finally {
    loading.value = false
  }
}

const handle = async (row: EscrowApi.TutorEscrowTradeVO, action: string) => {
  await EscrowApi.handleEscrowTrade(row.id!, { action, adminRemark: action === 'release' ? '完成释放' : '后台退款' })
  message.success('处理成功')
  await getList()
}

onMounted(getList)
</script>
