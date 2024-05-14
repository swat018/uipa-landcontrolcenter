<template>

  <div class="d-flex ga-4 voyageDetail">

    <div class="alert-chart-container">
      <LineChart :series="series"></LineChart>
    </div>

    <DxDataGrid id="alertDetailGrid" ref="alertGrid" :data-source="alertDetail" key-expr="id">
      <DxColumn data-field="time" caption="Time" alignment="center" :allow-edting="false"></DxColumn>
      <DxColumn data-field="staus" caption="Status" alignment="center" :allow-edting="false"
        cell-template="alarm-type-template"></DxColumn>
      <template #alarm-type-template="{ data: templateOptions }">
        <div class="d-flex justify-center ">
          <div class="" :class="getColorByAlarmType(templateOptions.data.alarmStateType)">●</div>
        </div>
      </template>

      <DxColumn data-field="value" caption="Value" alignment="center" :allow-edting="false"></DxColumn>
      <DxColumn data-field="cautionLow" alignment="center" header-cell-template="cautionlow-header">
      </DxColumn>
      <template #cautionlow-header="{ data }">
        <p>Caution <br> (Low)</p>
      </template>
      <DxColumn data-field="warningLow" alignment="center" :allow-edting="false"
        header-cell-template="warninglow-header">
      </DxColumn>
      <template #warninglow-header="{ data }">
        <p>Warning <br> (Low Low)</p>
      </template>
      <DxColumn data-field="cautionHigh" alignment="center" :allow-edting="false"
        header-cell-template="cautionhigh-header">
      </DxColumn>
      <template #cautionhigh-header="{ data }">
        <p>Caution <br> (High)</p>
      </template>
      <DxColumn data-field="warningHigh" alignment="center" :allow-edting="false"
        header-cell-template="warninghigh-header">
      </DxColumn>
      <template #warninghigh-header="{ data }">
        <p>Wearning <br> (High High)</p>
      </template>
      <DxScrolling mode="infinite" />
      <DxPaging :page-size="6" />
    </DxDataGrid>
  </div>
  <!-- <div>
    <p class="text-center desc">데이터가 없습니다</p>
  </div> -->
  <!-- {{ props.templateData.data }} -->
</template>

<script setup>
import { ref, onMounted } from 'vue';
import mapBg from '@/assets/images/mapBg.png'
import alertDetail from '@/assets/mockup/alertDetail.json'
import { getVoyageTrack } from '@/api/voyage'
import LineChart from '@/components/echart/LineChart.vue'

import { convertFloatFormatObject } from '@/composables/util'

const props = defineProps({
  templateData: {
    type: Object
  }
})

const detailInfo = ref(null)

const series = [
  {
    name: 'M/E1 Power',
    type: 'line',
    data: [35, 36, 40, 52, 52, 52],
  },
]

onMounted(() => {
  console.dir(props.templateData.key)
  let key = props.templateData.key
  fetchReportDetail(key)
})


const fetchReportDetail = async (voyageId) => {
  const { data: { data } } = await getVoyageTrack(voyageId)

  detailInfo.value = data.map((track) => convertFloatFormatObject(track))
}


const getColorByAlarmType = (alarmType) => {
  let alarmColor = ''
  switch (alarmType) {
    case 'NORMAL':
      alarmColor = 'normal'
      break;
    case 'Low':
      alarmColor = 'warning'
      break;
    case 'High':
      alarmColor = 'warning'
      break;
    case 'Low Low':
      alarmColor = 'danger'
      break;
    case 'High High':
      alarmColor = 'danger'
      break;
  }

  return alarmColor;
}

</script>

<style>
#alertDetailGrid {
  height: 320px;
}

#alertDetailGrid td {
  height: 45px;
}

.alert-chart-container{
  flex : 1 1 0;
}

#alertDetailGrid{
  flex : 2 2 0;
}

.desc {
  font-size: 1.2em;
}
.normal {
  color: #42D2A7;
  border-color: #42D2A7;
}

.warning {
  color: #FD8100
}

.danger {
  color: #F04A4A;
  border-color: #F04A4A;
}
</style>