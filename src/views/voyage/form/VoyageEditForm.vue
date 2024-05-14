<template>
  <v-dialog :width="700">
    <v-sheet class="pa-4" :height="560">
      <div class="d-flex justify-space-between">
        <div class="title d-flex align-center">항차 리포트 수정</div>
        <v-btn class="d-flex align-center" icon="mdi-close" height="35" size="small" variant="text"
          @click="closePopup"></v-btn>
      </div>
      <div class="report-container d-flex flex-column flex-grow-1 flex-shrink-1">
        <v-tabs v-model="tab" color="#5789FE">
          <v-tab :value="port">출발지 목적지 수정</v-tab>
          <v-tab :value="detail">기타 항목 수정</v-tab>
        </v-tabs>
        <v-window v-model="tab" class="report-container-tab pa-2">
          <v-window-item>
            <div class="d-flex ga-2">
              <div class="w-50">
                <span>Departure</span>
                <v-autocomplete v-model="voyageEditForm.departure" :items="ports" item-title="name" item-value="code"
                  density="compact" bg-color='#434348' placeholder="출발지를 선택하세요" hide-details variant="solo-filled"
                  no-data-text="데이터가 없습니다" />
              </div>
              <div class="w-50">
                <span>DepatureTime</span>
                <div>
                  <input type="datetime-local" v-model="voyageEditForm.departureTime" class="w-100">
                </div>
              </div>
            </div>
            <div class="d-flex ga-2 mt-2">
              <div class="w-50">
                <span>Arrival</span>
                <v-autocomplete v-model="voyageEditForm.arrival" :items="ports" item-title="name" item-value="code"
                  density="compact" bg-color='#434348' placeholder="도착지를 선택하세요" variant="solo-filled"
                  no-data-text="데이터가 없습니다" />
              </div>

              <div class="w-50">
                <span>ArrivalTime</span>
                <input type="datetime-local" class="w-100" v-model="voyageEditForm.arrivalTime">
              </div>
            </div>

            <div class="d-flex justify-end w-100">
              <i-btn text="수정" @click="editVoyageInfo"></i-btn>
            </div>

          </v-window-item>
          <v-window-item>
            <div class="d-flex ga-2">
              <div class="w-50">
                <span>Load</span>
                <i-input type="number" v-model="voyageEditForm.load" placeholder="Load를 입력하세요"></i-input>
              </div>
              <div class="w-50">
                <span>RPM</span>
                <i-input type="number" v-model="voyageEditForm.rpm" placeholder="RPM을 입력하세요"></i-input>
              </div>
            </div>
            <div class="d-flex ga-2">
              <div class="w-50">
                <span>Speed</span>
                <i-input type="number" v-model="voyageEditForm.speed" placeholder="Speed를 입력하세요"></i-input>
              </div>
              <div class="w-50">
                <span>Underway</span>
                <i-input type="number" v-model="voyageEditForm.underway" placeholder="underway를 입력하세요"></i-input>
              </div>
            </div>
            <div class="d-flex ga-2">

              <div class="w-50">
                <span>Distance</span>
                <i-input type="number" v-model="voyageEditForm.distance" placeholder="distance를 입력하세요"></i-input>
              </div>
              <div class="w-50">
                <span>Slip</span>
                <i-input type="number" v-model="voyageEditForm.slip" placeholder="slip을 입력하세요"></i-input>
              </div>
            </div>
            <div class="d-flex ga-2">

              <div class="w-50">
                <span>BF</span>
                <i-input type="number" v-model="voyageEditForm.bf" placeholder="BF를 입력하세요"></i-input>
              </div>
              <div class="w-50">
                <span>FOC</span>
                <i-input type="number" v-model="voyageEditForm.foc" placeholder="DFOC를 입력하세요"></i-input>
              </div>
            </div>

            <div class="d-flex ga-2">
              <div class="w-50">
                <span>EEOI</span>
                <i-input type="number" v-model="voyageEditForm.eeoi" placeholder="EEOI 입력하세요"></i-input>
              </div>
            </div>
            <div class="d-flex justify-end w-100">
              <i-btn text="수정" @click="editVoyage"></i-btn>
            </div>
          </v-window-item>
        </v-window>
      </div>
    </v-sheet>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'

