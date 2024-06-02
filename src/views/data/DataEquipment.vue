<template>
  <v-sheet
    class="ma-3 rounded-lg"
    style="height: 100vh; max-height: calc(100vh - 65px - 24px)"
    color="#ffffff00"
  >
    <v-sheet class="mb-3 rounded-lg">
      <SelectedShipSummary />
    </v-sheet>

    <v-sheet class="data-equipment-container pa-3 rounded-lg detail-page">
      <v-sheet class="px-3 py-3 rounded-lg" color="#333334">
        <div class="d-flex justify-end align-center">
          <!-- <div class="align-center">Equipment</div> -->

          <div class="d-flex ga-2">
            <i-selectbox
              v-model="selectedEngineName"
              :items="shipEngines"
              item-title="name"
              item-value="id"
              variant="solo-filled"
              density="compact"
              return-object
              class="equipmentSelector"
              bg-color="#434348"
              :hide-details="true"
              @update:modelValue="filterEquipmentData"
            ></i-selectbox>
            <input class="noticeList-datePicker" type="datetime-local" v-model="startDate" />
            <input class="noticeList-datePicker" type="datetime-local" v-model="endDate" />
            <i-btn @click="fetchPeriodEngineData" text="조회" height="43"></i-btn>

            <i-btn
              text="항차조회"
              @click="openVoyagesPopup()"
              :imoNumber="curSelectedShip.imoNumber"
              color="#3D3D40"
            ></i-btn>
          </div>
        </div>
      </v-sheet>

      <v-sheet
        class="mt-3 pa-3 rounded-lg"
        color="#333334"
        style="height: 100%; max-height: calc(100% - 70px - 12px)"
      >
        <v-container class="h-100 pa-0" fluid>
          <v-row no-gutters class="h-100">
            <v-col cols="5" xl="6" xxl="7" class="h-100 pr-3">
              <div
                class="d-flex justify-center align-center h-100"
                v-if="option.series.length == 0"
                style="font-size: 1.4em"
              >
                우측 태그 목록에서 태그를 선택해주세요
              </div>
              <Echart v-else :option="option"></Echart>
              <!-- <v-chart
                v-else
                :option="option"
                autoresize
                ref="dataChart"
                :theme="currentEchartTheme"
              /> -->
            </v-col>
            <v-col cols="7" xl="6" xxl="5" class="h-100">
              <DxDataGrid
                id="equimentGrid"
                ref="equimentGrid"
                class="h-100"
                style="max-height: 100%"
                :show-borders="true"
                :data-source="equipmenTagtList"
                key-expr="tagId"
                :selected-row-keys="selectedRowKeys"
                :column-auto-width="true"
                @selection-changed="onSelectionChanged"
              >
                <DxSelection mode="multiple" show-check-boxes-mode="always"></DxSelection>
                <DxScrolling mode="virtual" />
                <!-- row-rendering-mode="virtual" -->
                <DxColumn
                  data-field="equipNo"
                  caption="Equip No"
                  alignment="center"
                  :allow-editing="false"
                  width="20%"
                />
                <DxColumn
                  data-field="tagId"
                  catpion="Tag ID"
                  alignment="center"
                  :allow-editing="false"
                  width="20%"
                />
                <DxColumn
                  data-field="description"
                  catpion="Dscription"
                  alignment="left"
                  :allow-editing="false"
                />
              </DxDataGrid>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted, watch, reactive, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

import { useShipStore } from '@/stores/shipStore'
import { getEquimentTagList, getEquimentChartData } from '@/api/dataApi'
import { convertDateTimeType, openNewPopup } from '@/composables/util'

import { useToast } from '@/composables/useToast'

import { use, registerTheme, registerTransform } from 'echarts/core'
import { useThemeStore } from '@/stores/themeStore.js'
import VChart, { THEME_KEY, UPDATE_OPTIONS_KEY } from 'vue-echarts'
import Echart from '@/components/echart/Echarts.vue'
import { CanvasRenderer } from 'echarts/renderers'
// import alertHistoryDetail from '@/assets/mockup/alertHistoryDetail.json'
import SelectedShipSummary from '@/components/ship/SelectedShipSummary.vue'
import blackTheme from '@/components/echart/theme/black.json'
import {
  BarChart,
  PieChart,
  LineChart,
  GaugeChart,
  PictorialBarChart,
  ScatterChart,
  HeatmapChart
} from 'echarts/charts'
import {
  GridComponent,
  MarkLineComponent,
  DataZoomComponent,
  BrushComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  TransformComponent,
  VisualMapComponent,
  MarkAreaComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  LineChart,
  GaugeChart,
  PictorialBarChart,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  MarkLineComponent,
  DataZoomComponent,
  BrushComponent,
  TransformComponent,
  VisualMapComponent,
  MarkAreaComponent,
  HeatmapChart
])

