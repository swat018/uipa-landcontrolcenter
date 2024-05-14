<template>
  <!-- <div class="detail-page container-height"> -->
  <v-sheet class="py-6 rounded-lg detail-page h-100">
    <v-sheet class="px-6 py-6 mb-6 rounded-lg" color="#333334">
      <div class="d-flex justify-space-between align-center">
        <!-- <div class="align-center">Equipment</div> -->
        <div class="d-flex ga-2">
          <v-autocomplete v-model="fdsData.decks[0]" :items="fdsData.decks" item-title="deckName" item-value="id"
            variant="solo-filled" density="compact" return-object class="equipmentSelector" bg-color="#434348"
            :hide-details="true" placeholder="Deck를 선택해주세요"></v-autocomplete>

          <i-selectbox v-model="sensorTypes[0]" :items="sensorTypes" variant="solo-filled" density="compact"
            class="equipmentSelector" bg-color="#434348" placeholder="SensorType을 선택해주세요"
            :hide-details="true"></i-selectbox>

          <i-selectbox v-model="statuses[0]" :items="statuses" item-title="text" item-value="status"
            variant="solo-filled" density="compact" return-object class="equipmentSelector" bg-color="#434348"
            placeholder="Status를 선택해주세요" :hide-details="true"></i-selectbox>
          <!-- <v-btn icon="mdi-image-outline" @click="displayImage"></v-btn> -->
        </div>
      </div>
    </v-sheet>


    <!-- 선박 이미지 여부에 따른 숨김 처리 필요  -->
    <div v-if="isExistDeckImage" class="deck-image-container d-flex py-4"
      style="border : 1px solid #5F5F67; background : #000; ">
      <div class="floor-plan-container w-100" style="position : relative">
        <v-img :src="floorplan" />
        <div class="sensor-container">
          <div class="sensor first danger-animation">
            <div style="width:15px; height : 15px; background: linear-gradient(to bottom, #ff0000, #d72d33);">
            </div>
          </div>
          <div class="sensor second">●</div>
          <div class="sensor third">●</div>
          <div class="sensor fourth  danger-animation">
            <div style="width:15px; height : 15px; background: linear-gradient(to bottom, #ff0000, #d72d33)">
            </div>
          </div>
          <div class="sensor fifth danger-animation">
            <div style="width:15px; height : 15px; background: linear-gradient(to bottom, #ff0000, #d72d33)">
            </div>
          </div>
          <div class="sensor sixth">●</div>
          <!-- <div class="sensor seventh">●</div> -->
          <div class="sensor eighth">●</div>
          <div class="sensor ninth">●</div>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <DxDataGrid id="realAlarmGrid" ref="realAlarmGrid" key-expr="id" :data-source="fdsData.data"
        :class="isExistDeckImage ? 'deck-image-container' : 'full-container'" :column-auto-width="true"
        :show-borders="true">
        <DxSelection mode="single"></DxSelection>
        <DxScrolling mode="virtual" />

        <DxColumn data-field="id" :visible="false"></DxColumn>
        <DxColumn data-field="deckName" caption="Deck" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="location" caption="Installation Location" alignment="center" :allow-editing="false" />
        <DxColumn data-field="sensorType" caption="Sensor Type" alignment="center" :allow-editing="false" width="10%" />

        <DxColumn data-field="status" caption="status" alignment="center" cell-template="alarm-type-template"
          width="10%" :allow-editing="false">
        </DxColumn>

        <template #alarm-type-template="{ data: templateOptions }">
          <div class="d-flex justify-center ">
            <div class="" :class="getColorByAlarmType(templateOptions.data.status)">●</div>
            <div class="ml-2"> {{ getTextByAlarmType(templateOptions.data.status) }}</div>
          </div>
        </template>

        <DxColumn data-field="description" caption="Description" alignment="center" width="auto" :allow-editing="false"
          cell-template="description-template" />

        <template #description-template="{ data: templateOptions }">
          <div class="d-flex ">
            <div class="ml-2"> {{ getDescriptionByAlarmType(templateOptions.data.status) }}</div>
          </div>
        </template>


      </DxDataGrid>
    </div>
  </v-sheet>
  <!-- </div> -->

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

const isExistDeckImage = ref(true)

const displayImage = () => {
  isExistDeckImage.value = !isExistDeckImage.value
}

const sensorTypes = ['열 감지기', '연기 감지기']
const statuses = [
  { id: 1, text: '정상', 'status': 'normal' },
  { id: 2, text: '신호없음', 'status': 'warning' },
  { id: 3, text: '경보', 'status': 'danger' }]

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
/* .normal {
  color: #42D2A7;
  border-color: #42D2A7;
} */

/* .warning {
  color: #FD8100
}

.danger {
  color: #F04A4A;
  border-color: #F04A4A;
} */

.alarm-type {
  font-size: 1.2em;
  ;
}

.w-40 {
  width: 40%;
}

.deck-select-container {
  flex: 1 1 0;
}

.image-container {
  flex: 1 1 0;
}

.data-container {
  /* flex : 2 2 0; */
  height: 100%;
}

/* #realAlarmGrid {
  height: 100vh;
  max-height: calc(100vh - (65px + 105px + 16px + 8px* 3));
} */

.sensor {
  font-size: 1.5em;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
}

.sensor.first {
  position: absolute;
  top: 14%;
  left: 35%;
  color: red;

}

.sensor.second {
  position: absolute;
  top: 11%;
  right: 38%;
  color: #13D254;

}

.sensor.third {
  position: absolute;
  bottom: 17%;
  left: 37%;
  color: #fff900;

}

.sensor.fourth {
  position: absolute;
  bottom: 20%;
  right: 42%;
  color: red;

}

.sensor.fifth {
  position: absolute;
  top: 14%;
  right: 42%;
  color: red;

}

.sensor.sixth {
  position: absolute;
  top: 10%;
  left: 48%;
  color: #fff900;

}

.sensor.seventh {
  position: absolute;
  top: 30px;
  left: 547px;
  color: red;

}

.sensor.eighth {
  position: absolute;
  bottom: 17%;
  left: 48%;
  color: #13D254;

}

.sensor.ninth {
  position: absolute;
  bottom: 46%;
  left: 46%;
  color: #13D254;

}


.danger-animation {
  border-radius: 100%;
  overflow: hidden;
  animation: fadein .5s;
  animation: pulse 1.5s infinite;
}

@keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeout {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes pulse {
  from {
    box-shadow: 0 0 0 0px rgba(211, 47, 47);
  }

  to {
    box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
  }
}

.deck-image-container{
  height: 100vh;
  max-height: calc((100vh - 65px - 24px - 62px - 24px - 24px - 24px - 40px - 24px - 24px - 24px - 24px ) * 0.5)
}

.full-container{
  height: 100vh;
  max-height: calc(100vh - 65px - 24px - 62px - 24px - 24px - 24px - 40px - 24px - 24px - 24px );
}
</style>
