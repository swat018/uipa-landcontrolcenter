<template>
  <v-sheet
    class="pa-3 rounded-lg popupLayout pointer-cursor"
    :style="getPopupOpacity()"
    ref="popupLayout"
    height="822"
    v-if="isShow"
    width="355"
  >
    <!--  국가이미지, 선박명, 닫기 버튼 -->
    <v-sheet>
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <!-- <v-btn icon="mdi-menu" height="40" width="40" class="mr-6 menuBtn" size="x-large" variant="text"
            @click="changeVisibleStatusMenu" style="background : #3c3c3f "></v-btn> -->
          <div class="d-flex align-center ga-2">
            <div class="align-center pl-1">
              <v-img :src="displayNationImage" width="25"></v-img>
            </div>
            <div class="align-center boatName" style="line-height: 1">
              {{ clickedShipInfo.name }}
            </div>
          </div>
        </div>
        <v-btn icon="mdi-close" width="" size="small" variant="text" @click="closePopup"></v-btn>
      </div>
    </v-sheet>
    <!-- 선박 요약 정보 (이미지, 선박 타입, IMO 번호 , MMSI 번호) -->
    <v-sheet color="#3C3C3F" class="px-3 py-3 d-flex rounded-lg" height="160" max-height="160">
      <v-row class="h-100">
        <v-col cols="8">
          <div class="h-100">
            <v-img
              min-height="140"
              max-height="140"
              :src="displayImage"
              width="100%"
              height="100%"
              cover
              class="rounded-lg"
            ></v-img>
          </div>
        </v-col>
        <v-col cols="4" class="pl-0">
          <div class="h-100 align-center d-flex flex-column justify-space-between">
            <div class="justify-space-between d-flex flex-column flex-wrap w-100">
              <div class="sub-title ship">Vessel Type</div>
              <div class="text-left sub-desc ship" style="word-break: normal">
                {{ totalInfo.worldMapShipInfo.type }}
              </div>
            </div>
            <div class="mt-1 d-flex flex-column align-start justify-center w-100">
              <div class="sub-title ship">Flag</div>
              <div class="text-left sub-desc">{{ clickedShipInfo.nation }}</div>
            </div>
            <div class="mt-1 d-flex flex-column align-start justify-center w-100">
              <div class="sub-title ship">IMO Number</div>
              <div class="text-left sub-desc">{{ clickedShipInfo.imoNumber }}</div>
            </div>
            <div class="justify-space-between mt-1 w-100">
              <div class="sub-title ship">MMSI Number</div>
              <div class="text-left sub-desc">{{ totalInfo.worldMapShipInfo.mmsiNumber }}</div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <v-sheet>
      <v-sheet class="mt-3 mb-3 d-flex ga-2">
        <v-chip
          @click="tab = 'voyage'"
          class="rounded-10"
          :color="tab == 'voyage' ? '#4E83FF' : '#3C3C3F'"
          variant="flat"
        >Voyage</v-chip
        >
        <v-chip
          @click="tab = 'equipment'"
          class="rounded-10"
          :color="tab == 'equipment' ? '#4E83FF' : '#3C3C3F'"
          variant="flat"
        >Engine / Fuel
        </v-chip>
      </v-sheet>
      <v-window v-model="tab">
        <v-window-item value="voyage">
          <v-sheet color="#3C3C3F" class="pt-3 rounded-10">
            <div class="d-flex justify-space-between px-3 mb-3">
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
              <div style="width: 65%">
                <v-slider
                  v-model="shipProcess"
                  :thumb-size="30"
                  :track-size="7"
                  height="20"
                  color="#052673"
                  rounded
                  hide-details
                  class="progressBar remain"
                  readonly
                >
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
                <div class="sub-title text-center mb-1" style="line-height: 1">Remainig</div>
                <div class="sub-title" style="line-height: 1">
                  <span class="emphasis-text">{{ totalInfo.worldMapVoyageInfo.remainDay }}</span>
                  <span class="remainig-subtext"> Days</span>
                  <span class="emphasis-text ml-1">
                    {{ totalInfo.worldMapVoyageInfo.remainHour }}</span
                  >
                  <span class="remainig-subtext"> Hrs</span>
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
                  <div class="sub-title" style="line-height: 1">OFF</div>
                  <div class="voyage-track-switch">
                    <v-switch
                      density="compact"
                      v-model="trackStatus"
                      hide-details
                      color="#4e83ff"
                    ></v-switch>
                  </div>
                  <div class="sub-title ml-1" style="line-height: 1">ON</div>
                </div>
              </div>

              <div class="d-flex justify-space-between align-center mt-2">
                <!-- <div class="sub-title">With Date</div> -->
                <div class="d-flex ga-2 align-center">
                  <div class="voyage-datepicker"><input type="date" v-model="startDate" /></div>
                  <div class="voyage-datepicker"><input type="date" v-model="endDate" /></div>
                  <div class="d-flex align-center">
                    <i-btn
                      class="align-self-center search-text"
                      color="#555555"
                      @click="periodData()"
                      text="항차에서 조회"
                      height="35"
                      style="font-size: 0.75rem"
                    ></i-btn>
                  </div>
                  <!-- <i-btn @click="periodData()" class="px-0 search-text" text="조회" width="15" height="20"></i-btn> -->
                </div>
              </div>
            </div>
          </v-sheet>
          <v-sheet color="#3C3C3F" class="px-3 py-2 mt-3 rounded-lg">
            <div class="d-flex justify-space-between mb-3">
              <div class="card-title">CII Monitoring</div>
            </div>
            <div class="d-flex flex-column">
              <div class="d-flex justify-space-between align-center">
                <div class="sub-title">CII Grade</div>
                <div style="font-size: 1.1rem; line-height: 1">
                  <span
                    class="grade-icon font-weight-bold"
                    :class="getCiiGradeClassName(totalInfo.worldMapCiiMonitoring.ciiGrade)"
                  >{{ totalInfo.worldMapCiiMonitoring.ciiGrade }}</span
                  >
                </div>
              </div>
              <div class="d-flex justify-space-between align-center">
                <div class="sub-title">CII Rating</div>
                <div style="font-size: 1.1rem">
                  <span style="font-size: 0.8em">{{
                      totalInfo.worldMapCiiMonitoring.ciiRating
                    }}</span>
                  <span class="unit">%</span>
                </div>
              </div>
              <div class="d-flex justify-space-between">
                <div class="sub-title">Distance</div>
                <div>
                  {{ totalInfo.worldMapCiiMonitoring.distance }} <span class="unit">nm</span>
                </div>
              </div>
              <div class="d-flex justify-space-between">
                <div class="sub-title">FOC / CO2</div>
                <div>
                  {{ totalInfo.worldMapCiiMonitoring.foc }} <span class="unit">t</span>
                  <span class="unit">/</span> {{ totalInfo.worldMapCiiMonitoring.co2Emission }}
                  <span class="unit">t</span>
                </div>
              </div>
            </div>
            <div class="cii-range gc-1 align-center mt-2">
              <div class="cii-value">{{ totalInfo.worldMapCiiMonitoring.attainedCiiValue }}</div>
              <div class="d-flex cii-grade" style="height: 25px">
                <div
                  class="cii-grade grade-a d-flex justify-center align-center"
                  style="border-top-left-radius: 10px; border-bottom-left-radius: 10px"
                >
                  A
                </div>
                <div class="cii-grade grade-b d-flex justify-center align-center">B</div>
                <div class="cii-grade grade-c d-flex justify-center align-center">C</div>
                <div class="cii-grade grade-d d-flex justify-center align-center">D</div>
                <div
                  class="cii-grade grade-e d-flex justify-center align-center"
                  style="border-top-right-radius: 10px; border-bottom-right-radius: 10px"
                >
                  E
                </div>
              </div>
              <div class="d-flex grade mt-1">
                <div class="cii-grade sub-title" style="line-height: 1.1">
                  {{ totalInfo.worldMapCiiMonitoring.ciiValueBoundaryList[0] }}
                </div>
                <div class="cii-grade sub-title" style="line-height: 1.1">
                  {{ totalInfo.worldMapCiiMonitoring.ciiValueBoundaryList[1] }}
                </div>
                <div class="cii-grade sub-title" style="line-height: 1.1">
                  {{ totalInfo.worldMapCiiMonitoring.ciiValueBoundaryList[2] }}
                </div>
                <div class="cii-grade sub-title" style="line-height: 1.1">
                  {{ totalInfo.worldMapCiiMonitoring.ciiValueBoundaryList[3] }}
                </div>
              </div>
            </div>
          </v-sheet>
        </v-window-item>
        <v-window-item value="equipment">
          <v-sheet color="#3C3C3F" class="px-3 py-3 rounded-lg">
            <div class="d-flex justify-space-between mb-3" style="line-height: 1">
              <div class="card-title">Main Engine [Power / RPM]</div>
            </div>
            <div class="d-flex flex-column gap-2">
              <div v-if="visibleMEArray[0]" class="d-flex justify-space-between align-center">
                <div class="sub-title">M/E 1</div>
                <div>
                  {{ totalInfo.worldMapMainEngineInfo.enginePowerList[0] }}
                  <span class="unit">kw</span> <span class="unit">/</span>
                  {{ totalInfo.worldMapMainEngineInfo.engineRpmList[0] }}
                  <span class="unit">rpm</span>
                </div>
              </div>
              <div v-if="visibleMEArray[1]" class="d-flex justify-space-between align-center">
                <div class="sub-title">M/E 2</div>
                <div>
                  {{ totalInfo.worldMapMainEngineInfo.enginePowerList[1] }}
                  <span class="unit">kw</span> <span class="unit">/</span>
                  {{ totalInfo.worldMapMainEngineInfo.engineRpmList[1] }}
                  <span class="unit">rpm</span>
                </div>
              </div>
              <div v-if="visibleMEArray[2]" class="d-flex justify-space-between align-center">
                <div class="sub-title">M/E 3</div>
                <div>
                  {{ totalInfo.worldMapMainEngineInfo.enginePowerList[2] }}
                  <span class="unit">kw</span> <span class="unit">/</span>
                  {{ totalInfo.worldMapMainEngineInfo.engineRpmList[2] }}
                  <span class="unit">rpm</span>
                </div>
              </div>
              <div v-if="visibleMEArray[3]" class="d-flex justify-space-between align-center">
                <div class="sub-title">M/E 4</div>
                <div>
                  {{ totalInfo.worldMapMainEngineInfo.enginePowerList[3] }}
                  <span class="unit">kw</span> <span class="unit">/</span>
                  {{ totalInfo.worldMapMainEngineInfo.engineRpmList[3] }}
                  <span class="unit">rpm</span>
                </div>
              </div>
            </div>
          </v-sheet>
          <v-sheet color="#3C3C3F" class="px-3 py-3 my-3 rounded-lg">
            <div class="d-flex justify-space-between mb-3">
              <div class="card-title" style="line-height: 1">Generator Engine</div>
            </div>
            <div class="justify-space-between mb-3">
              <div class="d-flex justify-space-between">
                <div class="sub-title">Total Power</div>
                <div class="emphasis-text" style="font-size: 1rem">
                  {{ totalInfo.worldMapGeneratorEngineInfo.totalGeneratedPowerValue }}
                  <span class="unit">/ </span
                  >{{ totalInfo.worldMapGeneratorEngineInfo.totalMaxPowerValue }}
                  <span class="unit"><span class="unit">kw</span></span>
                </div>
              </div>
              <div class="w-100 d-flex align-center ga-4">
                <v-slider
                  class="generator-power mx-0"
                  v-model="generatorPowerPercent"
                  :thumb-size="0"
                  :track-size="10"
                  height="15"
                  color="#4E83FF"
                  rounded
                  readonly
                  hide-details
                >
                </v-slider>
                <div class="d-flex align-center emphasis-text">
                  {{ generatorPowerPercent }} <span class="unit">&nbsp;%</span>
                </div>
              </div>
            </div>
            <div class="d-flex flex-column gap-2">
              <div v-if="visibleGEArray[0]" class="d-flex justify-space-between">
                <div class="sub-title">G/E 1</div>
                <div>
                  {{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerValueList[0] }}
                  <span class="unit">kw</span> <span class="unit">/</span>
                  {{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerPercentList[0] }}
                  <span class="unit">rpm</span>
                </div>
              </div>
              <div v-if="visibleGEArray[1]" class="d-flex justify-space-between">
                <div class="sub-title">G/E 2</div>
                <div>
                  {{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerValueList[1] }}
                  <span class="unit">kw</span> <span class="unit">/</span>
                  {{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerPercentList[1] }}
                  <span class="unit">rpm</span>
                </div>
              </div>
              <div v-if="visibleGEArray[2]" class="d-flex justify-space-between">
                <div class="sub-title">G/E 3</div>
                <div>
                  {{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerValueList[2] }}
                  <span class="unit">kw</span> <span class="unit">/</span>
                  {{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerPercentList[2] }}
                  <span class="unit">rpm</span>
                </div>
              </div>
              <div v-if="visibleGEArray[3]" class="d-flex justify-space-between">
                <div class="sub-title">G/E 4</div>
                <div>
                  {{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerValueList[3] }}
                  <span class="unit">kw</span> <span class="unit">/</span>
                  {{ totalInfo.worldMapGeneratorEngineInfo.generatedPowerPercentList[3] }}
                  <span class="unit">rpm</span>
                </div>
              </div>
            </div>
          </v-sheet>
          <v-sheet color="#3C3C3F" class="px-3 py-3 mt-2 rounded-lg">
            <div class="d-flex justify-space-between">
              <div class="card-title mb-3">Fuel Remaining</div>
            </div>

            <div
              v-if="remainingHfo > 0"
              class="d-flex flex-column justify-space-between fuel-remaining-container gap-2"
            >
              <div class="d-flex ga-4">
                <div class="sub-title align-center" style="width: 15%">HFO</div>
                <div class="d-flex justify-end ga-2" style="width: 85%">
                  <v-slider
                    class="generator-power mx-0"
                    v-model="remainingHfo"
                    :thumb-size="0"
                    :track-size="10"
                    height="15"
                    color="#b9c8ef"
                    rounded
                    readonly
                    hide-details
                  >
                  </v-slider>
                  <div class="d-flex align-center">
                    {{ remainingHfo }}<span class="unit">%</span>
                  </div>
                </div>
              </div>
              <div v-if="remainingLfo > 0" class="d-flex ga-4">
                <div class="sub-title align-center" style="width: 15%">LFO</div>
                <div class="d-flex justify-end ga-2" style="width: 85%">
                  <v-slider
                    class="generator-power mx-0"
                    v-model="remainingLfo"
                    :thumb-size="0"
                    :track-size="10"
                    color="#b9c8ef"
                    height="15"
                    rounded
                    readonly
                    hide-details
                  >
                  </v-slider>
                  <div class="d-flex align-center">
                    {{ remainingLfo }}<span class="unit">%</span>
                  </div>
                </div>
              </div>
              <div v-if="remainingMdo > 0" class="d-flex ga-4">
                <div class="sub-title align-center" style="width: 15%">MDO</div>
                <div class="d-flex justify-end ga-2" style="width: 85%">
                  <v-slider
                    class="generator-power mx-0"
                    v-model="remainingMdo"
                    :thumb-size="0"
                    :track-size="10"
                    height="15"
                    color="#b9c8ef"
                    rounded
                    readonly
                    hide-details
                  >
                  </v-slider>
                  <div class="d-flex align-center">
                    {{ remainingMdo }}<span class="unit">%</span>
                  </div>
                </div>
              </div>
              <div v-if="remainingMgo > 0" class="d-flex ga-4">
                <div class="sub-title align-center" style="width: 15%">MGO</div>
                <div class="d-flex justify-end ga-2" style="width: 85%">
                  <v-slider
                    class="generator-power mx-0"
                    v-model="remainingMgo"
                    :thumb-size="0"
                    :track-size="10"
                    height="15"
                    color="#b9c8ef"
                    rounded
                    readonly
                    hide-details
                  >
                  </v-slider>
                  <div class="d-flex align-center">
                    {{ remainingMgo }}<span class="unit">%</span>
                  </div>
                </div>
              </div>
              <div v-if="remainingLpg > 0" class="d-flex ga-4">
                <div class="sub-title align-center" style="width: 15%">LPG</div>
                <div class="d-flex justify-end ga-2" style="width: 85%">
                  <v-slider
                    class="generator-power mx-0"
                    v-model="remainingLpg"
                    :thumb-size="0"
                    :track-size="10"
                    height="15"
                    color="#b9c8ef"
                    rounded
                    readonly
                    hide-details
                  >
                  </v-slider>
                  <div class="d-flex align-center">
                    {{ remainingLpg }}<span class="unit">%</span>
                  </div>
                </div>
              </div>
              <div v-if="remainingLng > 0" class="d-flex ga-4">
                <div class="sub-title align-center" style="width: 15%">LNG</div>
                <div class="d-flex justify-end ga-2" style="width: 85%">
                  <v-slider
                    class="generator-power mx-0"
                    v-model="remainingLng"
                    :thumb-size="0"
                    :track-size="10"
                    height="15"
                    color="#b9c8ef"
                    rounded
                    readonly
                    hide-details
                  >
                  </v-slider>
                  <div class="d-flex align-center">
                    {{ remainingLng }}<span class="unit">%</span>
                  </div>
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
import { convertFloatFormatObject, convertDateTimeType } from '@/composables/util'
import { useAuthStore } from '@/stores/authStore'
import { useAdminStore } from '@/stores/adminStore'
import { useMapStore } from '@/stores/mapStore'
import { useUserSettingStore } from '@/stores/userSettingStore'