import _ from 'lodash'
import moment from 'moment'
const shipStore = useShipStore()
const { curSelectedShip, shipEngines } = storeToRefs(shipStore)

const { showResMsg } = useToast()

const store = useThemeStore()
let { currentEchartTheme } = storeToRefs(store)
const chart = ref()

registerTheme('echartBlackTheme', blackTheme)
const dataChart = ref()
onMounted(() => {
  console.dir(shipEngines.value)

  initFetchData()
})

const initFetchData = async () => {
  const today = moment()
  let curSelectedShipImoNumber = curSelectedShip.value.imoNumber

  if (curSelectedShipImoNumber == null) {
    showResMsg('선박명을 클릭해주세요')
    return
  }
  // 선박 엔진 조회
  let engineCount = shipEngines.length

  if (engineCount == 0) {
    await shipStore.fetchShipMachineInfo(curSelectedShipImoNumber)

    if (shipEngines.value.length == 0) {
      equipmenTagtList.value = []
      return
    }
  }

  let isExistAllOption = shipEngines.value.includes('ALL')
  if (!isExistAllOption) {
    shipEngines.value.unshift('All')
  }

  selectedEngineName.value = shipEngines.value[1]

  let currentDay = today.clone().utc().format('YYYY-MM-DD hh:mm')
  let sevenDaysAgo = today.clone().utc().subtract(7, 'days').format('YYYY-MM-DD hh:mm')

  startDate.value = sevenDaysAgo
  endDate.value = currentDay

  fetchEquimentTagList()
}

const selected = ref()
const selectedTags = []
const lineChart = ref(null)
const tags = ref([])
const selectedEngineName = ref(null)

const updateOptions = ref()

const selectedRowKeys = ref([])

const startDate = ref(null)
const endDate = ref(null)

const equipmenTagtList = ref([])

const option = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
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
  grid: {
    top: '10%',
    left: '1%',
    right: '3%',
    bottom: '0%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    // prettier-ignore
    data: []
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}'
    },
    boundaryGap: [0, '30%'],
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

const testOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
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
  grid: {
    top: '10%',
    left: '1%',
    right: '3%',
    bottom: '0%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false
    // prettier-ignore
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}'
    },
    boundaryGap: [0, '30%'],
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

const removeChart = () => {
  let originData = _.cloneDeep(testOption.value.series)

  let index = testOption.value.series.findIndex((item) => item.key == 'LC01002')
  originData.splice(index, 1)

  testOption.value.series = []

  console.log('editData')
  console.dir(originData)

  testOption.value.series = originData
}

let xAxisData = null
let seriesData = null
let chartSeries = []
const fetchPeriodEngineData = () => {
  let checkedIdList = selectedRowKeys.value

  let merge = []

  let filterData = originEquimentTags.filter((item) => checkedIdList.includes(item.id))
  let utcStartTime = moment(startDate.value).utc().toISOString()
  let utcEndTime = moment(endDate.value).utc().toISOString()

  if (filterData.length == 0) {
    option.value.series = []
    option.value.xAxis.data = []
    merge.push('series')
    merge.push('xAxis')
    // dataChart.value.setOption(option.value, { replaceMerge: merge })
  }

  filterData.forEach(async (item, index) => {
    let isTimeContain = false
    seriesData = null
    if (index == 0) {
      isTimeContain = true
    }
    let newData = {
      imoNumber: curSelectedShip.value.imoNumber,
      fieldName: item.tagId,
      startTime: utcStartTime,
      endTime: utcEndTime,
      isTimeContains: isTimeContain
    }
    const {
      status,
      data: { data }
    } = await getEquimentChartData(newData)

    if (index == 0) {
      let dates = data.first.map((date) => convertDateTimeType(date))
      xAxisData = dates
      console.log('xAxisData')
      console.dir(xAxisData)

      seriesData = data.second
      option.value.xAxis.data = xAxisData
      merge.push('xAxis')
      merge.push('series')
    } else {
      seriesData = data
    }
    chartSeries.push(seriesData)
  })
  console.log('x축')
  console.dir(xAxisData)
  console.log('data')
  console.dir(chartSeries)

  option.value.series = chartSeries
  dataChart.value.setOption(option.value, { replaceMerge: merge })
}

