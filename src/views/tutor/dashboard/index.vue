<template>
  <ContentWrap>
    <el-row :gutter="16">
      <el-col v-for="item in cards" :key="item.label" :xs="24" :sm="12" :lg="6">
        <el-card shadow="never" class="mb-16px">
          <div class="text-14px text-gray-500">{{ item.label }}</div>
          <div class="mt-12px text-24px font-bold">{{ item.value }}</div>
          <div class="mt-8px text-12px text-gray-400">{{ item.remark }}</div>
        </el-card>
      </el-col>
    </el-row>
  </ContentWrap>

  <ContentWrap>
    <el-alert
      title="数据概览菜单已接入，核心指标接口将在 ADM-012 补齐后展示实时数据。"
      type="info"
      :closable="false"
      show-icon
    />
  </ContentWrap>
</template>

<script setup lang="ts" name="TutorDashboard">
const cards = [
  { label: '用户档案', value: '-', remark: '家长 / 教师档案总量' },
  { label: '待审核', value: '-', remark: '认证、需求、简历待办' },
  { label: '有效发布', value: '-', remark: '展示中的需求与简历' },
  { label: '联系查看', value: '-', remark: '联系方式查看次数' }
]
</script>
