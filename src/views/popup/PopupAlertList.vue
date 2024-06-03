<template>
  <v-sheet class="detail-page ma-3 px-3 popup-container rounded-lg" color="#000000">
    <PopupSelectedShipSummary :curSelectedShipImoNumber="selectedImoNumber" />
    <v-sheet class="mt-3">
      <!-- 엔진, 경보 / 주의, 차트 관련 필터 -->

      <v-sheet class="rounded-lg px-3 py-3 mt-3" color="#333334">
        <div class="d-flex justify-space-between align-center filter-area ga-2">
          <!-- <div class="align-center">Equipment</div> -->
          <div class="d-flex ga-2">
            <i-selectbox
              v-model="selectedEngine"
              :items="shipEngines"
              variant="solo-filled"
              density="compact"
              class="equipment-selector"
              bg-color="#434348"
              :hide-details="true"
              placeholder="Select"
              :persistent-placeholder="true"
            ></i-selectbox>

            <i-selectbox
              v-model="selectedStatus"
              :items="statuses"
              variant="solo-filled"
              density="compact"
              class="status-setting"
              bg-color="#434348"
              placeholder="Status"
              :hide-details="true"
            ></i-selectbox>
          </div>

          <div class="d-flex ga-2">
            <v-sheet class="rounded-lg py-2 px-4 mr-2" color="#212121">
              <div class="d-flex ga-12 justify-end align-center">
                <div class="alarm-count-container d-flex align-center">
                  <div class="alarm-type caution mr-2">●</div>
                  <div>CAUTION</div>
                  <div class="caution alarm-count ml-2">{{ cautionCount }}</div>
                </div>
                <div class="alarm-count-container d-flex align-center">
                  <div class="alarm-type danger mr-2">●</div>
                  <div>WARNING</div>
                  <div class="alarm-count danger ml-2">{{ warningCount }}</div>
                </div>
              </div>
            </v-sheet>
            <div class="d-flex align-center">
              <span class="mr-2">Alert Duration Setting</span>
              <i-selectbox
                v-model="duration"
                :items="durations"
                item-title="name"
                item-value="miniute"
                return-object
                class="duration-setting"
                bg-color="#434348"
                variant="solo-filled"
                density="compact"
                :hide-details="true"
              ></i-selectbox>
            </div>

            <div class="d-flex align-center">
              <span class="mr-2">Chart Interval</span>
              <i-selectbox
                v-model="chartInterval"
                :items="chartIntervals"
                item-title="name"
                item-value="minute"
                return-object
                class="chart-interval"
                variant="solo-filled"
                density="compact"
                bg-color="#434348"
                :hide-details="true"
              ></i-selectbox>
            </div>
          </div>
        </div>
      </v-sheet>
      <!-- 경보 / 주의 수 출력 -->
      <v-sheet class="mt-3 pa-3 rounded-lg popup-content-container" color="#333334">
        <DxDataGrid
          id="popupAlertGrid"
          ref="realAlertGrid"
          class="h-100"
          style="max-height: 100%"
          :column-auto-width="false"
          key-expr="id"
          @row-click="clickAlert"
          :data-source="alarmData"
          :show-borders="true"
        >
          <DxSelection mode="single"></DxSelection>
          <DxScrolling mode="virtual" />
          <DxColumn
            data-field="raisedTime"
            caption="RaisedTime"
            alignment="center"
            :allow-editing="false"
            cell-template="raisedTime-template"
          ></DxColumn>

          <template #raisedTime-template="{ data: templateOptions }">
            <div class="d-flex">
              <div class="ml-2">{{ convertDateTimeType(templateOptions.data.raisedTime) }}</div>
            </div>
          </template>
          <DxColumn
            data-field="status"
            caption="Status"
            alignment="center"
            cell-template="alarm-type-template"
            :allow-editing="false"
          />
          <DxColumn
            data-field="id"
            caption="No"
            alignment="center"
            :visible="false"
            :allow-editing="false"
          ></DxColumn>
          <DxColumn
            data-field="alarmStateType"
            caption="alarmStateType"
            :visible="false"
          ></DxColumn>
          <DxColumn
            data-field="description"
            caption="Description"
            width="20%"
            :allow-editing="false"
          >
          </DxColumn>
          <DxColumn
            data-field="equipNo"
            caption="Equip No"
            alignment="center"
            :allow-editing="false"
          ></DxColumn>
          <DxColumn
            data-field="tagId"
            caption="Tag ID"
            alignment="center"
            :allow-editing="false"
          ></DxColumn>
          <DxColumn
            data-field="caution"
            caption="Caution"
            :visible="true"
            alignment="center"
            :allow-editing="false"
          >
          </DxColumn>
          <DxColumn
            data-field="warning"
            caption="Warning"
            alignment="center"
            :allow-editing="false"
          ></DxColumn>
          <DxColumn
            data-field="value"
            caption="value"
            alignment="center"
            :allow-editing="false"
          ></DxColumn>

          <template #alarm-type-template="{ data: templateOptions }">
            <div class="d-flex">
              <div class="" :class="getColorByAlertType(templateOptions.data.status)">●</div>
              <div class="ml-2">{{ templateOptions.data.status }}</div>
            </div>
          </template>

          <DxMasterDetail :enabled="false" template="detailTemplate"></DxMasterDetail>

          <template #detailTemplate="{ data: alertDetail }">
            <AlertMonitoringDetail
              :template-data="alertDetail"
              :imoNumber="curSelectedShip.imoNumber"
              :chartInterval="chartInterval"
            />
          </template>
        </DxDataGrid>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, watch, onUnmounted } from 'vue'
