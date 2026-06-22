<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      class="-mb-15px"
      :model="queryParams"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入简历标题"
          clearable
          class="!w-200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户编号" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户编号"
          clearable
          class="!w-160px"
          @keyup.enter="handleQuery"
        />
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
      <el-form-item label="科目" prop="subject">
        <el-select v-model="queryParams.subject" placeholder="全部" clearable class="!w-160px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.TUTOR_SUBJECT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="授课模式" prop="teachMode">
        <el-select v-model="queryParams.teachMode" placeholder="全部" clearable class="!w-160px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TUTOR_TEACH_MODE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支持试课" prop="freeTrialEnabled">
        <el-select
          v-model="queryParams.freeTrialEnabled"
          placeholder="全部"
          clearable
          class="!w-140px"
        >
          <el-option label="支持" :value="true" />
          <el-option label="不支持" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-160px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TUTOR_PUBLISH_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" placeholder="全部" clearable class="!w-160px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TUTOR_AUDIT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-row class="mb-10px">
      <el-button
        v-hasPermi="['tutor:resume:create']"
        type="primary"
        plain
        @click="openEntryDialog"
      >
        <Icon icon="ep:plus" class="mr-5px" /> 录入教师
      </el-button>
    </el-row>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" width="90" />
      <el-table-column label="标题" align="center" prop="title" min-width="180" />
      <el-table-column label="用户编号" align="center" prop="userId" width="100" />
      <el-table-column label="城市" align="center" prop="cityName" width="110" />
      <el-table-column label="科目" align="center" prop="subjects" min-width="120">
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.TUTOR_SUBJECT" :value="row.subjects" />
        </template>
      </el-table-column>
      <el-table-column label="授课模式" align="center" prop="teachModes" min-width="120">
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.TUTOR_TEACH_MODE" :value="row.teachModes" />
        </template>
      </el-table-column>
      <el-table-column label="时薪" align="center" prop="hourlyPrice" width="100">
        <template #default="{ row }">{{ row.hourlyPrice || '-' }}</template>
      </el-table-column>
      <el-table-column label="试课" align="center" prop="freeTrialEnabled" width="100">
        <template #default="{ row }">
          <el-tag :type="row.freeTrialEnabled ? 'success' : 'info'">
            {{ row.freeTrialEnabled ? '支持' : '不支持' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布状态" align="center" prop="status" width="110">
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.TUTOR_PUBLISH_STATUS" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="auditStatus" width="110">
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.TUTOR_AUDIT_STATUS" :value="row.auditStatus" />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180"
      />
      <el-table-column label="操作" align="center" fixed="right" width="210">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row)">详情</el-button>
          <el-button
            v-if="row.auditStatus === AuditStatus.WAITING"
            v-hasPermi="['tutor:resume:audit']"
            link
            type="success"
            @click="handleAudit(row, AuditStatus.APPROVED)"
          >
            通过
          </el-button>
          <el-button
            v-if="row.auditStatus === AuditStatus.WAITING"
            v-hasPermi="['tutor:resume:audit']"
            link
            type="danger"
            @click="handleAudit(row, AuditStatus.REJECTED)"
          >
            拒绝
          </el-button>
          <el-button
            v-if="row.status !== PublishStatus.OFFLINE"
            v-hasPermi="['tutor:resume:offline']"
            link
            type="danger"
            @click="handleOffline(row)"
          >
            下架
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

  <el-dialog v-model="detailVisible" title="简历详情" width="760px">
    <el-descriptions v-if="currentRow" :column="2" border>
      <el-descriptions-item label="标题" :span="2">{{ currentRow.title }}</el-descriptions-item>
      <el-descriptions-item label="用户编号">{{ currentRow.userId }}</el-descriptions-item>
      <el-descriptions-item label="城市">{{ currentRow.cityName }}</el-descriptions-item>
      <el-descriptions-item label="科目">
        <dict-tag :type="DICT_TYPE.TUTOR_SUBJECT" :value="currentRow.subjects" />
      </el-descriptions-item>
      <el-descriptions-item label="授课模式">
        <dict-tag :type="DICT_TYPE.TUTOR_TEACH_MODE" :value="currentRow.teachModes" />
      </el-descriptions-item>
      <el-descriptions-item label="时薪">{{ currentRow.hourlyPrice || '-' }} 元</el-descriptions-item>
      <el-descriptions-item label="服务半径">
        {{ currentRow.serviceRadiusKm ? `${currentRow.serviceRadiusKm} 公里` : '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="试课">
        {{ currentRow.freeTrialEnabled ? `${currentRow.freeTrialMinutes || 0} 分钟` : '不支持' }}
      </el-descriptions-item>
      <el-descriptions-item label="联系方式">
        {{ currentRow.contactMobileMask || '-' }} / {{ currentRow.contactWechatMask || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="数据">
        评分 {{ currentRow.ratingAvg || 0 }}，评价 {{ currentRow.reviewCount || 0 }}，浏览
        {{ currentRow.viewCount || 0 }}，联系 {{ currentRow.contactViewCount || 0 }}，匹配
        {{ currentRow.matchCount || 0 }}
      </el-descriptions-item>
      <el-descriptions-item label="拒绝原因" :span="2">
        {{ currentRow.rejectReason || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="教学经历" :span="2">
        {{ currentRow.teachingExperience || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="可授课时间" :span="2">
        {{ currentRow.availableTimes || '-' }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>

  <el-dialog v-model="entryDialogVisible" title="录入教师" width="760px">
    <el-form
      ref="entryFormRef"
      :model="entryForm"
      :rules="entryRules"
      label-width="108px"
      v-loading="entryLoading"
    >
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="entryForm.mobile" placeholder="请输入教师手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市" prop="cityCode">
            <el-select
              v-model="entryForm.cityCode"
              placeholder="请选择开通城市"
              filterable
              clearable
              class="!w-100%"
            >
              <el-option
                v-for="city in openedCityList"
                :key="city.code"
                :label="`${city.name} / ${city.code}`"
                :value="city.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="简历标题" prop="title">
        <el-input v-model="entryForm.title" placeholder="例如：985硕士数学老师" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="科目" prop="subjects">
            <el-select
              v-model="entryForm.subjects"
              multiple
              filterable
              placeholder="请选择科目"
              class="!w-100%"
            >
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.TUTOR_SUBJECT)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授课模式" prop="teachModes">
            <el-select
              v-model="entryForm.teachModes"
              multiple
              placeholder="请选择授课模式"
              class="!w-100%"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.TUTOR_TEACH_MODE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="时薪" prop="hourlyPrice">
            <el-input-number
              v-model="entryForm.hourlyPrice"
              :min="0"
              :max="99999"
              class="!w-100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务半径" prop="serviceRadiusKm">
            <el-input-number
              v-model="entryForm.serviceRadiusKm"
              :min="0"
              :max="200"
              class="!w-100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="最高学历" prop="educationLevel">
            <el-input v-model="entryForm.educationLevel" placeholder="例如：硕士" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教龄" prop="teachingYears">
            <el-input-number
              v-model="entryForm.teachingYears"
              :min="0"
              :max="80"
              class="!w-100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="学校" prop="schoolName">
            <el-input v-model="entryForm.schoolName" placeholder="例如：浙江大学" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专业" prop="major">
            <el-input v-model="entryForm.major" placeholder="例如：数学" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="教师资格证" prop="hasTeacherCertificate">
            <el-switch
              v-model="entryForm.hasTeacherCertificate"
              active-text="有"
              inactive-text="无"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支持试课" prop="freeTrialEnabled">
            <el-switch
              v-model="entryForm.freeTrialEnabled"
              active-text="支持"
              inactive-text="不支持"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="entryForm.freeTrialEnabled" label="试课时长" prop="freeTrialMinutes">
        <el-input-number
          v-model="entryForm.freeTrialMinutes"
          :min="0"
          :max="240"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="教学介绍" prop="intro">
        <el-input
          v-model="entryForm.intro"
          type="textarea"
          :rows="4"
          maxlength="1000"
          show-word-limit
          placeholder="请输入教学经验、教学风格和优势"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="entryDialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="entryLoading" @click="submitTeacherEntry">
        确认录入
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="TutorResume">
import { ElMessageBox, type FormRules } from 'element-plus'
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as ResumeApi from '@/api/tutor/resume'
import * as CityApi from '@/api/tutor/city'

const enum AuditStatus {
  WAITING = 10,
  APPROVED = 20,
  REJECTED = 30
}

const enum PublishStatus {
  OFFLINE = 40
}

const message = useMessage()
const loading = ref(true)
const total = ref(0)
const list = ref<ResumeApi.TutorTeacherResumeVO[]>([])
const queryFormRef = ref()
const detailVisible = ref(false)
const currentRow = ref<ResumeApi.TutorTeacherResumeVO>()
const entryDialogVisible = ref(false)
const entryLoading = ref(false)
const entryFormRef = ref()
const cityList = ref<CityApi.TutorCityVO[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: undefined,
  title: undefined,
  cityCode: undefined,
  subject: undefined,
  teachMode: undefined,
  freeTrialEnabled: undefined,
  status: undefined,
  auditStatus: undefined
})
const entryForm = reactive({
  mobile: '',
  title: '',
  cityCode: undefined as string | undefined,
  subjects: [] as string[],
  teachModes: [] as number[],
  hourlyPrice: undefined as number | undefined,
  educationLevel: '',
  schoolName: '',
  major: '',
  hasTeacherCertificate: false,
  serviceRadiusKm: 10,
  freeTrialEnabled: false,
  freeTrialMinutes: undefined as number | undefined,
  teachingYears: undefined as number | undefined,
  intro: ''
})
const entryRules: FormRules = {
  mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '简历标题不能为空', trigger: 'blur' }],
  cityCode: [{ required: true, message: '请选择城市', trigger: 'change' }],
  subjects: [{ type: 'array', required: true, min: 1, message: '请选择科目', trigger: 'change' }],
  teachModes: [
    { type: 'array', required: true, min: 1, message: '请选择授课模式', trigger: 'change' }
  ],
  hourlyPrice: [{ required: true, message: '时薪不能为空', trigger: 'blur' }],
  educationLevel: [{ required: true, message: '最高学历不能为空', trigger: 'blur' }],
  serviceRadiusKm: [{ required: true, message: '服务半径不能为空', trigger: 'blur' }],
  freeTrialMinutes: [
    {
      validator: (_rule, value, callback) => {
        if (entryForm.freeTrialEnabled && (value === undefined || value === null)) {
          callback(new Error('试课时长不能为空'))
          return
        }
        callback()
      },
      trigger: 'blur'
    }
  ],
  intro: [{ required: true, message: '教学介绍不能为空', trigger: 'blur' }]
}

const openedCityList = computed(() => cityList.value.filter((city) => city.opened))

const getList = async () => {
  loading.value = true
  try {
    const data = await ResumeApi.getTutorResumePage(queryParams)
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

const openDetail = (row: ResumeApi.TutorTeacherResumeVO) => {
  currentRow.value = row
  detailVisible.value = true
}

const resetEntryForm = () => {
  entryForm.mobile = ''
  entryForm.title = ''
  entryForm.cityCode = undefined
  entryForm.subjects = []
  entryForm.teachModes = []
  entryForm.hourlyPrice = undefined
  entryForm.educationLevel = ''
  entryForm.schoolName = ''
  entryForm.major = ''
  entryForm.hasTeacherCertificate = false
  entryForm.serviceRadiusKm = 10
  entryForm.freeTrialEnabled = false
  entryForm.freeTrialMinutes = undefined
  entryForm.teachingYears = undefined
  entryForm.intro = ''
  entryFormRef.value?.clearValidate()
}

const openEntryDialog = async () => {
  resetEntryForm()
  entryDialogVisible.value = true
  if (!cityList.value.length) {
    cityList.value = await CityApi.getTutorCityList()
  }
}

const submitTeacherEntry = async () => {
  await entryFormRef.value.validate()
  const payload: ResumeApi.TutorTeacherEntryReqVO = {
    mobile: entryForm.mobile,
    title: entryForm.title,
    cityCode: entryForm.cityCode!,
    subjects: entryForm.subjects.join(','),
    teachModes: entryForm.teachModes.join(','),
    hourlyPrice: entryForm.hourlyPrice!,
    educationLevel: entryForm.educationLevel,
    schoolName: entryForm.schoolName || undefined,
    major: entryForm.major || undefined,
    hasTeacherCertificate: entryForm.hasTeacherCertificate,
    serviceRadiusKm: entryForm.serviceRadiusKm,
    freeTrialEnabled: entryForm.freeTrialEnabled,
    freeTrialMinutes: entryForm.freeTrialEnabled ? entryForm.freeTrialMinutes : undefined,
    teachingYears: entryForm.teachingYears,
    intro: entryForm.intro
  }
  entryLoading.value = true
  try {
    await ResumeApi.createTutorTeacherEntry(payload)
    message.success('教师录入成功')
    entryDialogVisible.value = false
    await getList()
  } finally {
    entryLoading.value = false
  }
}

const handleAudit = async (row: ResumeApi.TutorTeacherResumeVO, auditStatus: AuditStatus) => {
  const isReject = auditStatus === AuditStatus.REJECTED
  let rejectReason = ''
  if (isReject) {
    const { value } = await ElMessageBox.prompt('请输入拒绝原因', '拒绝简历', {
      confirmButtonText: '确认拒绝',
      cancelButtonText: '取消',
      inputPattern: /\S+/,
      inputErrorMessage: '拒绝原因不能为空'
    })
    rejectReason = value
  } else {
    await message.confirm(`确认通过「${row.title}」吗？`)
  }
  await ResumeApi.auditTutorResume({ id: row.id, auditStatus, rejectReason })
  message.success('审核成功')
  await getList()
}

const handleOffline = async (row: ResumeApi.TutorTeacherResumeVO) => {
  await message.confirm(`确认下架「${row.title}」吗？`)
  await ResumeApi.offlineTutorResume(row.id)
  message.success('下架成功')
  await getList()
}

onMounted(() => {
  getList()
})
</script>
