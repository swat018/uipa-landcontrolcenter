<template>
  <v-sheet class="detail-page h-100 py-6">
    <!-- 날짜 필터 -->
    <v-sheet class=" px-6 py-6 rounded-lg" color="#333334">
      <div class="d-flex justify-space-between align-center">
        <!-- <div class="align-center">Equipment</div> -->
        <div class="d-flex ga-2">
          <input class="noticeList-datePicker" type="date" v-model="startDate" />
          <input class="noticeList-datePicker" type="date" v-model="endDate" />
          <i-selectbox v-model="equipments[0]" :items="equipments" item-title="name" item-value="id"
            variant="solo-filled" density="compact" return-object class="equipmentSelector" bg-color="#434348"
            :hide-details="true"></i-selectbox>

          <i-selectbox v-model="statuses[0]" :items="statuses" item-title="name" item-value="id" variant="solo-filled"
            density="compact" return-object class="equipmentSelector" bg-color="#434348"
            :hide-details="true"></i-selectbox>
          <i-btn @click="periodData()" text="조회"></i-btn>
        </div>

        <div class="d-flex ga-2">
          <div class="d-flex align-center">
            <span class="mr-6" style="font-size : 1rem">Chart Interval</span>
            <i-selectbox v-model="chartInterval[0]" :items="chartInterval" item-title="name" item-value="id"
              variant="solo-filled" density="compact" return-object class="equipmentSelector" bg-color="#434348"
              :hide-details="true"></i-selectbox>
          </div>
        </div>
      </div>
    </v-sheet>
    <v-sheet class="mt-6 pa-6 rounded-lg" color="#333334">
      <DxDataGrid id="alarmHistoryGrid" ref="alarmHistoryGrid" class="tabs-filter-container" :column-auto-width="false"
        key-expr="id" @row-click="clickAlarm" :data-source="alarmData" :show-borders="true">
        <DxSelection mode="single"></DxSelection>
        <DxScrolling mode="virtual" />
        <DxColumn data-field="id" caption="No" alignment="center" :visible="false" :allow-editing="false"></DxColumn>
        <DxColumn data-field="ralsedTime" caption="RalsedTime" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="status" caption="status" alignment="center" cell-template="alarm-type-template"
          :allow-editing="false">
        </DxColumn>
        <DxColumn data-field="alarmStateType" caption="alarmStateType" :visible="false"></DxColumn>
        <DxColumn data-field="description" caption="Description" width="20%" :allow-editing="false">
        </DxColumn>
        <DxColumn data-field="equipmentNo" caption="Equip No" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="tagId" caption="Tag ID" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="caution" caption="Caution" :visible="true" alignment="center" :allow-editing="false">
        </DxColumn>
        <DxColumn data-field="warning" caption="Warning" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="value" caption="value" alignment="center" :allow-editing="false"></DxColumn>


        <template #alarm-type-template="{ data: templateOptions }">
          <div class="d-flex ">
            <div class="" :class="getColorByAlarmType(templateOptions.data.alarmStateType)">●</div>
            <div class="ml-2"> {{ templateOptions.data.alarmStateType }}</div>
          </div>
        </template>

        <DxMasterDetail :enabled="false" template="detailTemplate"></DxMasterDetail>

        <template #detailTemplate="{ data: alertHistory }">
          <AlertHistoryDetail :template-data="alertHistory" />
        </template>
      </DxDataGrid>
    </v-sheet>
  </v-sheet>

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

import AlertHistoryDetail from '@/views/alert/AlertHistoryDetail.vue'

import alarmData from '@/assets/mockup/alertMonitoring.json'

const { proxy } = getCurrentInstance();

const equipments = ref(['ME1', 'ME2', 'GE1'])
const statuses = ref(['All', 'Caution', 'Warning'])
const chartInterval = ref(['1 min', '3 min', '5 min', '10 min', '30 min', '1 hour'])

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

const alarmHistoryGrid = ref(null)




let interval = null
// 사용자가 선박 변경 시 재 조회
emitter.on('getCurrentShipEvent', () => {
  interval = null
  fetchRealAlarm();
});

onMounted(() => {
  if (currentShip.value) {
    fetchRealAlarm()
  }
})

onBeforeUnmount(() => {
  clearInterval(interval)
  interval = null
})



const clickAlarm = (e) => {
  const isExpanded = e.component.isRowExpanded(e.key)

  if (e.rowType == "detail")
    return;

  if (isExpanded) {
    e.component.collapseRow(e.key)
  } else {
    e.component.collapseAll(-1);
    e.component.expandRow(e.key);
  }
}

const fetchRealAlarm = async () => {
  const imoNumber = currentShip.value.imoNumber
  if (imoNumber) {
    const result = await alarmStore.fetchRealAlarm(imoNumber);
    if (result == 200 && !interval) {
      interval = setInterval(() => fetchRealAlarm(imoNumber), 60000)
    }
  }
}


const getColorByAlarmType = (alarmType) => {
  let alarmColor = ''
  switch (alarmType) {
    case 'NORMAL':
      alarmColor = 'normal'
      break;
    case 'Low':
      alarmColor = 'warning'
      break;
    case 'High':
      alarmColor = 'warning'
      break;
    case 'Low Low':
      alarmColor = 'danger'
      break;
    case 'High High':
      alarmColor = 'danger'
      break;
  }

  return alarmColor;
}



</script>

<style scoped>
.normal {
  color: #42D2A7;
  border-color: #42D2A7;
}


.alarm-type {
  font-size: 1.2em;
  ;
}

#dx-col-5 {
  text-align: center !important;
}
</style>
