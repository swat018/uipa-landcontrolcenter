<template>
  <div class="map-container">
    <div class="map" ref="map">
        <!-- 지도 컴포넌트 -->
        <OlMap
        ></OlMap>
    </div>
    <PopupLayout ref="popupLayout" v-model="isShow" :isShow="isShow" @closePopup="isShow = false"></PopupLayout>
    <PopupMenu class="popMenu" ref="popupMenu"></PopupMenu>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, inject } from "vue";
import { onBeforeMount } from "vue";
import { storeToRefs } from 'pinia'
import { useAuthStore } from "@/stores/authStore";
import { useMapStore } from '@/stores/mapStore'
import { changeShipByImoNumber } from '@/api/worldMap.js'
import emitter from '@/composables/eventbus.js'

import OlMap from "@/components/map/OlMap.vue";
const olMap = ref(null);

/**
 * 팝업 레이아웃 import
 */
import PopupLayout from "@/views/map/popup/PopupLayout.vue";
import PopupMenu from '@/views/map/popup/PopupMenu.vue'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const mapStore = useMapStore()
const { clickedShipInfo } = storeToRefs(mapStore)

const popupLayout = ref(null);
const popupMenu = ref(null)
const isShow = ref(false)

const openPopup = () => {
  isShow.value = true;
  return isShow.value;
}

/**
 * 좌측 사이드바에서 선박 선택했을 때, 선박 imoNumber 전달받는 함수
 * @param {} imoNumbers imoNumber 목록
 */
emitter.on('selectedShip', (imoNumbers) => {

  alert(imoNumbers)
  // 지도에 선박 표시하는 함수 호출
})


emitter.on('clickShipName', (imoNumber) => {
  clickShip(imoNumber)
})

const clickShip = async (imoNumber) => {

  await mapStore.fetchShipSummary(imoNumber);

  console.log(!clickedShipInfo.value)

  if (clickedShipInfo.value) {
    const response = openPopup();

    // 팝업창 띄우는 함수

    if (response) {
      emitter.emit('clickedShipOnMap', imoNumber)

      // 백엔드에 Ship이 변경되었다고 알려주는 함수
      let uuid = userInfo.value.uuid
      changeShipByImoNumber(uuid, imoNumber)
    }
  }
}


</script>

<style scoped>
.map-container{
  position: relative;
}
</style>
