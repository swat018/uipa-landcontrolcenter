<template>
  <div class="pa-4 container-height">
    <v-sheet class="rounded-lg px-4 py-2">
      <div class="d-flex ga-3">
       <div><span class="danger mr-2">●</span>경보 :  <span> {{ realAlarms.dangerCount ? realAlarms.dangerCount : 0 }} 개</span></div>
       <div><span class="warning mr-2">●</span>주의 : <span>{{ realAlarms.warningCount ? realAlarms.warningCount : 0 }} 개</span></div>
       <div><span class="normal mr-2">●</span>정상 : <span>{{ realAlarms.normalCount ? realAlarms.normalCount : 0 }} 개</span></div>
      </div>
    </v-sheet>
    <v-sheet class="mt-4 pa-4 rounded-lg">
        <DxDataGrid id="realAlarmGrid" ref="realAlarmGrid" class="container-include-filter " key-expr="id" :data-source="realAlarms">
          <DxExport :enabled="true" :allow-export-selected-data="true"/>        

          <DxFilterRow :visible="true" />
          <DxScrolling column-rendering-mode="virtual" />
          <DxColumn data-field="id" caption="id" :visible="false"></DxColumn>
          <DxColumn data-field="alarmStateType" caption="alarmStateType" :visible="false"></DxColumn>
          <DxColumn data-field="description" caption="description" cell-template="alarm-type-template" width="auto"></DxColumn>
          <DxColumn data-field="equipmentName" caption="equipmentName"></DxColumn>
          <DxColumn data-field="tagName" caption="tagName"></DxColumn>
          <DxColumn data-field="value" caption="value" alignment="center"></DxColumn>
          <DxColumn data-field="thresholdLowLow" caption="thresholdLowLow" :visible="true" alignment="center"></DxColumn>
          <DxColumn data-field="thresholdLow" caption="thresholdLow" alignment="center"></DxColumn>
          <DxColumn data-field="thresholdHigh" caption="thresholdHigh" alignment="center"></DxColumn>
          <DxColumn data-field="thresholdHighHigh" caption="thresholdHighHigh" alignment="center"></DxColumn>
          <DxColumn data-field="occuredTime" caption="occuredTime" alignment="center"></DxColumn>

          <template #alarm-type-template="{ data : templateOptions}">
            <div class="d-flex">
              <div :class="getColorByAlarmType(templateOptions.data.alarmStateType)">●</div>
              <div class="ml-2"> {{ templateOptions.data.description }}</div>
            </div>
          </template>
        </DxDataGrid>      
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

const { proxy } = getCurrentInstance();

const tagStore = useTagStore()
const authStore = useAuthStore()
const voccStore = useVoccStore()
const fleetStore = useFleetStore()
const shipStore = useShipStore()
const alarmStore = useAlarmStore()

const { userInfo } = storeToRefs(authStore)
const { tagList } = storeToRefs(tagStore)
const { voccInfo } = storeToRefs(voccStore)
const { fleets } = storeToRefs(fleetStore)
const { realAlarms } = storeToRefs(alarmStore)

const { currentShip } = storeToRefs(shipStore)

const activeStatus = ref(true)
const showFilterRow = ref(true)

const realAlarmGrid = ref(null)


let interval = null
// 사용자가 선박 변경 시 재 조회
emitter.on('getCurrentShipEvent', () => {
  interval = null
  fetchRealAlarm();
});

onMounted(()=>{
  if(currentShip.value){
    fetchRealAlarm()
  }
})

onBeforeUnmount(() => {
  clearInterval(interval)
  interval = null
})

const fetchRealAlarm = async() => {
  const imoNumber = currentShip.value.imoNumber
  if(imoNumber){
    const result = await alarmStore.fetchRealAlarm(imoNumber);
    if (result == 200 && !interval) {
      interval = setInterval(() => fetchRealAlarm(imoNumber), 60000)
    }
  }
}


const getColorByAlarmType = (alarmType) => {
  let alarmColor = ''
  switch(alarmType){
    case 'NORMAL':
      alarmColor = 'normal'
      break;
    case 'WARNING':
      alarmColor = 'warning'
      break;
    case 'DANGER':
      alarmColor = 'danger'
      break;
  }

  return alarmColor;
}



</script>

<style scoped>
.normal {
  color : #42D2A7;
  border-color : #42D2A7;
}

.warning {
  color : #FD8100
}

.danger {
  color : #F04A4A;
  border-color : #F04A4A;
}
</style>