import { getTotalInfo } from '@/api/worldMap'
import { getPopupOpacitySetting } from '@/api/settingsApi.js'
import { getUserSetting } from '@/api/settingsApi.js'

import emitter from '@/composables/eventbus.js'
import noShipImage from '/images/ship/no-ship-image.png'

const mapStore = useMapStore()
const { clickedShipInfo, isPastVesselTracks } = storeToRefs(mapStore)

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)

const adminStore = useAdminStore()
const { popupOpacity } = storeToRefs(adminStore)

const userSettingsStore = useUserSettingStore()
const { settingsForm } = storeToRefs(userSettingsStore)

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

const trackStatus = ref(true)
const tab = ref(null)

const startDate = ref(null)
const endDate = ref(null)

const emit = defineEmits(['closePopup'])

const popupLayout = ref(null)
const totalInfo = ref({
  worldMapShipInfo: {
    imoNumber: '1234567',
    name: 'Test Ship Name No.0',
    nation: 'USA',
    mmsiNumber: '001234567',
    type: 'BULK CARRIER'
  },
  worldMapVoyageInfo: {
    speed: 0,
    draft: 0,
    departure: 'SGSIN',
    arrival: 'KRUSN',
    departureTime: '2024-05-10 00:30:00',
    arrivalTime: '2024-05-20 23:59:59',
    process: 50,
    remainDay: 0,
    remainHour: 0,
    latitude: "0˚0.0'N",
    longitude: "0˚0.0'E"
  },
  worldMapCiiMonitoring: {
    ciiGrade: 'C',
    ciiRating: 0,
    distance: 0,
    foc: 0,
    co2Emission: 0,
    ciiRatingBoundaryList: [0, 0, 0, 0],
    ciiValueBoundaryList: [0, 0, 0, 0],
    requiredCiiValue: 0,
    attainedCiiValue: 0
  },
  worldMapMainEngineInfo: {
    enginePowerList: [0, 0, 0, 0],
    engineRpmList: [0, 0, 0, 0]
  },
  worldMapGeneratorEngineInfo: {
    totalGeneratedPowerValue: 0,
    totalMaxPowerValue: 0,
    totalGeneratedPowerPercent: 0,
    generatedPowerValueList: [0, 0, 0, 0],
    generatedPowerPercentList: [0, 0, 0, 0]
  },
  worldMapFuelRemainingInfo: {
    fuelRemainingMap: {
      HFO: 0,
      LFO: 0,
      MDO: 0,
      MGO: 0,
      LPG: 0,
      LNG: 0
    }
  }
})

