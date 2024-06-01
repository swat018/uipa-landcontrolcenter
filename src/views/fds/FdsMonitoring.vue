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
            @update:modelValue="filterByDeckName"
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
    <v-sheet
      v-if="isExistDeckImage"
      class="deck-image-container d-flex justify-center py-4"
      style="border: 1px solid #5f5f67; background: #000"
    >
      <v-sheet class="image-container w-50" v-if="floorplan" style="position: relative">
        <v-img :src="floorplan" class="deck-image w-100 h-100" />
        <div
          v-for="icon in icons"
          :key="icon.id"
          class="icon"
          :style="{ top: `${icon.posY}%`, left: `${icon.posX}%` }"
          :data-id="icon.id"
        >
          <div class="sensor-icon" :class="getIconColorByAlarmType(icon.status)" />
        </div>
      </v-sheet>

      <!-- <div class="floor-plan-container image-container w-100" style="position: relative">
        <v-img :src="floorplan" width="796" height="300" />
        <div
          v-for="icon in icons"
          :key="icon.id"
          class="icon"
          :style="{ top: `${icon.posY}%`, left: `${icon.posX}%` }"
        >
          <div
            class="sensor-icon"
            :class="{
              [getColorByAlarmType(icon.status)]: true,
              'danger-animation': icon.status == 'WARNING'
            }"
          >
            ●
          </div>
        </div>
      </div> -->
    </v-sheet>

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
const icons = ref([])

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

let originData = null
const initMonitoring = async () => {
  let selectedDeckName = ''
  curSelectedShipImoNumber = curSelectedShip.value.imoNumber
  floorplan.value = null

  if (curSelectedShipImoNumber) {
    await fetchDeckList(curSelectedShipImoNumber)

    if (decks.value.length <= 0) {
      return
    }
    selectedDeck.value = decks.value[0]

    selectedSensorType.value = sensorTypes[0]
    selectedAlarmStatus.value = statuses[0]

    if (selectedDeck.value.deckName != 'ALL') {
      selectedDeckName = selectedDeck.value.deckName
    } else {
      selectedDeckName = ''
      console.dir(selectedDeckName)
    }

    const {
      status,
      data: { data }
    } = await getFDSMonitoring(curSelectedShipImoNumber, selectedDeckName)

    icons.value = data
    originData = data

    if (isStausOk(status)) {
      if (selectedDeckName) {
        const response = await getDeckImage(curSelectedShipImoNumber, selectedDeckName)
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
        }
      }

      sensorsStatusList.value = data
    }
  }
}

const filterByDeckName = async () => {
  let selectedDeckName = selectedDeck.value.deckName
  curSelectedShipImoNumber = curSelectedShip.value.imoNumber

  if (selectedDeckName == 'ALL') {
    console.log('All')
    sensorsStatusList.value = originData
    return
  }

  const {
    status,
    data: { data }
  } = await getFDSMonitoring(curSelectedShipImoNumber, selectedDeckName)

  icons.value = data

  if (isStausOk(status)) {
    if (selectedDeckName) {
      const response = await getDeckImage(curSelectedShipImoNumber, selectedDeckName)
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
      }
    } else if (selectedDeckName == 'ALL') {
      floorplan.value = null
    }

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

    if (decks.value.length != 0) {
      existAllOption = decks.value.some(
        (obj) => obj.hasOwnProperty(deckKey) && obj[deckKey] === allOptionName
      )
      if (!existAllOption) {
        let allOption = { id: 0, deckName: allOptionName }
        decks.value.unshift(allOption)
      }
      console.log('api 응답')
      console.dir(decks.value)
    }
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

const getIconColorByAlarmType = (alarmType) => {
  let alarmColor = ''
  switch (alarmType) {
    case 'NORMAL':
      alarmColor = 'normal'
      break
    case 'NO SIGNAL':
      alarmColor = 'caution'
      break
    case 'Caution':
      alarmColor = 'caution'
      break
    case 'WARNING':
      alarmColor = 'warning'
      alarmColor += ' danger-animation'
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
  const obj = {
    deck: selectedDeck.value.deckName,
    sensorType: selectedSensorType.value.value,
    status: selectedAlarmStatus.value.value
  }

  const filters = Object.keys(obj)
    .filter((el) => obj[el] !== 'ALL' && obj[el] !== '')
    .map((sub) => [sub, '=', obj[sub]])

  if (filters.length != 0) {
    fdsMonitoringInstance.value.filter(filters)
  } else if (filters.length == 0) {
    fdsMonitoringInstance.value.clearFilter()
  }

  console.log(filters)
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

/* .image-container {
  flex: 1 1 0;
} */

.data-container {
  /* flex : 2 2 0; */
  height: 100%;
}

/* #realAlarmGrid {
  height: 100vh;
  max-height: calc(100vh - (65px + 105px + 16px + 8px* 3));
} */

.sensor-icon {
  font-size: 1.5em;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
  width: 15px;
  height: 15px;
}
.sensor-icon.warning {
  background: linear-gradient(rgb(255, 0, 0), rgb(215, 45, 51));
}

.danger-animation {
  border-radius: 100%;
  overflow: hidden;
  animation: fadein 0.5s;
  animation: pulse 1.5s infinite;
}

.image-container {
  position: relative;
}
.icon {
  position: absolute;
  cursor: pointer;
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
  /* 
  max-height: calc(
    (100vh - 65px - 12px - 60px - 12px - 62px - 12px - 40px - 12px - 12px - 12px - 12px) * 0.5
  ); */
  min-height: 300px;
  max-height: 300px;
}

.full-container {
  height: 100vh;
  /* max-height: calc(100vh - 65px - 24px - 62px - 24px - 24px - 24px - 40px - 24px - 24px - 24px); */

  max-height: calc(
    (100vh - 65px - 12px - 60px - 12px - 12px - 62px - 12px - 12px - 12px - 40px - 12px - 12px)
  );
}

.image-container > .icon {
  top: 0%;
  left: 0%;
  /* transform: translate(-50%, -50%) */
}
/* .icon {
  position: absolute;
  cursor: pointer;
} */
.sensor-icon {
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
  border-radius: 50%;

  width: 15px;
  height: 15px;
}

.sensor-icon.warning {
  background: #ff0000;
  border-color: #ff0000;
}

.sensor-icon.normal {
  background: #13d254;
  border-color: #13d254;
}

.sensor-icon.caution {
  background: #fff900;
  border-color: #fff900;
}
</style>
