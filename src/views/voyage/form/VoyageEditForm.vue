<template>
  <FormModal>
    <template #title>
      <div>항차 리포트 수정</div>
    </template>
    <template #content>
      <div class="d-flex ga-2">
        <div class="w-50">
          <span>출발지</span>
          <i-selectbox v-model="voyageEditForm.startPort" :items="ports" item-title="name" item-value="code"
         density="compact" bg-color='#434348' placeholder="출발지를 선택하세요"></i-selectbox>
        </div>
        <div class="w-50">
          <span>출발시각</span>
          <div>
            <input type="datetime-local" v-model="voyageEditForm.startTime" class="w-100">
          </div>
        </div>
      </div>
      <div class="d-flex ga-2">
        <div class="w-50">
          <span>도착지</span>
          <i-selectbox v-model="voyageEditForm.endPort" :items="ports" item-title="name" item-value="code"
            density="compact" bg-color='#434348' placeholder="도착지를 선택하세요"></i-selectbox>
        </div>

        <div class="w-50">
          <span>도착시각</span>
          <input type="datetime-local" class="w-100" v-model="voyageEditForm.endTime">
        </div>
      </div>
      <div class="d-flex ga-2">
        <div class="w-50">
          <span>운항시간</span>
          <i-input type="number" v-model="voyageEditForm.underway" placeholder="운항시간을 입력하세요"></i-input>
        </div>
        <div class="w-50">
          <span>운항거리</span>
          <i-input type="number" v-model="voyageEditForm.distance" placeholder="운항거리를 입력하세요"></i-input>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="d-flex justify-end w-100">
        <i-btn text="수정" @click="editVoyage"></i-btn>
      </div>
    </template>
  </FormModal>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch, watchEffect } from 'vue'

import { getAllPort } from '@/api/operationapi.js'
import { getVoyageById } from '@/api/voyage.js'
import { convertDateTimeType, isValidDateRange } from '@/composables/util'
import { useToast } from '@/composables/useToast'

const { showResMsg } = useToast()


import FormModal from '@/components/modal/FormModal.vue'; 
onMounted(() => {
  voyageId.value = props.id
  fetchAllPort()
})

const props = defineProps({
  id : {
    type : Number,
    default : -1
  }
})

const emit = defineEmits('editVoyage')

const voyageId = ref(props.id)

const voyageEditForm = ref({
  id : null,
  startPort: null,
  startTime: null,
  endPort: null,
  endTime: null,
  shipCondition: null,
  underway: 0,
  distance: 0
})

const ports = ref([])

const addVoyage = () => {

}




const fetchVoyage = async (newValue) => {
  console.log('항차 조회')
  console.log('id')
  console.log(props.id)
  const { data: { data: { startPortInfo, startTime, endPortInfo, endTime } } } = await getVoyageById(newValue)

  const { code : startPort } = startPortInfo
  const { code: endPort } = endPortInfo

  voyageEditForm.value.startPort = startPort
  voyageEditForm.value.startTime = convertDateTimeType(startTime)
  voyageEditForm.value.endPort = endPort
  voyageEditForm.value.endTime = convertDateTimeType(endTime)
}

watch(() => props.id, (newValue, oldValue) => {
  voyageId.value = newValue;
  fetchVoyage(newValue)
})

const editVoyage = () => {
  let editForm = {}

  let startTime = new Date(voyageEditForm.value.startTime)
  startTime = startTime.toISOString()
  let endTime = new Date(voyageEditForm.value.endTime)
  endTime = endTime.toISOString()
  editForm.id = props.id
  editForm.startPort = voyageEditForm.value.startPort;
  editForm.startTime = startTime
  editForm.endPort = voyageEditForm.value.endPort;
  editForm.endTime = endTime

  console.log('수정 진행시켜')
  console.dir(editForm)

  emit('editVoyage', editForm)

}

const fetchAllPort = async () => {
  const response = await getAllPort()
  console.dir(response)
  ({ data: { data: ports.value } } = response)
  // console.dir(ports.value)
}





</script>

<style>
input[type='datetime-local']{
  background: #434348;
  padding: 8px;
  border-radius: 4px;
}
</style>