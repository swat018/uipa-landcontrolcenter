<template>
  <v-container
    fluid
    class="detail-page pa-0 tab-content-container"
    style="height: calc(100vh - 65px - 24px - 62px - 44px)"
  >
    <v-row no-gutters class="h-100 settings">
      <v-col cols="12" class="h-100">
        <v-card class="operation-info rounded-lg h-100">
          <v-card-title class="h-auto py-6">
            <div class="d-flex justify-space-between align-center">
              <div class="align-self-center" style="line-height: 1">선박 제원 관리</div>
            </div>
          </v-card-title>
          <v-card-text class="py-0">
            <v-sheet class="tab-card operation-equipment-area">
              <v-sheet class="">
                <div class="title mb-2">M/E</div>
                <div class="operation-container d-flex flex-wrap ga-2">
                  <div class="operation-info-item">
                    <div class="mt-1 mb-1">M/E Count</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.mainEngineCount"
                      placeholder="M/E 개수를 입력하여 주십시오"
                    >
                    </i-input>
                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">Max Power</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.mainEngineMaxPower"
                      placeholder="메인엔진의 최대 파워를 입력하여 주십시오"
                    >
                    </i-input>
                  </div>

                  <div class="operation-info-item">
                    <div class="mb-1">T/C Count</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.mainEngineTurboChargerCount"
                      placeholder="메인엔진의 T/C 개수를 입력하여 주십시오"
                    >
                    </i-input>
                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">Max Speed</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.mainEngineMaxPower"
                      placeholder="메인엔진의 최대 파워를 입력하여 주십시오"
                    >
                    </i-input>
                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">Cylinder Count</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.mainEngineCylinderCount"
                      placeholder="메인엔진의 Cyl 개수를 입력하여 주십시오"
                    >
                    </i-input>
                  </div>
                </div>
              </v-sheet>
              <v-sheet class="mt-4">
                <div class="title mb-2">G/E</div>
                <div class="operation-container d-flex flex-wrap ga-2">
                  <div class="operation-info-item">
                    <div class="mb-1">G/E Count</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.generatorEngineCount"
                      placeholder="G/E 개수를 입력하여 주십시오"
                    >
                    </i-input>
                  </div>

                  <div class="operation-info-item">
                    <div class="mb-1">Max Power</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.generatorEngineMaxPower"
                      placeholder="발전기의 최대 파워(생산량)을 입력하여 주십시오"
                    >
                    </i-input>
                  </div>

                  <div class="operation-info-item">
                    <div class="mb-1">T/C Count</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.generatorEngineTurboChargerCount"
                      placeholder="발전기의 T/C 개수를 입력하여 주십시오"
                    >
                    </i-input>
                  </div>

                  <div class="operation-info-item">
                    <div class="mb-1">Max Speed</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.generatorEngineMaxPower"
                      placeholder="발전기의 최대 파워(생산량)을 입력하여 주십시오"
                    >
                    </i-input>
                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">Cylinder Count</div>
                    <i-input
                      type="number"
                      v-model="equipmentInfo.generatorEngineCylinderCount"
                      placeholder="발전기의 Cyl 개수를 입력하여 주십시오"
                    >
                    </i-input>
                  </div>
                </div>
              </v-sheet>
              <v-sheet class="mt-4">
                <div class="title mb-2">Fuel</div>
                <div class="operation-container d-flex flex-wrap">
                  <div class="operation-info-item cylinder">
                    <div class="mb-1">Used Fuel Type</div>
                    <i-selectbox
                      v-model="selectedFules"
                      :items="fules"
                      item-title="text"
                      item-value="value"
                      multiple
                      chips
                      density="compact"
                      bg-color="#434348"
                      hide-details
                    >
                    </i-selectbox>
                  </div>
                </div>
              </v-sheet>
              <v-sheet class="d-flex justify-end">
                <i-btn
                  @click="updateShipDetailInfo"
                  class="d-flex align-self-center mb-2"
                  text="수정"
                ></i-btn>
              </v-sheet>
              <!-- <div class="d-flex align-self-end"></div> -->
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { getShipMachineInfo, updateShipMachineInfo } from '@/api/shipApi'

import { useToast } from '@/composables/useToast'

const { showResMsg } = useToast()

const props = defineProps({
  selectedShipImoNumber: {
    type: [String]
  }
})

const fules = [
  { text: 'HFO', value: 'HFO' },
  { text: 'LFO', value: 'LFO' },
  { text: 'MDO', value: 'MDO' },
  { text: 'MGO', value: 'MGO' },
  { text: 'LPG', value: 'LPG' },
  { text: 'LNG', value: 'LNG' }
]
const selectedFules = ref([])

const equipmentInfo = ref({})

onMounted(() => {
  fetchShipMachineInfo()
})

const fetchShipMachineInfo = async () => {
  let imoNumber = props.selectedShipImoNumber
  const {
    data: { data }
  } = await getShipMachineInfo(imoNumber)
  equipmentInfo.value = data
  selectedFules.value = Object.keys(data)
    .filter((key) => key.startsWith('use') && data[key] == true)
    .map((key) => key.replace('use', '').toUpperCase())
}

const updateShipDetailInfo = async () => {
  let editInfo

  const selectedFuelInfo = {
    useHfo: selectedFules.value.includes('HFO'),
    useLfo: selectedFules.value.includes('LFO'),
    useMdo: selectedFules.value.includes('MDO'),
    useMgo: selectedFules.value.includes('MGO'),
    useLpg: selectedFules.value.includes('LPG'),
    useLng: selectedFules.value.includes('LNG')
  }

  editInfo = { ...equipmentInfo.value, ...selectedFuelInfo }

  const response = await updateShipMachineInfo(editInfo)
  if (response.status == 200) {
    equipmentInfo.value = editInfo
    showResMsg('선박 제원 정보가 수정되었습니다')
  }
}

watch(() => props.selectedShipImoNumber, fetchShipMachineInfo, { immediate: true })
</script>

<style scoped>
.v-field .v-chip {
  height: calc(var(--v-chip-height) + 0px);
  background: #5789fe;
}

.operation-info-item {
  flex: 1 1 40%;
}

.operation-info-item.cylinder {
  flex: 0 0 49%;
}
</style>