import AlertList from '@/views/alert/AlertList.vue'
import { storeToRefs } from 'pinia'
import { useTagStore } from '@/stores/tagStore'
import { useAuthStore } from '@/stores/authStore.js'
import { useVoccStore } from '@/stores/voccStore'
import { useFleetStore } from '@/stores/fleetStore'
import { useShipStore } from '@/stores/shipStore'
import { useAlarmStore } from '@/stores/alarmStore'
import { convertDateTimeType, isStatusOk } from '@/composables/util'
import { getCurrentAlarmData } from '@/api/alarmApi.js'
import { v4 } from 'uuid'

import AlertMonitoringDetail from '@/views/alert/AlertMonitoringDetail.vue'
import PopupSelectedShipSummary from '@/components/ship/PopupSelectedShipSummary.vue'

const tagStore = useTagStore()
const authStore = useAuthStore()
const voccStore = useVoccStore()
const fleetStore = useFleetStore()
const shipStore = useShipStore()
const alarmStore = useAlarmStore()

const { userInfo } = storeToRefs(authStore)
const { shipEngines } = storeToRefs(shipStore)
const { tagList } = storeToRefs(tagStore)
const { voccInfo } = storeToRefs(voccStore)
const { fleets } = storeToRefs(fleetStore)
const { realAlarms } = storeToRefs(alarmStore)

const activeStatus = ref(true)
const showFilterRow = ref(true)

const realAlertGrid = ref(null)
const realAlertInstance = ref(null)
let interval = null

const selectedImoNumber = ref('')

/**
 * 필터 옵션
 */
const selectedEngine = ref()
const selectedStatus = ref()
const statuses = ref(['All', 'Caution', 'Warning'])
const duration = ref('')
const durations = ref([
  {
    name: 'No duration',
    minute: 2
  },
  {
    name: '10 min',
    minute: 10
  },
  {
    name: '30 min',
    minute: 30
  },
  {
    name: '1 hour',
    minute: 60
  },
  {
    name: '3 hour',
    minute: 180
  }
])
const chartInterval = ref()
const chartIntervals = ref([
  {
    name: '1 min',
    minute: 1
  },
  {
    name: '3 min',
    minute: 3
  },
  {
    name: '5 min',
    minute: 5
  },
  {
    name: '10 min',
    minute: 10
  },
  {
    name: '30 min',
    minute: 30
  },
  {
    name: '1 hour',
    minute: 60
  }
])

/**
 * 알람 모니터링 데이터
 */
const alarmData = ref([])

