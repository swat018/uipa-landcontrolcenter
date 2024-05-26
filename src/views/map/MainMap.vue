<template>
  <div class="map-container">
    <div class="map" ref="map">
        <!-- 지도 컴포넌트 -->
        <OlMap :propsdata="imoNumberList"
               :isShow="isShow"
               :isRouteShow="isRouteShow"
               :vesselTrack="vesselTrackStatus"
               :startDate="startDate" :endDate="endDate" :isPastVesselTracks="isPastVesselTracks"
               :layerBright="layerBright" :layerMode="layerMode"
        />
    </div>

    <!-- 팝업 컴포넌트 -->
    <PopupLayout ref="popupLayout" v-model="isShow" :isShow="isShow" @closePopup="isShow = false" ></PopupLayout>
    <PopupRoute ref="popupRoute" v-model="isRouteShow" :isRouteShow="isRouteShow" @closePopup="isRouteShow = false" ></PopupRoute>
    <PopupMenu class="popMenu" ref="popupMenu"></PopupMenu>

    <!-- 배경맵 선택 -->
    <div class="menuBar" style="background-color:rgba(4,82,137,0.3); position: absolute">
      <table class="menuTable-0" >
        <tr>
          <td>
            <input type="radio" id="checkWind" name="weatherOption" class="customRadio"> 풍향/풍속
            <input type="radio" id="checkFlow" name="weatherOption" class="customRadio"> 유향/유속
            <input type="radio" id="checkWave" name="weatherOption" class="customRadio"> 파향/파주기
            <input type="radio" id="checkTempair" name="weatherOption" class="customRadio"> 기온
            <input type="radio" id="checkTempwater" name="weatherOption" class="customRadio"> 수온
          </td>
        </tr>
      </table>
      <table class="menuTable-1">
        <tr>
          <td>
            <button @click="getRouteplan()">항로계획</button>
          </td>
          <td width="20px"></td>
          <td>
            <select id="brightSelect" v-model="layerBright" style='background-color: black; color: white'>
              <option value='Day' selected>Day</option>
              <option value='Dusk'>Dusk</option>
              <option value='Night'>Night</option>
              <option value='Black'>Black Theme</option>
            </select>
          </td>
          <td width="5px">
          </td>
          <td>
            <select id="modeSelect" v-model="layerMode" style='background-color: black; color: white'>
              <option value='Base' selected>Base</option>
              <option value='Standard'>Standard</option>
              <option value='Full'>Full</option>
            </select>
          </td>
        </tr>
      </table>

    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, inject, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from "@/stores/authStore";
import { useMapStore } from '@/stores/mapStore'
import { useRouteStore } from '@/stores/routeStore'
import { getPlanList } from '@/api/routePlanApi'
import { changeShipByImoNumber } from '@/api/worldMap.js'
import emitter from '@/composables/eventbus.js'
import OlMap from "@/components/map/OlMap.vue";

/**
 * 팝업 레이아웃 import
 */
import PopupLayout from "@/views/map/popup/PopupLayout.vue";
import PopupMenu from '@/views/map/popup/PopupMenu.vue';
import PopupRoute from "@/views/map/popup/PopupRoute.vue";

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const mapStore = useMapStore()
const { clickedShipInfo, imoNumberList, vesselTrackStatus, startDate, endDate, isPastVesselTracks, layerBright, layerMode } = storeToRefs(mapStore)

const routeplanStore = useRouteStore()
const { routeMaster, routeDetail, routelist } = storeToRefs(routeplanStore)

const popupLayout = ref(null)
const popupMenu = ref(null)
const popupRoute = ref(null)
const isShow = ref(false)
const isRouteShow = ref(false)



const openPopup = () => {
  isShow.value = true;
  return isShow.value;
}

const openRoutePopup = () => {
  isRouteShow.value = true;
  return isRouteShow.value;
}

// onMounted(() => {
//   layerBright.value = 'Day'
//   layerMode.value = 'Base'
// });

/**
 * 좌측 사이드바에서 선박 선택했을 때, 선박 imoNumber 전달받는 함수
 * @param {} imoNumbers imoNumber 목록
 */
emitter.on('selectedShip', (imoNumbers) => {
  // alert(imoNumbers)
  // 지도에 선박 표시하는 함수 호출
  imoNumberList.value = imoNumbers;
  emitter.emit('imoNumberList', imoNumbers);
})

/**
 * 지도에서 선박 클릭했을 때, 선박 imoNumber 전달받는 함수
 * @param {} imoNumber imoNumber
 */
emitter.on('clickShipName', (imoNumber) => {
  clickShip(imoNumber)
})

/**
 * 지도에서 선박 클릭했을 때, 팝업창 띄우는 함수
 * @param {} imoNumber imoNumber
 */
const clickShip = async (imoNumber) => {

  await mapStore.fetchShipSummary(imoNumber);

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

emitter.on('clickTrackStatus', (status) => {
  // console.log(status, clickedShipInfo.value.imoNumber);
  vesselTrackStatus.value = status;
})

emitter.on('inputStartDate', (value) => {
  startDate.value = value;
})

emitter.on('inputEndDate', (value) => {
  endDate.value = value;
})

emitter.on('clickPastVesselTracks', (value) => {
  isPastVesselTracks.value = value;
})

watch(vesselTrackStatus, (value) => {
  console.log(value);
})

watch(startDate, (value) => {
  console.log(value);
})

watch(endDate, (value) => {
  console.log(value);
})
watch(isPastVesselTracks, (value) => {
  console.log(value);
})

function getRouteplan() {
      getPlanList().then((response) => {
        routelist.value = response
        console.log(routelist);
        openRoutePopup();
      });
    }
</script>

<style scoped>
.map-container{
  position: relative;
}
.menuBar {
  width: 100%;
  height: 25px;
  background: #82837f96;
}
.menuBar select {
  -webkit-appearance: listbox;
  border-style: solid;
  background: #82837f96;
}
.menuBar select option {
  background: #82837f96;
}
.menuTable-0 {
  padding-left: 1em;
  display: inline-block;
  float: left;
  margin-right: 1em;
}
.menuTable-1 {
  display: inline-block;
  float: right;
  margin-right: 1em;
}
</style>
