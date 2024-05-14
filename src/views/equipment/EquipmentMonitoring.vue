<template>
  <v-sheet class="pa-6 ma-4 rounded-lg engine-monitoring-page d-flex flex-column">
    <v-tabs v-model="tab" color="#5789FE">
      <v-tab value="mainengine">실시간 기관정보</v-tab>
      <v-tab value="generator">기간별 기관정보</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="engine-monitoring-container d-flex flex-column py-2">
      <!-- Main Engine Monitoring -->
      <v-window-item value="mainengine">
        <EngineRealTimeMonitoring />
      </v-window-item>

      <!-- Generator Engine Monitoring -->
      <v-window-item value="generator">
        <EnginePeriodMonitoring />
      </v-window-item>
    </v-window>
  </v-sheet>
</template>
<script setup>
import { ref, computed } from 'vue'
import EngineRealTimeMonitoring from '@/views/equipment/EngineRealTimeMonitoring.vue'
import EnginePeriodMonitoring from '@/views/equipment/EnginePeriodMonitoring.vue'

const tab = ref(null)
</script>

<style scoped>
.engine-monitoring-page {
  height: calc(100vh - 65px - 32px);
  min-height: 600px;
  overflow: auto;
}

.engine-data-item {
  flex: 1 1 40%;
}

.engine-monitoring-container {
  height: 100%;
}

.engine-monitoring-container .v-window__container {
  flex: 1 1 auto;
}

.engine-monitoring-container .v-window-item {
  display: flex;
  flex: 1 1 auto;
  height: calc(100%);
}

.title {
  font-size: 1.2em;
  ;
}
</style>
