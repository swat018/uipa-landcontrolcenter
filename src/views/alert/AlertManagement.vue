<template>
  <v-sheet class="ma-6 px-6 rounded-lg tabs-container">
    <v-tabs v-model="tab" class="tabs-button" color="#5789FE">
      <v-tab value="alertlist">Alert List</v-tab>
      <v-tab value="threshold">Threshold</v-tab>
      <v-tab value="history">History</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="">
      <!-- Alert Monitoring-->
      <v-window-item value="alertlist">
        <AlertList />
      </v-window-item>

      <!-- THRESHOLD -->
      <v-window-item value="threshold">
        <AlertThreshold />
      </v-window-item>

      <!-- Alert History  -->
      <v-window-item value="history">
        <AlertHistory />
      </v-window-item>
    </v-window>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue'
import AlertList from '@/views/alert/AlertList.vue'
import AlertThreshold from '@/views/alert/AlertThreshold.vue'
import AlertHistory from '@/views/alert/AlertHistory.vue'

const tab = ref(null)
</script>

<style></style>
