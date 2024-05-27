<template>
  <v-sheet class="ma-6 px-6 rounded-lg tabs-container">
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

import FdsMonitoring from '@/views/fds/FdsMonitoring.vue'
import SensorManagement from '@/views/fds/SensorManagement.vue'

const tab = ref(null)
</script>

<style scoped></style>
