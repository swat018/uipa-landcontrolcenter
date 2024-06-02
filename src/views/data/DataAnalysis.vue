<template>
  <v-sheet
    class="ma-3 rounded-lg"
    style="height: 100vh; max-height: calc(100vh - 65px - 24px)"
    color="#ffffff00"
  >
    <v-sheet class="mb-3 rounded-lg">
      <SelectedShipSummary />
    </v-sheet>
    <v-sheet class="content-container pa-3 rounded-lg">
      <v-sheet class="px-3 py-3 rounded-lg" color="#333334">
        <div class="d-flex justify-space-between align-center">
          <!-- <div class="align-center">Equipment</div> -->
          <div class="d-flex ga-2">
            <input class="noticeList-datePicker" type="date" v-model="startDate" />
            <input class="noticeList-datePicker" type="date" v-model="endDate" />
            <i-btn @click="fetchPeriodAnalysis" text="조회" height="43"></i-btn>
            <i-btn
              text="항차조회"
              @click="openVoyagesPopup()"
              :imoNumber="curSelectedShip.imoNumber"
              color="#3D3D40"
            ></i-btn>
          </div>
        </div>
      </v-sheet>

      <v-container class="performance-chart-container mt-3 pa-0" fluid>
        <v-row class="h-100" no-gutters>
          <v-col cols="6" class="col">
            <v-sheet class="h-100 rounded-lg" color="#333334">
              <Echart :option="fuelConsumptionOption"></Echart>
            </v-sheet>
          </v-col>
          <v-col cols="6" class="col pl-3">
            <v-sheet class="h-100 rounded-lg" color="#333334">
              <Echart :option="speedPowerOption"></Echart> </v-sheet
          ></v-col>
          <v-col cols="6" class="col pt-3">
            <v-sheet class="h-100 rounded-lg" color="#333334">
              <Echart :option="fuelPowerOption"></Echart>
            </v-sheet>
          </v-col>
          <v-col cols="6" class="col pt-3 pl-3">
            <v-sheet class="h-100 rounded-lg" color="#333334">
              <Echart :option="powerPropellerOption"></Echart> </v-sheet
          ></v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <VoyagesPopup
      v-model="isShowPopupModal"
      :imoNumber="curSelectedShip.imoNumber"
      @selectVoyage="updateDate"
      @close="closeVoyagesPopup"
    />
  </v-sheet>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useShipStore } from '@/stores/shipStore'
import { useLoadingStore } from '@/stores/loadingStore'

import { getAllVoyageByImoNumber } from '@/api/voyage.js'
import { getAnalysisData } from '@/api/dataApi.js'

import {
  convertDateTimeType,
  convertDateType,
  convertUTCTimezone,
  isStatusOk
} from '@/composables/util.js'

import Echart from '@/components/echart/Echarts.vue'
import SelectedShipSummary from '@/components/ship/SelectedShipSummary.vue'
import VoyagesPopup from '@/components/voyage/VoyagesPopup.vue'

import { useToast } from '@/composables/useToast'
import moment from 'moment'
import _ from 'lodash'

const startDate = ref(null)
const endDate = ref(null)
const isShowPopupModal = ref(false)
const voyages = ref(false)

const shipStore = useShipStore()
const { curSelectedShip, shipEngins } = storeToRefs(shipStore)
const loadingStore = useLoadingStore()
const { loadingStatus } = storeToRefs(loadingStore)

const { showResMsg } = useToast()

const fuelConsumptionSeries = ref([])
const powerPropellerSeries = ref([])
const speedPowerSeries = ref([])
// const fuelPowerSeries = ref([])

