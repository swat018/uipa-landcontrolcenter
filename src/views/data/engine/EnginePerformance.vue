<template>
  <v-sheet class="performance-container rounded-lg pt-3">
    <v-sheet class="pa-3 mb-3 rounded-lg" color="#333334">
      <div class="d-flex justify-space-between align-center">
        <!-- <div class="align-center">Equipment</div> -->
        <div class="d-flex ga-2">
          <i-selectbox
            v-model="selectedEngineName"
            :items="engineKeys"
            item-title="name"
            item-value="id"
            variant="solo-filled"
            density="compact"
            return-object
            class="equipmentSelector"
            bg-color="#434348"
            :hide-details="true"
          ></i-selectbox>
          <input class="noticeList-datePicker" type="datetime-local" v-model="startDate" />
          <input class="noticeList-datePicker" type="datetime-local" v-model="endDate" />
          <i-btn @click="fetchPeriodEngineData()" text="조회" height="43"></i-btn>

          <i-btn
            text="항차조회"
            @click="openVoyagesPopup()"
            :imoNumber="curSelectedShip.imoNumber"
            color="#3D3D40"
          ></i-btn>
        </div>
      </div>
    </v-sheet>

    <v-row no-gutters class="engine-data-item performance-chart">
      <v-col cols="4">
        <v-sheet class="h-100 rounded-lg" color="#333334">
          <EChart :option="loadSpeedrOption"> </EChart>
        </v-sheet>
      </v-col>
      <v-col cols="4" class="px-3">
        <v-sheet class="h-100 rounded-lg" color="#333334">
          <EChart :option="loadPressOption"></EChart>
        </v-sheet>
      </v-col>

      <v-col cols="4">
        <v-sheet class="h-100 rounded-lg" color="#333334">
          <EChart :option="loadTcOption"></EChart>
        </v-sheet>
      </v-col>

      <v-col cols="4" class="pa-0 pt-3">
        <v-sheet class="h-100 rounded-lg" color="#333334">
          <EChart :option="loadTcSpeedrOption"></EChart>
        </v-sheet>
      </v-col>
      <v-col cols="4" class="pa-0 px-3 pt-3">
        <v-sheet class="h-100 rounded-lg" color="#333334">
          <EChart :option="loadScavOption" autoresize />
        </v-sheet>
      </v-col>
    </v-row>
  </v-sheet>
  <VoyagesPopup
    v-model="isShowPopupModal"
    :imoNumber="curSelectedShip.imoNumber"
    @selectVoyage="updateDate"
    @close="closeVoyagesPopup"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'

import moment from 'moment'
import EChart from '@/components/echart/Echarts.vue'
import { getEnginePerformanceData } from '@/api/dataApi'
import { getAllVoyageByImoNumber } from '@/api/voyage.js'

import { convertDateTimeType, convertDateType } from '@/composables/util.js'

import VoyagesPopup from '@/components/voyage/VoyagesPopup.vue'

const startDate = ref(null)
const endDate = ref(null)
const equipments = ref(['ME1', 'ME2', 'GE1'])
const engineKeys = ref()
let utcStartTime = ''
let utcEndTime = ''

const shipStore = useShipStore()
const { curSelectedShip, shipMachineInfo } = storeToRefs(shipStore)

let selectedEngineName = ref(null)
onMounted(() => {
  initFetchData()
})

const initFetchData = async () => {
  const today = moment()
  let parseEndTimeZone = moment.parseZone(today)
  let sevenDaysAgo = today.subtract(4, 'hours')
  let parseStartTimeZone = moment.parseZone(sevenDaysAgo)
  utcStartTime = parseStartTimeZone.toISOString()
  utcEndTime = parseEndTimeZone.toISOString()

  console.log('초기화')
  console.log(utcStartTime, utcEndTime)
  fetchPerformanceData(utcStartTime, utcEndTime)
}

