<template>
  <v-sheet class="pa-3 rounded-lg popupLayout pointer-cursor" ref="popupLayout" height="822" v-if="isShow" width="355">
    <!--  국가이미지, 선박명, 닫기 버튼 -->
    <v-sheet class="">
      <div class="d-flex justify-space-between align-center ">
        <div class="d-flex align-center">
          <!-- <v-btn icon="mdi-menu" height="40" width="40" class="mr-6 menuBtn" size="x-large" variant="text"
            @click="changeVisibleStatusMenu" style="background : #3c3c3f "></v-btn> -->
          <div class="d-flex align-center ga-4">
            <div class="align-center"><v-img :src="PanamaLogo" width="25"></v-img></div>
            <div class="align-center boatName" style="line-height: 1;">{{ clickedShipInfo.name }}</div>
          </div>
        </div>
        <v-btn icon="mdi-close" width="" size="small" variant="text" @click="closePopup"></v-btn>
      </div>
    </v-sheet>
    <!-- 선박 요약 정보 (이미지, 선박 타입, IMO 번호 , MMSI 번호) -->
    <v-sheet color="#3C3C3F" class="px-3 py-3 d-flex rounded-lg">
      <v-row>
        <v-col cols="8">
          <div class="h-100">
            <v-img :src="displayImage" width="100%" height="100%" cover class="rounded-lg"></v-img>
          </div>
        </v-col>
        <v-col cols="4" class="pl-0">
          <div class="h-100 align-center d-flex flex-column justify-space-between">
            <div class="justify-space-between d-flex flex-column flex-wrap w-100">
              <div class="sub-title ship">Vessel Type</div>
              <div class="text-left sub-desc ship" style="word-break: normal">{{ totalInfo.worldMapShipInfo.type }}</div>
            </div>
            <div class="mt-2 d-flex flex-column align-start justify-center  w-100">
              <div class="sub-title ship">{{ clickedShipInfo.imoNumber }}</div>
              <div class="text-left sub-desc">9876544</div>
            </div>
            <div class=" justify-space-between mt-2  w-100">
              <div class="sub-title ship">{{ totalInfo.worldMapShipInfo.mmsiNumber }}</div>
              <div class="text-left sub-desc">009876544</div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <v-sheet>
      <v-sheet class="mt-3 mb-3 d-flex ga-2">
        <v-chip @click="tab = 'voyage'" class="rounded-10" :color="tab == 'voyage' ? '#4E83FF' : '#3C3C3F'"
          variant="flat">Voyage</v-chip>
        <v-chip @click="tab = 'equipment'" class="rounded-10" :color="tab == 'equipment' ? '#4E83FF' : '#3C3C3F'"
          variant="flat">Engine / Tank </v-chip>
      </v-sheet>
      <v-window v-model="tab">
        <v-window-item value="voyage">
          <v-sheet color="#3C3C3F" class="pt-3 rounded-10">
            <div class="d-flex justify-space-between px-3 mb-3 ">
              <div class="card-title">Voyage Information</div>
            </div>
            <div class="d-flex flex-column">
              <div class="d-flex justify-space-between px-3">
                <div class="sub-title">Speed</div>
                <div>{{ totalInfo.worldMapVoyageInfo.speed }} <span class="unit">kn</span></div>
              </div>
              <div class="d-flex justify-space-between px-3">
                <div class="sub-title">Current Draft</div>
                <div>{{ totalInfo.worldMapVoyageInfo.draft }} <span class="unit">m</span></div>
              </div>
            </div>
            <div class="d-flex px-3 justify-space-between">
              <div style="width : 65%;">
                <v-slider v-model="shipProcess" :thumb-size="30" :track-size="10" height="30" color="#4E83FF" rounded
                   hide-details class="progressBar remain" readonly>
                </v-slider>
                <div class="d-flex justify-space-between mt-2 ga-2">
                  <div>
                    <div class="">{{ totalInfo.worldMapVoyageInfo.departure }}</div>
                    <div class="voyage-date">{{ departureTime }}</div>
                  </div>
                  <!-- <div style="background : white; color : black; border-radius : 50px; padding:5px; height : 30px; vertical-align:middle">68</div> -->
                  <div>
                    <div class="text-right">{{ totalInfo.worldMapVoyageInfo.arrival }}</div>
                    <div class="voyage-date">{{ arrivalTime }}</div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column text-start justify-center">
                <div class="sub-title text-center" style="line-height : 1">
                  Remainig
                </div>
                <div class="sub-title" style=" line-height : 1"><span class="emphasis-text">{{ totalInfo.worldMapVoyageInfo.remainDay }}</span> Days <span
                    class="emphasis-text"> {{ totalInfo.worldMapVoyageInfo.remainHour }}</span>
                  Hrs
                </div>
              </div>
            </div>
            <div class="d-flex flex-column justify-center">
              <div class="d-flex justify-space-between px-3 mt-2">
                <div class="sub-title">LAT</div>
                <div>{{ totalInfo.worldMapVoyageInfo.latitude }}</div>
              </div>
              <div class="d-flex justify-space-between px-3 mb-2">
                <div class="sub-title">LON</div>
                <div>{{ totalInfo.worldMapVoyageInfo.longitude }}</div>
              </div>
            </div>
            <div class="voyage-tracks-container pa-3">
              <div class="d-flex justify-space-between align-center">
                <div class="sub-title">Vessel Tracks</div>
                <div class="d-flex align-center ga-2">
                  <div class="sub-title" style="line-height: 1;">OFF</div>
                  <div class="voyage-track-switch"><v-switch density="compact" v-model="trackStatus" hide-details
                      color="#4e83ff"></v-switch>
                  </div>
                  <div class="sub-title ml-1" style="line-height: 1;">ON</div>
                </div>
              </div>

              <div class="d-flex justify-space-between align-center mt-2">
                <!-- <div class="sub-title">With Date</div> -->
                <div class="d-flex ga-2 align-center">
                  <div class="voyage-datepicker"><input type="date" v-model="startDate" /></div>
                  <div class="voyage-datepicker"><input type="date" v-model="endDate" />
                  </div>
                  <div class="d-flex align-center">
                    <i-btn class="align-self-center search-text" color="#555555" @click="periodData" text="항차에서 조회"
                      height="35" style="font-size : 0.75rem"></i-btn>
                  </div>
                  <!-- <i-btn @click="periodData()" class="px-0 search-text" text="조회" width="15" height="20"></i-btn> -->
                </div>
              </div>
            </div>
          </v-sheet>
          <v-sheet color="#3C3C3F" class="px-3 py-3 mt-3 rounded-lg">
            <div class="d-flex justify-space-between mb-3">
              <div class="card-title">CII Monitoring</div>
            </div>
            <div class="d-flex flex-column">
              <div class="d-flex justify-space-between align-center">
                <div class="sub-title">CII Grade</div>
                <div style="font-size : 1.1rem; line-height : 1"> <span class="grade-icon font-weight-bold" :class="getCiiGradeClassName(totalInfo.worldMapCiiMonitoring.ciiGrade)">{{ totalInfo.worldMapCiiMonitoring.ciiGrade }}</span></div>
              </div>
              <div class="d-flex justify-space-between align-center">
                <div class="sub-title">CII Rating</div>
                <div style="font-size : 1.1rem">
                  <span style="font-size: 0.8em;">{{ totalInfo.worldMapCiiMonitoring.ciiRating }}</span> <span class="unit">%</span></div>
              </div>
              <div class="d-flex justify-space-between">
                <div class="sub-title">Distance</div>
                <div>{{ totalInfo.worldMapCiiMonitoring.distance }} <span class="unit">nm</span></div>
              </div>
              <div class="d-flex justify-space-between">
                <div class="sub-title">FOC / CO2</div>
                <div>{{ totalInfo.worldMapCiiMonitoring.foc }} <span class="unit">t</span> <span class="unit">/</span> {{ totalInfo.worldMapCiiMonitoring.co2Emission }} <span class="unit">t</span>
                </div>
              </div>
            </div>
            <div class="cii-range gc-1 align-center mt-2">
              <div class="cii-value">{{ totalInfo.worldMapCiiMonitoring.attainedCiiValue }}</div>
              <div class="d-flex cii-grade" style="height : 35px;">
                <div class="cii-grade grade-a d-flex justify-center align-center" style="border-top-left-radius : 10px; border-bottom-left-radius : 10px">A</div>
                <div class="cii-grade grade-b d-flex justify-center align-center">B</div>
                <div class="cii-grade grade-c d-flex justify-center align-center">C</div>
                <div class="cii-grade grade-d d-flex justify-center align-center">D</div>
                <div class="cii-grade grade-e d-flex justify-center align-center" style="border-top-right-radius : 10px; border-bottom-right-radius : 10px">E</div>
              </div>
              <div class="d-flex grade mt-1">
                <div class="cii-grade sub-title" style="line-height: 1.1;">{{ totalInfo.worldMapCiiMonitoring.ciiValueBoundaryList[0] }}</div>
                <div class="cii-grade sub-title" style="line-height: 1.1;">{{ totalInfo.worldMapCiiMonitoring.ciiValueBoundaryList[1] }}</div>
                <div class="cii-grade sub-title" style="line-height: 1.1;">{{ totalInfo.worldMapCiiMonitoring.ciiValueBoundaryList[2] }}</div>
                <div class="cii-grade sub-title" style="line-height: 1.1;">{{ totalInfo.worldMapCiiMonitoring.ciiValueBoundaryList[3] }}</div>
              </div>
            </div>
          </v-sheet>

        </v-window-item>
        <v-window-item value="equipment">
          <v-sheet color="#3C3C3F" class="px-3 py-3 rounded-lg">
            <div class="d-flex justify-space-between mb-3" style="line-height: 1;">
              <div class="card-title">Main Engine [Power / RPM]</div>
            </div>
            <div class="d-flex flex-column gap-2">
              <div v-if="visibleMEArray[0]" class="d-flex justify-space-between align-center">
                <div class="sub-title">M/E 1</div>
                <div>{{ totalInfo.worldMapMainEngineInfo.enginePowerList[0] }} <span class="unit">kw</span> <span class="unit">/</span> {{ totalInfo.worldMapMainEngineInfo.engineRpmList[0] }} <span class="unit">rpm</span>
                </div>
              </div>
              <div v-if="visibleMEArray[1]" class="d-flex justify-space-between align-center">
                <div class="sub-title">M/E 2</div>
                <div>{{ totalInfo.worldMapMainEngineInfo.enginePowerList[1] }} <span class="unit">kw</span> <span class="unit">/</span> {{ totalInfo.worldMapMainEngineInfo.engineRpmList[1] }} <span class="unit">rpm</span>
                </div>
              </div>
              <div v-if="visibleMEArray[2]" class="d-flex justify-space-between align-center">
                <div class="sub-title">M/E 3</div>
                <div>{{ totalInfo.worldMapMainEngineInfo.enginePowerList[2] }} <span class="unit">kw</span> <span class="unit">/</span> {{ totalInfo.worldMapMainEngineInfo.engineRpmList[2] }} <span class="unit">rpm</span>
                </div>
              </div>
              <div v-if="visibleMEArray[3]" class="d-flex justify-space-between align-center">
                <div class="sub-title">M/E 4</div>
                <div>{{ totalInfo.worldMapMainEngineInfo.enginePowerList[3] }} <span class="unit">kw</span> <span class="unit">/</span> {{ totalInfo.worldMapMainEngineInfo.engineRpmList[3] }} <span class="unit">rpm</span>
                </div>
              </div>
            </div>
          </v-sheet>
          <v-sheet color="#3C3C3F" class="px-3 py-3 my-3 rounded-lg">
            <div class="d-flex justify-space-between mb-3">
              <div class="card-title" style="line-height: 1;">Generator Engine</div>
            </div>
            <div class="justify-space-between mb-3">
              <div class="d-flex justify-space-between">
                <div class="sub-title">Total Power</div>
                <div class="emphasis-text" style="font-size: 1rem;">{{ totalInfo.worldMapGeneratorEngineInfo.totalGeneratedPowerValue }} <span class="unit">/ </span>{{ totalInfo.worldMapGeneratorEngineInfo.totalMaxPowerValue }}
                  <span class="unit"><span class="unit">kw</span></span></div>
              </div>
              <div class="w-100 d-flex align-center ga-4">
                <v-slider class="generator-power mx-0" v-model="generatorPowerPercent" :thumb-size="0" :track-size="10" height="15"
                  color="#4E83FF" rounded readonly hide-details>
                </v-slider>
                <div class="d-flex align-center emphasis-text"> {{ generatorPowerPercent }} <span class="unit">&nbsp;%</span></div>
              </div>
            </div>
            <div class="d-flex flex-column gap-2">
              <div v-if="visibleGEArray[0]" class="d-flex justify-space-between">
                <div class="sub-title">G/E 1</div>
                <div>{{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerValueList[0] }} <span class="unit">kw</span> <span class="unit">/</span> {{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerPercentList[0] }} <span class="unit">rpm</span>
                </div>
              </div>
              <div v-if="visibleGEArray[1]" class="d-flex justify-space-between">
                <div class="sub-title">G/E 2</div>
                <div>{{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerValueList[1] }} <span class="unit">kw</span> <span class="unit">/</span> {{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerPercentList[1] }} <span class="unit">rpm</span>
                </div>
              </div>
              <div v-if="visibleGEArray[2]" class="d-flex justify-space-between">
                <div class="sub-title">G/E 3</div>
                <div>{{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerValueList[2] }} <span class="unit">kw</span> <span class="unit">/</span> {{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerPercentList[2] }} <span class="unit">rpm</span>
                </div>
              </div>
              <div v-if="visibleGEArray[3]" class="d-flex justify-space-between">
                <div class="sub-title">G/E 4</div>
                <div>{{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerValueList[3] }} <span class="unit">kw</span> <span class="unit">/</span> {{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerPercentList[3] }} <span class="unit">rpm</span>
                </div>
              </div>
            </div>
          </v-sheet>
          <v-sheet color="#3C3C3F" class="px-3 py-3 mt-2 rounded-lg">
            <div class="d-flex justify-space-between">
              <div class="card-title mb-3">Fuel Remaining</div>
            </div>

            <div v-if="remainingHfo > 0" class="d-flex flex-column justify-space-between fuel-remaining-container gap-2">
              <div class="d-flex ga-4">
                <div class="sub-title align-center" style="width : 15%">HFO</div>
                <div class="d-flex justify-end ga-2" style="width: 85%;">
                  <v-slider class="generator-power mx-0" v-model="remainingHfo" :thumb-size="0" :track-size="10"
                  height="15" color="#b9c8ef" rounded readonly hide-details>
                  </v-slider>
                  <div class="d-flex align-center">{{ remainingHfo }}<span class="unit">%</span></div>
                </div>
              </div>
              <div v-if="remainingLfo > 0" class="d-flex ga-4">
                <div class="sub-title align-center" style="width : 15%">LFO</div>
                <div class="d-flex justify-end ga-2" style="width: 85%;">
                  <v-slider class="generator-power mx-0" v-model="remainingLfo" :thumb-size="0" :track-size="10"
                    color="#b9c8ef" height="15" rounded readonly hide-details>
                  </v-slider>
                  <div class="d-flex align-center">{{ remainingLfo }}<span class="unit">%</span></div>
                </div>
              </div>
              <div v-if="remainingMdo > 0" class="d-flex ga-4" >
                <div class="sub-title align-center" style="width : 15%">MDO</div>
                <div class="d-flex justify-end ga-2" style="width: 85%;">
                  <v-slider class="generator-power mx-0" v-model="remainingMdo" :thumb-size="0" :track-size="10"
                  height="15" color="#b9c8ef" rounded readonly hide-details>
                  </v-slider>
                  <div class="d-flex align-center">{{ remainingMdo }}<span class="unit">%</span></div>
                </div>
              </div>
              <div v-if="remainingMgo > 0" class="d-flex ga-4">
                <div class="sub-title align-center" style="width : 15%">MGO</div>
                <div class="d-flex justify-end ga-2" style="width: 85%;">
                  <v-slider class="generator-power mx-0" v-model="remainingMgo" :thumb-size="0" :track-size="10"
                  height="15" color="#b9c8ef" rounded readonly hide-details>
                  </v-slider>
                  <div class="d-flex align-center">{{ remainingMgo }}<span class="unit">%</span></div>
                </div>
              </div>
              <div v-if="remainingLpg > 0" class="d-flex ga-4">
                <div class="sub-title align-center" style="width : 15%">LPG</div>
                <div class="d-flex justify-end ga-2" style="width: 85%;">
                  <v-slider class="generator-power mx-0" v-model="remainingLpg" :thumb-size="0" :track-size="10"
                  height="15" color="#b9c8ef" rounded readonly hide-details>
                  </v-slider>
                  <div class="d-flex align-center">{{ remainingLpg }}<span class="unit">%</span></div>
                </div>
              </div>
              <div v-if="remainingLng > 0" class="d-flex ga-4">
                <div class="sub-title align-center" style="width : 15%">LNG</div>
                <div class="d-flex justify-end ga-2" style="width: 85%;">
                  <v-slider class="generator-power mx-0" v-model="remainingLng" :thumb-size="0" :track-size="10"
                  height="15" color="#b9c8ef" rounded readonly hide-details>
                  </v-slider>
                  <div class="d-flex align-center">{{ remainingLng }}<span class="unit">%</span></div>
                </div>
              </div>
            </div>
          </v-sheet>
        </v-window-item>
      </v-window>
    </v-sheet>

  </v-sheet>

