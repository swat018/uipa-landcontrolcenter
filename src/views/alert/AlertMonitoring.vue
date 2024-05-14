<template>
  <v-sheet class="detail-page h-100">
    <!-- 엔진, 경보 / 주의, 차트 관련 필터 -->
    <v-sheet class="rounded-lg px-6 py-6 mt-6  " color="#333334">
      <div class="d-flex justify-space-between align-center filter-area ga-2">
        <!-- <div class="align-center">Equipment</div> -->
        <div class="d-flex ga-2">
          <i-selectbox v-model="equipments[0]" :items="equipments" item-title="name" item-value="id"
            variant="solo-filled" density="compact" return-object class="equipmentSelector" bg-color="#434348"
            :hide-details="true" placeholder="Select" :persistent-placeholder="true"></i-selectbox>

          <i-selectbox v-model="statuses[0]" :items="statuses" item-title="name" item-value="id" variant="solo-filled"
            density="compact" return-object class="equipmentSelector" bg-color="#434348" placeholder="Status"
            :hide-details="true"></i-selectbox>
        </div>
        <v-sheet class="rounded-lg" color="#333334">
          <div class="d-flex ga-12 justify-end align-center">
            <div class="alarm-count-container"><span class="alarm-type warning mr-2">●</span>CAUTION <span
                class="warning alarm-count ">5</span></div>
            <div class="alarm-count-container"><span class="alarm-type danger mr-2">●</span>WARNING <span
                class="alarm-count danger">4</span></div>
          </div>
        </v-sheet>
        <div class="d-flex ga-2">
          <div class="d-flex align-center">
            <span class="mr-2">Alert Duration Setting</span>
            <i-selectbox v-model="duration[0]" :items="duration" item-title="name" item-value="id" variant="solo-filled"
              density="compact" return-object class="equipmentSelector" bg-color="#434348"
              :hide-details="true"></i-selectbox>
          </div>

          <div class="d-flex align-center">
            <span class="mr-2">Chart Interval</span>
            <i-selectbox v-model="chartInterval[0]" :items="chartInterval" item-title="name" item-value="id"
              variant="solo-filled" density="compact" return-object class="equipmentSelector" bg-color="#434348"
              :hide-details="true"></i-selectbox>
          </div>
        </div>
      </div>
    </v-sheet>
    <!-- 경보 / 주의 수 출력 -->
    <v-sheet class="mt-6 pa-6 rounded-lg" color="#333334">
      <DxDataGrid id="realAlertGrid" ref="realAlertGrid" class="tabs-filter-container" :column-auto-width="false"
        key-expr="id" @row-click="clickAlert" :data-source="alarmData" show-borders="true">
        <DxSelection mode="single"></DxSelection>
        <DxScrolling mode="virtual" />
        <DxColumn data-field="ralsedTime" caption="RaisedTime" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="status" caption="Status" alignment="center" cell-template="alarm-type-template"
          :allow-editing="false" />
        <DxColumn data-field="id" caption="No" alignment="center" :visible="false" :allow-editing="false"></DxColumn>
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
            <div class="" :class="getColorByAlertType(templateOptions.data.alarmStateType)">●</div>
            <div class="ml-2"> {{ templateOptions.data.alarmStateType }}</div>
          </div>
        </template>

        <DxMasterDetail :enabled="false" template="detailTemplate"></DxMasterDetail>

        <template #detailTemplate="{ data: voyageDetail }">
          <AlertMonitoringDetail :template-data="voyageDetail" />
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

import AlertMonitoringDetail from '@/views/alert/AlertMonitoringDetail.vue'

import alarmData from '@/assets/mockup/alertMonitoring.json'

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

const equipments = ref(['ME1', 'ME2', 'GE1'])
const statuses = ref(['All', 'Caution', 'Warning'])
const duration = ref(['No duration', '10 min', '30 min', '1 hour', '3 hour'])
const chartInterval = ref(['1 min', '3 min', '5 min', '10 min', '30 min', '1 hour'])
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



const clickAlert = (e) => {
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


const getColorByAlertType = (alarmType) => {
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

.warning {
  color: #fff900
}

.danger {
  color: #ff0000;
  border-color: #ff0000;
}

.alarm-type {
  font-size: 1.4rem;
}

.alarm-container{
  font-size: 0.9rem;
}

.alarm-count{
  font-size: 1.2rem;
}

#dx-col-5 {
  text-align: center !important;
}
</style>
