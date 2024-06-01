<template>
  <v-sheet class="detail-page tabs-inner-content-container">
    <!-- 날짜 필터 -->
    <v-sheet class="px-3 py-3 rounded-lg mt-3" color="#333334">
      <div class="d-flex justify-space-between align-center">
        <!-- <div class="align-center">Equipment</div> -->
        <div class="d-flex ga-2">
          <input class="noticeList-datePicker" type="datetime-local" v-model="startDate" />
          <input
            class="noticeList-datePicker"
            type="datetime-local"
            v-model="endDate"
            :min="startDate"
          />
          <i-selectbox
            v-model="selectedEngine"
            :items="shipEngines"
            item-title="name"
            item-value="id"
            variant="solo-filled"
            density="compact"
            return-object
            class="equipmentSelector"
            bg-color="#434348"
            :hide-details="true"
          ></i-selectbox>

          <i-selectbox
            v-model="selectedStatus"
            :items="statuses"
            item-title="name"
            item-value="id"
            variant="solo-filled"
            density="compact"
            return-object
            class="equipmentSelector"
            bg-color="#434348"
            :hide-details="true"
          ></i-selectbox>
          <i-btn @click="fetchAlarmHistory" text="조회"></i-btn>
          <i-btn
            text="항차조회"
            @click="openVoyagesPopup()"
            :imoNumber="curSelectedShip.imoNumber"
            color="#3D3D40"
          ></i-btn>
        </div>

        <!-- <div class="d-flex ga-2">
          <div class="d-flex align-center">
            <span class="mr-6" style="font-size: 1rem">Chart Interval</span>
            <i-selectbox
              v-model="chartInterval[0]"
              :items="chartInterval"
              item-title="name"
              item-value="id"
              variant="solo-filled"
              density="compact"
              return-object
              class="equipmentSelector"
              bg-color="#434348"
              :hide-details="true"
            ></i-selectbox>
          </div>
        </div> -->
      </div>
    </v-sheet>
    <v-sheet class="mt-3 pa-3 rounded-lg tabs-exclude-filter-container" color="#333334">
      <DxDataGrid
        id="alarmHistoryGrid"
        ref="alarmHistoryGrid"
        class="h-100"
        style="max-height: 100%"
        :column-auto-width="false"
        key-expr="id"
        @row-click="clickAlarm"
        :data-source="alarmHistory"
        :show-borders="true"
      >
        <DxSelection mode="single"></DxSelection>
        <DxScrolling mode="virtual" />
        <DxColumn
          data-field="id"
          caption="No"
          alignment="center"
          :visible="false"
          :allow-editing="false"
        ></DxColumn>
        <DxColumn
          data-field="raisedTime"
          caption="RalsedTime"
          alignment="center"
          :allow-editing="false"
          cell-template="raisedTime-template"
        />
        <template #raisedTime-template="{ data: templateOptions }">
          <div class="d-flex">
            <div class="ml-2">{{ convertDateTimeType(templateOptions.data.raisedTime) }}</div>
          </div>
        </template>
        <DxColumn
          data-field="status"
          caption="status"
          alignment="center"
          cell-template="alarm-type-template"
          :allow-editing="false"
        />

        <DxColumn data-field="alarmStateType" caption="alarmStateType" :visible="false"></DxColumn>
        <DxColumn data-field="description" caption="Description" width="20%" :allow-editing="false">
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
            <div class="" :class="getColorByAlarmType(templateOptions.data.status)">●</div>
            <div class="ml-2">{{ templateOptions.data.status }}</div>
          </div>
        </template>

        <DxMasterDetail :enabled="false" template="detailTemplate"></DxMasterDetail>

        <template #detailTemplate="{ data: alertHistory }">
          <AlertHistoryDetail
            :id="id"
            :template-data="alertHistory"
            :startDate="startDate"
            :endDate="endDate"
          />
        </template>
      </DxDataGrid>
    </v-sheet>
  </v-sheet>
  <VoyagesPopup
    v-model="isShowPopupModal"
    :imoNumber="curSelectedShip.imoNumber"
    @selectVoyage="updateDate"
    @close="closeVoyagesPopup"
  />
</template>

<script setup>
import {
  ref,
  onMounted,
  computed,
  watch,
  onUnmounted,
  onBeforeUnmount,
  getCurrentInstance
} from 'vue'
import { storeToRefs } from 'pinia'
import { useTagStore } from '@/stores/tagStore'
import { useAuthStore } from '@/stores/authStore.js'
import { useVoccStore } from '@/stores/voccStore'
import { useFleetStore } from '@/stores/fleetStore'
import { useShipStore } from '@/stores/shipStore'
import { useAlarmStore } from '@/stores/alarmStore'
import { getAllVoyageByImoNumber } from '@/api/voyage.js'
import GroupRegisterForm from '@/views/auth/group/GroupRegisterForm.vue'
import { getDxGridInstance, dxGridRefresh, dxGridDeselectAll } from '@/composables/dxGridUtil'
import { convertUTCTimezone, convertDateTimeType } from '@/composables/util'
import { getAlarmHistory } from '@/api/alarmApi'
import emitter from '@/composables/eventbus.js'

