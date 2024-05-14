<template>

  <div class="d-flex ga-4 voyageDetail" v-if="detailInfo != null">

    <div class="mapImage-container"><v-img :src="mapBg" cover min-width="450"></v-img></div>

    <DxDataGrid id="voyageDetailGrid" ref="voyageGrid" :data-source="detailInfo" key-expr="id">
      <DxColumn data-field="load" caption="Load(%)" alignment="center" :allow-edting="false"></DxColumn>
      <DxColumn data-field="rpm" caption="RPM" alignment="center" :allow-edting="false"></DxColumn>
      <DxColumn data-field="speed" caption="Speed(kn)" alignment="center" :allow-edting="false"></DxColumn>
      <DxColumn data-field="underway" caption="Underway(h)" alignment="center" :allow-edting="false"></DxColumn>
      <DxColumn data-field="distance" caption="Distance(nm)" alignment="center" :allow-edting="false"></DxColumn>
      <DxColumn data-field="slip" caption="SLIP(%)" alignment="center" :allow-edting="false"></DxColumn>
      <DxColumn data-field="bf" caption="BF" alignment="center" :allow-edting="false"></DxColumn>
      <DxColumn data-field="foc" caption="FOC(hours)" alignment="center" :allow-edting="false"></DxColumn>
      <DxColumn data-field="eeoi" caption="EEOI" alignment="center" :allow-edting="false"></DxColumn>
      <DxColumn data-field="id" :visible="false"></DxColumn>
      <DxScrolling mode="infinite" />
    </DxDataGrid>
  </div>
  <div v-else>
    <p class="text-center desc">데이터가 없습니다</p>
  </div>
  <!-- {{ props.templateData.data }} -->
</template>

<script setup>
import { ref, onMounted } from 'vue';
import mapBg from '@/assets/images/mapBg.png'
import voyageReportData from '@/assets/mockup/voyageReportData.json'
import { getVoyageTrack } from '@/api/voyage'

import { convertFloatFormatObject } from '@/composables/util'

const props = defineProps({
  templateData : {
    type : Object
  }
})

const detailInfo = ref(null) 


onMounted(()=>{
  console.dir(props.templateData.key)
  let key = props.templateData.key
  fetchReportDetail(key)
})


const fetchReportDetail = async (voyageId) => {
  const { data : { data } } = await getVoyageTrack(voyageId)

  detailInfo.value = data.map((track)=> convertFloatFormatObject(track))
}
</script>

<style>

#voyageDetailGrid {
  height: 270px;
}

#voyageDetailGrid td{
  height: 45px;
}

.mapImage-container{
  width : 60%;
}
.mapImage-container img{
  width: 100%;
}

.desc{
  font-size: 1.2em;
}
</style>