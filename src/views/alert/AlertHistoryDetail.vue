<template>

  <div class="d-flex ga-4 voyageDetail">
    <div class="charts-container">
      <LineChart :series="series"></LineChart>
    </div>

    <div class="equipment-container">
      <div class="d-flex ga-2 w-50 mb-4">
        <i-selectbox variant="solo-filled" density="compact" class="equipmentSelector" bg-color="#434348"
          placeholder="SensorType을 선택해주세요" :hide-details="true"></i-selectbox>

        <i-selectbox item-title="text" item-value="status" variant="solo-filled" density="compact" return-object
          class="equipmentSelector" bg-color="#434348" placeholder="Status를 선택해주세요" :hide-details="true"></i-selectbox>
      </div>

      <DxDataGrid id="alertDetailGrid" ref="alertGrid" key-expr="id" :data-source="detailData"
        :column-auto-width="false">
        <DxSelection mode="multiple" :recursive="true" show-check-boxes-mode="always"></DxSelection>

        <DxColumn data-field="equipmentNo" caption="Equip No" alignment="center" :allow-edting="false" />
        <DxColumn data-field="description" caption="Description" alignment="center" :allow-editing="false" />
        <DxColumn data-field="tagId" caption="Tag ID" alignment="center" :allow-edting="false" />

        <DxScrolling mode="infinite" />
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
import { ref, onMounted } from 'vue';
import mapBg from '@/assets/images/mapBg.png'
import alertDetail from '@/assets/mockup/alertDetail.json'
import { getVoyageTrack } from '@/api/voyage'
import LineChart from '@/components/echart/LineChart.vue'

import { convertFloatFormatObject } from '@/composables/util'

import detailData from '@/assets/mockup/alertHistoryDetail.json'

// const props = defineProps({
//   templateData: {
//     type: Object
//   }
// })

const detailInfo = ref(null)


const series = [
  {
    name: 'M/E1 Power',
    type: 'line',
    data: [120, 130, 140, 90, 90, 230, 210],
  },
  {
    name: 'M/E1 Load',
    type: 'line',
    data: [80, 90, 60, 134, 100, 150, 120],
  },
  {
    name: 'M/E1 Speed',
    type: 'line',
    data: [70, 80, 50, 134, 110, 190, 210],
  },
  {
    name: 'M/E1 L.O Inlet Press',
    type: 'line',
    data: [60, 90, 80, 70, 90, 120, 100],
  },
  {
    name: 'M/E1 T/C1 Speed',
    type: 'line',
    data: [10, 60, 90, 50, 60, 120, 80],
  },
]


onMounted(() => {
  // console.dir(props.templateData.key)
  // let key = props.templateData.key
  // fetchReportDetail(key)
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

.charts-container{
  flex : 1 1 0;
}

.equipment-container{
  flex : 1 1 0;
}
</style>