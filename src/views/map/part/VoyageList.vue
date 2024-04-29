<template>
  <div class="area-container d-flex flex-column px-2" style="height: calc(100vh - 210px); overflow:hidden;">
    <div class="d-flex justify-space-between align-center my-0">
      <div class="voyageList-title">| Voyage List</div>
      <i-btn @click="openPopup" icon="mdi-plus" width="30" height="30" color="transparent"></i-btn>
    </div>

    <DxDataGrid :data-source="voyageList" :column-auto-width="true" :show-borders="false" :show-column-lines="false"
      style="height: calc(100% - 30px);">
      <DxColumn data-field="startPort" caption="Departure" cell-template="departure-template" :allow-editing="false">
      </DxColumn>

      <template #departure-template="{ data: templateOptions }">
        <PortInfo :portName="templateOptions.data.startPort" :time="templateOptions.data.startTime"
          :country="templateOptions.data.startPortCountry">
        </PortInfo>
      </template>

      <DxColumn data-field="endPort" caption="Arrival" cell-template="arrival-template" :allow-editing="false">
      </DxColumn>

      <template #arrival-template="{ data: templateOptions }">
        <PortInfo :portName="templateOptions.data.endPort" :time="templateOptions.data.endTime"
          :country="templateOptions.data.endPortCountry">
        </PortInfo>
      </template>

      <DxColumn data-field="elapsedHours" :allow-editing="false" caption="Hours" alignment="center"></DxColumn>
      <DxColumn data-field="distance" :allow-editing="false" alignment="center" cell-template="distance-template">
      </DxColumn>

      <template #distance-template="{ data: templateOptions }">
        {{ convertNumberFormat(templateOptions.data.distance) }}
      </template>
      <DxColumn data-field="id" cell-template="track-template" :allow-editing="false"></DxColumn>
      <template #track-template>
        <v-btn icon="mdi-map" size="x-small"></v-btn>
      </template>
      <DxPaging :page-size="5" />
    </DxDataGrid>

  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMapStore } from '@/stores/mapStore'

import { convertNumberFormat } from '@/composables/util.js'

import PortInfo from '@/components/voyage/PortInfo.vue';

const mapStore = useMapStore()
const { clickedShipInfo, voyageList } = storeToRefs(mapStore);

onMounted(() => {
  fetchVoyageList()
})

const fetchVoyageList = async () => {
  let imoNumber = clickedShipInfo.value.imoNumber;
  await mapStore.fetchVoyageList(imoNumber)
}

let imageURl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/255px-Flag_of_South_Korea.svg.png'

</script>

<style scoped>
.voyageList-title {
  font-size: 1.2em;
}

#dx-col-7>div.dx-datagrid-text-content.dx-text-content-alignment-left {
  display: none;
}
</style>