<template>
  <v-card class="sensor-register-area">
    <v-card-title>
      <div>센서 정보 추가</div>
    </v-card-title>
    <v-card-text class="">
      <v-form @submit.prevent="" class="w-100">
        <div class="ga-2">
          <div class="sensor-item">
            <div class="mb-1">Deck</div>
            <i-input
              v-model="sensorRegisterForm.deck"
              :items="sensorData.decks"
              item-title="deckName"
              item-value="id"
              density="compact"
              bg-color="#434348"
              variant="solo-filled"
              placeholder="Deck를 선택하여 주십시오"
              no-data-text="데이터가 없습니다"
              hide-details
              readonly
            />
          </div>
          <div class="sensor-item mt-4">
            <div class="mb-1">Installation Location</div>
            <i-input
              label=""
              type="text"
              v-model="sensorRegisterForm.installationLocation"
              placeholder="Installation Location를 입력하여 주십시오"
              :hide-details="true"
            >
            </i-input>
          </div>
          <div class="sensor-item mt-4">
            <div class="mb-1">Sensor Type</div>
            <i-selectbox
              v-model="sensorRegisterForm.sensorType"
              :items="sensorTypes"
              item-title="title"
              item-value="value"
              variant="solo-filled"
              density="compact"
              bg-color="#434348"
              placeholder="SensorType을 선택해주세요"
              :hide-details="true"
            ></i-selectbox>
          </div>
          <div class="sensor-item mt-4">
            <div class="mb-1">Tag ID</div>
            <i-input
              label="Tag ID"
              type="text"
              v-model="sensorRegisterForm.tagId"
              placeholder="Tag ID를 입력하여 주십시오"
              :hide-details="true"
            >
            </i-input>
          </div>
          <div class="sensor-item mt-4">
            <div class="mb-1">Sensor No</div>
            <i-input
              label="TYPE"
              type="text"
              v-model="sensorRegisterForm.sensorNumber"
              placeholder="Sensor No를 입력하여 주십시오"
              :hide-details="true"
              readonly
            >
            </i-input>
          </div>

          <div class="sensor-item mt-4 d-flex ga-4">
            <div class="flex-grow-1">
              <div class="mb-1">X</div>
              <i-input
                label="TYPE"
                type="number"
                min="0"
                max="99"
                v-model="sensorRegisterForm.posX"
                placeholder="x를 입력하여 주십시오"
                :hide-details="true"
              >
              </i-input>
            </div>

            <div class="flex-grow-1">
              <div class="mb-1">Y</div>
              <i-input
                label="TYPE"
                type="number"
                max="95"
                v-model="sensorRegisterForm.posY"
                placeholder="y를 입력하여 주십시오"
                :hide-details="true"
              >
              </i-input>
            </div>
          </div>
        </div>
        <div class="button-container d-flex ga-4 mt-4">
          <i-btn @click="resetComponent" color="#5E616A" width="48%" text="취소"></i-btn>
          <i-btn type="submit" width="48%" text="등록" @click="registerFDSSensor"></i-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from '@/composables/useToast'
import { isStausOk } from '@/composables/util'
import { saveFDSSensor } from '@/api/fdsApi'
import { useShipStore } from '@/stores/shipStore'
import sensorData from '@/assets/mockup/fdsMonitoring.json'
import _ from 'lodash'

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

const { showResMsg } = useToast()

const props = defineProps({
  deckName: {
    type: String
  },
  sensorListLength: {
    type: Number
  }
})

const sensorTypes = [
  {
    id: 1,
    title: '열 감지기',
    value: 'HEAT'
  },
  {
    id: 2,
    title: '연기 감지기',
    value: 'SMOKE'
  }
]

const emits = defineEmits(['resetComponent', 'updatePos'])

onMounted(() => {
  console.log(props.sensorListLength)
  let selctedShipImoNumber = curSelectedShip.value.imoNumber
  sensorRegisterForm.value.imoNumber = selctedShipImoNumber
  sensorRegisterForm.value.deck = props.deckName
  sensorRegisterForm.value.sensorNumber = props.sensorListLength + 1
  sensorRegisterForm.value.sensorType = sensorTypes[0]['value']
})

const sensorRegisterForm = ref({
  imoNumber: '',
  deck: '',
  installationLocation: '',
  sensorType: '',
  tagId: '',
  sensorNumber: 0,
  posX: 50,
  posY: 50
})
// const changeComponent = inject('changeComponent', 'NoSelectSensor')
// const resetComponent = (e) => {
//   changeComponent(e, 'NoSelectSensor')
// }

const resetComponent = (e) => {
  emits('resetComponent')
}

const registerFDSSensor = async () => {
  let requestForm = _.cloneDeep(sensorRegisterForm.value)
  let posX = requestForm.posX
  let posY = requestForm.posY
  let sensorType = requestForm.sensorType

  console.log(sensorType)

  requestForm.posX = parseInt(posX)
  requestForm.posY = parseInt(posY)
  requestForm.sensorType = sensorType
  delete requestForm.sensorNumber

  const { status } = await saveFDSSensor(requestForm)

  if (isStausOk(status)) {
    showResMsg('FDS 센서가 등록이 완료되었습니다')
    resetComponent()
  }
}

watch(
  sensorRegisterForm,
  () => {
    let posX = sensorRegisterForm.value.posX
    let posY = sensorRegisterForm.value.posY
    emits('updatePos', { type: 'regist', posX, posY })
  },
  { deep: true }
)
</script>

<style scoped>
.title {
  font-size: 1.2em;
  margin-bottom: 16px;
}

.button-container div {
  flex: 1 1 auto;
}

.cancle-button button {
  width: 100%;
}

.register-button {
  width: 100%;
}

.sensor-register-area {
  height: 100vh;
  max-height: calc(100vh - 65px - 24px - 64px - 24px - 24px);
}
</style>
