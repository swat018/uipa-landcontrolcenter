<template>
  <v-sheet class="tabs-content-container w-100">
    <v-sheet class="px-6 py-3 my-6 rounded-lg" color="#333334">
      <div class="d-flex ga-2 align-center">
        <div class="d-flex ga-2">
          <input class="noticeList-datePicker" type="date" v-model="startDate" />
          <input class="noticeList-datePicker" type="date" v-model="endDate" :min="startDate" />
          <i-btn @click="fetchPeriodEngineData()" text="조회"></i-btn>
          <i-btn
            text="항차조회"
            @click="openVoyagesPopup()"
            :imoNumber="selectedShip"
            color="#3D3D40"
          ></i-btn>
        </div>
        <!-- <div class="d-flex ml-6">
          <i-selectbox v-model="selectedEngineName" :items="engineKeys" item-title="name" item-value="id" variant="solo-filled"
        density="compact" return-object class="equipmentSelector" bg-color="#434348" :hide-details="true"></i-selectbox>
        </div> -->
      </div>
    </v-sheet>

    <v-sheet class="period-engine-page">
      <v-sheet class="rounded-lg" color="#333334">
        <EChart :option="heatmapOption"></EChart>
      </v-sheet>
      <v-sheet class="rounded-lg" color="#333334">
        <EChart :option="runningHourSeries"></EChart>
      </v-sheet>
      <v-sheet class="rounded-lg" color="#333334">
        <EChart :option="averageSpeedSeries"></EChart>
      </v-sheet>
      <v-sheet class="rounded-lg" color="#333334">
        <EChart :option="averagePowerSeries"></EChart>
      </v-sheet>
    </v-sheet>
  </v-sheet>
  <VoyagesPopup
    v-model="isShowPopupModal"
    :imoNumber="selectedShip"
    @selectVoyage="updateDate"
    @close="closeVoyagesPopup"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { convertDateTimeType, convertDateType } from '@/composables/util.js'
import { getPeriodEngineData } from '@/api/engineApi'

import EChart from '@/components/echart/Echarts.vue'
import VoyagesPopup from '@/components/voyage/VoyagesPopup.vue'
import moment from 'moment'

import { convertUTCTimezone } from '@/composables/util'
import { useShipStore } from '@/stores/shipStore'
import { getAllVoyageByImoNumber } from '@/api/voyage.js'

const shipStore = useShipStore()
const { selectedShip } = storeToRefs(shipStore)

const startDate = ref(null)
const endDate = ref(null)
const isShowPopupModal = ref(false)
const voyages = ref(false)

onMounted(() => {
  initFetchData()
})

let utcStartTime = ''
let utcEndTime = ''

const initFetchData = () => {
  const today = moment()
  let parseEndTimeZone = moment.parseZone(today)
  let sevenDaysAgo = today.subtract(7, 'days')
  let parseStartTimeZone = moment.parseZone(sevenDaysAgo)
  utcStartTime = parseStartTimeZone.toISOString()
  utcEndTime = parseEndTimeZone.toISOString()

  console.log('초기화')
  console.log(utcStartTime, utcEndTime)
  fetchEngineData(utcStartTime, utcEndTime)
}

const fetchEngineData = async (utcStartTime, utcEndTime) => {
  let periodForm = {
    imoNumber: selectedShip.value,
    startTime: utcStartTime,
    endTime: utcEndTime
  }

  console.dir(periodForm)

  const response = await getPeriodEngineData(periodForm)

  // 로드율 차트
  heatmapOption.value.xAxis.data = response.data.data.AverageLoad.recordDaySet
  heatmapOption.value.yAxis.data = response.data.data.AverageLoad.engineNameList
  heatmapOption.value.series[0].data = response.data.data.AverageLoad.dataList

  console.log('Load 리스트')
  console.dir(response.data.data.AverageLoad.dataList)
  startDate.value = convertDateTimeType(utcStartTime)
  endDate.value = convertDateTimeType(utcEndTime)

  // 운영시간 차트
  runningHourSeries.value.xAxis.data = response.data.data.RunningHours.recordDaySet
  runningHourSeries.value.legend.data = response.data.data.RunningHours.engineNameList
  runningHourSeries.value.series = convertRunningHourSeries(response.data.data.RunningHours)

  // 스피드 차트
  averageSpeedSeries.value.xAxis.data = response.data.data.AverageSpeed.recordDaySet
  averageSpeedSeries.value.legend.data = response.data.data.AverageSpeed.engineNameList
  averageSpeedSeries.value.series = convertAverageSpeedSeries(response.data.data.AverageSpeed)

  // 파워 차트
  averagePowerSeries.value.xAxis.data = response.data.data.AveragePower.recordDaySet
  averagePowerSeries.value.legend.data = response.data.data.AveragePower.engineNameList
  averagePowerSeries.value.series = convertPowerSeries(response.data.data.AveragePower)

  console.dir(response)

  startDate.value = convertDateType(utcStartTime)
  endDate.value = convertDateType(utcEndTime)
}

const fetchPeriodEngineData = () => {
  utcStartTime = convertUTCTimezone(startDate.value)
  utcEndTime = convertUTCTimezone(endDate.value)
  fetchEngineData(utcStartTime, utcEndTime)
}