let departureTime = null
let arrivalTime = null

const SECOND_IN_ONE_MINUTE = 1000 * 60
let interval = null

const periodData = () => {
  isPastVesselTracks.value = true
}

const closePopup = () => {
  emit('closePopup')
  emitter.emit('closePopupMenu')
}

const displayImage = computed(() => {
  let image = ''
  const result = clickedShipInfo.value.shipImage
    ? `data:image/png;base64,${clickedShipInfo.value.shipImage}`
    : noShipImage
  image = result

  return image
})

const displayNationImage = computed(() => {
  let nation = clickedShipInfo.value.nation
  let nationImage = `/images/country/${nation}.png`
  return nationImage
})

const fetchTotalInfo = async () => {
  const response = await getTotalInfo(clickedShipInfo.value.imoNumber)
  let {
    data: { data }
  } = response
  let result = convertFloatFormatObject(data)

  departureTime = convertDateTimeType(result.worldMapVoyageInfo.departureTime)
  arrivalTime = convertDateTimeType(result.worldMapVoyageInfo.arrivalTime)

  shipProcess.value = parseInt(result.worldMapVoyageInfo.process)
  generatorPowerPercent.value = parseInt(
    result.worldMapGeneratorEngineInfo.totalGeneratedPowerPercent
  )

  for (var step = 0; step < 4; step++) {
    if (step >= result.worldMapMainEngineInfo.enginePowerList.length) {
      visibleMEArray[step] = false
    }
  }

  for (var step = 0; step < 4; step++) {
    if (step >= result.worldMapGeneratorEngineInfo.generatedPowerValueList.length) {
      visibleGEArray[step] = false
    }
  }

  if (result.worldMapFuelRemainingInfo.fuelRemainingMap.hasOwnProperty('HFO')) {
    remainingHfo.value = parseInt(result.worldMapFuelRemainingInfo.fuelRemainingMap.HFO)
  }

  if (result.worldMapFuelRemainingInfo.fuelRemainingMap.hasOwnProperty('LFO')) {
    remainingLfo.value = parseInt(result.worldMapFuelRemainingInfo.fuelRemainingMap.LFO)
  }

  if (result.worldMapFuelRemainingInfo.fuelRemainingMap.hasOwnProperty('MDO')) {
    remainingMdo.value = parseInt(result.worldMapFuelRemainingInfo.fuelRemainingMap.MDO)
  }

  if (result.worldMapFuelRemainingInfo.fuelRemainingMap.hasOwnProperty('MGO')) {
    remainingMgo.value = parseInt(result.worldMapFuelRemainingInfo.fuelRemainingMap.MGO)
  }

  if (result.worldMapFuelRemainingInfo.fuelRemainingMap.hasOwnProperty('LPG')) {
    remainingLpg.value = parseInt(result.worldMapFuelRemainingInfo.fuelRemainingMap.LPG)
  }

  if (result.worldMapFuelRemainingInfo.fuelRemainingMap.hasOwnProperty('LNG')) {
    remainingLng.value = parseInt(result.worldMapFuelRemainingInfo.fuelRemainingMap.LNG)
  }

  totalInfo.value = result
}

