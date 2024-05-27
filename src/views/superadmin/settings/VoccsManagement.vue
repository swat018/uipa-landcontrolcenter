<template>
  <v-container fluid class="h-100 management-page detail-page">
    <v-row class="ma-0 h-100">
      <v-col cols="5">
        <v-row>
          <v-col cols="6">
            <v-card class="h-100" rounded="30">
              <v-card-title>
                <div class="d-flex justify-space-between align-center">
                  <div>선사목록</div>
                  <div>
                  </div>
                </div>
              </v-card-title>
              <v-card-text>
                <!-- 권한 그룹 목록 -->
                <DxDataGrid id="grid" :data-source="voccs" key-expr="id" :show-borders="true"
                  :on-focused-cell-changed="changeVoccId" :selected-row-keys="selectedVoccKey"
                  class="title-container no-stripe">
                  <DxColumn data-field="id" :visible="false"></DxColumn>
                  <DxColumn data-field="name" caption="선사명" :allow-editing="false"></DxColumn>
                  <DxSelection mode="single" />
                  <DxScrolling mode="virtual" />
                </DxDataGrid>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="h-100" rounded="30">
              <v-card-title class="d-flex justify-space-between align-center">
                <div>선사기초정보</div>
              </v-card-title>
              <v-card-text class="title-container">
                <v-form @submit.prevent>
                  <div class="mb-1">선사명</div>
                  <i-input label="선사명" type="text" v-model="editForm.name" placeholder="선사명을 입력하여 주십시오">
                  </i-input>
                  <div class="mt-4 mb-1">소재지</div>
                  <i-input label="소재지" type="text" v-model="editForm.address" placeholder="소재지를 입력하여 주십시오">
                  </i-input>
                  <div class="mt-4 mb-1">대표이사</div>
                  <i-input label="대표이사" type="text" v-model="editForm.ceoName" placeholder="대표이사명을 입력하여 주십시오">
                  </i-input>
                  <div class="d-flex justify-space-between align-center my-4">
                    <div>선사 로고</div>
                    <i-btn text="로고 업로드" @click="uploadBtnClick"></i-btn>
                    <input ref="logoFileUploader" class="d-none" type="file" @change="previewFile" />
                  </div>
                  <div class="gray-border">
                    <v-img :src="preview" height="150" aspect-ratio="16/9" position="center" contain></v-img>
                  </div>
                  <div class="mt-6">
                    <i-btn @click="editVoccInfo" class="w-100" text="수정"></i-btn>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>


      <v-col cols="7">
        <v-sheet class="px-3 h-100 rounded-lg">
          <v-tabs v-model="tab" color="#5789FE" align-tabs="left">
            <v-tab :value="tabItem[0]">선박 관리</v-tab>
            <v-tab :value="tabItem[1]">선단 관리</v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item :value="tabItem[0]">
              <VoccsShipManagement :voccId="selectedVoccId" />
            </v-window-item>
            <v-window-item :value="tabItem[1]">
              <VoccsFleetManagement :voccId="selectedVoccId" />
            </v-window-item>
          </v-window>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import VoccInfoEditForm from '@/views/settings/vocc/VoccInfoEditForm.vue';
import VoccsShipManagement from '@/views/superadmin/settings/ships/VoccsShipManagement.vue';
import VoccsFleetManagement from '@/views/superadmin/settings/fleets/VoccsFleetManagement.vue';

import { useVoccStore } from '@/stores/voccStore.js'
const voccStore = useVoccStore()

import { useAdminStore } from '@/stores/adminStore.js'
const adminStore = useAdminStore()
import { useToast } from '@/composables/useToast'
const { showResMsg } = useToast()


const voccs = ref()
const _voccId = ref()

const tab = ref('ship')

const tabItem = ref([
  'ship', 'vocc'
])

const selectedVoccKey = ref([])

const editForm = ref({
  nameKor: '', // 선사명
  nameEng: '',
  address: '',
  ceoName: '',
  logoImage: []
})

const preview = ref([])
const selectedVoccId = ref()
const logoFileUploader = ref()

onMounted(() => {
  fetchVoccs()
})

/**
 * 선사 목록 조회
 */
const fetchVoccs = async () => {
  const result = await voccStore.fetchVoccs()
  console.dir(result)
  voccs.value = result;

  console.log('선사 목록 조회')
  initSelectedKey()
  fetchVoccInformation()
}

const initSelectedKey = () => {
  console.dir(voccs.value[0])
  selectedVoccId.value = voccs.value[0].id
  selectedVoccKey.value = [voccs.value[0].id]
  console.log('키 초기화 ' + selectedVoccKey.value)
}

const changeVoccId = (e) => {
  console.log('아이디 변경')
  console.dir(e)
  if (e.row) {
    selectedVoccId.value = e.row.key
    selectedVoccKey.value = [e.row.key]
    fetchVoccInformation()
  }
}


const fetchVoccInformation = async () => {
  console.log('선사 정보 조회')
  let voccId = selectedVoccId.value
  console.log('vocc Id ' + voccId)
  const response = await adminStore.fetchVoccInfoByVoccId(voccId)
  editForm.value = { ...response }
  editForm.value.logoImage = `data:image/png;base64,${editForm.value.logoImage}`
  preview.value = `${editForm.value.logoImage}`
}


const editVoccInfo = async () => {
  console.dir(editForm.value)
  const voccId = Number(selectedVoccKey.value.toString())
  const response = await adminStore.editVoccInfo(voccId, editForm.value)

  if (response == 200) {

    let reader = new FileReader()
    let convertedImage = ''

    if (logoImagefile.value) {
      reader.onload = async (e) => {
        convertedImage = reader.result;
        const result = await new Uint8Array(convertedImage)

        const response = await voccStore.changeLogoImage(result)

        console.dir(response)

        if (response == 200) {
          showResMsg('선사 정보가 업데이트 되었습니다')
        }
      }
      reader.readAsArrayBuffer(logoImagefile.value)
    }
  }
}



const uploadBtnClick = () => {
  logoFileUploader.value.click()
}

const logoImagefile = ref([])
const previewFile = (e) => {
  logoImagefile.value = e.target.files[0]
  let reader = new FileReader()

  if (logoImagefile.value !== null) {
    reader.onload = (e) => {
      preview.value = reader.result;
      editForm.value.logoImage = reader.result
    }
    reader.readAsDataURL(logoImagefile.value)
  } else {
    preview.value = ''
  }
}


watch(selectedVoccKey.value, fetchVoccInformation)

</script>

<style></style>