import AlertHistoryDetail from '@/views/alert/AlertHistoryDetail.vue'
import VoyagesPopup from '@/components/voyage/VoyagesPopup.vue'

import alarmData from '@/assets/mockup/alertMonitoring.json'

import moment from 'moment'

const { proxy } = getCurrentInstance()
const alarmHistory = ref([])

const equipments = ref(['ME1', 'ME2', 'GE1'])
const statuses = ref(['All', 'Caution', 'Warning'])
const chartInterval = ref(['1 min', '3 min', '5 min', '10 min', '30 min', '1 hour'])

const selectedStatus = ref()

const tagStore = useTagStore()
const authStore = useAuthStore()
const voccStore = useVoccStore()
const fleetStore = useFleetStore()
const shipStore = useShipStore()
const alarmStore = useAlarmStore()

const { userInfo } = storeToRefs(authStore)
const { tagList } = storeToRefs(tagStore)
const { voccInfo } = storeToRefs(voccStore)
const { fleets } = storeToRefs(fleetStore)
const { realAlarms } = storeToRefs(alarmStore)

const { curSelectedShip, shipEngines } = storeToRefs(shipStore)

const activeStatus = ref(true)
const showFilterRow = ref(true)

const alarmHistoryGrid = ref(null)
const alarmHistoryInstance = ref(null)

let interval = null
const startDate = ref()
const endDate = ref()

const selectedEngine = ref()

onMounted(() => {
  const today = moment()

  if (shipEngines.value) {
    let ShipEngineList = [...shipEngines.value]
    shipEngines.value = ShipEngineList
    selectedEngine.value = shipEngines.value[0]
  }

  selectedStatus.value = statuses.value[0]
  alarmHistoryInstance.value = alarmHistoryGrid.value.instance

  endDate.value = today.utc().format('YYYY-MM-DD hh:mm')
  startDate.value = today.utc().subtract(1, 'hours').format('YYYY-MM-DD hh:mm')

  fetchAlarmHistory()
})

onBeforeUnmount(() => {
  clearInterval(interval)
  interval = null
})

const fetchAlarmHistory = async () => {
  if (!shipEngines.value.includes('All')) {
    let ShipEngineList = [...shipEngines.value]
    ShipEngineList.unshift('All')
    shipEngines.value = ShipEngineList
  }
  let alertStartDate = null
  let alertEndDate = null

  if (startDate.value != null) {
    alertStartDate = startDate.value
    alertStartDate = convertUTCTimezone(alertStartDate)
  }

  if (endDate.value != null) {
    alertEndDate = endDate.value
    alertEndDate = convertUTCTimezone(alertEndDate)
  }
  let requestForm = {
    imoNumber: curSelectedShip.value.imoNumber,
    startTime: alertStartDate,
    endTime: alertEndDate
  }
  const {
    status,
    data: { data }
  } = await getAlarmHistory(requestForm)

  if (parseInt(status / 100) == 2) {
    alarmHistory.value = data
  }
  if (status == 404) {
    alarmHistory.value = []
  }
}

const clickAlarm = (e) => {
  const isExpanded = e.component.isRowExpanded(e.key)

  if (e.rowType == 'detail') return

  if (isExpanded) {
    e.component.collapseRow(e.key)
  } else {
    e.component.collapseAll(-1)
    e.component.expandRow(e.key)
  }
}

const fetchRealAlarm = async () => {
  const imoNumber = currentShip.value.imoNumber
  if (imoNumber) {
    const result = await alarmStore.fetchRealAlarm(imoNumber)
    if (result == 200 && !interval) {
      interval = setInterval(() => fetchRealAlarm(imoNumber), 60000)
    }
  }
}

const getColorByAlarmType = (alarmType) => {
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

const isShowPopupModal = ref(false)
const voyages = ref(false)
const openVoyagesPopup = async () => {
  isShowPopupModal.value = true
  ;({
    data: { data: voyages.value }
  } = await getAllVoyageByImoNumber(curSelectedShip.value.imoNumber))
}

const closeVoyagesPopup = () => {
  isShowPopupModal.value = false
}

const updateDate = async (dateInformation) => {
  let { selectStartDate, selectEndDate } = dateInformation

  console.dir(dateInformation)
  startDate.value = convertDateTimeType(selectStartDate)
  endDate.value = convertDateTimeType(selectEndDate)
  fetchAlarmHistory()
}

const filterAlarmHistory = () => {
  if (selectedStatus.value == 'All') {
    alarmHistoryInstance.value.clearFilter()
  } else {
    alarmHistoryInstance.value.filter((item) => item.status == selectedStatus.value)
  }
}

const filterEngineType = () => {
  if (selectedEngine.value == 'All') {
    alarmHistoryInstance.value.clearFilter()
  } else {
    alarmHistoryInstance.value.filter((item) => item.equipNo == selectedEngine.value)
  }
}

watch(curSelectedShip, fetchAlarmHistory)
watch(selectedStatus, filterAlarmHistory)
watch(selectedEngine, filterEngineType)
</script>

<style lang="scss" scoped>
.alarm-type {
  font-size: 1.2em;
}

.dx-header-row {
  td {
    &#dx-col-27 {
      text-align: center !important;
    }
  }
}
</style>
