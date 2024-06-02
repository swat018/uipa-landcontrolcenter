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
            :equipmentTags="equipmentTags"
            :checkedTags="checkedTags"
            :startDate="startDate"
            :endDate="endDate"
            :chartHistories="chartSeries"
            @click="handleAlertHistoryDetail"
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
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { useAlarmStore } from '@/stores/alarmStore'
import { getAllVoyageByImoNumber } from '@/api/voyage.js'
import { getAlarmHistory } from '@/api/alarmApi'
import { getEquimentTagList, getEquimentChartData } from '@/api/dataApi'
import { useToast } from '@/composables/useToast'
import { convertUTCTimezone, convertDateTimeType, isStatusOk } from '@/composables/util'

import AlertHistoryDetail from '@/views/alert/AlertHistoryDetail.vue'
import VoyagesPopup from '@/components/voyage/VoyagesPopup.vue'

import moment from 'moment'
import _ from 'lodash'

const shipStore = useShipStore()
const { curSelectedShip, shipEngines } = storeToRefs(shipStore)

const alarmStore = useAlarmStore()
const { showResMsg } = useToast()

let interval = null

/**
 * 그리드 관련
 */
const alarmHistoryGrid = ref(null)
const alarmHistoryInstance = ref(null)
const alarmHistory = ref([])

/**
 * 필터 관련
 */
const startDate = ref()
const endDate = ref()
const statuses = ref(['All', 'Caution', 'Warning'])
const chartInterval = ref(['1 min', '3 min', '5 min', '10 min', '30 min', '1 hour'])
const selectedEngine = ref()
const selectedStatus = ref()

/**
 * 차트 관련
 */
const chartHistories = ref({})
const chartData = ref([])
const CHECKED_COUNT_ONE = 1
const chartSeries = ref({
  title: {
    text: '',
    left: 'left',
    textStyle: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bolder'
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  toolbox: {
    show: true,
    top: '0%',
    right: '2%',
    feature: {
      dataZoom: {
        show: true,
        title: {
          zoom: 'Zoom',
          back: 'Restore'
        },
        yAxisIndex: 'none',
        iconStyle: {
          borderColor: '#fff', // Default icon border color
          emphasis: {
            borderColor: '#5789FE' // Icon border color when activated
          }
        }
      }
    }
  },
  legend: {
    show: false,
    orient: 'vertical',
    data: null,
    right: 10
  },
  grid: {
    left: '5%',
    right: '8%',
    bottom: '10%',
    top: '12%'
    // containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    },
    boundaryGap: [0, '30%']
  },
  series: [
    {
      type: 'line',
      data: [],
      symbolSize: 0,
      smooth: true
    }
  ]
})
let test = []

let count = 0

const handleAlertHistoryDetail = async (param) => {
  let imoNumber = curSelectedShip.value.imoNumber
  checkedTags.value = param.tagIds

  let chartDatas = []
  let axisDatas = []

  if (!imoNumber) {
    showResMsg('선박을 선택해주세요')
    return
  }

  if (param.type == 'remove') {
    let deselctedKey = param.deselctedKeys

    chartDatas = chartSeries.value.series.filter((item) => {
      console.log(item)
      console.log(deselctedKey.includes(item.name))
      return !deselctedKey.includes(item.name)
    })

    console.dir()
  } else if (param.type == 'add') {
    let startDatetime = startDate.value
    let endDatetime = endDate.value
    let isTimeContains = false
    let xAxisLength = chartSeries.value.xAxis.data.length

    if (xAxisLength <= 0) {
      isTimeContains = true
    }

    let utcStartTime = convertUTCTimezone(startDatetime)
    let utcEndTime = convertUTCTimezone(endDatetime)

    console.log('타임 포함 여부')
    console.log(isTimeContains)
    let requestform = {
      imoNumber: imoNumber,
      fieldNameList: param.tagIds,
      startTime: utcStartTime,
      endTime: utcEndTime,
      timeContains: isTimeContains
    }

    let {
      status,
      data: { data }
    } = await getEquimentChartData(requestform)

    if ('Time' in data) {
      console.log('Time 있는지')
      let dates = data['Time'].map((date) => convertDateTimeType(date))
      data.Time = dates
      axisDatas = data['Time']
      chartSeries.value.xAxis.data = axisDatas
    }
    console.log('데이터')
    console.dir(data)

    let newDatas = []

    Object.keys(data).forEach((key) => {
      if (key != 'Time') {
        let newData = {
          name: key,
          data: data[key],
          type: 'line'
        }

        newDatas.push(newData)
      }
    })
    chartDatas = newDatas
  }

  nextTick(() => {
    console.log('DOM 로딩 후')
    chartSeries.value.series = []
    chartSeries.value.series = chartDatas

    console.dir(chartSeries.value)
  })

  // console.dir(data)
  // if (isStatusOk(status)) {

  // chartHistories.value = data

  // chartData.value = test2

  // console.dir(chartHistories)
  // }
  console.log(param)
}

onMounted(() => {
  const today = moment()

  if (shipEngines.value) {
    let ShipEngineList = [...shipEngines.value]
    shipEngines.value = ShipEngineList
    selectedEngine.value = shipEngines.value[1]
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

const equipmentTags = ref()
const checkedTags = ref()
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

  if (isStatusOk(status)) {
    alarmHistory.value = data
  }

  fetchEquimentList()
}
let originEquipmentTags = []
const fetchEquimentList = async (requestfomr) => {
  console.log('Equipment Tags')
  let engineName = selectedEngine.value
  console.dir(engineName)
  const {
    data: { data }
  } = await getEquimentTagList(requestfomr)
  originEquipmentTags = data
  equipmentTags.value = data.filter((item) => item.equipNo == engineName)
  console.dir(equipmentTags.value)
}

const clickAlarm = (e) => {
  const isExpanded = e.component.isRowExpanded(e.key)
  checkedTags.value = []

  if (e.rowType == 'detail') {
    e.preventDefault()
  }

  if (isExpanded) {
    e.component.collapseRow(e.key)
  } else {
    e.component.collapseAll(-1)
    e.component.expandRow(e.key)
  }
}

const fetchRealAlarm = async () => {
  const imoNumber = curSelectedShip.value.imoNumber
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
    equipmentTags.value = originEquipmentTags.filter((item) => item.equipNo == selectedEngine.value)
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
