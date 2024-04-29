<template>
  <v-sheet class="anualReport-page">
    <div class="d-flex justify-space-between align-center my-4">
      <div>Report</div>
      <div>
        <i-selectbox v-model="year" :items="years" item-title="name" item-value="id" return-object variant="solo-filled"
          density="comfortable" hide-details>
        </i-selectbox>
      </div>
    </div>

    <div class="anualReport-container d-flex ga-4">
      <div class="d-flex flex-wrap ga-4">
        <div class="anualReport-item">
          <ReportItem title="Ship Particular" :data="shipParticular" />
        </div>
        <div class="anualReport-item">
          <ReportItem title="CII Rating" :data="ciiRating"></ReportItem>
        </div>
        <div class="anualReport-item">
          <ReportItem title="CII Rating" :data="fuelConsumption"></ReportItem>
        </div>
        <div class="anualReport-item">
          <ReportItem title="Voyage Data" :data="voyageData"></ReportItem>
        </div>
      </div>

      <div class="d-flex flex-column flex-grow-1 flex-shrink-1 mr-4">
          <AnualCIIChart></AnualCIIChart>
          <AnualCIITable></AnualCIITable>
      </div>
    </div>
  </v-sheet>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMapStore } from '@/stores/mapStore'
import moment from 'moment'

import ReportItem from '@/components/voyage/ReportItem.vue'
import AnualCIIChart from '@/views/voyage/cii/AnualCIIChart.vue'
import AnualCIITable from '@/views/voyage/cii/AnualCIITable.vue'

const mapStore = useMapStore()
const { clickedShipInfo } = mapStore

const year = ref('2024')
const years = ['2022', '2023', '2024']

const shipParticular = {
  'Ship type': clickedShipInfo.type,
  'IMO Number': clickedShipInfo.imoNumber,
  'DWT': clickedShipInfo.yearBuilt,
  'GT': clickedShipInfo.grossTonnage,
  'Year Built': clickedShipInfo.yearBuilt,
}

const ciiRating = {
  'Required CII': 6.893,
  'Attained CII': 6.673,
  'CII Rating CII': 96.808 + '%',
  'CII Grade': 'C'
}

const fuelConsumption = {
  'HFO': 6.893,
  'LFO': 6.893,
  'DIESEL/GAS OIL': 15,
  'LPG(PROPANE)': 600,
  'LPG(BUTANE)': 0,
  'LNG': 20,
  'METHNOL': 30,
  'ETHANOL': 5
}

const voyageData = {
  'Hours Under way': 6.893,
  'Distance Travelled': 6.893,
  'Avg. Speed': 15,
  'FOC(mt/day)': 600,
  'LPG(BUTANE)': 0,
  'LCO₂ Emission(tCO₂)': 20,
}

</script>

<style scoped>
.anualReport-page {
  /* height: calc(100vh - 65px - 64px - 32px); */
}

/* .anualReport-container {

  height: calc(100% - 64px);
} */

.anualReport-item, .anualReport-container > div{
  flex: 1 1 40%;
}
</style>