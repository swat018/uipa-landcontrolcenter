<template>
  <div class="d-flex ga-4 voyageDetail">
    <div class="alert-chart-container">
      <Echart :option="chartSeries"></Echart>
    </div>

    <DxDataGrid
      id="alertDetailGrid"
      ref="alertGrid"
      :data-source="alertDetailInfo"
      key-expr="id"
      :show-borders="true"
    >
      <!-- RaisedTime -->
      <DxColumn
        data-field="time"
        caption="Time"
        alignment="center"
        :allow-edting="false"
        cell-template="time-template"
      ></DxColumn>
      <template #time-template="{ data: templateOptions }">
        <div class="d-flex justify-center">
          <div>
            {{ convertDateTimeType(templateOptions.data.time) }}
          </div>
        </div>
      </template>

      <!-- Status -->
      <DxColumn
        data-field="status"
        caption="Status"
        alignment="center"
        :allow-editing="false"
        cell-template="alarm-type-template"
      />
      <template #alarm-type-template="{ data: templateOptions }">
        <div class="d-flex justify-center">
          <div class="" :class="getColorByAlarmType(templateOptions.data.status)">●</div>
        </div>
      </template>

      <!-- Value -->
      <DxColumn data-field="value" caption="Value" alignment="center" :allow-edting="false" />

      <!--Caution -->
      <DxColumn data-field="caution" alignment="center" header-cell-template="cautionLow-header" />
      <template #cautionLow-header="{ data }">
        <div class="d-flex align-center ga-2">
          <div class="caution">●</div>
          <div>Caution</div>
        </div>
      </template>
      <!-- Warning -->
      <DxColumn
        data-field="warning"
        alignment="center"
        :allow-editing="false"
        header-cell-template="warningLow-header"
      />
      <template #warningLow-header="{ data }">
        <div class="d-flex align-center ga-2">
          <div class="warning">●</div>
          <div>Warning</div>
        </div>
      </template>

      <DxScrolling mode="infinite" />
      <!-- <DxPaging :page-size="6" /> -->
    </DxDataGrid>
  </div>
  <!-- <div>
    <p class="text-center desc">데이터가 없습니다</p>
  </div> -->
  <!-- {{ props.templateData.data }} -->
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import mapBg from '@/assets/images/mapBg.png'
// import alertDetail from '@/assets/mockup/alertDetail.json'
import { convertDateTimeType } from '@/composables/util'
import { getAlertDetailInfo } from '@/api/alarmApi'
import Echart from '@/components/echart/Echarts.vue'

import { convertFloatFormatObject } from '@/composables/util'

const props = defineProps({
  templateData: {
    type: Object
  },
  imoNumber: {
    type: [Object, String]
  },
  chartInterval: {
    type: [Object]
  }
})

const alertDetailInfo = ref(null)

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
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    data: null,
    right: 10,
    bottom: 0
  },
  grid: {
    left: '5%',
    right: '8%',
    bottom: '15%',
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
      name: null,
      type: 'line',
      data: [],
      markLine: {
        silent: true,
        lineStyle: {
          type: 'dashed',
          color: 'red'
        },
        data: [{ xAxis: null }]
      }
    }
  ]
})

onMounted(() => {
  fetchAlertDetail()
})

const fetchAlertDetail = async () => {
  let chartIntervalMinute = props.chartInterval.minute

  const { raisedTime, tagId, caution, warning, description } = props.templateData.data

  console.dir(props.templateData)

  console.dir(props.templateData)
  let requestForm = {
    imoNumber: props.imoNumber,
    chartIntervalMinute,
    raisedTime,
    tagId,
    caution,
    warning
  }
  const {
    data: { data }
  } = await getAlertDetailInfo(requestForm)

  console.log('알람 상세')
  console.dir(data)
  let chartData = data.map((chartData) => chartData.value)
  let dates = data.map((chartData) => convertDateTimeType(chartData.time))

  console.dir(chartData)
  console.dir(dates)

  chartSeries.value.xAxis.data = dates
  chartSeries.value.series[0].data = chartData
  chartSeries.value.series[0].name = description
  chartSeries.value.series[0].markLine.data[0].xAxis = dates[3]

  console.dir(chartSeries)
  alertDetailInfo.value = data
}

const getColorByAlarmType = (alarmType) => {
  let alarmColor = ''
  switch (alarmType) {
    case 'Normal':
      alarmColor = 'normal'
      break
    case 'Caution':
      alarmColor = 'caution'
      break
    case 'Warning':
      alarmColor = 'warning'
      break
  }

  return alarmColor
}

watch(() => props.chartInterval, fetchAlertDetail)
</script>

<style scoped>
#alertDetailGrid {
  height: 320px;
}

#alertDetailGrid td {
  height: 45px;
}

.alert-chart-container {
  flex: 1 1 0;
}

#alertDetailGrid {
  flex: 2 2 0;
}

.desc {
  font-size: 1.2em;
}
.normal {
  color: #42d2a7;
  border-color: #42d2a7;
}

.caution {
  color: #fff900;
}

.warning {
  color: #ff0000;
  border-color: #ff0000;
}
</style>
