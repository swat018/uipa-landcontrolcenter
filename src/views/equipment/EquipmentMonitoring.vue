<template>
  <v-sheet class="engine-monitoring-page pa-4 ma-4 overflow-y-auto">
    <div class="d-flex justify-space-between align-start my-4">
      <div class="content-title">Engine Data monitoring</div>
      <div class="d-flex  align-center ">
        <!-- <div>Equipment</div> -->
        <i-selectbox v-model="equipmentName" :items="equipments" item-title="name" item-value="id" variant="solo-filled"
          density="compact" return-object class="equipmentSelector" bg-color="#434348"
          :hide-details="true"></i-selectbox>
      </div>
    </div>

    <div class="engine-data-container d-flex ga-4">
      <div class="d-flex flex-wrap ga-4">
        <div class="engine-data-item">
          <ReportItem title="MainEngine" :data="mainEngine1" :names="mainEngineNames" />
        </div>
        <div class="engine-data-item">
          <ReportItem title="TurboCharger 1" :data="turboCharger1" :names="turboChargerNames"></ReportItem>
        </div>
        <div class="engine-data-item">
          <ReportItem title="TurboCharger 2" :data="turboCharger2" :names="turboChargerNames"></ReportItem>
        </div>
        <div class="engine-data-item">
          <ReportItem title="Voyage Data" :data="turboCharger2"></ReportItem>
        </div>
      </div>

      <div class="d-flex flex-column flex-grow-1 flex-shrink-1 mr-4">

        <LineChart class="engine-data-item" :series="series"></LineChart>
        <AnualCIIChart class="engine-data-item"></AnualCIIChart>
        <AnualCIIChart class="engine-data-item"></AnualCIIChart>
        <AnualCIIChart></AnualCIIChart>
        <AnualCIIChart class="engine-data-item"></AnualCIIChart>

      </div>
    </div>

    <div>
      실린더
    </div>
  </v-sheet>
</template>
<script setup>
import ShipFilter from '@/components/ShipFilter.vue'
import ReportItem from '@/components/voyage/ReportItem.vue'
import AnualCIIChart from '@/views/voyage/cii/AnualCIIChart.vue'
import AnualCIITable from '@/views/voyage/cii/AnualCIITable.vue'
import LineChart from '@/components/echart/LineChart.vue'

const mainEngine1 = {
  runningHours : '15,346.6',
  power : '8,102.5',
  load : 67.9,
  speed : 87.3,
  ScavAirPress : 1.71,
  ScavAirTemp : 44.6,
  mainLoInletPress : 2.6,
  mainLoInletTemp : 46.2
}

const mainEngineNames = {
  runningHours : 'Running Hours',
  power: 'Power',
  load : 'Load',
  speed : 'Speed',
  ScavAirPress: 'Scav. Air Press',
  ScavAirTemp : 'Scav. Air Temp',
  mainLoInletPress: 'Main L.O Inlet Press',
  mainLoInletTemp: 'Main L.O Inlet temp'
}

const turboCharger1 = {
  speed : '11651.5',
  exhGasInletTemp : '336.1',
  exhGasOutletTemp : 208.1,
  exhGasTempDiff : 127.9,
  intakeAirTemp : 30.1
}

const turboCharger2 = {
  speed: '11651.5',
  exhGasInletTemp: '336.1',
  exhGasOutletTemp: 208.1,
  exhGasTempDiff: 127.9,
  intakeAirTemp: 30.1
}

const turboChargerNames = {
  speed: 'Speed',
  exhGasInletTemp: 'Exh.gas Inlet Temp',
  exhGasOutletTemp: 'Exh.gas Oulet Temp',
  exhGasTempDiff: 'Exh.gas Temp Diff',
  intakeAirTemp: 'Intake Air Temp',
}

const series = [
  {
    name: 'Speed',
    type: 'line',
    stack: 'Total',
    data: [120, 132, 101, 134, 90, 230, 210],
    markLine: {
      label: {
        position: 'insideStartTop',
        formatter: 'Average : {c}',
      },
      data: [{ type: 'average', name: 'Avg' }]
    }
  },
]
</script>

<style scoped>
.engine-monitoring-page{
  height: calc(100vh - 65px - 32px);
}
.engine-data-item {
  flex : 1 1 40%;
}
</style>
