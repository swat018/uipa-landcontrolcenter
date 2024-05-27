<template>
  <v-sheet class="ma-6 px-6 rounded-lg tabs-container">
    <v-tabs v-model="tab" color="#5789FE">
      <v-tab value="realtime">Real-time</v-tab>
      <v-tab value="timebased">Time-based</v-tab>
      <v-tab value="performance">Performance</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="">
      <v-window-item value="realtime">
        <EngineRealTimeMonitoring />
      </v-window-item>

      <v-window-item value="timebased">
        <EnginePeriodMonitoring />
      </v-window-item>

      <v-window-item value="performance">
        <EquipmentPerformance />
      </v-window-item>
    </v-window>
  </v-sheet>
</template>

<script setup>
import { ref, computed } from 'vue'
import EngineRealTimeMonitoring from '@/views/equipment/EngineRealTimeMonitoring.vue'
import EnginePeriodMonitoring from '@/views/equipment/EnginePeriodMonitoring.vue'
import EquipmentPerformance from '@/views/equipment/EquipmentPerformance.vue'

const tab = ref(null)
</script>

<style scoped>
/* .engine-monitoring-page {
  height: calc(100vh - 65px - 32px);
  min-height: 600px;
  overflow: auto;
}
f
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
} */

.title {
  font-size: 1.2em;
}
</style>
