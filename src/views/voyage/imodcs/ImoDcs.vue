<template>
  <v-sheet class="ma-4 pa-4 rounded-lg" color="#222224">
    <v-tabs v-model="tab" color="#5789FE">
      <v-tab value="monitoring">선박연료유 사용량 보고서</v-tab>
      <v-tab value="report">선박연료유 수급현황</v-tab>
      <v-tab value="simulation">선박운항정보현황</v-tab>
      <v-tab value="plan">선박에너지효율관리계획 Part Ⅱ</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="cii-tab-container d-flex flex-column">
      <!-- CII Monitoring -->
      <v-window-item value="monitoring">
        <FuelConsumptionReport />
      </v-window-item>

      <!-- Report -->
      <v-window-item value="report" class="overflow-y-auto">
        <BDNSUmmaries />
        <!-- <div>test2</div> -->
      </v-window-item>
      <v-window-item value="plan">
        <EEDIPlanPart />
      </v-window-item>
      <v-window-item value="simulation">
        <CollectedDataSummaries />
      </v-window-item>
    </v-window>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue'
import FuelConsumptionReport from '@/views/voyage/imodcs/FuelConsumptionReport.vue'
import EEDIPlanPart from '@/views/voyage/imodcs/EEDIPlanPart.vue'
import BDNSUmmaries from '@/views/voyage/imodcs/BDNSummaries.vue'
import CollectedDataSummaries from '@/views/voyage/imodcs/CollectedDataSummaries.vue'

const tab = ref(null)
</script>

<style>
.cii-tab-container .v-window__container {
  flex: 1 1 auto;
}

.cii-tab-container .v-window-item {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
</style>
