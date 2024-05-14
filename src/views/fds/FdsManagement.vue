<template>
  <v-sheet class="ma-6 px-6 rounded-lg tabs-container">
    <v-tabs v-model="tab" color="#5789FE">
      <v-tab value="monitoring">화재감지 모니터링</v-tab>
      <v-tab value="sensor">센서관리</v-tab>
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
import SensorManagement from '@/views/fds/SensorManagement.vue';

const tab = ref(null)
</script>

<style scoped>
.normal {
  color: #42D2A7;
  border-color: #42D2A7;
}

.warning {
  color: #FD8100
}

.danger {
  color: #F04A4A;
  border-color: #F04A4A;
}

.alarm-type{
  font-size: 1.2em;;
}

.w-40{
  width : 40%;
}

.fds-container{
  height: calc(100vh - 65px - 32px);
}
.fds-tab-container{
  height: calc(100% - 48px);
}

.v-window.fds-tab-container .v-window__container {
  flex: 1 1 auto;
}

.fds-tab-container .v-window-item {
  flex: 1 1 auto;
  height: 100%;
}
</style>
