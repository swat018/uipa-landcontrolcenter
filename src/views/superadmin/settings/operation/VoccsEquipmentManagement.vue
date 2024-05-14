<template>
  <v-container fluid class="detail-page">
    <v-row class="h-100">
      <v-col cols="12" class="pr-0">
        <v-card class="operation-info rounded-lg">
          <v-card-title class="tab-title">
            <div class="d-flex justify-space-between align-center">
              <div class="align-self-center">선박 제원 관리</div>
            </div>
          </v-card-title>
          <v-card-text class="py-0">
            <v-sheet class="tab-card operation-equipment-area">
              <v-sheet class="">
                <div class="title my-3">M/E</div>
                <div class="operation-container d-flex flex-wrap ga-4">
                  <div class="operation-info-item">
                    <div class="mt-1 mb-1">M/E Count</div>
                    <i-input label="메인엔진 개수" type="number" v-model="countInfo.mainEngineCount"
                      placeholder="M/E 개수를 입력하여 주십시오">
                    </i-input>
                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">T/C Count</div>
                    <i-input label="IMO Number" type="number" v-model="countInfo.mainEngineTCCount"
                      placeholder="메인엔진의 T/C 개수를 입력하여 주십시오">
                    </i-input>

                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">Cylinder Count</div>
                    <i-input label="IMO Number" type="number" v-model="countInfo.mainEngineCylCount"
                      placeholder="메인엔진의 Cyl 개수를 입력하여 주십시오">
                    </i-input>
                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">Max Power</div>
                    <i-input label="IMO Number" type="number" v-model="countInfo.mainEngineCount"
                      placeholder="메인엔진의 최대 파워를 입력하여 주십시오">
                    </i-input>
                  </div>
                </div>
              </v-sheet>
              <v-sheet class="mt-4">
                <div class="title mb-4">G/E</div>
                <div class="operation-container d-flex flex-wrap ga-4">
                  <div class="operation-info-item">
                    <div class="mb-1">G/E Count</div>
                    <i-input label="발전기 개수" type="number" v-model="countInfo.generatorCount"
                      placeholder="G/E 개수를 입력하여 주십시오">
                    </i-input>
                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">T/C Count</div>
                    <i-input label="IMO Number" type="number" v-model="countInfo.generatorTCCount"
                      placeholder="발전기의 T/C 개수를 입력하여 주십시오">
                    </i-input>

                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">Cylinder Count</div>
                    <i-input label="IMO Number" type="number" v-model="countInfo.mainEngineCount"
                      placeholder="발전기의 Cyl 개수를 입력하여 주십시오">
                    </i-input>
                  </div>
                  <div class="operation-info-item">
                    <div class="mb-1">Max Power</div>
                    <i-input label="IMO Number" type="number" v-model="countInfo.mainEngineCount"
                      placeholder="발전기의 최대 파워(생산량)을 입력하여 주십시오">
                    </i-input>
                  </div>
                </div>
              </v-sheet>
              <v-sheet class="mt-4">
                <div class="title mb-4">Fuel</div>
                <div class="operation-container d-flex flex-wrap ga-4">
                  <div class="operation-info-item cylinder">
                    <div class="mb-1">Used Fuel Type</div>
                    <i-selectbox v-model="selectedFules" :items="fules" multiple chips density="compact"
                      bg-color="#434348">
                    </i-selectbox>
                  </div>
                </div>
              </v-sheet>
              <v-sheet class="mt-4 d-flex justify-end">
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
import { getShipDetailInfo } from '@/api/shipApi'

import emitter from '@/composables/eventbus.js'
const operationStore = useOperationStore()


const shipStore = useShipStore()
const { currentShip, selectedShip } = storeToRefs(shipStore)
const voccStore = useVoccStore()


const fuleInfo = ref([])
const fules = ['HFO', 'LFO', 'MDO', 'MGO', 'LPG', 'LNG']
const selectedFules = ref([])

const shipDetailInfo = ref({})

onMounted(() => {
  fetchShipDetailInfo()
})

const fetchShipDetailInfo = async () => {
  ({ data: { data: { detailDataMap: shipDetailInfo.value } } } = await getShipDetailInfo(selectedShip.value))
}

const updateShipDetailInfo = () => {
  console.log('합치기 전')
  console.dir(shipDetailInfo.value)

  shipDetailInfo.value = {
    ...shipDetailInfo.value,
    ...countInfo,
    'usedFules': selectedFules.value
  }

  console.log('합친 후 ')
  console.dir(shipDetailInfo.value)

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