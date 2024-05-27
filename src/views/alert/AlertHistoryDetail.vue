<template>
  <div class="d-flex ga-4 voyageDetail">
    <div class="charts-container">
      <Echart :option="chartSeries" ref="test"></Echart>
    </div>

    <div class="equipment-container">
      <div class="d-flex ga-2 w-50 mb-4">
        <i-selectbox
          variant="solo-filled"
          density="compact"
          class="equipmentSelector"
          bg-color="#434348"
          placeholder="SensorType을 선택해주세요"
          :hide-details="true"
        ></i-selectbox>

        <i-selectbox
          item-title="text"
          item-value="status"
          variant="solo-filled"
          density="compact"
          return-object
          class="equipmentSelector"
          bg-color="#434348"
          placeholder="Status를 선택해주세요"
          :hide-details="true"
        ></i-selectbox>
      </div>

      <DxDataGrid
        id="alertHistoryDetailGrid"
        ref="historyDetailGrid"
        key-expr="id"
        @selection-changed="onSelectionChanged"
        :data-source="detailData"
        :column-auto-width="false"
      >
        <DxSelection mode="multiple" :recursive="true" show-check-boxes-mode="always"></DxSelection>

        <DxColumn
          data-field="equipmentNo"
          caption="Equip No"
          alignment="center"
          :allow-edting="false"
        />
        <DxColumn
          data-field="description"
          caption="Description"
          alignment="center"
          :allow-editing="false"
        />
        <DxColumn data-field="tagId" caption="Tag ID" alignment="center" :allow-edting="false" />

        <DxScrolling mode="virtual" />
        <DxPaging :page-size="6" />
      </DxDataGrid>
    </div>
  </div>
  <!-- <div v-else>
    <p class="text-center desc">데이터가 없습니다</p>
  </div> -->
  <!-- {{ props.templateData.data }} -->
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import mapBg from '@/assets/images/mapBg.png'
import alertDetail from '@/assets/mockup/alertDetail.json'
import { getAlarmHistoryChart } from '@/api/alarmApi'
import Echart from '@/components/echart/Echarts.vue'

import { convertDateTimeType, convertUTCTimezone } from '@/composables/util'
import { useShipStore } from '@/stores/shipStore'

import detailData from '@/assets/mockup/alertHistoryDetail.json'
import { DxEditing } from 'devextreme-vue/tree-list'

const shipStore = useShipStore()
const { selectedShip, shipEngines } = storeToRefs(shipStore)

const historyDetailGrid = ref()

const props = defineProps({
  id: {
    type: [Number]
  },
  templateData: {
    type: Object
  },
  startDate: {
    type: [String]
  },
  endDate: {
    type: [String]
  }
})

const chartSeries = ref({
  title: {
    text: props.title,
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

const detailInfo = ref(null)

const series = [
  {
    name: 'M/E1 Power',
    type: 'line',
    data: [120, 130, 140, 90, 90, 230, 210]
  },
  {
    name: 'M/E1 Load',
    type: 'line',
    data: [80, 90, 60, 134, 100, 150, 120]
  },
  {
    name: 'M/E1 Speed',
    type: 'line',
    data: [70, 80, 50, 134, 110, 190, 210]
  },
  {
    name: 'M/E1 L.O Inlet Press',
    type: 'line',
    data: [60, 90, 80, 70, 90, 120, 100]
  },
  {
    name: 'M/E1 T/C1 Speed',
    type: 'line',
    data: [10, 60, 90, 50, 60, 120, 80]
  }
]
const test = ref()
const test2 = ref()
const historyInstance = ref()
onMounted(() => {
  // console.dir(props.templateData.key)
  // let key = props.templateData.key
  // fetchReportDetail(key)
  historyInstance.value = historyDetailGrid.value.instance
  fetchAlertDetail()
  console.log('이차트')
  console.dir(test.value)
})

const fetchAlertDetail = async () => {
  fetchAlertChart()
}

const fetchAlertChart = async () => {
  let tagId = props.templateData.data.tagId
  let chartStartTime = convertUTCTimezone(props.startDate)
  let chartEndTime = convertUTCTimezone(props.endDate)

  let requestForm = {
    imoNumber: selectedShip.value,
    fieldName: tagId,
    startTime: chartStartTime,
    endTime: chartEndTime,
    isTimeContains: true
  }

  console.dir(requestForm)

  const {
    status,
    data: { data }
  } = await getAlarmHistoryChart(requestForm)

  let dataRange = data.first.map((date) => convertDateTimeType(date))
  chartSeries.value.xAxis.data = dataRange
  chartSeries.value.series[0].name = props.templateData.data.description
  chartSeries.value.series[0].data = data.second
  console.dir(chartSeries.value)
}

const getColorByAlarmType = (alarmType) => {
  let alarmColor = ''
  switch (alarmType) {
    case 'NORMAL':
      alarmColor = 'normal'
      break
    case 'Low':
      alarmColor = 'warning'
      break
    case 'High':
      alarmColor = 'warning'
      break
    case 'Low Low':
      alarmColor = 'danger'
      break
    case 'High High':
      alarmColor = 'danger'
      break
  }

  return alarmColor
}

const onSelectionChanged = (e) => {
  console.dir(e)
  let seriesLength = chartSeries.value.series.length

  if (e.currentDeselectedRowKeys.length != 0) {
    removeChartOption(e.currentDeselectedRowKeys)
    return
  }

  let description = e.selectedRowsData[seriesLength - 1].description

  let result = isExistChartOption(description)

  if (result == -1) {
    changeChartOption(e.selectedRowsData)
  }
}

const isExistChartOption = (description) => {
  let seriesLength = chartSeries.value.series.length
  for (let i = 0; i < seriesLength; i++) {
    if (chartSeries.value.series[i].name == description) {
      return i
    }
  }

  return -1
}

const removeChartOption = (deselectedRows) => {
  // historyDetailGrid.value.getRowData(key)
  for (let i = 0; i < deselectedRows.length; i++) {
    var visibleRowsData = historyInstance.value.getVisibleRows()
    var targetRowData = visibleRowsData.find((row) => {
      return row.key === deselectedRows[i]
    }) // myTargetKey는 찾고자 하는 키 값

    let index = chartSeries.value.series.findIndex(
      (option) => option.name == targetRowData.data.description
    )

    chartSeries.value.series.splice(index, 1)
  }
  // chartSeries.value.series = removedChartOption
}

const changeChartOption = async (selectedRows) => {
  console.log('차트 생성')
  let chartStartTime = convertUTCTimezone(props.startDate)
  let chartEndTime = convertUTCTimezone(props.endDate)

  for (let i = 0; i < selectedRows.length; i++) {
    let requestForm = {
      imoNumber: selectedShip.value,
      fieldName: selectedRows[i].tagId,
      startTime: chartStartTime,
      endTime: chartEndTime,
      isTimeContains: false
    }

    const {
      status,
      data: { data }
    } = await getAlarmHistoryChart(requestForm)

    if (status == 200) {
      chartSeries.value.series.push({
        name: selectedRows[i].description,
        type: 'line',
        data: data
      })
    }
  }
}
</script>

<style>
#alertDetailGrid {
  height: 320px;
}

#alertDetailGrid td {
  height: 45px;
}

.desc {
  font-size: 1.2em;
}

.normal {
  color: #42d2a7;
  border-color: #42d2a7;
}

.warning {
  color: #fd8100;
}

.danger {
  color: #f04a4a;
  border-color: #f04a4a;
}

.charts-container {
  flex: 1 1 0;
}

.equipment-container {
  flex: 1 1 0;
}
</style>
