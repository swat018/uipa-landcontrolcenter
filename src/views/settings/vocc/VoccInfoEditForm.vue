<template>
  <div class="mt-8">
    <v-form @submit.prevent>
      <div class="mt-2 mb-1">선사명</div>
      <i-input label="선사명" type="text" v-model="editForm.nameKor" placeholder="선사명을 입력하여 주십시오" :readonly="isReadonly">
      </i-input>
      <div class="mt-2 mb-1">소재지</div>
      <i-input label="소재지" type="text" v-model="editForm.address" placeholder="소재지를 입력하여 주십시오" :readonly="isReadonly">
      </i-input>
      <div class="mt-2 mb-1">대표이사</div>
      <i-input label="대표이사" type="text" v-model="editForm.ceoName" placeholder="대표이사명을 입력하여 주십시오"
        :readonly="isReadonly">
      </i-input>
      <div class="d-flex justify-space-between align-center my-4">
        <div>선사 로고</div>
        <i-btn text="로고 업로드" @click="uploadBtnClick"></i-btn>
        <input ref="logoFileUploader" class="d-none" type="file" @change="previewFile" />
      </div>

      <v-img :src="preview" height="150" aspect-ratio="16/9" position="center" contain></v-img>
      <i-btn v-if="role != 'ROLE_VOCC_USER'" @click="editVoccInfo" class="w-100 mt-10" text="수정" :color="changeColor"
        :disabled="isDisabled"></i-btn>
    </v-form>
  </div>
</template>

<script setup>
import { onMounted, watch, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useVoccStore } from '@/stores/voccStore.js'
import { useAuthStore } from '../../../stores/authStore'
import _ from 'lodash'

const voccStore = useVoccStore()
const { voccInfo } = storeToRefs(voccStore)

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)

import { useToast } from '@/composables/useToast'
const { showResMsg } = useToast()

const editForm = ref({
  nameKor: '', // 선사명
  nameEng: '',
  address: '',
  ceoName: '',
  logoImage : []
})

const isReadonly = ref(false)

let role = ''

const preview = ref([])

onMounted(() => {
  fetchVoccInformation()
  role = userInfo.value.role
  if (role === 'ROLE_VOCC_USER') {
    isReadonly.value = true;
  }
})

watch(editForm, (newValue, oldValue) => {
  if (!_.isEqual(newValue, voccInfo.value)) {
    isDisabled.value = false
  } else {
    isDisabled.value = true
  }
}, { deep: true });

const isDisabled = ref(true)

const changeColor = computed(() => {
  return isDisabled.value ? '#7A8294' : '#5789FE'
})


const editVoccInfo = async () => {
  console.dir(editForm.value)
  const voccId = voccInfo.value.id
  const response = await voccStore.editVoccInfo(voccId, editForm.value)

  console.log(response)
  if (response == 200) {
    isDisabled.value = true;

    let reader = new FileReader()
    let convertedImage = ''

    if (logoImagefile.value) {
      reader.onload = async (e) => {
        convertedImage = reader.result;
        const result = await new Uint8Array(convertedImage)
        
        const response = await voccStore.changeLogoImage(result)

        console.dir(response)

        if (response == 200){
          showResMsg('선사 정보가 업데이트 되었습니다')
        }
      }
      reader.readAsArrayBuffer(logoImagefile.value)
    }
  }
}

const fetchVoccInformation = async () => {
  await voccStore.fetchVoccInfo()
  editForm.value = { ...voccStore.voccInfo }
  editForm.value.logoImage = `data:image/png;base64,${editForm.value.logoImage}`
  preview.value = `${editForm.value.logoImage}`
}


const logoFileUploader = ref()
const uploadBtnClick = () => {
  logoFileUploader.value.click()
}

const logoImagefile = ref([])
const previewFile = (e) => {
  logoImagefile.value = e.target.files[0]
  let reader = new FileReader()

  if (logoImagefile.value !== null){
    reader.onload = (e) => {
      preview.value = reader.result;
      editForm.value.logoImage = reader.result
    }
    reader.readAsDataURL(logoImagefile.value)
  }else{
    preview.value = ''
  }
}

</script>

<style></style>
