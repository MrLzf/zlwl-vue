<template>
  <ContentWrap>
    <el-form :model="form" label-width="120px" class="max-w-720px">
      <el-form-item label="场景">
        <el-select v-model="form.scene">
          <el-option label="教师广场" value="square_resume" />
          <el-option label="需求广场" value="square_demand" />
        </el-select>
      </el-form-item>
      <el-form-item label="城市编码">
        <el-input v-model="form.cityCode" placeholder="留空表示全局" />
      </el-form-item>
      <el-form-item label="AB 实验组">
        <el-input v-model="form.abGroup" />
      </el-form-item>
      <el-form-item label="距离权重">
        <el-slider v-model="form.distanceWeight" :min="0" :max="100" show-input />
      </el-form-item>
      <el-form-item label="评分权重">
        <el-slider v-model="form.ratingWeight" :min="0" :max="100" show-input />
      </el-form-item>
      <el-form-item label="活跃权重">
        <el-slider v-model="form.activeWeight" :min="0" :max="100" show-input />
      </el-form-item>
      <el-form-item label="置顶权重">
        <el-slider v-model="form.topWeight" :min="0" :max="100" show-input />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存权重</el-button>
        <el-button @click="load">重新加载</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
</template>

<script setup lang="ts" name="TutorRecommend">
import * as RecommendApi from '@/api/tutor/recommend'

const message = useMessage()
const form = reactive<RecommendApi.TutorRecommendConfigVO>({
  scene: 'square_resume',
  cityCode: '',
  abGroup: 'default',
  distanceWeight: 30,
  ratingWeight: 30,
  activeWeight: 20,
  topWeight: 20
})

const load = async () => {
  Object.assign(form, await RecommendApi.getRecommendConfig(form))
}

const save = async () => {
  await RecommendApi.saveRecommendConfig(form)
  message.success('推荐权重已保存，广场排序将按新权重生效')
}

onMounted(load)
</script>