const convertRunningHourSeries = (runningHourData) => {
  const stackBarSeries = []
  for (let i = 0; i < runningHourData.engineNameList.length; i++) {
    const engineName = runningHourData.engineNameList[i]
    let engineData = runningHourData.dataList[i]
    console.log('변환')
    // engineData = engineData.dataList[i].map((data) => console.dir(data))
    console.dir(engineData)
    stackBarSeries.push({
      data: engineData,
      type: 'bar',
      stack: engineName.slice(0, 2),
      name: engineName
    })
  }

  return stackBarSeries
}

const convertAverageSpeedSeries = (speedData) => {
  let averageSpeedSeries = []

  for (let i = 0; i < speedData.engineNameList.length; i++) {
    let speedDataSeries = speedData.dataList[i]

    averageSpeedSeries.push({
      name: speedData.engineNameList[i],
      type: 'line',
      stack: 'Total',
      data: speedDataSeries
    })

    console.dir(averageSpeedSeries)
  }

  return averageSpeedSeries
}

const convertPowerSeries = (powerData) => {
  const powerSeries = []
  for (let i = 0; i < powerData.engineNameList.length; i++) {
    const engineName = powerData.engineNameList[i]
    let powerDataSeries = powerData.dataList[i]
    powerSeries.push({
      name: engineName,
      type: 'bar',
      stack: 'total',
      barWidth: '60%',
      data: powerDataSeries
    })
  }

  return powerSeries
}

const heatmapOption = ref({
  title: {
    text: 'Average Load',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  tooltip: {
    position: 'top'
  },
  grid: {
    height: '50%',
    top: '20%',
    right: '3%',
    left: '7%'
  },
  xAxis: {
    type: 'category',
    data: [],
    splitArea: {
      show: true
    }
  },
  yAxis: {
    type: 'category',
    data: [],
    splitArea: {
      show: true
    },
    nameTextStyle: {
      color: '#fff'
    }
  },
  visualMap: {
    min: 0,
    max: 100,
    calculable: true,
    orient: 'horizontal',
    right: '1%',
    bottom: '5%',
    inRange: {
      color: ['#F5A119', '#F48416', '#F36715', '#F24D13', '#F13412']
    },
    textStyle: {
      color: '#fff'
    }
  },
  series: [
    {
      name: 'Average Load',
      type: 'heatmap',
      data: [],
      label: {
        show: true
      },
      backgroundColor: '#ffa5500',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

const runningHourSeries = ref({
  title: {
    text: 'Running Hours',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  grid: {
    left: '5%',
    right: '3%'
  },
  xAxis: {
    type: 'category',
    data: []
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
  legend: {
    right: '3%',
    bottom: '5%',
    data: []
  },
  tooltip: {
    position: 'top'
  },
  series: []
})

const averageSpeedSeries = ref({
  title: {
    text: 'Average Speed',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    right: '3%',
    bottom: '5%',
    data: []
  },
  grid: {
    left: '3%',
    right: '5%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: ['20%', '20%'],
    data: []
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
  series: []
})

const averagePowerSeries = ref({
  title: {
    text: 'Average Power',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  grid: {
    left: '6%',
    right: '3%'
  },
  legend: {
    selectedMode: false,
    right: '3%',
    bottom: '5%'
  },
  tooltip: {
    trigger: 'axis'
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
  xAxis: {
    type: 'category',
    data: []
  },
  series: []
})

const openVoyagesPopup = async () => {
  isShowPopupModal.value = true
  ;({
    data: { data: voyages.value }
  } = await getAllVoyageByImoNumber(selectedShip.value))
}

const closeVoyagesPopup = () => {
  isShowPopupModal.value = false
}

const updateDate = (dateInformation) => {
  let { selectStartDate, selectEndDate } = dateInformation

  startDate.value = convertDateTimeType(selectStartDate)
  endDate.value = convertDateTimeType(selectEndDate)

  fetchPeriodEngineData()
}

watch(selectedShip, initFetchData, { deep: true })
</script>

<style lang="scss" scoped>
.item {
  flex: 1 1 40%;
}

.v-card.item {
  background: #5f5f67;
}

.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.rh-item {
  background: #333334;
  flex: 1 1 40%;
}

.rh-title {
  font-size: 1.2em;
}

.rh-value {
  font-size: 2.5em;
  font-weight: bold;
}

.engine-data-item {
  > div {
    /* flex: 0 1 33.3%; */
    height: calc(100% / 3);
  }
}

.running-hour-container {
  gap: 16px;
}

.runing-hour-item {
  flex: 1 1 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #333334;
}

.chart-bg {
  // background: #2d2d30;
}

.performance-chart-container {
  height: 100vh;
  max-height: calc(100% - 92px - 24px);
  // background: blue;
}

.tabs-content-test {
  height: 100vh;
  max-height: calc(100vh - 65px - 24px - 62px - 24px - 24px);
}

.period-engine-page {
  height: 100vh;
  max-height: calc(100vh - 65px - 24px - 62px - 24px - 48px - 40px - 24px - 24px - 24px - 6px);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 24px;
}
</style>