import { getAllPort } from '@/api/operationapi.js'
import { getVoyageById } from '@/api/voyage.js'
import { convertDateTimeType, isValidDateRange, convertFloatFormatObject } from '@/composables/util'
import { useToast } from '@/composables/useToast'

const { showResMsg } = useToast()
const tab = ref(null)

import FormModal from '@/components/modal/FormModal.vue';
onMounted(() => {
  voyageId.value = props.id
  fetchAllPort()
})

const props = defineProps({
  id: {
    type: Number,
    default: -1
  }
})

const emit = defineEmits(['editVoyage', 'editVoyageInfo', 'closePopup'])

const voyageId = ref(props.id)

const voyageEditForm = ref({
  id: null,
  departure: null,
  departureTime: null,
  arrival: null,
  arrivalTime: null,
  load: null,
  rpm: null,
  speed: null,
  underway: null,
  distance: null,
  slip: null,
  bf: null,
  foc: null,
  eeol: null
})

const ports = ref([])
const shipCondition = ['LADEN', 'BALLAST']

const fetchVoyage = async (newValue) => {
  const { data: { data: { departurePortInfo, departureTime, arrivalPortInfo, arrivalTime, ...rest } } } = await getVoyageById(newValue)

  const { code: departure } = departurePortInfo
  const { code: arrival } = arrivalPortInfo
  let etcData = { ...rest}
  voyageEditForm.value = convertFloatFormatObject(etcData)
  voyageEditForm.value.departure = departure
  voyageEditForm.value.departureTime = convertDateTimeType(departureTime)
  voyageEditForm.value.arrival = arrival
  voyageEditForm.value.arrivalTime = convertDateTimeType(arrivalTime)

  console.dir(voyageEditForm)
}

watch(() => props.id, (newValue, oldValue) => {
  if (newValue != null) {
    voyageId.value = newValue;
    fetchVoyage(newValue)
    tab.value = 'port'
  }
})

const editVoyage = () => {
  let editForm = {}
  const { departure, depatureTime, arrival, arrivalTime, ...rest } = voyageEditForm.value
  editForm = rest
  editForm.id = props.id
  // voyageEditForm.value.departureTime = departureTime
  // voyageEditForm.value.arrivalTime = arrivalTime 
  emit('editVoyage', editForm)

  // tab.value = 'port'
}

const editVoyageInfo = () => {
  let editForm = {}
  let departureTime = new Date(voyageEditForm.value.departureTime)
  departureTime = departureTime.toISOString()
  let arrivalTime = new Date(voyageEditForm.value.arrivalTime)
  arrivalTime = arrivalTime.toISOString()
  editForm.id = props.id
  editForm.departure = voyageEditForm.value.departure;
  editForm.departureTime = departureTime
  editForm.arrival = voyageEditForm.value.arrival;
  editForm.arrivalTime = arrivalTime
  
  emit('editVoyageInfo', editForm)
  // tab.value = 'port'
}

const fetchAllPort = async () => {
  // const response = await getAllPort()
  ({ data: { data: ports.value } } = await getAllPort())
}

const closePopup = () => {
  emit('closePopup')
}



</script>

<style scoped>
input[type='datetime-local'] {
  background: #434348;
  padding: 8px;
  border-radius: 4px;
}

.report-container-tab {
  /* height: calc(100% - 64px); */
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.report-container-tab .v-window__container {
  flex: 1 1 auto;
}

.report-container-tab .v-window-item {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.report-container .v-card-actions {
  display: none;
}

.title{
  font-size : 1.2em;
}
</style>