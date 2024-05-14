<template>
  <v-sheet class="ma-6 px-6 rounded-lg tabs-container" style="overflow: hidden;">
    <v-tabs v-model="tab" color="#5789FE">
      <v-tab value="monitoring">항차별 CII Monitoring</v-tab>
      <v-tab value="report">연간 CII Report</v-tab>
      <v-tab value="simulation">CII 시뮬레이션</v-tab>
    </v-tabs>

    <v-window v-model="tab" style="overflow: visible;">
      <!-- CII Monitoring -->
      <v-window-item value="monitoring" style="height: calc(100vh - 199px);">
        <CllMonitoring />
      </v-window-item>

      <!-- Report -->
      <v-window-item value="report" style="height: calc(100vh - 199px);">
        <AnualCIIReport />
      </v-window-item>

      <!-- Simulation  -->
      <v-window-item value="simulation" style="height: calc(100vh - 199px);">
        <CllSimulation />
      </v-window-item>
    </v-window>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue'
import AnualCIIReport from '@/views/voyage/cii/AnualCIIReport.vue'
import CllMonitoring from '@/views/voyage/cii/CllMonitoring.vue';
import CllSimulation from '@/views/voyage/cii/CIISimulation.vue';


const tab = ref(null)

</script>

<style scoped>
/* .cii-tab-container .v-window__container {
  flex: 1 1 auto;
}

.cii-tab-container .v-window-item {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
} */
</style>