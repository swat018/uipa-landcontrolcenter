<template>
  <v-menu v-model="isShowAlarmInfo" :close-on-content-click="false" location="bottom" transition="slide-y-transition"
    offset="10">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-bell" v-bind="props"></v-btn>
    </template>
    <v-card min-width="350" max-height="300" class="py-2 ga-3 border">
      <v-list>
        <v-list-item v-if="summaryAlarms.length == 0" class="text-center">
          <v-list-item>알람 발생 내역이 없습니다</v-list-item>
        </v-list-item>
        <v-list-item v-else value="notifications" 
          v-for="(alarm , index ) in summaryAlarms"
          class="d-flex justify-space-between">
          <template v-slot:prepend="{ props }">
            <div>{{  props }}</div>
            <div>{{ alarm.equipmentName ? alarm.equipmentName : '장비 데이터가 없습니다' }}</div>
          </template>

          <v-list-item-title class="d-flex justfiy-center ga-5" v-if="alarm.equipmentName">
            <div class="danger text-center">{{ alarm.danger ? alarm.danger : 0 }} </div>
            <div class="warning text-center">{{ alarm.warning ? alarm.warning : 0 }}</div>
          </v-list-item-title>

          <template v-slot:append>
            <i-btn text="상세보기"></i-btn>
          </template>
          
        </v-list-item>
      
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { useShipStore } from '@/stores/shipStore'
import emitter from '@/composables/eventbus.js'
import { storeToRefs } from 'pinia';

const alarmStore = useAlarmStore()
const { summaryAlarms } = storeToRefs(alarmStore)

const shipStore = useShipStore()
const { currentShip } = storeToRefs(shipStore)

const isShowAlarmInfo = ref(false)

emitter.on('getCurrentShipEvent', ()=>{
  if(currentShip){
    fetchSummaryAlarm()
  }
})


const fetchSummaryAlarm = async() => {

  const imoNumber = currentShip.value.imoNumber;

  await alarmStore.fetchSummaryAlarm(imoNumber)
}
</script>

<style></style>