const fuelConsumptionOption = ref({
  title: {
    text: 'Engine Fuel Consumption',
    left: 'center',
    textStyle: {
      color: '#fff'
    },
    top: '2%'
  },

  legend: {
    data: [],
    right: '10%',
    bottom: '5%'
  },
  grid: {
    bottom: '20%',
    top: '12%',
    right: '3%'
  },

  xAxis: {
    name: 'Speed (knots)',
    nameLocation: 'center',
    nameGap: 30,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
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
    name: 'Fuel Consumption (kg/h)',
    nameLocation: 'middle',
    nameGap: 55,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  series: fuelConsumptionSeries
})

const speedPowerOption = ref({
  title: {
    text: 'Speed - Power Curve',
    left: 'center',
    textStyle: {
      color: '#fff'
    },
    top: '2%'
  },
  legend: {
    data: [],
    right: '10%',
    bottom: '5%'
  },
  grid: {
    bottom: '20%',
    top: '12%',
    right: '3%'
  },
  xAxis: {
    name: 'Speed (knot)',
    nameLocation: 'center',
    nameGap: 30,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
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
    name: 'Power (kW)',
    nameLocation: 'middle',
    nameGap: 40,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  series: speedPowerSeries
})

const fuelPowerOption = ref({
  title: {
    text: 'Fuel Consumption - Power Curve',
    left: 'center',
    textStyle: {
      color: '#fff'
    },
    top: '2%'
  },
  legend: {
    data: [],
    right: '10%',
    bottom: '5%'
  },
  grid: {
    bottom: '20%',
    top: '12%',
    right: '3%'
  },
  xAxis: {
    name: 'Power (kW)',
    nameLocation: 'center',
    nameGap: 40,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
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
    name: 'Fuel Consumption (kg/h)',
    nameLocation: 'center',
    nameGap: 55,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  series: []
})

const powerPropellerOption = ref({
  title: {
    text: 'Power - Propeller RPM Curve',
    left: 'center',
    textStyle: {
      color: '#fff'
    },
    top: '2%'
  },
  legend: {
    data: [],
    right: '3%',
    bottom: '5%'
  },
  grid: {
    bottom: '20%',
    top: '12%',
    right: '3%'
  },
  xAxis: {
    name: 'Propeller Speed (rpm)',
    nameLocation: 'start',
    // nameGap: 30,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
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
    name: 'Power (kW)',
    nameLocation: 'middle',
    nameGap: 40,
    nameTextStyle: {
      color: '#fff',
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  series: powerPropellerSeries
})

const getFuelConsumptionSeries = (fuelConsumptionData) => {
  return new Promise((resolve, reject) => {
    try {
      let series = []

      console.dir(fuelConsumptionData)
      Object.keys(fuelConsumptionData).forEach((el) => {
        let newData = {
          name: '',
          symbolSize: 10,
          itemStyle: {
            opacity: 0.5
          },
          data: [],
          type: 'scatter'
        }
        newData.name = el
        newData.data = fuelConsumptionData[el]

        // console.log('key')
        // console.dir(el)

        // console.log('data')
        // console.dir(fuelConsumptionData[el])

        let index = fuelConsumptionOption.value.series.findIndex((option) => {
          console.log(option.name)
          option.name == el
        })

        console.log('인덱스')
        console.log(index)

        if (index == -1) {
          fuelConsumptionOption.value.series.push(newData)
        } else {
          fuelConsumptionOption.value.series[index] = newData
        }
      })

      console.log('최종 시리즈')
      console.dir(fuelConsumptionOption.value.series)

      fuelConsumptionOption.value.legend.data = Object.keys(fuelConsumptionData)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

let utcStartTime = ''
let utcEndTime = ''

onMounted(() => {
  if (!curSelectedShip.value.imoNumber) {
    showResMsg('선박명을 클릭해주세요')
    return
  }
  initFetchData()
})

const initFetchData = async () => {
  const today = moment()
  let parseEndTimeZone = moment.parseZone(today)
  let sevenDaysAgo = today.subtract(3, 'days')
  let parseStartTimeZone = moment.parseZone(sevenDaysAgo)
  utcStartTime = parseStartTimeZone.toISOString()
  utcEndTime = parseEndTimeZone.toISOString()

  fetchAnalysisData(utcStartTime, utcEndTime)
}

const fetchAnalysisData = async (utcStartTime, utcEndTime) => {
  loadingStatus.value = true
  const promises = []

  let currentShipImoNumber = curSelectedShip.value.imoNumber
  let requestForm = {
    imoNumber: currentShipImoNumber,
    startTime: utcStartTime,
    endTime: utcEndTime
  }

  const {
    status,
    data: { data }
  } = await getAnalysisData(requestForm)

  if (data.length == 0) {
    resetChartOption()
    return
  }

  let engineFuelConsumption = []
  let powerPropeller = []
  let SpeedPower = []
  let fuelConsumptionPower = []

  if ('Engine Fuel Consumption' in data) {
    engineFuelConsumption = data['Engine Fuel Consumption']

    if (engineFuelConsumption) {
      promises.push(getFuelConsumptionSeries(engineFuelConsumption))
    } else {
      fuelConsumptionOption.value.series = []
    }
  }

  if ('Power - Propeller RPM Curve' in data) {
    powerPropeller = data['Power - Propeller RPM Curve']
    if (powerPropeller) {
      promises.push(getPowerPropellerSeries(powerPropeller))
    } else {
      powerPropellerOption.value.series = []
    }
  }

  if ('Speed - Power Curve' in data) {
    SpeedPower = data['Speed - Power Curve']
    if (SpeedPower) {
      promises.push(getSpeedPowerSeries(SpeedPower))
    } else {
      speedPowerOption.value.series = []
    }
  }

  if ('Foc - Power Curve' in data) {
    fuelConsumptionPower = data['Foc - Power Curve']
    if (fuelConsumptionPower) {
      promises.push(getFuelPowerSeries(fuelConsumptionPower))
    } else {
      fuelPowerOption.value.series = []
    }
  }

  await Promise.all(promises)
    .then(() => {
      startDate.value = convertDateType(utcStartTime)
      endDate.value = convertDateType(utcEndTime)
      loadingStatus.value = false
    })
    .catch((error) => {
      showResMsg(error)
      loadingStatus.value = false
    })
}

const fetchPeriodAnalysis = () => {
  utcStartTime = convertUTCTimezone(startDate.value)
  utcEndTime = convertUTCTimezone(endDate.value)
  fetchAnalysisData(utcStartTime, utcEndTime)
}

const getPowerPropellerSeries = (powerPropellerData) => {
  return new Promise((resolve, reject) => {
    try {
      let series = []

      console.dir(powerPropellerData)
      Object.keys(powerPropellerData).forEach((el) => {
        let newData = {
          name: '',
          symbolSize: 10,
          itemStyle: {
            opacity: 0.5
          },
          data: [],
          type: 'scatter'
        }
        newData.name = el
        newData.data = powerPropellerData[el]

        // console.log('key')
        // console.dir(el)

        // console.log('data')
        // console.dir(fuelConsumptionData[el])

        let index = powerPropellerOption.value.series.findIndex((option) => {
          console.log(option.name)
          option.name == el
        })

        console.log('인덱스')
        console.log(index)

        if (index == -1) {
          powerPropellerOption.value.series.push(newData)
        } else {
          powerPropellerOption.value.series[index] = newData
        }
      })

      console.log('최종 시리즈')
      console.dir(powerPropellerOption.value.series)

      powerPropellerOption.value.legend.data = Object.keys(powerPropellerData)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

const getSpeedPowerSeries = (speedPowerData) => {
  return new Promise((resolve, reject) => {
    try {
      let series = []

      console.log('Speed Power')
      console.dir(speedPowerData)
      Object.keys(speedPowerData).forEach((el) => {
        let newData = {
          name: '',
          symbolSize: 10,
          itemStyle: {
            opacity: 0.5
          },
          data: [],
          type: 'scatter'
        }
        newData.name = el
        newData.data = speedPowerData[el]

        // console.log('key')
        // console.dir(el)

        // console.log('data')
        // console.dir(fuelConsumptionData[el])

        console.log('speedPowerSeries')
        console.dir(speedPowerSeries)

        let index = speedPowerSeries.value.findIndex((option) => option.name == el)

        if (index == -1) {
          speedPowerSeries.value.push(newData)
        } else {
          speedPowerSeries[index] = newData
        }
      })

      console.log('최종 시리즈')
      console.dir(speedPowerOption.value.series)

      speedPowerOption.value.legend.data = Object.keys(speedPowerData)
    } catch (error) {
      reject(error)
    }
  })
}

const getFuelPowerSeries = (fuelPowerData) => {
  return new Promise((resolve, reject) => {
    try {
      let series = []

      console.dir(fuelPowerData)
      Object.keys(fuelPowerData).forEach((el) => {
        let newData = {
          name: '',
          symbolSize: 10,
          itemStyle: {
            opacity: 0.5
          },
          data: [],
          type: 'scatter'
        }
        newData.name = el
        newData.data = fuelPowerData[el]

        let index = fuelPowerOption.value.series.findIndex((option) => option.name == el)

        if (index == -1) {
          fuelPowerOption.value.series.push(newData)
        } else {
          fuelPowerOption.value.series[index] = newData
        }
      })

      console.log('최종 시리즈')
      console.dir(fuelPowerOption.value.series)

      fuelPowerOption.value.legend.data = Object.keys(fuelPowerData)
    } catch (error) {
      reject(error)
    }
  })
}

const updateDate = (dateInformation) => {
  let { selectStartDate, selectEndDate } = dateInformation

  startDate.value = convertDateTimeType(selectStartDate)
  endDate.value = convertDateTimeType(selectEndDate)

  fetchAnalysisData()
}

const openVoyagesPopup = async () => {
  isShowPopupModal.value = true
  ;({
    data: { data: voyages.value }
  } = await getAllVoyageByImoNumber(curSelectedShip.value.imoNumber))
}

const closeVoyagesPopup = () => {
  isShowPopupModal.value = false
}

const resetChartOption = () => {
  fuelConsumptionOption.value.series = []
  speedPowerSeries.value = []
  fuelPowerOption.value.series = []
  powerPropellerOption.value.series = []
}

watch(curSelectedShip, initFetchData)
</script>

<style lang="scss" scoped>
.v-window.analysis-tab-container.d-flex.flex-column .v-window__container {
  /* background : red; */
  flex: 1 1 auto;
}

.analysis-chart-container {
  height: calc(100% - 45px);
}

/* Flex */
/* .chart-analysis-container{
  flex : 1 1 0;
  gap : 16px;
  background : orange;
} */

/* 
.chart-item {
  background: #222224;
  flex: 1 1 40%;
}
*/
/* height : 100%; */

/* Grid */
.chart-analysis-container {
  /* flex: 1 1 0; */

  /* background : yellow; */
}

.chart-grid {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  background: orange;
}

.chart-item {
  background: #222224;
}

.analysis-tab-container .v-window-item {
  height: 100%;
}

.card-bg {
  background: #434348;
}

.v-row.analysis-chart-container {
  > div {
    height: calc(100% / 2);
  }
}

.performance-chart-container {
  height: 100%;
  max-height: calc(100% - 36px - 48px);
  // background: blue;
}

.col {
  height: calc(100% / 2);
}
</style>
