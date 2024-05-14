<template>
  <!-- <v-dialog ref="popupLayout" model-value="isShow" min-width="280" width="500" :close-on-back="false" :scrim="false"> -->
  <v-sheet class="pa-3 rounded-lg popupLayout d-flex flex-column pointer-cursor" ref="popupLayout" v-if="isShow"
    width="530" max-width="585" min-height="560" max-height="560">
    <div class="d-flex justify-space-between align-center">
      <div class="d-flex align-center mb-2">
        <v-btn icon="mdi-menu" height="40" width="40" class="mr-6 menuBtn" size="x-large" variant="text"
          @click="changeVisibleStatusMenu" style="background : #3c3c3f "></v-btn>
        <div class="d-flex align-center ga-2">
          <div><v-img :src="PanamaLogo" width="25"></v-img></div>
          <div class="boatName">{{ clickedShipInfo.name }}</div>
        </div>
      </div>
      <v-btn icon="mdi-close" height="35" size="small" variant="text" @click="closePopup"></v-btn>
    </div>
    <div>
      <v-navigation-drawer location="left" temporary>
        <PopupMenu></PopupMenu>
      </v-navigation-drawer>
    </div>
    <ShipSummary></ShipSummary>
    <v-divider class="my-2"></v-divider>
    <component :is="components[selectedPopMenu]"></component>
  </v-sheet>
  <!-- </v-dialog> -->
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { useMapStore } from '@/stores/mapStore'

import ShipSummary from '@/components/ship/ShipSummary.vue'
import PopupMenu from '@/views/map/popup/PopupMenu.vue'

import ShipInfo from '@/views/map/part/shipinfo/ShipInfo.vue'
import VoyageList from '@/views/map/part/VoyageList.vue'
import CIIRating from '@/views/map/part/cii/CIIRating.vue'
import EnginePerformance from '@/views/map/part/engine/EnginePerformance.vue'
import INSMonitoring from '@/views/map/part/ins/INSMonitoring.vue'

import emitter from '@/composables/eventbus.js'
import PanamaLogo from '@/assets/images/panama_logo.png'

const mapStore = useMapStore()
const { clickedShipInfo, selectedPopMenu } = storeToRefs(mapStore);

defineProps({
  isShow: {
    type: Boolean,
    defalut: false
  }
})


const emit = defineEmits(['closePopup'])

const components = {
  ShipInfo,
  VoyageList,
  CIIRating,
  EnginePerformance,
  INSMonitoring
}

const popupLayout = ref(null)
const initFleetsAndShip = ref(null)

const boatName = ref('')
emitter.on('clickedShipOnMap', () => {

})

const changeVisibleStatusMenu = () => {
  emitter.emit('changeVisibleMenu')
}

const closePopup = () => {
  emit('closePopup')
  emitter.emit('closePopupMenu')
}

</script>

<style scoped>
.popupLayout {
  position: absolute;
  top: 15px;
  z-index: 999;
  left: 15px;
}

.boatName {
  font-size: 1.4em;
}
</style>