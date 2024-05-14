<template>
  <v-sheet class="ma-6 px-6 rounded-lg tabs-container">
    <v-tabs v-model="tab" color="#5789FE">
      <v-tab value="monitoring">ALERT</v-tab>
      <v-tab value="threshold">THRESHOLD</v-tab>
      <v-tab value="simulation">HISTORY</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="">
      <!-- Alert Monitoring-->
      <v-window-item value="monitoring">
        <AlertMonitoring />
      </v-window-item>

      <!-- THRESHOLD -->
      <v-window-item value="threshold">
        <AlertThreshold />
      </v-window-item>

      <!-- Alert History  -->
      <v-window-item value="simulation">
        <AlertHistory />
      </v-window-item>
    </v-window>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue'
import AlertMonitoring from '@/views/alert/AlertMonitoring.vue'
import AlertThreshold from '@/views/alert/AlertThreshold.vue';
import AlertHistory from '@/views/alert/AlertHistory.vue'

const tab = ref(null)
</script>

<style>

</style>