<template>
  <v-row no-gutters class="pt-6 h-100 anual-cii-report">
    <v-sheet width="100%" class="mb-6">
      <i-selectbox v-model="year" :items="years" item-title="name" item-value="id" return-object variant="solo-filled"
        density="comfortable" hide-details style="width : 10%">
      </i-selectbox>
    </v-sheet>
    <v-sheet width="50%" class="pr-2 d-flex flex-wrap">
      <v-col cols="6" class="pa-0 pr-2 pb-2">
        <v-sheet class="pa-4" height="100%" color="#333334">
          <div class="mb-3">CII Rating</div>
          <div class="d-flex item-container">
            <div class="dataKey">CII Grade</div>
            <div class="dataValue justify-start">{{ annualCiiData['ciiGrade'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">CII Rating</div>
            <div class="dataValue justify-start">{{ annualCiiData['ciiRating'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">Required CII</div>
            <div class="dataValue justify-start">{{ annualCiiData['requiredCii'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">Attained CII</div>
            <div class="dataValue justify-start">{{ annualCiiData['attainedCii'] }}</div>
          </div>
        </v-sheet>
      </v-col>
      <v-col cols="6" class="pa-0 pl-2 pb-2">
        <v-sheet class="pa-4" height="100%" color="#333334">
          <div class="mb-3">Vessel Particular</div>
          <div class="d-flex item-container">
            <div class="dataKey">Vessel Type</div>
            <div class="dataValue justify-start">{{ annualCiiData['shipType'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">IMO Number</div>
            <div class="dataValue justify-start">{{ annualCiiData['imoNumber'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">MMSI</div>
            <div class="dataValue justify-start">{{ annualCiiData['mmsiNumber'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">DWT (t)</div>
            <div class="dataValue justify-start">{{ annualCiiData['dwt'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">GT (t)</div>
            <div class="dataValue justify-start">{{ annualCiiData['gt'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">Year built</div>
            <div class="dataValue justify-start">{{ annualCiiData['yearBuilt'] }}</div>
          </div>
        </v-sheet>
      </v-col>
      <v-col cols="6" class="pa-0 pr-2 pt-2">
        <v-sheet class="pa-4" height="100%" color="#333334">
          <div class="mb-3">Fuel Oil Consumption (t)</div>
          <div class="d-flex item-container">
            <div class="dataKey">HFO</div>
            <div class="dataValue justify-start">{{ annualCiiData['focHfo'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">LFO</div>
            <div class="dataValue justify-start">{{ annualCiiData['focLfo'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">DIESEL OIL</div>
            <div class="dataValue justify-start">{{ annualCiiData['focMdo'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">GAS OIL</div>
            <div class="dataValue justify-start">{{ annualCiiData['focMdo'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">LPG</div>
            <div class="dataValue justify-start">{{ annualCiiData['focLpg'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">LNG</div>
            <div class="dataValue justify-start">{{ annualCiiData['focLng'] }}</div>
          </div>
        </v-sheet>
      </v-col>
      <v-col cols="6" class="pa-0 pl-2 pt-2">
        <v-sheet class="pa-4" height="100%" color="#333334">
          <div class="mb-3">Voyage Data</div>
          <div class="d-flex item-container">
            <div class="dataKey">Distance (nm)</div>
            <div class="dataValue justify-start">{{ annualCiiData['distance'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">Speed (kn)</div>
            <div class="dataValue justify-start">{{ annualCiiData['speed'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">FOC (mt)</div>
            <div class="dataValue justify-start">{{ annualCiiData['focTotal'] }}</div>
          </div>
          <div class="d-flex item-container">
            <div class="dataKey">CO2 Emission (tCO2) </div>
            <div class="dataValue justify-start">{{ annualCiiData['co2Emission'] }}</div>
          </div>
        </v-sheet>
      </v-col>
    </v-sheet>
    <v-sheet width="50%" class="pl-2">
      <v-sheet width="100%" height="40%">
        <AnualCIIChart class="h-100" />
      </v-sheet>
      <v-sheet width="100%" height="60%">
        <AnualCIITable></AnualCIITable>
      </v-sheet>
    </v-sheet>
  </v-row>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMapStore } from '@/stores/mapStore'
import { useShipStore } from '@/stores/shipStore'
import { useCiiStore } from '@/stores/ciiStore'
import moment from 'moment'

import ReportItem from '@/components/voyage/ReportItem.vue'
import AnualCIIChart from '@/views/voyage/cii/AnualCIIChart.vue'
import AnualCIITable from '@/views/voyage/cii/AnualCIITable.vue'

const mapStore = useMapStore()
const { clickedShipInfo } = mapStore
const shipStore = useShipStore()
const { selectedShip } = storeToRefs(shipStore)
const ciiStore = useCiiStore()
const { annualCiiData } = storeToRefs(ciiStore)


const year = ref('2024')
const years = ['2022', '2023', '2024']

onMounted(() => {
  fetchAnualCiiData(selectedShip.value, year.value)
})

const fetchAnualCiiData = async () => {
  if (selectedShip.value != null || selectedShip.value != '') {
    await ciiStore.fetchAnualCiiData(selectedShip.value, year.value)
  }
}

watch(selectedShip, fetchAnualCiiData);

// const shipParticular = {
//   'Ship type': clickedShipInfo.type,
//   'IMO Number': clickedShipInfo.imoNumber,
//   'DWT': clickedShipInfo.yearBuilt,
//   'GT': clickedShipInfo.grossTonnage,
//   'Year Built': clickedShipInfo.yearBuilt,
// }

const shipParticular = {
  'Ship type': 'GAS CARRIER',
  'IMO Number': 'IMO9876544',
  'DWT': 5000,
  'GT': 3000,

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
  'LPG': 600,
  'LNG': 20,
}

const voyageData = {
  'Hours Under way': 6.893,
  'Distance Travelled': 6.893,
  'Avg. Speed': 15,
  'FOC(mt/day)': 600,
  'LPG(BUTANE)': 0,
  'LCO₂ Emission(tCO₂)': 20,
  'EEXI': 0,
}


const convertText = (key, names) => {
  if (names) {
    return names[key]
  } else {
    return key;
  }
}

</script>

<style scoped>
.anual-cii-report>div:not(:first-child) {
  height: calc(100% - 72px);
}

.anualReport-page {
  height: calc(100vh - 65px - 64px - 32px);
  display: flex;
}

.anualReport-page .detailinfo {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto
}

.anualReport-container {
  flex: 1 1 auto;
}

/* .anualReport-container {

  height: calc(100% - 64px);
} */

.anualReport-item,
.anualReport-container>div {
  flex: 1 1 40%;
}

.point {
  background-color: #3f69cd;
}

.item-container:not(:last-child) {
  border-bottom: 1px dashed #ffffff34;
}

.item-container {
  padding: 8px 0;
}

.item-container>div {
  flex: 1 1 40%;
}

.dataKey {
  font-weight: 300;
}

.dataValue {
  font-weight: 400;
}

.cii-anual-item {
  height: 100vh;
  max-height: calc(100% / 2)
}
</style>