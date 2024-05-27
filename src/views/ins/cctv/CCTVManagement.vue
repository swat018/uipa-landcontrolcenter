<template>
  <v-sheet class="ma-6 px-3 rounded-lg tabs-container">
    <v-tabs v-model="tab" class="tabs-button" color="#5789FE">
      <v-tab value="monitoring">Real-time</v-tab>
      <v-tab value="history">Time-based</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- CII Monitoring -->
      <v-window-item value="monitoring">
        <CCTVMonitoring />
      </v-window-item>

      <!-- Sensor -->
      <v-window-item value="history">
        <CCTVHistory />
      </v-window-item>
    </v-window>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue'

import CCTVMonitoring from '@/views/ins/cctv/CCTVMonitoring.vue'
import CCTVHistory from '@/views/ins/cctv/CCTVHistory.vue'

const tab = ref(null)
</script>

<style scoped>
/* .ins-cctv-container {
  height: calc(100vh - 65px - 32px);
}

.ins-cctv-tab-container{
  height: calc(100% - 48px);
}

.v-window.ins-cctv-tab-container .v-window__container{
  flex : 1 1 auto;
}

.ins-cctv-tab-container .v-window-item{
  display: flex;
  flex: 1 1 auto;
  height: calc(100%);
}

@media screen and (max-height : 800px) {
  .ins-cctv-container {
    overflow: auto;
    height: 100vh;
  }
} */
</style>