const getCiiGradeClassName = (ciiGrade) => {
  let ciiGradeClassName = ''
  switch (ciiGrade) {
    case 'A':
      ciiGradeClassName = 'grade-a'
      break
    case 'B':
      ciiGradeClassName = 'grade-b'
      break
    case 'C':
      ciiGradeClassName = 'grade-c'
      break
    case 'D':
      ciiGradeClassName = 'grade-d'
      break
    case 'E':
      ciiGradeClassName = 'grade-e'
      break
  }

  return ciiGradeClassName
}

const getPopupOpacity = () => {
  let role = userInfo.value.role
  let userId = userInfo.value.userId

  let opacityClass = 'opacity-'
  let opacityStyle = 'opacity : '
  if (role == 'ROLE_LCC_ADMIN') {
    if (popupOpacity.value.valueInt) {
      opacityClass = opacityClass + popupOpacity.value.valueInt
      opacityStyle = opacityStyle + (100 - popupOpacity.value.valueInt) * 0.01
    } else {
      getPopupOpacitySetting(popupOpacity.value.key)
    }
  } else {
    if (settingsForm.value.settingDataMap.popupOpacity) {
      opacityClass = opacityClass + settingsForm.value.settingDataMap.popupOpacity
      opacityStyle = opacityStyle + (100 - popupOpacity.value.valueInt) * 0.01
    } else {
      getUserSetting(userId)
    }
  }

  return opacityStyle
}