let eventSource = ''
onBeforeMount(() => {
  clearInterval(interval)
  interval = null
  // let uuid = crypto.randomUUID()
  let uuid = v4()
  eventSource = new EventSource(`/api/sse/subscribe?subScribeId=${uuid}`)

  eventSource.addEventListener('sse', (e) => {
    recieveImoNumber(e)
  })
})

onMounted(() => {
  if (shipEngines.value) {
    let ShipEngineList = [...shipEngines.value]
    // ShipEngineList.unshift('All')
    shipEngines.value = ShipEngineList
    selectedEngine.value = shipEngines.value[0]
  }

  let url = new URLSearchParams(location.search)
  let imoNumber = url.get('imoNumber')
  selectedImoNumber.value = imoNumber
  duration.value = durations.value[0]
  chartInterval.value = chartIntervals.value[0]
  selectedStatus.value = statuses.value[0]

  console.log('imoNumber', imoNumber)
  fetchAlertMonitoring()

  realAlertInstance.value = realAlertGrid.value.instance
})

onUnmounted(() => {
  eventSource.close()
})

const recieveImoNumber = (e) => {
  console.log('구독 이벤트')
  console.dir(e)
  let curSelectedShipImoNumber = null
  const result = JSON.parse(e.data)
  alarmData.value = []
  if (result.sseReturnCode == 'CHANGED_SHIP') {
    console.log('선박 변경')
    console.dir(e)
    curSelectedShipImoNumber = result.msg
    console.log(e.msg)
    console.log(result.msg)
    if (result.msg) {
      selectedImoNumber.value = result.msg
      fetchAlertMonitoring(curSelectedShipImoNumber)
    }
  }
}

const fetchAlertMonitoring = async () => {
  console.log('알람 패치')
  const imoNumber = selectedImoNumber.value
  if (imoNumber) {
    let requestForm = {
      imoNumber: imoNumber,
      alertDurationMinute: duration.value.minute
    }

    console.log('요청폼')
    console.dir(requestForm)
    const {
      status,
      data: { data }
    } = await getCurrentAlarmData(requestForm)

    if (isStatusOk(status)) {
      alarmData.value = data
      alarmDataCount()
    }
  }
}

const getColorByAlertType = (alarmType) => {
  let alarmColor = ''
  switch (alarmType) {
    case 'Caution':
      alarmColor = 'caution'
      break
    case 'Warning':
      alarmColor = 'warning'
      break
  }

  return alarmColor
}

const cautionCount = ref()
const warningCount = ref()
const alarmDataCount = () => {
  // warningCount.value = alarmData.value.filter((alarm) => alarm.status == 'Warning').length
  // cautionCount.value = alarmData.value.filter((alarm) => alarm.status == 'Caution').length
  let test = realAlertInstance.value.filter((alarm) => alarm.status == 'Warning')
  let test1 = realAlertInstance.value.filter((alarm) => alarm.status == 'Caution')

  console.log('test')
  console.dir(test)

  console.log('test1')
  console.dir(test1)
}

const filterAlarmStatus = () => {
  if (selectedStatus.value == 'All') {
    realAlertInstance.value.clearFilter()
  } else {
    realAlertInstance.value.filter((item) => item.status == selectedStatus.value)
  }

  alarmDataCount()
}

const filterEngineType = () => {
  if (selectedEngine.value == 'All') {
    realAlertInstance.value.clearFilter()
  } else {
    realAlertInstance.value.filter((item) => item.equipNo == selectedEngine.value)
  }
  alarmDataCount()
}

const clickAlert = (e) => {
  const isExpanded = e.component.isRowExpanded(e.key)

  if (e.rowType == 'detail') return

  if (isExpanded) {
    e.component.collapseRow(e.key)
  } else {
    e.component.collapseAll(-1)
    e.component.expandRow(e.key)
  }
}
watch(duration, fetchAlertMonitoring)
watch(selectedStatus, filterAlarmStatus)
watch(selectedEngine, filterEngineType)
</script>

<style lang="scss" scoped>
.popup-container {
  height: 100vh;
  max-height: calc(100vh - 48px);
}

.popup-content-container {
  height: 100vh;
  max-height: calc(100vh - 60px - 68px - 48px);
}
</style>
>
