<template>
  <v-sheet class="ma-6 px-3 rounded-lg tabs-container">
    <v-tabs v-model="tab" class="tabs-button" color="#5789FE">
      <v-tab value="ecdis">ECDIS</v-tab>
      <v-tab value="radar">RADAR</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- ECDIS Monitoring -->
      <v-window-item value="ecdis">
        <ECDISMonitoring />
      </v-window-item>

      <!-- RADAR Monitoring-->
      <v-window-item value="radar">
        <RADARMonitoring />
      </v-window-item>
    </v-window>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue'

import ECDISMonitoring from '@/views/ins/ECDISMonitoring.vue'
import RADARMonitoring from '@/views/ins/RADARMonitoring.vue'

const tab = ref(null)
</script>

<style scoped></style>