watch(clickedShipInfo, () => {
  fetchTotalInfo()
  interval = setInterval(fetchTotalInfo, SECOND_IN_ONE_MINUTE)
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

watch(isPastVesselTracks, (value) => {
  emitter.emit('clickPastVesselTracks', value)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.popupLayout {
  position: absolute;
  top: 10px;
  z-index: 999;
  left: 15px;
  height: calc(100% - 24px);
}

.boatName {
  font-size: 1rem;
}

.voyage-date {
  color: #6c6c6c;
  font-size: 0.7rem;
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
  font-size: 0.75rem;
}

.v-slider.generator-power.v-input--horizontal > .v-input__control {
  min-height: 15px;
}

.v-slider.v-input--horizontal {
  align-items: center;
  margin-inline: 0px 0px;
}

.voyage-datepicker input[type='date'] {
  border: 1px solid #717171;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  width: 100px;
  font-size: 0.65rem;
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
  font-size: 1rem;
  color: #4e83ff;
}

.rounded-10 {
  border-radius: 10px;
}

.sub-title.ship {
  font-size: 0.8rem;
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
  color: '#b9c8ef';
}

.gap-2 {
  gap: 1px;
}

.voyage-tracks-container {
  background: #4b4b4b;
  border-radius: 15px;
}
.progressBar .v-slider-thumb__surface::after {
  /* content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALgAAABACAYAAACp8r2zAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAWuSURBVHgB7Z0/bBxFGMXfWkiRQAI3CRVwBWlQkBJhGkAytquYxkYpoLGd0mlIlEihSuz0yKFJSts0UERymtgNIT4JqIwSKZCGZoGKpIFIIKiW78vtIWd3/uzu7KxPyvtJk3V2TpeN9DSeefO+2STLsssAVkBIODelnU6S5A+MCIn+ISJfk8tZEBJOKm1KRJ5iBEiGP4jIN+SyCELCSTEiIh8b/iAPsySXXRASTk/aXRk053DAJPv/Ig80Lpc70o6bPvzg1wyEFDn8UiLN2n1OBs+rOCCS4g0ReQ8DkfeKfdt7wBffUOTkaV44BJyfT/DGq9aPrIrIV3AAJKabLpHf+E4bRU7KLE4DJycSW/dVEfk5dIz1aShy0oRT70h7zyqre9Lmu1x8Jq5OEbnOxVXk48W+zdsZdn4AISVm3wIWZqzSStGhw5L4PuAS+fXtDP0fQUiJ3hHg0scJnj9k7E4xGMnvITJjvg/kD2GcOy3PysLiFRBSIn0IXFzP8OhPY3dP2p0ubESvwBUR+YZcTpv6dPX82hEQUuLRY+DKl1aR64xgS0S+goh4pyj7seVW/voH+HTT+h8hzzhqI+pv+4mj1o9EsxFrCVyxiVzFfeUripzY8TgsUYJatQWuUOSkKV3biI0ErtjCWSruixsZ/v4XhBiZPCbCmXE6LK3ZiI0FrojIt+RSWgmnvw9Gcoqc2FAbUQ0KS4YlRUs2YiUXxYE6K6WH6L08WFQQYkNtRIfD0sMgjRhcoxCswjyBeBeGLf3+fdkM2uGWPrFz+EXgwodOqznIYWllmGVuhYSyfDLB5JvW7sZBrdbmERQ5CSWGjdjqRDkXuU5XSrkVipxUwSPyFDUdltZXggxnkVDePjowKdqwEaNYHSLy9zEQeQmKnFRBF5+aRrTYiDpN0enKTd/3hNqERuQf3oUlnLUwzXAW8VMxqOW1EaOa1fkDrBXvazhLN4J+eQhCnITWe0bfjWFuhbRB03rPTrYbKXLSBk2CWp3tp9uOh6PISR3q1nt2GhixJRAZziJ1qFPvGcVFcaAjuDGcdWGe4SxSjTr1np2rynU8HMNZpA4er1xZ7XoEHzJuvk1xkxokA8vZQfYcuscYyNJ5+PUdEFIJHbUvfeTc6Twr8/DNTgWeLzJLU5PhIpOQKuimj67ZqiwyOxO4iFuP0DXWcH62RQeFVGPyWILlWWt3ioJN2InA88NdPinef+KBa97gMQjxcurdRJq1W0fsqWJePPoiMxf35eJ9ipvUYXHaKe4NEfYJUzFE1BHcJm6djlDcpAo6z9aaTccZmCsi7FVbZzQfXMS9JJf14v2huFMmCYkHj1OiqFPyues7oozg+S7Suqlv82uKm/jxnJuiU5E5EXff9z2tCzwvWTOL+3aG/k8gxMnE68CZD9opWWtV4HnRsZ52VS46/pZvhCB+ZicSLExbu1McVNGx89gIEfeN70GIE48NuIvBBk73x0ZQ3CQEnYroYZx6KKeFxgf/BE9R9qUDe8W+/n2Km7hRcatTopFpC04b0EeQwF3i3vs5Y3iKOKlgAy5pYAoBhI7g6pYYw1PXtkGIlQo24FQbxyc3FnieDCydDT6ssWR4itjQwNTiDDo5AL+RwPMteGMyUHcpKW5io0JgqtVXmNQOWzE8RZriC0whwhuQ675GcAUUN6mJTkXOuF8jGOSUuKg8RcmPYTMmA7VggeImJnQReX4ung3oo5LA82Tgmqnv2i2Gp4iZqnWTiIh3iuI87/sWw1PETJ26yZg4R/B9W/DG8BTFTUzUrZuMiVXgPnFzC56YaFI3GROjTcjwFGlC07rJmJRGcJe4t/coblImtG4yJk8tMl3nBioPfgMhJTRXYllMKt66yZgUBa6vADwOQsKpXDcZk/+nKLZj1QhpQIoOnRIXTxaZtmPVCGlAihERtzJmO1aNkAbsSjsxKuJW/gMlLp6qccDm/gAAAABJRU5ErkJggg==') !important; */
}

.remainig-subtext {
  font-size: 0.8rem;
}
</style>