const convertSeries = (data) => {
  const loadPressSeries = []
  for (let i = 0; i < data.length; i++) {
    const loadPressList = data[i]
    loadPressSeries.push({
      symbolSize: 10,
      itemStyle: {
        opacity: 0.5
      },
      data: loadPressList.dataList,
      name: loadPressList.dataName,
      type: 'scatter'
    })
  }

  return loadPressSeries
}
const fetchPerformanceData = async (utcStartTime, utcEndTime) => {
  let curSelectedImoNumber = curSelectedShip.value.imoNumber
  let periodForm = {
    imoNumber: curSelectedImoNumber,
    startTime: utcStartTime,
    endTime: utcEndTime,
    intervalHours: 0
  }
  const response = await getEnginePerformanceData(periodForm)

  engineKeys.value = Object.keys(response.data.data)
  selectedEngineName.value = engineKeys.value[0]

  const {
    data: { data }
  } = response
  // 로드율 차트
  loadSpeedrOption.value.series[0].data = data.ME1.LOAD_SPEED[0].dataList
  loadPressOption.value.series = convertSeries(data.ME1.LOAD_PRESS)
  loadTcOption.value.series = convertSeries(data.ME1.LOAD_TC_GAS)
  loadTcSpeedrOption.value.series[0].data = data.ME1.LOAD_TC_SPEED[0].dataList
  loadScavOption.value.series[0].data = data.ME1.LOAD_SCAV_AIR_PRESSURE[0].dataList
  // }

  startDate.value = convertDateTimeType(utcStartTime)
  endDate.value = convertDateTimeType(utcEndTime)
}

const loadSpeedrOption = ref({
  title: {
    text: 'Load - Speed',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  xAxis: {
    max: 100,
    interval: 25,
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
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  legend: {
    data: ['Load-Speed'],
    right: '10%',
    bottom: '5%'
  },
  series: [
    {
      name: 'Load-Speed',
      symbolSize: 10,
      data: [],
      type: 'scatter'
    }
  ]
})

const loadPressOption = ref({
  title: {
    text: 'Load - Press',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  legend: {
    data: ['Cyl Pmax (bar)', 'Cyl Pcomp (bar)'],
    right: '10%',
    bottom: '5%'
  },
  xAxis: {
    max: 100,
    interval: 25,
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

const loadTcOption = ref({
  title: {
    text: 'Load - T/C',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  legend: {
    data: ['Load-T/C Inlet Gas', 'Load-T/C Outlet Gas'],
    right: '10%',
    bottom: '5%'
  },
  xAxis: {
    max: 100,
    interval: 25,
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

const loadTcSpeedrOption = ref({
  title: {
    text: 'Load - T/C Speed',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  xAxis: {
    max: 100,
    interval: 25,
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
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  legend: {
    data: ['Load-T/CSpeed'],
    right: '10%',
    bottom: '5%'
  },
  series: [
    {
      name: 'Load-T/CSpeed',
      symbolSize: 10,
      data: [],
      type: 'scatter',
      itemStyle: {
        opacity: 0.5
      }
    }
  ]
})

const loadScavOption = ref({
  title: {
    text: 'Load - Scav Air Pressure',
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  xAxis: {
    max: 100,
    interval: 25,
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
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  legend: {
    data: ['Load-Scav Air Pressure'],
    right: '10%',
    bottom: '5%'
  },
  series: [
    {
      name: 'Load-Scav Air Pressure',
      symbolSize: 10,
      data: [],
      type: 'scatter',
      itemStyle: {
        opacity: 0.5
      }
    }
  ]
})

const isShowPopupModal = ref(false)
const voyages = ref(false)
const openVoyagesPopup = async () => {
  let curSelectedImoNumber = curSelectedShip.value.imoNumber
  isShowPopupModal.value = true(
    ({
      data: { data: voyages.value }
    } = await getAllVoyageByImoNumber(curSelectedImoNumber))
  )
}

const updateDate = async (dateInformation) => {
  let { selectStartDate, selectEndDate } = dateInformation

  console.dir(dateInformation)
  startDate.value = convertDateTimeType(selectStartDate)
  endDate.value = convertDateTimeType(selectEndDate)
  fetchPerformanceData(selectStartDate, selectEndDate)
}

watch(curSelectedShip, initFetchData)
</script>

<style scoped lang="scss">
.performance-container {
  height: 100vh;
  max-height: calc(100vh - 65px - 12px - 60px - 12px - 62px - 12px);

  min-height: 600px;
  overflow: auto;
  // gap : 16px;
}

.performance-chart {
  height: calc(100% - 79px - 12px);
}

.performance-container .chart-item {
  flex: 1 1 30%;
  background: yellow;
}

.engine-data-item {
  > div {
    /* flex: 0 1 33.3%; */
    height: calc(100% / 2);
  }
}

.title {
  font-size: 1.15rem;
}
</style>
