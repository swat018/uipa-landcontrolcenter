<template>
  <div class="d-flex ga-4 voyageDetail">

    <div class="mapImage-container"><v-img :src="mapBg" cover min-width="450"></v-img></div>
    <div>
      <DxDataGrid id="voyageDetailGrid" ref="voyageGrid" :data-source="voyageReportData" key-expr="id">
        <DxColumn data-field="load" caption="Load(%)" alignment="center" :allow-edting="false"></DxColumn>
        <DxColumn data-field="rpm" caption="RPM" alignment="center" :allow-edting="false"></DxColumn>
        <DxColumn data-field="speed" caption="Speed(kn)" alignment="center" :allow-edting="false"></DxColumn>
        <DxColumn data-field="underway" caption="Underway(h)" alignment="center" :allow-edting="false"></DxColumn>
        <DxColumn data-field="distance" caption="Distance(nm)" alignment="center" :allow-edting="false"></DxColumn>
        <DxColumn data-field="slip" caption="SLIP(%)" alignment="center" :allow-edting="false"></DxColumn>
        <DxColumn data-field="bf" caption="BF" alignment="center" :allow-edting="false"></DxColumn>
        <DxColumn data-field="dfoc" caption="DFOC(hours)" alignment="center" :allow-edting="false"></DxColumn>
        <DxColumn data-field="eeoi" caption="EEOI" alignment="center" :allow-edting="false"></DxColumn>
        <DxColumn data-field="id" :visible="false"></DxColumn>
        <DxScrolling mode="infinite" />
      </DxDataGrid>

    </div>
  </div>
  <!-- {{ props.templateData.data }} -->
</template>

<script setup>
import mapBg from '@/assets/images/mapBg.png'
import voyageReportData from '@/assets/mockup/voyageReportData.json'

const props = defineProps({
  templateData : {
    type : Object
  }
})

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
</style>