// 필터 기능을 위해서 origin데이터 저장
let originEquimentTags = []
const fetchEquimentTagList = async () => {
  let equimentTags = []
  let engineName = selectedEngineName.value
  const {
    status,
    data: { data }
  } = await getEquimentTagList()

  console.log('데이터')
  console.dir(data)
  if (data.length == 0) {
    equipmenTagtList.value = []
    return
  }

  equimentTags = data.filter((equiment) => equiment.equipNo == engineName)
  equipmenTagtList.value = equimentTags
  originEquimentTags = equimentTags
}

const filterEquipmentData = () => {
  let engineName = selectedEngineName.value
  // let equipmetListOrigin = _.cloneDeep(equipmenTagtList.value)
  equipmenTagtList.value = originEquimentTags.filter((equiment) => equiment.equipNo == engineName)
}

const onSelectionChanged = async (e) => {
  console.log('체크')
  console.dir(e)
  // 현재 체크 해제한 태그 아이디 목록
  let deselctedKey = e.currentDeselectedRowKeys
  // 현재 체크한 태그 아이디
  let curSelectedKey = e.currentSelectedRowKeys
  // 현재 체크된 태그 아이디 목록
  let selectedKeys = e.selectedRowKeys
  selectedRowKeys.value = selectedKeys

  // 현재 선박 IMO 번호
  let curSelectedShipImoNumber = curSelectedShip.value.imoNumber

  // 시작날짜, 종료날짜 UTC 시간
  let utcStartTime = moment(startDate.value).utc().toISOString()
  let utcEndTime = moment(endDate.value).utc().toISOString()

  // 현재 차트 데이터
  const curChartData = _.cloneDeep(option.value)
  let updateChartData = []
  let xAxisLength = curChartData.xAxis.data.length
  let xAxisDatas = []
  let isIncludeTime = false

  console.log('현재 차트 데이터')
  console.dir(curChartData)

  console.log('현재 선택한 키')
  console.log(curSelectedKey.length)

  if (curSelectedKey.length <= 0) {
    // deselectedOriginData가 0인지 아닌지 판단
    // 0이 아닌 경우, originData에서 해당 키 값의 TagID 일치한 데이터를 찾기
    // 차트 시리즈 옵션에서 name이 해당 TagID와 일치한게 있는지 확인
    // 일치하는게 있으면 제거
    if (deselctedKey.length <= 0) {
      return
    }
    console.log('체크 해제')

    updateChartData = curChartData.series.filter((item) => {
      console.log(item)
      console.log(!deselctedKey.includes(item.name))
      return !deselctedKey.includes(item.name)
    })

    console.log('배열 자르기')
    console.dir(updateChartData)

    option.value.series = []

    option.value.series = updateChartData
  } else {
    console.log('isIncludeTime')

    if (xAxisLength == 0) {
      console.log('0 이니')
      isIncludeTime = true
    }

    console.log(isIncludeTime)
    let requestForm = {
      imoNumber: curSelectedShipImoNumber,
      fieldNameList: selectedKeys,
      startTime: utcStartTime,
      endTime: utcEndTime,
      timeContains: isIncludeTime
    }
    const {
      data: { data }
    } = await getEquimentChartData(requestForm)

    console.log('api 결과값 ')
    console.dir(data)

    if ('Time' in data) {
      console.log('data에 타임 있음')
      console.dir(data['Time'])
      xAxisDatas = data['Time'].map((date) => convertDateTimeType(date))
    }

    Object.keys(data).forEach((key) => {
      if (key !== 'Time') {
        // 현재 키에 해당하는 배열을 순회하며 data 배열에 객체 형태로 저장
        updateChartData.push({
          name: key,
          data: data[key],
          type: 'line'
        })
      }
    })
  }

  let updatedAxis = []

  if (isIncludeTime) {
    // option.value.xAxis.data = []
    updatedAxis = xAxisDatas
  } else {
    // let originXAxis = curChartData.xAxis.data
    // option.value.xAxis.data = []
    updatedAxis = curChartData.xAxis.data
  }

  console.log('차트 데이터 비운 후')
  console.log('초기화')
  option.value.xAxis.data = []

  option.value.series = []

  nextTick(() => {
    option.value.series = updateChartData
  })

  option.value.xAxis.data = updatedAxis

  console.log('x축')
  console.dir(option.value.xAxis)

  console.dir(updateChartData)

  console.log('updateChartData')
  console.dir(updateChartData)

  console.log('차트 데이터')
  console.dir(option.value)
}
watch(curSelectedShip, initFetchData)
</script>

<style>
.equiment-chart-container {
  flex: 2 2 0;
}

.equiment-select-container {
  flex: 1 1 0;
}
</style>
