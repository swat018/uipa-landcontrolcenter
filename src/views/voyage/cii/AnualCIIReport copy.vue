<template>
  <v-sheet class="anualReport-page">
    <div class="detailinfo">
      <div class="d-flex justify-space-between align-center my-4">
        <!-- <div>Report</div> -->
        <div>
          <i-selectbox v-model="year" :items="years" item-title="name" item-value="id" return-object
            variant="solo-filled" density="comfortable" hide-details>
          </i-selectbox>
        </div>
      </div>

      <div class="anualReport-container d-flex ga-4">
        <div class="d-flex flex-wrap ga-4">
          <div class="anualReport-item">
            <v-sheet class="pa-4 h-100" color="#333334">

              <div>CII Rating</div>
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
          </div>

          <div class="anualReport-item">
            <v-sheet class="pa-4 h-100" color="#333334">
              <div>Vessel Particular</div>
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
          </div>

          <div class="anualReport-item">
            <v-sheet class="pa-4 h-100" color="#333334">
              <div>Fuel Oil Consumption (t)</div>
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
          </div>
          <div class="anualReport-item">
            <v-sheet class="pa-4 h-100" color="#333334">
              <div>Voyage Data</div>
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
          </div>
        </div>

        <div class="d-flex flex-column flex-grow-1 flex-shrink-1 mr-4">
          <AnualCIIChart></AnualCIIChart>
          <AnualCIITable></AnualCIITable>
        </div>
      </div>
    </div>
    <!-- <div v-else>
      <p>데이터가 없습니다</p>
    </div> -->
  </v-sheet>
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
  padding-top: 12px;
  padding-bottom: 12px;
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
</style>