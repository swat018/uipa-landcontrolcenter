<template>
  <v-sheet class="settings-container d-flex flex-column ga-4 align-center rounded-lg ma-6 pa-6">
    <div class="d-flex justify-start text-left w-50 page-title">시스템 설정</div>
    <v-sheet class="d-flex flex-column rounded-lg w-50 pa-6 ga-4" color="#333334">
      <div class="setting-title mb-4">데이터 설정</div>
      <!-- <div class="d-flex justify-space-between ga-2">
        <div class="refresh-time-area d-flex justify-space-between align-center flex-grow-1">
          <div class="mr-4">데이터 갱신 시간</div>
          <div class="d-flex ga-4 align-center"><i-input></i-input> <span>분</span></div>
        </div>
        <div class="delete-time-area d-flex justify-space-between align-center flex-grow-1">
          <div class="mr-4">CCTV 삭제 주기</div>
          <div class="d-flex ga-4 align-center"><i-input></i-input><span>일</span></div>
        </div>
      </div> -->
      <v-row>
        <v-col
          ><div class="refresh-time-area d-flex justify-space-between align-center flex-grow-1">
            <div class="mr-4">데이터 갱신 시간</div>
            <div class="d-flex ga-4 align-center">
              <i-input @input="inputHandle('data')" v-model="dataInterval.valueInt"></i-input>
              <span>분</span>
            </div>
          </div></v-col
        >
        <v-col>
          <div class="delete-time-area d-flex justify-space-between align-center flex-grow-1">
            <div class="mr-4">CCTV 삭제 주기</div>
            <div class="d-flex ga-4 align-center">
              <i-input @input="inputHandle('cctv')" v-model="cctvInterval.valueInt"></i-input
              ><span>일</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>

    <v-sheet class="rounded-lg w-50 pa-6 ga-4" color="#333334">
      <div class="setting-title mb-4">월드맵 설정</div>
      <div>
        <div>팝업창 투명도</div>
        <div>
          <v-slider
            class="opacity-slider"
            v-model="popupOpacity.valueInt"
            :ticks="tickLabels"
            show-ticks="always"
            step="20"
            tick-size="5"
            @mouseup="inputHandle('opacity')"
          ></v-slider>
        </div>
      </div>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminStore } from '@/stores/adminStore'
const adminStore = useAdminStore()

const { dataInterval, cctvInterval, popupOpacity } = storeToRefs(adminStore)
const tickLabels = ref([0, 20, 40, 60, 80, 100])

let timer = null

onMounted(() => {
  fetchSettings()
})

const inputHandle = (type) => {
  if (timer) {
    clearInterval(timer)
  }
  timer = setTimeout(editSettingInformation, 800, type)
}

const fetchSettings = () => {
  fetchCCTVSetting()
  fetchDataSetting()
  fetchPopupOpacitySetting()
}

const fetchCCTVSetting = async () => {
  await adminStore.fetchCCTVSetting()
}

const fetchDataSetting = async () => {
  await adminStore.fetchDataSetting()
}

const fetchPopupOpacitySetting = async () => {
  await adminStore.fetchPopupOpacitySetting()
}
const editSettingInformation = async (type) => {
  let requestForm = null

  switch (type) {
    case 'cctv':
      requestForm = cctvInterval.value
      break
    case 'data':
      requestForm = dataInterval.value
      break
    case 'opacity':
      requestForm = popupOpacity.value
      break
  }

  await adminStore.editSettingInformation(requestForm)
}
</script>

<style scoped>
.settings-container {
  height: 100vh;
  max-height: calc(100vh - 65px - 24px - 24px);
}

.setting-title {
  font-size: 1.2rem;
}

.page-title {
  font-size: 1.3rem;
  line-height: 1;
}
</style>
