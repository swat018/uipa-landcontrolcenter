<template>
  <div class="pa-4">
    <v-sheet class="pa-4 rounded-lg cii-container">
      <v-tabs v-model="tab" color="#5789FE">
        <v-tab value="monitoring">항차별 CII Monitoring</v-tab>
        <v-tab value="report">연간 CII Report</v-tab>
        <v-tab value="simulation">CII 시뮬레이션</v-tab>
      </v-tabs>

      <v-window v-model="tab" class="cii-tab-container d-flex flex-column">
        <!-- CCTV -->
        <v-window-item value="monitoring">
          <CllMonitoring></CllMonitoring>
        </v-window-item>

        <!-- AnualCIIReport -->
        <v-window-item value="report" class="overflow-y-auto">
          <AnualCIIReport></AnualCIIReport>
          <!-- <div>test2</div> -->
        </v-window-item>

        <!-- RADAR  -->
        <v-window-item value="simulation">
          <!-- <div>test3</div> -->
        </v-window-item>
      </v-window>
    </v-sheet>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import ShipFilter from '@/components/ShipFilter.vue';
import AnualCIIReport from '@/views/voyage/cii/AnualCIIReport.vue'
import CllMonitoring from '@/views/voyage/cii/CllMonitoring.vue';


const tab = ref('monitoring')
</script>

<style>
.cii-tab-container .v-window__container {
  flex: 1 1 auto;
}

.cii-tab-container .v-window-item {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
</style>