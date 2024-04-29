<template>
  <div class="w-20 pa-2 progressBar-wrap pointer-cursor">
    <div class="float-left pl-2">
      <div class="distance-title text-center">{{ aisInfo.startPort }}</div>
      <div class="desc">{{ aisInfo.startTime }}</div>
    </div>

    <div class="float-left progressBar-style">
      <v-slider v-model="progress" :thumb-size="10" color="#4E83FF"
        :thumb-label="true" rounded readonly hide-details class="progressBar pointer-cursor"></v-slider></div>
    <div class="float-right pr-2">
      <div class="distance-title text-center">{{ aisInfo.endPort}}</div>
      <div class="desc">{{ aisInfo.endTime }}</div>
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMapStore } from '@/stores/mapStore'

import emitter from '@/composables/eventbus.js'

const mapStore = useMapStore()
const { aisInfo } = storeToRefs(mapStore)

const progress = ref(aisInfo.progress)


// emitter.on('fetchAisInfo', ())

</script>

<style scoped>
.progressBar-wrap {
  background: #282828;
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
}

.progressBar-style {
  position: absolute;
  left: 25%;
  right: 23%;
  top: 40%;
}

.distance-title {
  font-size: 0.8em;
}

.desc {
  color: #ADB2B8;
  font-size: 0.8em;
  ;
}

.v-slider.v-input--horizontal>.v-input__control {
  min-height: 15px !important;
}

.w-20 {
  width: 20%;
}
</style>