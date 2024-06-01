<template>
  <!-- <div class="detail-page container-height"> -->
  <v-sheet class="py-3 rounded-lg detail-page tabs-inner-content-container">
    <v-sheet class="px-3 py-3 mb-3 rounded-lg" color="#333334">
      <div class="d-flex justify-space-between align-center">
        <!-- <div class="align-center">Equipment</div> -->
        <div class="d-flex ga-2 w-25">
          <v-autocomplete
            v-model="selectedDeck"
            :items="decks"
            item-title="deckName"
            item-value="deckName"
            variant="solo-filled"
            density="compact"
            class="equipmentSelector"
            bg-color="#434348"
            :hide-details="true"
            placeholder="Deck를 선택해주세요"
            return-object
            @update:modelValue="filterByAlarmStatus"
          ></v-autocomplete>

          <i-selectbox
            v-model="selectedSensorType"
            :items="sensorTypes"
            item-title="title"
            item-value="value"
            variant="solo-filled"
            density="compact"
            class="equipmentSelector"
            bg-color="#434348"
            placeholder="SensorType을 선택해주세요"
            return-object
            @update:modelValue="filterByAlarmStatus"
            :hide-details="true"
          ></i-selectbox>

          <i-selectbox
            v-model="selectedAlarmStatus"
            :items="statuses"
            item-title="title"
            item-value="value"
            variant="solo-filled"
            density="compact"
            return-object
            @update:modelValue="filterByAlarmStatus"
            class="equipmentSelector"
            bg-color="#434348"
            placeholder="Status를 선택해주세요"
            :hide-details="true"
          ></i-selectbox>
          <!-- <v-btn icon="mdi-image-outline" @click="displayImage"></v-btn> -->
        </div>
      </div>
    </v-sheet>

    <!-- 선박 이미지 여부에 따른 숨김 처리 필요  -->
    <div
      v-if="isExistDeckImage"
      class="deck-image-container d-flex py-4"
      style="border: 1px solid #5f5f67; background: #000"
    >
      <div class="floor-plan-container w-100" style="position: relative">
        <v-img :src="floorplan" />
        <div class="sensor-container">
          <div class="sensor first danger-animation">
            <div
              style="
                width: 15px;
                height: 15px;
                background: linear-gradient(to bottom, #ff0000, #d72d33);
              "
            ></div>
          </div>
          <div class="sensor second">●</div>
          <div class="sensor third">●</div>
          <div class="sensor fourth danger-animation">
            <div
              style="
                width: 15px;
                height: 15px;
                background: linear-gradient(to bottom, #ff0000, #d72d33);
              "
            ></div>
          </div>
          <div class="sensor fifth danger-animation">
            <div
              style="
                width: 15px;
                height: 15px;
                background: linear-gradient(to bottom, #ff0000, #d72d33);
              "
            ></div>
          </div>
          <div class="sensor sixth">●</div>
          <!-- <div class="sensor seventh">●</div> -->
          <div class="sensor eighth">●</div>
          <div class="sensor ninth">●</div>
        </div>
      </div>
    </div>

    <div class="mt-3">
      <DxDataGrid
        id="fdsMonitoringGrid"
        ref="fdsMonitoringGrid"
        key-expr="id"
        :data-source="sensorsStatusList"
        :class="isExistDeckImage ? 'deck-image-container' : 'full-container'"
        :column-auto-width="true"
        :show-borders="true"
      >
        <DxSelection mode="single"></DxSelection>
        <DxScrolling mode="virtual" />

        <DxColumn data-field="id" :visible="false"></DxColumn>
        <DxColumn
          data-field="deck"
          caption="Deck"
          alignment="center"
          :allow-editing="false"
        ></DxColumn>
        <DxColumn
          data-field="installationLocation"
          caption="Installation Location"
          alignment="center"
          :allow-editing="false"
        />
        <DxColumn
          data-field="sensorType"
          caption="Sensor Type"
          alignment="center"
          :allow-editing="false"
          width="10%"
        />

        <DxColumn
          data-field="status"
          caption="status"
          alignment="center"
          cell-template="alarm-type-template"
          width="10%"
          :allow-editing="false"
        >
        </DxColumn>

        <template #alarm-type-template="{ data: templateOptions }">
          <div class="d-flex justify-center">
            <div class="" :class="getColorByAlarmType(templateOptions.data.status)">●</div>
            <div class="ml-2">{{ getTextByAlarmType(templateOptions.data.status) }}</div>
          </div>
        </template>

        <DxColumn
          data-field="description"
          caption="Description"
          alignment="center"
          width="auto"
          :allow-editing="false"
          cell-template="description-template"
        />

        <template #description-template="{ data: templateOptions }">
          <div class="d-flex">
            <div class="ml-2">{{ getDescriptionByAlarmType(templateOptions.data.status) }}</div>
          </div>
        </template>
      </DxDataGrid>
    </div>
  </v-sheet>
  <!-- </div> -->
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { getDeckList, getFDSMonitoring, getDeckImage } from '@/api/fdsApi'
import { useToast } from '@/composables/useToast'

import { isStausOk } from '@/composables/util'

// import floorplan from '@/assets/images/ship/floorplan/floorPlan2.png'

const { showResMsg } = useToast()

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

let curSelectedShipImoNumber = null

const decks = ref([])
const selectedDeck = ref()

const selectedSensorType = ref()

const selectedAlarmStatus = ref()

const fdsMonitoringGrid = ref()
const fdsMonitoringInstance = ref()
const sensorsStatusList = ref([])

const isExistDeckImage = ref(false)
const floorplan = ref()

const sensorTypes = [
  {
    id: 1,
    title: 'ALL',
    value: ''
  },
  {
    id: 2,
    title: '열 감지기',
    value: 'HEAT'
  },
  {
    id: 3,
    title: '연기 감지기',
    value: 'SMOKE'
  }
]

const statuses = [
  { id: 1, title: 'ALL', value: 'ALL' },
  { id: 2, title: '정상', value: 'NORMAL' },
  { id: 3, title: '신호없음', value: 'NO SIGNAL' },
  { id: 4, title: '경보', value: 'WARNING' }
]

onMounted(() => {
  fdsMonitoringInstance.value = fdsMonitoringGrid.value.instance
  initMonitoring()
})

const displayImage = () => {
  isExistDeckImage.value = !isExistDeckImage.value
}

const initMonitoring = async () => {
  let selectedDeckName = ''
  curSelectedShipImoNumber = curSelectedShip.value.imoNumber
  console.log('imo 변호')
  console.log(curSelectedShipImoNumber)
  if (curSelectedShipImoNumber) {
    await fetchDeckList(curSelectedShipImoNumber)

    console.log('응답')
    console.dir(decks.value)
    selectedDeck.value = decks.value[1].deckName
    selectedSensorType.value = sensorTypes[0]
    selectedAlarmStatus.value = statuses[0]

    console.log(selectedSensorType)

    if (selectedDeck.value != 'ALL') {
      selectedDeckName = selectedDeck.value
    }

    console.log(selectedDeckName)

    const {
      status,
      data: { data }
    } = await getFDSMonitoring(curSelectedShipImoNumber, selectedDeckName)

    console.log('모니터링')
    console.dir(data)

    if (isStausOk(status)) {
      const response = await getDeckImage(curSelectedShipImoNumber, selectedDeckName)

      console.log('센서 이미지')
      console.dir(response)

      let {
        data: {
          data: { deckImage }
        }
      } = response
      // let deckImage = response.data.data.deckImage

      if (deckImage) {
        let deckImageUrl = `data:image/png;base64,${deckImage}`

        isExistDeckImage.value = true
        floorplan.value = deckImageUrl
        console.dir(floorplan.value)
      }
      console.log('성공')
      console.dir(data)
      sensorsStatusList.value = data
      console.dir(sensorsStatusList)
    }
  }
}

const fetchRealTimeMonitoring = () => {
  curSelectedShipImoNumber = curSelectedShip.value.imoNumber
  let selectedDeckName = selectedDeck.value.deckName

  const {
    status,
    data: { data }
  } = getFDSMonitoring(curSelectedShipImoNumber, selectedDeckName)
  if (isStausOk(status)) {
    sensorsStatusList.value = data
  }
}

const fetchDeckList = async (imoNumber) => {
  console.log('번호')
  console.log(imoNumber)
  if (imoNumber) {
    ;({
      data: { data: decks.value }
    } = await getDeckList(imoNumber))

    // Deck 선택하는 옵션에 All이 있는지 확인
    let deckKey = 'deckName'
    let allOptionName = 'ALL'
    let existAllOption = null

    existAllOption = decks.value.some(
      (obj) => obj.hasOwnProperty(deckKey) && obj[deckKey] === allOptionName
    )
    if (!existAllOption) {
      let allOption = { id: 0, deckName: allOptionName }
      decks.value.unshift(allOption)
    }
    console.log('api 응답')
    console.dir(decks.value)
  } else {
    showResMsg('클릭한 선박이 없습니다')
  }
}

const getColorByAlarmType = (alarmType) => {
  let alarmColor = ''
  switch (alarmType) {
    case 'NORMAL':
      alarmColor = 'normal'
      break
    case 'NO SIGNAL':
      alarmColor = 'caution'
      break

    case 'WARNING':
      alarmColor = 'warning'
      break
  }
  return alarmColor
}

const getTextByAlarmType = (alarmType) => {
  let alarmStatus = ''
  switch (alarmType) {
    case 'NORMAL':
      alarmStatus = '정상'
      break
    case 'NO SIGNAL':
      alarmStatus = '신호없음'
      break
    case 'WARNING':
      alarmStatus = '경보'
      break
  }

  return alarmStatus
}

const getDescriptionByAlarmType = (alarmType) => {
  let alarmStatus = ''
  switch (alarmType) {
    case 'NORMAL':
      alarmStatus = '센서가 정상 작동하고 있습니다.'
      break
    case 'NO SIGNAL':
      alarmStatus = '센서가작동하지않거나, 오류를 일으키는 상태입니다'
      break
    case 'WARNING':
      alarmStatus = '화재가 감지 되었습니다'
      break
  }

  return alarmStatus
}

const filterByDeck = () => {
  let selectedDeckName = selectedDeck.value.deckName
  if (selectedDeckName == 'ALL') {
    fdsMonitoringInstance.value.clearFilter()
  } else {
    fdsMonitoringInstance.value.filter((item) => item.deck == selectedDeckName)
  }
}

const filterBySensorType = () => {
  let selectedType = selectedSensorType.value.value

  console.log(selectedType)
  if (selectedType == 'ALL') {
    fdsMonitoringInstance.value.clearFilter()
  } else {
    fdsMonitoringInstance.value.filter((item) => item.sensorType == selectedType)
  }
}

const filterByAlarmStatus = () => {
  let selectedDeckName = selectedDeck.value.deckName
  let selectedType = selectedSensorType.value.value
  let alarmStatus = selectedAlarmStatus.value.value

  console.dir(alarmStatus)

  let filters = []

  // if (selectedDeckName != 'ALL') {
  //   filters.push(['deck', '=', selectedDeckName])
  // }
  // if (selectedType != 'ALL') {
  //   filters.push(['sensorType', '=', selectedType])
  // }

  // if (alarmStatus != 'ALL') {
  //   console.log('alarm Status 필터 시작')
  //   filters.push(['status', '=', alarmStatus])
  // } else {
  //   let index = filters.findIndex((item) => item[0] == 'status')
  //   filters.splice(index, 1)
  // }

  // console.dir(fdsMonitoringInstance)
  // console.dir(fdsMonitoringGrid.value)
  // console.dir(filters)
  // fdsMonitoringInstance.value.filter(filters)

  // if (alarmStatus == 'ALL') {
  //   fdsMonitoringInstance.value.clearFilter('status')
  // }
  // if (selectedType == 'ALL') {
  //   fdsMonitoringInstance.value.clearFilter('sensorType')
  // }
  // if (selectedDeckName == 'ALL') {
  //   fdsMonitoringInstance.value.clearFilter('deck')
  // }
  // fdsMonitoringInstance.value.filter(
  //   (item) =>
  //     item.status == alarmStatus && item.deck == selectedDeckName && item.sensorType == selectedType
  // )
}

watch(curSelectedShip, initMonitoring)
</script>

<style scoped>
/* .normal {
  color: #42D2A7;
  border-color: #42D2A7;
} */

/* .warning {
  color: #FD8100
}

.danger {
  color: #F04A4A;
  border-color: #F04A4A;
} */

.alarm-type {
  font-size: 1.2em;
}

.w-40 {
  width: 40%;
}

.deck-select-container {
  flex: 1 1 0;
}

.image-container {
  flex: 1 1 0;
}

.data-container {
  /* flex : 2 2 0; */
  height: 100%;
}

/* #realAlarmGrid {
  height: 100vh;
  max-height: calc(100vh - (65px + 105px + 16px + 8px* 3));
} */

.sensor {
  font-size: 1.5em;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
}

.sensor.first {
  position: absolute;
  top: 14%;
  left: 35%;
  color: red;
}

.sensor.second {
  position: absolute;
  top: 11%;
  right: 38%;
  color: #13d254;
}

.sensor.third {
  position: absolute;
  bottom: 17%;
  left: 37%;
  color: #fff900;
}

.sensor.fourth {
  position: absolute;
  bottom: 20%;
  right: 42%;
  color: red;
}

.sensor.fifth {
  position: absolute;
  top: 14%;
  right: 42%;
  color: red;
}

.sensor.sixth {
  position: absolute;
  top: 10%;
  left: 48%;
  color: #fff900;
}

.sensor.seventh {
  position: absolute;
  top: 30px;
  left: 547px;
  color: red;
}

.sensor.eighth {
  position: absolute;
  bottom: 17%;
  left: 48%;
  color: #13d254;
}

.sensor.ninth {
  position: absolute;
  bottom: 46%;
  left: 46%;
  color: #13d254;
}

.danger-animation {
  border-radius: 100%;
  overflow: hidden;
  animation: fadein 0.5s;
  animation: pulse 1.5s infinite;
}

@keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeout {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes pulse {
  from {
    box-shadow: 0 0 0 0px rgba(211, 47, 47);
  }

  to {
    box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
  }
}

.deck-image-container {
  height: 100vh;
  /* max-height: calc(
    (100vh - 65px - 24px - 62px - 24px - 24px - 24px - 40px - 24px - 24px - 24px - 24px) * 0.5
  ); */

  max-height: calc(
    (100vh - 65px - 12px - 60px - 12px - 62px - 12px - 40px - 12px - 12px - 12px - 12px) * 0.5
  );
}

.full-container {
  height: 100vh;
  /* max-height: calc(100vh - 65px - 24px - 62px - 24px - 24px - 24px - 40px - 24px - 24px - 24px); */

  max-height: calc(
    (100vh - 65px - 12px - 60px - 12px - 12px - 62px - 12px - 12px - 12px - 40px - 12px - 12px)
  );
}
</style>
