<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      class="-mb-15px"
      :model="queryParams"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="城市" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入城市名称/编码"
          clearable
          class="!w-240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开通" prop="opened">
        <el-select v-model="queryParams.opened" placeholder="全部" clearable class="!w-160px">
          <el-option label="已开通" :value="true" />
          <el-option label="未开通" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="filteredList" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" width="80" />
      <el-table-column label="城市" align="center" prop="name" min-width="120" />
      <el-table-column label="编码" align="center" prop="code" min-width="120" />
      <el-table-column label="省份" align="center" prop="province" min-width="120" />
      <el-table-column label="拼音" align="center" prop="pinyin" min-width="120" />
      <el-table-column label="开通" align="center" width="110">
        <template #default="{ row }">
          <el-switch v-model="row.opened" @change="handleUpdate(row)" />
        </template>
      </el-table-column>
      <el-table-column label="热门" align="center" width="110">
        <template #default="{ row }">
          <el-switch v-model="row.hot" @change="handleUpdate(row)" />
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" width="140">
        <template #default="{ row }">
          <el-input-number
            v-model="row.sort"
            :min="0"
            :max="9999"
            controls-position="right"
            @change="handleUpdate(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === 0 ? 'success' : 'info'">
            {{ row.status === 0 ? '正常' : '停用' }}
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
    </el-table>
  </ContentWrap>
</template>

<script setup lang="ts" name="TutorCity">
import { dateFormatter } from '@/utils/formatTime'
import * as CityApi from '@/api/tutor/city'

const message = useMessage()

const loading = ref(true)
const list = ref<CityApi.TutorCityVO[]>([])
const queryFormRef = ref()
const queryParams = reactive({
  keyword: '',
  opened: undefined as boolean | undefined
})

const filteredList = computed(() => {
  const keyword = queryParams.keyword.trim().toLowerCase()
  return list.value.filter((item) => {
    const matchKeyword =
      !keyword ||
      item.name.toLowerCase().includes(keyword) ||
      item.code.toLowerCase().includes(keyword) ||
      item.pinyin.toLowerCase().includes(keyword)
    const matchOpened = queryParams.opened === undefined || item.opened === queryParams.opened
    return matchKeyword && matchOpened
  })
})

const getList = async () => {
  loading.value = true
  try {
    list.value = await CityApi.getTutorCityList()
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  // 本页数据量小，筛选在前端完成
}

const resetQuery = () => {
  queryFormRef.value.resetFields()
}

const handleUpdate = async (row: CityApi.TutorCityVO) => {
  await CityApi.updateTutorCity({
    id: row.id,
    opened: row.opened,
    hot: row.hot,
    sort: row.sort,
    status: row.status
  })
  message.success('更新成功')
}

onMounted(() => {
  getList()
})
</script>
