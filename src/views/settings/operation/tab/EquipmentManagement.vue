<template>
  <v-container fluid class="detail-page pa-0 tab-content-container"
    style="height : calc(100vh - 65px - 24px - 62px - 44px)">
    <v-row no-gutters class="h-100 settings">
      <v-col cols="12" class="h-100">
        <v-card class="operation-info rounded-lg h-100">
          <v-card-title class="h-auto py-6">
            <div class="d-flex justify-space-between align-center">
              <div class="align-self-center" style="line-height: 1;">선박 제원 관리</div>
            </div>
          </v-card-title>
          <v-card-text class="py-0">
            <v-sheet class="tab-card operation-equipment-area">
              <v-sheet class="">
                <div class="title mb-2">M/E</div>
                <div class="operation-container d-flex flex-wrap ga-2">
                  <div class="operation-info-item">
                    <div class="mt-1 mb-1">M/E Count</div>
                    <i-input label="메인엔진 개수" type="number" v-model="equipmentInfo.mainEngineCount"
                      placeholder="M/E 개수를 입력하여 주십시오">
                    </i-input>
                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">Max Power</div>
                    <i-input label="IMO Number" type="number" v-model="equipmentInfo.mainEngineCount"
                      placeholder="메인엔진의 최대 파워를 입력하여 주십시오">
                    </i-input>
                  </div>

                  <div class="operation-info-item">
                    <div class="mb-1">T/C Count</div>
                    <i-input label="IMO Number" type="number" v-model="equipmentInfo.mainEngineTCCount"
                      placeholder="메인엔진의 T/C 개수를 입력하여 주십시오">
                    </i-input>

                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">Max Speed</div>
                    <i-input label="IMO Number" type="number" v-model="equipmentInfo.mainEngineCount"
                      placeholder="메인엔진의 최대 파워를 입력하여 주십시오">
                    </i-input>
                  </div>
                  <div class="operation-info-item ">
                    <div class="mb-1">Cylinder Count</div>
                    <i-input label="IMO Number" type="number" v-model="equipmentInfo.mainEngineCylCount"
                      placeholder="메인엔진의 Cyl 개수를 입력하여 주십시오">
                    </i-input>
                  </div>

                </div>
              </v-sheet>
              <v-sheet class="mt-4">
                <div class="title mb-2">G/E</div>
                <div class="operation-container d-flex flex-wrap ga-2">
                  <div class="operation-info-item">
                    <div class="mb-1">G/E Count</div>
                    <i-input label="발전기 개수" type="number" v-model="equipmentInfo.generatorCount"
                      placeholder="G/E 개수를 입력하여 주십시오">
                    </i-input>
                  </div>

                  <div class="operation-info-item">
                    <div class="mb-1">Max Power</div>
                    <i-input label="IMO Number" type="number" v-model="equipmentInfo.mainEngineCount"
                      placeholder="발전기의 최대 파워(생산량)을 입력하여 주십시오">
                    </i-input>
                  </div>

                  <div class="operation-info-item">
                    <div class="mb-1">T/C Count</div>
                    <i-input label="IMO Number" type="number" v-model="equipmentInfo.generatorTCCount"
                      placeholder="발전기의 T/C 개수를 입력하여 주십시오">
                    </i-input>

                  </div>

                  <div class="operation-info-item">
                    <div class="mb-1">Max Speed</div>
                    <i-input label="IMO Number" type="number" v-model="equipmentInfo.mainEngineCount"
                      placeholder="발전기의 최대 파워(생산량)을 입력하여 주십시오">
                    </i-input>
                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">Cylinder Count</div>
                    <i-input label="IMO Number" type="number" v-model="equipmentInfo.mainEngineCount"
                      placeholder="발전기의 Cyl 개수를 입력하여 주십시오">
                    </i-input>
                  </div>
                </div>
              </v-sheet>
              <v-sheet class="mt-4">
                <div class="title mb-2">Fuel</div>
                <div class="operation-container d-flex flex-wrap">
                  <div class="operation-info-item cylinder">
                    <div class="mb-1">Used Fuel Type</div>
                    <i-selectbox v-model="selectedFules" :items="fules" item-title="text" item-value="value" multiple
                      chips density="compact" bg-color="#434348" hide-details>
                    </i-selectbox>
                  </div>
                </div>
              </v-sheet>
              <v-sheet class="d-flex justify-end">
                <i-btn @click="updateShipDetailInfo" class="d-flex align-self-center mb-2" text="수정"></i-btn>
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
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useShipStore } from '@/stores/shipStore.js'
import { storeToRefs } from 'pinia';
import { useOperationStore } from '@/stores/operationStore.js'
import { useVoccStore } from '@/stores/voccStore'
import { getShipMachineInfo } from '@/api/shipApi'

import emitter from '@/composables/eventbus.js'
const operationStore = useOperationStore()


const shipStore = useShipStore()
const { currentShip, selectedShip } = storeToRefs(shipStore)
const voccStore = useVoccStore()

const props = defineProps({
  selectedShipImoNumber: {
    type: [String]
  }
})

const fuleInfo = ref([])
const fules = [
  { text: 'HFO', value: 'useHfo' },
  { text: 'LFO', value: 'useLfo' },
  { text: 'MDO', value: 'useMdo' },
  { text: 'MGO', value: 'useMgo' },
  { text: 'LPG', value: 'useLpg' },
  { text: 'LNG', value: 'useLng' },
]
const selectedFules = ref([])

const equipmentInfo = ref({})

onMounted(() => {
  fetchShipDetailInfo()
})

const fetchShipDetailInfo = async () => {
  const { data: { data } } = await getShipMachineInfo(selectedShip.value)
  console.log('정보 조회')
  console.dir(data)
  selectedFules.value = Object.keys(data).filter((key) => key.startsWith('use') && data.value[key] == true).map(key)
}

const updateShipDetailInfo = () => {
  const selectedFuelInfo = {
    useHfo: selectedFules.value.includes('useHFO'),
    useLfo: selectedFules.value.includes('useLfo'),
    useMdo: selectedFules.value.includes('useMdo'),
    useMgo: selectedFules.value.includes('useMgo'),
    useLpg: selectedFules.value.includes('useLpg'),
    useLng: selectedFules.value.includes('useLng'),
  }
}

const countInfo = {
  mainEngineCount: null,
  mainEngineTCCount: null,
  mainEngineCylCount: null,
  generatorCount: null,
  generatorTCCount: null,
  generatorCylCount: null,
}

const fuelType = [];


const voccs = ref();
const fetchVoccAll = async () => {
  const result = await voccStore.fetchVoccListAll();
  voccs.value = result;
  console.dir(voccs)
}


const test = () => {
  console.log('test')
}

watch(selectedFules, () => {
  console.log(selectedFules.value)
})

</script>

<style scoped>
.v-field .v-chip {
  height: calc(var(--v-chip-height) + 0px);
  background: #5789FE;
}

.operation-info-item {
  flex: 1 1 40%;
}

.operation-info-item.cylinder {
  flex: 0 0 49%;
}
</style>