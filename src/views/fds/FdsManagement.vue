<template>
  <v-sheet class="mx-3 mt-3 rounded-lg">
    <SelectedShipSummary />
  </v-sheet>
  <v-sheet class="ma-3 px-3 rounded-lg tabs-container ship-summary">
    <v-tabs v-model="tab" class="tabs-button" color="#5789FE">
      <v-tab value="monitoring">Real-time</v-tab>
      <v-tab value="sensor">Sensor Management</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- FDS Monitoring -->
      <v-window-item value="monitoring">
        <FdsMonitoring />
      </v-window-item>

      <!-- Sensor Management -->
      <v-window-item value="sensor">
        <SensorManagement />
      </v-window-item>
    </v-window>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue'

import SelectedShipSummary from '@/components/ship/SelectedShipSummary.vue'
import FdsMonitoring from '@/views/fds/FdsMonitoring.vue'
import SensorManagement from '@/views/fds/SensorManagement.vue'

const tab = ref(null)
</script>

<style scoped></style>
