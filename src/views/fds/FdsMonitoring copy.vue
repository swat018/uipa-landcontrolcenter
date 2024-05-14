<template>
  <div class="detail-page container-height">
    <v-sheet class="pa-4 rounded-lg d-flex flex-column">
      <div class="deck-select-container d-flex ga-2 w-40 mb-4">
        <v-autocomplete v-model="fdsData.decks[0]" :items="fdsData.decks" item-title="deckName" item-value="id"
          variant="solo-filled" density="compact" return-object class="equipmentSelector" bg-color="#434348"
          :hide-details="true" placeholder="Deck를 선택해주세요"></v-autocomplete>

        <i-selectbox v-model="sensorTypes[0]" :items="sensorTypes" variant="solo-filled" density="compact"
          class="equipmentSelector" bg-color="#434348" placeholder="SensorType을 선택해주세요"
          :hide-details="true"></i-selectbox>

        <i-selectbox v-model="statuses[0]" :items="statuses" item-title="text" item-value="status" variant="solo-filled"
          density="compact" return-object class="equipmentSelector" bg-color="#434348" placeholder="Status를 선택해주세요"
          :hide-details="true"></i-selectbox>
      </div>

      <div class="d-flex flex-column">
        <!-- 선박 이미지 여부에 따른 숨김 처리 필요  -->
        <div class="d-flex py-4" style="border : 1px solid #5F5F67; height : calc(100vh / 3); background : #000;">
          <div class="floor-plan-container w-100">
            <v-img :src="floorplan" />
          </div>
        </div>


        <div class="data-container mt-2">
          <DxDataGrid id="realAlarmGrid" ref="realAlarmGrid" :column-auto-width="true" key-expr="id"
            :data-source="fdsData.data">
            <DxSelection mode="single"></DxSelection>
            <DxScrolling mode="virtual" row-rendering-mode="virtual" />

            <DxColumn data-field="id" :visible="false"></DxColumn>
            <DxColumn data-field="deckName" caption="Deck" alignment="center" :allow-editing="false"></DxColumn>
            <DxColumn data-field="location" caption="Installation Location" alignment="center" :allow-editing="false" />
            <DxColumn data-field="sensorType" caption="Sensor Type" alignment="center" :allow-editing="false"
              width="10%" />

            <DxColumn data-field="status" caption="status" alignment="center" cell-template="alarm-type-template"
              width="10%" :allow-editing="false">
            </DxColumn>

            <template #alarm-type-template="{ data: templateOptions }">
              <div class="d-flex justify-center ">
                <div class="" :class="getColorByAlarmType(templateOptions.data.status)">●</div>
                <div class="ml-2"> {{ getTextByAlarmType(templateOptions.data.status) }}</div>
              </div>
            </template>

            <DxColumn data-field="description" caption="Description" alignment="center" width="auto"
              :allow-editing="false" cell-template="description-template" />

            <template #description-template="{ data: templateOptions }">
              <div class="d-flex ">
                <div class="ml-2"> {{ getDescriptionByAlarmType(templateOptions.data.status) }}</div>
              </div>
            </template>


          </DxDataGrid>
        </div>
      </div>
    </v-sheet>
  </div>

</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia';
import { useTagStore } from '@/stores/tagStore'
import { useAuthStore } from '@/stores/authStore.js'
import { useVoccStore } from '@/stores/voccStore'
import { useFleetStore } from '@/stores/fleetStore'
import { useShipStore } from '@/stores/shipStore'
import { useAlarmStore } from '@/stores/alarmStore'
import GroupRegisterForm from '@/views/auth/group/GroupRegisterForm.vue'
import { getDxGridInstance, dxGridRefresh, dxGridDeselectAll } from '@/composables/dxGridUtil'
import emitter from '@/composables/eventbus.js'


import fdsData from '@/assets/mockup/fdsMonitoring.json'
import floorplan from '@/assets/images/ship/floorplan/floorPlan2.png'

const sensorTypes = ['열 감지기', '연기 감지기']
const statuses = [
  { id : 1, text : '정상', 'status' : 'normal'},
  { id : 2, text : '신호없음', 'status' : 'warning' },
  { id : 3, text : '경보', 'status' : 'danger' }]

const getColorByAlarmType = (alarmType) => {
  let alarmColor = ''
  switch (alarmType) {
    case 'normal':
      alarmColor = 'normal'
      break;
    case 'warning':
      alarmColor = 'warning'
      break;

    case 'danger':
      alarmColor = 'danger'
      break;
  }
  return alarmColor;
}

const getTextByAlarmType = (alarmType) => {
  let alarmStatus = ''
  switch (alarmType) {
    case 'normal':
      alarmStatus = '정상'
      break;
    case 'warning':
      alarmStatus = '신호없음'
      break;
    case 'danger':
      alarmStatus = '경보'
      break;
  }

  return alarmStatus;
}

const getDescriptionByAlarmType = (alarmType) => {
  let alarmStatus = ''
  switch (alarmType) {
    case 'normal':
      alarmStatus = '센서가 정상 작동하고 있습니다.'
      break;
    case 'warning':
      alarmStatus = '센서가작동하지않거나, 오류를 일으키는 상태입니다'
      break;
    case 'danger':
      alarmStatus = '화재가 감지 되었습니다'
      break;
  }

  return alarmStatus;
}


</script>

<style scoped>
.normal {
  color: #42D2A7;
  border-color: #42D2A7;
}

.warning {
  color: #FD8100
}

.danger {
  color: #F04A4A;
  border-color: #F04A4A;
}

.alarm-type{
  font-size: 1.2em;;
}

.w-40{
  width : 40%;
}

.deck-select-container {
  flex: 1 1 0;
}

.image-container{
  flex : 1 1 0;
}

.data-container{
  flex : 2 2 0;
}

#realAlarmGrid {
  height: 100vh;
  max-height: calc(100vh - (65px + 105px + 16px + 8px* 3));
}


</style>
