<template>
  <v-card class="pa-4 h-100" color="transparent">
    <v-tabs v-model="tab" color="#5789FE" align-tabs="left">
      <v-tab :value="tabItem[0]">기준연료정보</v-tab>
      <v-tab :value="tabItem[1]">환경규제정보</v-tab>
    </v-tabs>
    <v-window v-model="tab" class="h-100">
      <v-window-item :value="tabItem[0]">
        <FuelInformation></FuelInformation>
      </v-window-item>
      <v-window-item :value="tabItem[1]" class="h-100">
        <ImoDcsInformation></ImoDcsInformation>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import FuelInformation from '@/views/settings/operation/tab/FuelInformation.vue';
import ImoDcsInformation from '@/views/settings/operation/tab/ImoDcsInformation.vue';

const tab = ref('fuel')
const tabItem = ref([
  'fuel', 'imodcs'
])
</script>

<style></style>