<template>
  <ContentWrap>
    <el-form :inline="true" :model="queryParams">
      <el-form-item label="教师用户" prop="teacherUserId">
        <el-input v-model="queryParams.teacherUserId" placeholder="教师用户 ID" clearable />
      </el-form-item>
      <el-form-item label="家长用户" prop="parentUserId">
        <el-input v-model="queryParams.parentUserId" placeholder="家长用户 ID" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="预约编号" prop="id" width="110" />
      <el-table-column label="家长用户" prop="parentUserId" min-width="120" />
      <el-table-column label="教师用户" prop="teacherUserId" min-width="120" />
      <el-table-column label="预约时间" min-width="220">
        <template #default="{ row }">{{ row.startTime }} - {{ row.endTime }}</template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="120" />
      <el-table-column label="备注" prop="remark" min-width="180" />
    </el-table>
  </ContentWrap>
</template>

<script setup lang="ts" name="TutorAppointment">
import * as AppointmentApi from '@/api/tutor/appointment'

const loading = ref(false)
const list = ref<AppointmentApi.TutorAppointmentVO[]>([])
const queryParams = reactive({ pageNo: 1, pageSize: 10, teacherUserId: undefined, parentUserId: undefined })

const getList = async () => {
  loading.value = true
  try {
    const data = await AppointmentApi.getAppointmentPage(queryParams)
    list.value = data.list || []
  } finally {
    loading.value = false
  }
}

onMounted(getList)
</script>