</template>

<script setup>
import { onMounted, ref, watch, computed, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { convertFloatFormatObject } from '@/composables/util'
import { convertDateTimeType } from '@/composables/util'
import { useShipStore } from '@/stores/shipStore'
import { useMapStore } from '@/stores/mapStore'
import { getTotalInfo } from '@/api/worldMap'

import ShipSummary from '@/components/ship/ShipSummary.vue'
import PopupMenu from '@/views/map/popup/PopupMenu.vue'

import ShipInfo from '@/views/map/part/shipinfo/ShipInfo.vue'
import VoyageList from '@/views/map/part/VoyageList.vue'
import CIIRating from '@/views/map/part/cii/CIIRating.vue'
import EnginePerformance from '@/views/map/part/engine/EnginePerformance.vue'
import INSMonitoring from '@/views/map/part/ins/INSMonitoring.vue'

import emitter from '@/composables/eventbus.js'
import PanamaLogo from '@/assets/images/panama_logo.png'

import AISProgressInfo from '@/views/map/part/shipinfo/AISProgressInfo.vue'

const mapStore = useMapStore()
const { clickedShipInfo } = storeToRefs(mapStore);

const props = defineProps({
  isShow: {
    type: Boolean,
    defalut: false
  }
})

let shipProcess = ref(50)
let generatorPowerPercent = ref(30)

let visibleMEArray = [true, true, true, true]
let visibleGEArray = [true, true, true, true]

let remainingHfo = ref(0)
let remainingLfo = ref(0)
let remainingMdo = ref(0)
let remainingMgo = ref(0)
let remainingLpg = ref(0)
let remainingLng = ref(0)

const trackStatus = ref(false)
const tab = ref(null)

const startDate = ref(null)
const endDate = ref(null)

const emit = defineEmits(['closePopup'])

const components = {
  ShipInfo,
  VoyageList,
  CIIRating,
  EnginePerformance,
  INSMonitoring
}

const popupLayout = ref(null)
const totalInfo = ref({
  worldMapShipInfo : {
    "imoNumber": "1234567",
    "name": "Test Ship Name No.0",
    "nation": "USA",
    "mmsiNumber": "001234567",
    "type": "BULK CARRIER"
  },
  worldMapVoyageInfo : {
    "speed": 0,
    "draft": 0,
    "departure": "SGSIN",
    "arrival": "KRUSN",
    "departureTime": "2024-05-10 00:30:00",
    "arrivalTime": "2024-05-20 23:59:59",
    "process": 50,
    "remainDay": 0,
    "remainHour": 0,
    "latitude": "0˚0.0'N",
    "longitude": "0˚0.0'E"
  },
  worldMapCiiMonitoring : {
    "ciiGrade": "C",
    "ciiRating": 0,
    "distance": 0,
    "foc": 0,
    "co2Emission": 0,
    "ciiRatingBoundaryList": [
        0,
        0,
        0,
        0
    ],
    "ciiValueBoundaryList": [
        0,
        0,
        0,
        0
    ],
    "requiredCiiValue": 0,
    "attainedCiiValue": 0
  },
  worldMapMainEngineInfo : {
    "enginePowerList": [
      0,
      0,
      0,
      0
    ],
    "engineRpmList": [
      0,
      0,
      0,
      0
    ]
  },
  worldMapGeneratorEngineInfo : {
    "totalGeneratedPowerValue": 0,
    "totalMaxPowerValue": 0,
    "totalGeneratedPowerPercent": 0,
    "generatedPowerValueList": [
        0,
        0,
        0,
        0
    ],
    "generatedPowerPercentList": [
        0,
        0,
        0,
        0
    ]
  },
  worldMapFuelRemainingInfo : {
    "fuelRemainingMap": {
      "HFO": 0,
      "LFO": 0,
      "MDO": 0,
      "MGO": 0,
      "LPG": 0,
      "LNG": 0
    }
  }
})

let departureTime = null
let arrivalTime = null

const SECOND_IN_ONE_MINUTE = 1000 * 60
let interval = null

// const periodData = () => {
//   props.isPeriodData = true;
// }

const closePopup = () => {
  emit('closePopup')
  emitter.emit('closePopupMenu')
}

const displayImage = computed(() => {
  let image = ''
  const result = clickedShipInfo.value.shipImage ? `data:image/png;base64,${clickedShipInfo.value.shipImage}` : PanamaShip;
  image = result

  return image;
})

const fetchTotalInfo = async() => {
  const response = await getTotalInfo(clickedShipInfo.value.imoNumber)
  let { data : { data }} = response
  let result  = convertFloatFormatObject(data)

  departureTime = convertDateTimeType(result.worldMapVoyageInfo.departureTime)
  arrivalTime = convertDateTimeType(result.worldMapVoyageInfo.arrivalTime)

  shipProcess = parseInt(result.worldMapVoyageInfo.process)
  generatorPowerPercent = parseInt(result.worldMapGeneratorEngineInfo.totalGeneratedPowerPercent)

  for (var step = 0; step < 4; step++) {
    if (step >= result.worldMapMainEngineInfo.enginePowerList.length ) {
      visibleMEArray[step] = false
    }
  }

  for (var step = 0; step < 4; step++) {
    if (step >= result.worldMapGeneratorEngineInfo.generatedPowerValueList.length ) {
      visibleGEArray[step] = false
    }
  }

  if (result.worldMapFuelRemainingInfo.fuelRemainingMap.hasOwnProperty('HFO')) {
    remainingHfo = parseInt(result.worldMapFuelRemainingInfo.fuelRemainingMap.HFO)
  }

  if (result.worldMapFuelRemainingInfo.fuelRemainingMap.hasOwnProperty('LFO')){
    remainingLfo = parseInt(result.worldMapFuelRemainingInfo.fuelRemainingMap.LFO)
  }

  if (result.worldMapFuelRemainingInfo.fuelRemainingMap.hasOwnProperty('MDO')){
    remainingMdo = parseInt(result.worldMapFuelRemainingInfo.fuelRemainingMap.MDO)
  }

  if (result.worldMapFuelRemainingInfo.fuelRemainingMap.hasOwnProperty('MGO')){
    remainingMgo = parseInt(result.worldMapFuelRemainingInfo.fuelRemainingMap.MGO)
  }

  if (result.worldMapFuelRemainingInfo.fuelRemainingMap.hasOwnProperty('LPG')){
    remainingLpg = parseInt(result.worldMapFuelRemainingInfo.fuelRemainingMap.LPG)
  }

  if (result.worldMapFuelRemainingInfo.fuelRemainingMap.hasOwnProperty('LNG')){
    remainingLng = parseInt(result.worldMapFuelRemainingInfo.fuelRemainingMap.LNG)
  }

  totalInfo.value = result
}

const getCiiGradeClassName = (ciiGrade) => {
  let ciiGradeClassName = ''
  switch(ciiGrade){
    case 'A':
      ciiGradeClassName = 'grade-a'
      break;
    case 'B':
      ciiGradeClassName = 'grade-b'
      break;
    case 'C':
      ciiGradeClassName = 'grade-c'
      break;
    case 'D':
      ciiGradeClassName = 'grade-d'
      break;
    case 'E':
      ciiGradeClassName = 'grade-e'
      break;
  }

  return ciiGradeClassName
}

watch(clickedShipInfo, ()=> {
  fetchTotalInfo()
  interval = setInterval(fetchTotalInfo, SECOND_IN_ONE_MINUTE)
})

onUnmounted(() => {
  clearInterval(interval)
})

watch(trackStatus, (value) => {
  emitter.emit('clickTrackStatus', value)
})

watch(startDate, (value) => {
  emitter.emit('inputStartDate', value)
})

watch(endDate, (value) => {
  emitter.emit('inputEndDate', value)
})

</script>

<style scoped>
.popupLayout {
  position: absolute;
  top: 15px;
  z-index: 999;
  left: 15px;
  height: calc(100% - 24px);
}

.boatName {
  font-size: 1rem;
}

.voyage-date {
  color: #6C6C6C;
  font-size: 0.7rem
}

.cii-range .cii-grade {
  flex: 1 0 auto;
  text-align: center;
}

.cii-grade {
  font-size: 0.8rem;
}

.cii-attained-bonudary {
  font-size: 0.6rem;
}

.sub-title {
  color: #aaa;
}

.card-title {
  font-size: 0.9rem;
  line-height: 1;
}

.unit {
  color: #aaa;
  font-size: 0.75rem
}

.v-slider.generator-power.v-input--horizontal>.v-input__control {
  min-height: 15px;
}

.v-slider.v-input--horizontal {
  align-items: center;
  margin-inline: 0px 0px;
}

.voyage-datepicker input[type=date] {
  border: 1px solid #717171;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  width: 100px;
  font-size: 0.65rem;
}

.grade-a {
  background-color: #8CE816
}

.grade-b {
  background-color: #42D2A7;
}

.grade-c {
  background-color: #FEBD19;
}

.grade-d {
  background-color: #F68822;
}

.grade-e {
  background-color: #F04A4A;
}

.grade-icon{
  color : #fff;
  padding : 1px 5px;
  border-radius: 5px;
}

.cii-value {
  /* background: #4e83ff; */
  position: relative;
  width: 20%;
  text-align: center;
  border-radius: 6px;
  margin-left: 90px;
}

.cii-value:after {
  position: absolute;
  left: -13%;
  /* right: 0; */
  /* margin: 0 auto; */
  width: 0;
  height: 0;
  color: #4e83ff;
  font-weight: 600;
  font-size: 1.25rem;
  /* border-top: 10px solid #4e83ff;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent; */
  z-index: 99;
  content: '↓';
  bottom: 25px;
}

.search-text {
  font-size: 0.8rem;
}

.voyage-track-switch .v-selection-control__wrapper {
  width: 25px;
  height: 25px;
}

.voyage-track-switch .v-switch .v-selection-control {
  min-height: 25px;
}

.emphasis-text {
  font-size: 1.2rem;
  color: #4e83ff;
}

.rounded-10 {
  border-radius: 10px;
}

.sub-title.ship,
.sub-desc.ship {
  line-height: 1.2;
}

.sub-desc {
  line-height: 1;
}

.fuel-remainig-container .v-slider-track__background--opacity {
  opacity: 0.5;
}

.track-bg {
  color: #b9c8ef;
}

.gap-2 {
  gap: 1px;
}

.voyage-tracks-container {
  background: #4b4b4b;
  border-radius: 15px;
}
.progressBar .v-slider-thumb__surface::after {
  content: url(data:image/png;base64,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) !important;
}
</style>
