<template>
  <v-sheet class="pa-3 rounded-lg popupLayout pointer-cursor" ref="popupRoute" height="790" v-if="isRouteShow" width="900">
    <!--  국가이미지, 선박명, 닫기 버튼 -->
    <v-sheet class="">
      <div class="d-flex justify-space-between align-center ">
        <div class="d-flex align-center">
          <div class="d-flex align-center ga-4">
            <div class="align-center boatName" style="line-height: 1;">항로계획</div>
          </div>
        </div>
        <v-btn icon="mdi-close" width="" size="small" variant="text" @click="closePopup"></v-btn>
      </div>
    </v-sheet>
    <v-sheet color="#3C3C3F" class="px-3 py-3 d-flex rounded-lg">
      <v-row>
        <v-col cols="5">
          <v-table height="650">
            <colgroup><col width="60%"></col><col width="40%"></col></colgroup>
            <tr>
              <th class="text-center">항로계획명</th>
              <th class="text-center">편집일자</th>
            </tr>
            <tr
              v-for="item in routelist"
              :key="item.routeid"
              @click="route_choice(item.routeid)"
            >
              <td>{{ item.routename }}</td>
              <td>{{ item.modifydate }}</td>
            </tr>
          </v-table>
          <button @click="route_reset()">추가</button>
        </v-col>
        <v-col cols="7">
          <!--<component :is="componentList[currentComponent]" :voccId="_voccId" :userId="selectedUserId" class="h-100"></component>-->
          <v-table height="700" width="480">
            <colgroup><col width="96"><col width="96"><col width="96"><col width="96"><col width="32"><col width="32"></colgroup>
            <tbody>
              <tr>
                <th class="text-center">항로계획명</th><th colspan="5"><input v-model="txt_routenm" placeholder="항로계획명을 입력하세요">{{txt_routenm}}</th>
              </tr>
              <tr>
                <th class="text-center">편집자</th><th><input v-model="makename" placeholder="편집자명을 입력하세요"></th>
                <th class="text-center">편집일자</th><th><p></p></th>
                <th><button @click="">저장</button></th>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-sheet>
  </v-sheet>

</template>

<script setup>

import { onMounted, ref, watch, computed, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouteStore } from '@/stores/routeStore'

const routeStore = useRouteStore()
const { routelist } = storeToRefs(routeStore);



const props = defineProps({
  isRouteShow: {
    type: Boolean,
    defalut: false
  }
})

const emit = defineEmits(['closePopup'])
const closePopup = () => {
  emit('closePopup')
  emitter.emit('closePopupMenu')
}

const route_choice = (id) => {
  const result = routeStore.fetchRouteInfoById(id)
  this.txt_routenm = result[0].routename
  console.log(result);
}

const route_reset = () => {
  alert("추가");
}

</script>

<style scoped>
.popupLayout {
  position: absolute;
  top: 35px;
  z-index: 999;
  left: 15px;
  height: calc(100% - 24px);
}

.boatName {
  font-size: 1rem;
}

.voyage-date {
  color: #6C6C6C;
  font-size: 0.7rem
}

.cii-range .cii-grade {
  flex: 1 0 auto;
  text-align: center;
}

.cii-grade {
  font-size: 0.8rem;
}

.cii-attained-bonudary {
  font-size: 0.6rem;
}

.sub-title {
  color: #aaa;
}

.card-title {
  font-size: 0.9rem;
  line-height: 1;
}

.unit {
  color: #aaa;
  font-size: 0.75rem
}

.v-slider.generator-power.v-input--horizontal>.v-input__control {
  min-height: 15px;
}

.v-slider.v-input--horizontal {
  align-items: center;
  margin-inline: 0px 0px;
}

.voyage-datepicker input[type=date] {
  border: 1px solid #717171;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  width: 100px;
  font-size: 0.65rem;
}

.grade-a {
  background-color: #8CE816
}

.grade-b {
  background-color: #42D2A7;
}

.grade-c {
  background-color: #FEBD19;
}

.grade-d {
  background-color: #F68822;
}

.grade-e {
  background-color: #F04A4A;
}

.grade-icon{
  color : #fff;
  padding : 1px 5px;
  border-radius: 5px;
}

.cii-value {
  /* background: #4e83ff; */
  position: relative;
  width: 20%;
  text-align: center;
  border-radius: 6px;
  margin-left: 90px;
}

.cii-value:after {
  position: absolute;
  left: -13%;
  /* right: 0; */
  /* margin: 0 auto; */
  width: 0;
  height: 0;
  color: #4e83ff;
  font-weight: 600;
  font-size: 1.25rem;
  /* border-top: 10px solid #4e83ff;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent; */
  z-index: 99;
  content: '↓';
  bottom: 25px;
}

.search-text {
  font-size: 0.8rem;
}

.voyage-track-switch .v-selection-control__wrapper {
  width: 25px;
  height: 25px;
}

.voyage-track-switch .v-switch .v-selection-control {
  min-height: 25px;
}

.emphasis-text {
  font-size: 1.2rem;
  color: #4e83ff;
}

.rounded-10 {
  border-radius: 10px;
}

.sub-title.ship,
.sub-desc.ship {
  line-height: 1.2;
}

.sub-desc {
  line-height: 1;
}

.fuel-remainig-container .v-slider-track__background--opacity {
  opacity: 0.5;
}

.track-bg {
  color: #b9c8ef;
}

.gap-2 {
  gap: 1px;
}

.voyage-tracks-container {
  background: #4b4b4b;
  border-radius: 15px;
}
.progressBar .v-slider-thumb__surface::after {
  content: url(data:image/png;base64,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) !important;
}
</style>
