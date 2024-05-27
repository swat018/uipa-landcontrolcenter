<template>
  <v-sheet class="d-flex ga-12 rounded-lg px-6 py-2">
    <v-sheet v-if="hasNullKey" class="d-flex ga-4 w-75">
      <v-sheet class="d-flex align-center w-25">
        <v-btn class="mr-1" color="indigo" size="small" icon="mdi-cloud-upload"></v-btn>
        <div>
          <div class="vessel-info-title">Vessel Name</div>
          <div>{{ curSelectedShip.name }}</div>
        </div>
      </v-sheet>
      <v-sheet class="d-flex align-center ga-2 w-25">
        <v-btn class="mr-1" color="indigo" size="small" icon="mdi-cloud-upload"></v-btn>
        <div>
          <div class="vessel-info-title">Vessel Type</div>
          <div>{{ curSelectedShip.type }}</div>
        </div>
      </v-sheet>
      <v-sheet class="d-flex align-center ga-2 w-25">
        <v-btn class="mr-1" color="indigo" size="small" icon="mdi-cloud-upload"></v-btn>
        <div>
          <div class="vessel-info-title">IMO Number</div>
          <div>{{ curSelectedShip.imoNumber }}</div>
        </div>
      </v-sheet>
      <v-sheet class="d-flex align-center ga-2 w-25">
        <v-btn class="mr-1" color="indigo" size="small" icon="mdi-cloud-upload"></v-btn>
        <div>
          <div class="vessel-info-title">MMSI Number</div>
          <div>{{ curSelectedShip.mmsiNumber }}</div>
        </div>
      </v-sheet>
    </v-sheet>
    <v-sheet v-else>
      <div>선택한 선박이 없습니다.</div>
      <div>선박명을 클릭해주세요</div>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

const validationField = ['name', 'type', 'imoNumber', 'mmsiNumber']

const hasNullKey = () => {
  return validationField.some((key) => curSelectedShip[key] === null)
}
</script>

<style lang="scss" scoped>
.vessel-info-title {
  font-size: 0.8rem;
  color: #aaa;
}
</style>
>
