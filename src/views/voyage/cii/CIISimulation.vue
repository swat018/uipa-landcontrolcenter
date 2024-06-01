<template>
  <!-- <div class="d-flex flex-column flex-grow-1 flex-shrink-1 detail-page"> -->
  <v-row no-gutters class="detail-page h-100 cii-simulation-page" style="overflow: visible">
    <v-sheet class="d-flex w-100 pt-3 ga-4 justify-space-between">
      <!-- 날짜 조회 -->
      <v-sheet class="d-flex">
        <div class="d-flex ga-2">
          <div class="datePicker">
            <input type="datetime-local" v-model="startDate" :max="yesterday" />
          </div>
          <div class="datePicker">
            <input type="datetime-local" v-model="endDate" :min="tomorrow" />
          </div>
          <i-btn @click="fetchPastCiiData()" text="조회" width="90"></i-btn>
        </div>
        <!-- <div class="d-flex align-center">Date (2024-01-01 ~ 2024-12-31)</div> -->
      </v-sheet>
      <!-- 시뮬레이터 -->
      <v-sheet class="d-flex w-50">
        <div class="d-flex ga-2">
          <div class="d-flex align-center">Parameter</div>
          <div class="parameter-selector d-flex">
            <i-selectbox
              v-model="selectedParameter"
              :items="parameters"
              variant="solo-filled"
              density="compact"
              class="equipmentSelector"
              bg-color="#434348"
              placeholder="Parameter를 선택해주세요"
              :hide-details="true"
            ></i-selectbox>
          </div>
        </div>

        <v-sheet class="d-flex px-5 flex-grow-1" style="">
          <div class="d-flex ga-2 w-100">
            <div class="d-flex align-center">CII Rating</div>
            <v-sheet class="align-center" style="flex: 1">
              <v-sheet class="cii-slider d-flex flex-column">
                <div class="d-flex gc-1 align-center" style="position: relative">
                  <!-- 슬라이드 A 너비 -->
                  <v-sheet
                    :style="{ width: rangeAWidth + '%' }"
                    height="12"
                    color="#8CE816"
                    style="border-bottom-left-radius: 20px; border-top-left-radius: 20px"
                  >
                  </v-sheet>
                  <!-- 슬라이드 B 너비 -->
                  <v-sheet
                    :style="{ width: rangeBWidth + '%' }"
                    height="12"
                    color="#42D2A7"
                    style=""
                  >
                  </v-sheet>
                  <!-- 슬라이드 C 너비 -->
                  <v-sheet
                    :style="{ width: rangeCWidth + '%' }"
                    height="12"
                    color="#FEBD19"
                    style=""
                  >
                  </v-sheet>
                  <!-- 슬라이드 D 너비 -->
                  <v-sheet
                    :style="{ width: rangeDWidth + '%' }"
                    height="12"
                    color="#F68822"
                    style=""
                  >
                  </v-sheet>
                  <!-- 슬라이드 E 너비 -->
                  <v-sheet
                    :style="{ width: rangeEWidth + '%' }"
                    height="12"
                    color="#F04A4A"
                    style="border-top-right-radius: 20px; border-bottom-right-radius: 20px"
                  >
                  </v-sheet>
                  <v-slider
                    ref="ciirateSlider"
                    id="ciirateSlider"
                    style="
                      position: absolute;
                      width: 100%;
                      transform: translateY(-70%);
                      top: 0%;
                      height: 12px;
                    "
                    min="40"
                    max="160"
                    v-model="ciiRate"
                    thumb-label="always"
                    @mouseup="simulateCiiData"
                    :hide-details="true"
                  ></v-slider>
                </div>

                <div class="d-flex mt-1">
                  <!-- 텍스트 A 너비 -->
                  <div
                    class="text-center"
                    :style="{ width: rangeAWidth + '%' }"
                    style="opacity: 0.5"
                  >
                    A
                  </div>
                  <div
                    class="text-center"
                    :style="{ width: rangeBWidth + '%' }"
                    style="opacity: 0.5"
                  >
                    B
                  </div>
                  <div
                    class="text-center"
                    :style="{ width: rangeCWidth + '%' }"
                    style="opacity: 0.5"
                  >
                    C
                  </div>
                  <div
                    class="text-center"
                    :style="{ width: rangeDWidth + '%' }"
                    style="opacity: 0.5"
                  >
                    D
                  </div>
                  <div
                    class="text-center"
                    :style="{ width: rangeEWidth + '%' }"
                    style="opacity: 0.5"
                  >
                    E
                  </div>
                </div>
              </v-sheet>
            </v-sheet>
          </div>
        </v-sheet>
      </v-sheet>
    </v-sheet>

    <!-- 테이블  -->
    <v-sheet class="w-100" style="height: 100%; max-height: calc(100% - 40px - 24px)">
      <v-sheet class="align-center mt-3 mb-3" style="height: 215px">
        <v-data-table class="cii-simulation-table" :headers="headers" :items="pastCiiData.first">
          <template v-slot:headers="{ columns }">
            <tr class="text-center">
              <th class="text-center" :rowspan="2">
                Sailing <br />
                (day)
              </th>
              <th class="text-center" :rowspan="2">
                Distance <br />
                (nm)
              </th>
              <th class="text-center" :rowspan="2">
                Speed <br />
                (kn)
              </th>
              <th
                class="text-center"
                :colspan="usedFuels.length"
                style="border-bottom: 1px solid #4d4d4d"
              >
                FOC (mt)
              </th>
              <th class="text-center" :rowspan="2">
                Total <br />
                Co2 Emission <br />(kn)
              </th>
              <th class="text-center" :rowspan="2">Required CII</th>
              <th class="text-center" :rowspan="2">Attaineded CII</th>
              <th class="text-center" :rowspan="2">CII Rating</th>
              <th class="text-center" :rowspan="2">CII Grade</th>
            </tr>
            <tr class="text-center">
              <th class="text-center" v-if="isHFOVisible">HFO</th>
              <th class="text-center" v-if="isLFOVisible">LFO</th>
              <th class="text-center" v-if="isMDOVisible">MDO</th>
              <th class="text-center" v-if="isMGOVisible">MGO</th>
              <th class="text-center" v-if="isLPGVisible">LPG</th>
              <th class="text-center" v-if="isLNGVisible">LNG</th>
            </tr>
          </template>
          <template v-slot:item="{ item, index }">
            <tr>
              <!-- <td>{{ item.type }}</td> -->
              <td class="text-center">{{ item.sailing }}</td>
              <td class="text-center">{{ item.distance }}</td>
              <td class="text-center">
                <i-input
                  @input="debounceSimulate"
                  v-model="item.speed"
                  :disabled="index != edtiableRowIndex || !isEditableSPEED"
                ></i-input>
              </td>
              <td class="cell-hfo text-center" v-if="isHFOVisible">
                <i-input
                  @input="debounceSimulate"
                  v-model="item.focHfo"
                  :disabled="index != edtiableRowIndex || !isEditableHFO"
                ></i-input>
              </td>
              <td class="cell-lfo text-center" v-if="isLFOVisible">
                <i-input
                  @input="debounceSimulate"
                  v-model="item.focLfo"
                  :disabled="index != edtiableRowIndex || !isEditableLFO"
                ></i-input>
              </td>
              <td class="cell-mdo text-center" v-if="isMDOVisible">
                <i-input
                  @input="debounceSimulate"
                  v-model="item.focMdo"
                  :disabled="index != edtiableRowIndex || !isEditableMDO"
                ></i-input>
              </td>
              <td class="cell-mgo text-center" v-if="isMGOVisible">
                <i-input
                  @input="debounceSimulate"
                  v-model="item.focMgo"
                  :disabled="index != edtiableRowIndex || !isEditableMGO"
                ></i-input>
              </td>
              <td class="cell-lpg text-center" v-if="isLPGVisible">
                <i-input
                  @input="debounceSimulate"
                  v-model="item.focLpg"
                  :disabled="index != edtiableRowIndex || !isEditableLPG"
                ></i-input>
              </td>
              <td class="cell-lng text-center" v-if="isLNGVisible">
                <i-input
                  class="w-100"
                  @input="debounceSimulate"
                  v-model="item.focLng"
                  :disabled="index == 0 || !isEditableLNG"
                ></i-input>
              </td>
              <td class="text-center">{{ item.co2Emission }}</td>
              <td class="text-center">{{ item.requiredCii }}</td>
              <td class="text-center">{{ item.attainedCii }}</td>
              <td class="text-center">{{ item.ciiRating }}</td>
              <td class="text-center">{{ item.ciiGrade }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-sheet>

      <v-sheet
        class="mt-0 w-100 d-flex"
        style="height: 100%; max-height: calc(100% - 215px - 24px)"
      >
        <!-- style="height: calc(67% - 48px)" -->
        <v-sheet class="h-100 mr-3" style="width: 30%">
          <v-card color="#333334" class="px-6 h-100 rounded-lg">
            <v-card-title class="cii-title py-4">
              <div>CII 예상 지표</div>
            </v-card-title>
            <v-card-text class="my-0" style="height: calc(100% - 80px)">
              <Echart :option="cimulationOption"> </Echart>
            </v-card-text>
          </v-card>
        </v-sheet>
        <v-sheet class="h-100 pa-6 ml-3 rounded-lg d-flex" style="width: 70%" color="#333334">
          <v-sheet color="#333334" class="d-flex flex-column flex-grow-1 flex-shrink-1">
            <div style="font-size: 1.2rem">CII 요약</div>
            <v-sheet
              class="w-100 flex-grow-1 flex-shrink-1 d-flex flex-column mt-3"
              color="#333334"
            >
              <div class="mb-3" style="font-size: 0.9rem; line-height: 1">
                현재 CII 지표 ({{ ciiStartDate }} ~ {{ convertDateType(todayDate) }})
              </div>
              <v-row class="flex-grow-1 flex-shrink-1">
                <v-col>
                  <v-card class="cii-summary-card h-100 d-flex align-center" color="#2D2D30">
                    <v-card-text>
                      <div class="d-flex align-center ga-4 pl-6">
                        <div style="min-width: 50px"><v-img :src="ciiGrade" width="100%" /></div>
                        <div class="align-center" style="flex: 1 1 0">
                          <div class="mb-2" style="font-size: 1rem">CII 등급</div>
                          <div
                            style="font-size: 1.4rem"
                            :class="getColorByGrade(simulatorData.pastData.ciiGrade)"
                          >
                            {{ simulatorData.pastData.ciiGrade }}
                          </div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col
                  ><v-card class="cii-summary-card h-100 d-flex align-center" color="#2D2D30">
                    <v-card-text>
                      <div class="d-flex align-center ga-4 pl-6">
                        <div style="min-width: 50px"><v-img :src="distance" width="100%" /></div>
                        <div class="align-center" style="flex: 1 1 0">
                          <div class="mb-2" style="font-size: 1rem">운항거리</div>
                          <div style="font-size: 1.4rem">
                            {{ simulatorData.pastData.distance }}<span class="unit"> nm</span>
                          </div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card></v-col
                >
                <v-col
                  ><v-card class="cii-summary-card h-100 d-flex align-center" color="#2D2D30">
                    <v-card-text>
                      <div class="d-flex align-center ga-4 pl-6">
                        <div style="min-width: 50px"><v-img :src="co2Emission" width="100%" /></div>
                        <div class="align-center" style="flex: 1 1 0">
                          <div class="mb-2" style="font-size: 1rem">CO2 배출량</div>
                          <div style="font-size: 1.4rem">
                            {{ simulatorData.pastData.co2Emission }}<span class="unit"> tCO₂</span>
                          </div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card></v-col
                >
              </v-row>
            </v-sheet>
            <v-divider class="my-3 border-dashed"></v-divider>
            <v-sheet class="w-100 flex-grow-1 flex-shrink-1 d-flex flex-column" color="#333334">
              <div class="mb-3" style="font-size: 0.9rem">
                총 CII 지표 ({{ ciiStartDate }} ~ {{ convertDateType(endDate) }})
              </div>
              <v-row class="flex-grow-1 flex-shrink-1">
                <v-col>
                  <v-card class="cii-summary-card h-100 d-flex align-center" color="#2D2D30">
                    <v-card-text>
                      <div class="d-flex align-center ga-4 pl-6">
                        <div style="min-width: 50px"><v-img :src="ciiGrade" width="100%" /></div>
                        <div class="align-center" style="flex: 1 1 0">
                          <div class="mb-2" style="font-size: 1rem">CII 등급</div>
                          <div
                            style="font-size: 1.4rem"
                            :class="getColorByGrade(simulatorData.futureData.ciiGrade)"
                          >
                            {{ simulatorData.futureData.ciiGrade }}
                          </div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col
                  ><v-card class="cii-summary-card h-100 d-flex align-center" color="#2D2D30">
                    <v-card-text>
                      <div class="d-flex align-center ga-4 pl-6">
                        <div style="min-width: 50px"><v-img :src="distance" width="100%" /></div>
                        <div class="align-center" style="flex: 1 1 0">
                          <div class="mb-2" style="font-size: 1rem">운항거리</div>
                          <div style="font-size: 1.4rem">
                            {{ simulatorData.futureData.distance }}<span class="unit"> nm</span>
                          </div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card></v-col
                >
                <v-col
                  ><v-card class="cii-summary-card h-100 d-flex align-center" color="#2D2D30">
                    <v-card-text>
                      <div class="d-flex align-center ga-4 pl-6">
                        <div style="min-width: 50px"><v-img :src="co2Emission" width="100%" /></div>
                        <div class="align-center" style="flex: 1 1 0">
                          <div class="mb-2" style="font-size: 1rem">CO2 배출량</div>
                          <div style="font-size: 1.4rem">
                            {{ simulatorData.futureData.co2Emission
                            }}<span class="unit"> tCO₂</span>
                          </div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card></v-col
                >
              </v-row>
            </v-sheet>
          </v-sheet>
        </v-sheet>
      </v-sheet>
    </v-sheet>
  </v-row>
  <!-- </v-sheet> -->
  <!-- </div> -->
</template>

<script setup>
import { ref, onMounted, watch, computed, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { convertDateType, removeComma } from '@/composables/util'

import { getCiiBoundary } from '@/api/cii'

import { useShipStore } from '@/stores/shipStore'
import { useCiiStore } from '@/stores/ciiStore'

import Echart from '@/components/echart/Echarts.vue'
import ciiGrade from '/icons/grade.png'
import distance from '/icons/distance.png'
import co2Emission from '/icons/co2Emission.png'

import moment from 'moment'
import _ from 'lodash'
/**
 * 상태관리 변수
 */
const shipStore = useShipStore()
const { curSelectedShip, shipMachineInfo, usedFuels } = storeToRefs(shipStore)

const ciiStore = useCiiStore()
const { pastCiiData } = storeToRefs(ciiStore)

/**
 * 날짜 관련 변수
 */
const startDate = ref('') // 시작날짜
const endDate = ref('') // 종료날짜
const todayDate = ref('') // 오늘 날짜
const yesterday = ref() // 어제 날짜
const tomorrow = ref() // 내일 날짜
const firstDayOfYear = ref() // 올해 첫날
const ciiStartDate = ref()
const lastDayOfYear = ref() // 올해 마지막날

/**
 * 파라미터 관련 변수
 */
const parameters = ref(['SPEED']) // 초기 파라미터 셋팅
const selectedParameter = ref('SPEED')
const requestType = ref('slide') // 시뮬레이터 시 텍스트 입력인지 슬라이더인지 판별하는 변수

/**
 * 시뮬레이션 관련 변수
 */
const ciiSimulatorGrid = ref()
const ciiRate = ref()
const simulatorData = ref({
  pastData: {
    distance: '-',
    co2Emission: '-',
    ciiGrade: '-'
  },
  futureData: {
    distance: '-',
    co2Emission: '-',
    ciiGrade: '-'
  }
})
let timer = null
const TIMER_SECOND = 1000

const rangeAWidth = ref(20)
const rangeBWidth = ref(20)
const rangeCWidth = ref(20)
const rangeDWidth = ref(20)
const rangeEWidth = ref(20)

const headers = [
  {
    title: 'Sailing (day)',
    key: 'sailing'
  },
  {
    title: 'Distance (nm)',
    key: 'distance'
  },
  {
    title: 'Speed (kn)',
    key: 'speed'
  },
  {
    title: 'FOC',
    key: '',
    children: [
      {
        title: 'HFO',
        value: 'hfo'
      },
      {
        title: 'LFO',
        value: 'lfo'
      },
      {
        title: 'MDO',
        value: 'mdo'
      },
      {
        title: 'MGO',
        value: 'mgo'
      },
      {
        title: 'LPG',
        value: 'lpg'
      },
      {
        title: 'LNG',
        value: 'lng'
      }
    ]
  },
  {
    title: 'Total Co2 Emission(kn)',
    key: 'requiredCII'
  },
  {
    title: 'Required CII ',
    key: 'requiredCII'
  },
  {
    title: 'Attained CII ',
    key: 'attainedCII'
  },
  {
    title: 'CII  Rating ',
    key: 'requiredCII'
  },
  {
    title: 'CII  Grade',
    key: 'ciiGrade'
  }
]

const edtiableRowIndex = ref(1) // 수정 가능한 테이블 행의 인덱스

/**
 * 사용 연료별 보이기 여부를 결정하는 변수
 */
const isHFOVisible = ref(false)
const isLFOVisible = ref(false)
const isMDOVisible = ref(false)
const isMGOVisible = ref(false)
const isLPGVisible = ref(false)
const isLNGVisible = ref(false)
const isFocVisible = ref(false)

/**
 * 파라미터 선택에 따라 수정 여부를 결정하는 변수
 */
const isEditableSPEED = ref(false)
const isEditableMDO = ref(true)
const isEditableMGO = ref(true)
const isEditableLFO = ref(true)
const isEditableHFO = ref(true)
const isEditableLPG = ref(true)
const isEditableLNG = ref(true)

/**
 * 차트 관련 변수
 */
const series = ref([])
const chartDate = ref([])

const pastCiiColor = ref()
const futureCiiColor = ref()

onMounted(() => {
  const today = moment()

  todayDate.value = today.utc().format('YYYY-MM-DD hh:mm')
  yesterday.value = today.utc().subtract(1, 'days').format('YYYY-MM-DD hh:mm')
  tomorrow.value = today.utc().add(2, 'days').format('YYYY-MM-DD hh:mm')

  console.log('오늘' + todayDate.value)

  // 올해 첫날 가져오기
  firstDayOfYear.value = today.utc().startOf('year')
  startDate.value = firstDayOfYear.value.format('YYYY-MM-DD HH:mm')
  ciiStartDate.value = firstDayOfYear.value.format('YYYY-MM-DD')

  // 올해 마지막 날짜 가져오기
  lastDayOfYear.value = today.utc().endOf('year')
  endDate.value = lastDayOfYear.value.format('YYYY-MM-DD HH:mm')

  changeParameter()
  fetchPastCiiData()
})

const displayColumn = () => {
  if (usedFuels.value.length == 0) {
    return
  } else {
    isFocVisible.value = true
  }

  isHFOVisible.value = usedFuels.value.includes('HFO')
  isLFOVisible.value = usedFuels.value.includes('LFO')
  isMDOVisible.value = usedFuels.value.includes('MDO')
  isMGOVisible.value = usedFuels.value.includes('MGO')
  isLPGVisible.value = usedFuels.value.includes('LPG')
  isLNGVisible.value = usedFuels.value.includes('LNG')
}

const changeParameter = () => {
  if (usedFuels.value && usedFuels.value.length != 0) {
    parameters.value = ['Speed', ...usedFuels.value]
  }
}

const fetchPastCiiData = async () => {
  displayColumn()
  await changeParameter()

  let parseStartTimeZone = moment.parseZone(startDate.value)
  let parseEndTimeZone = moment.parseZone(endDate.value)

  let utcStartTime = parseStartTimeZone.toISOString()
  let utcEndTime = parseEndTimeZone.toISOString()

  let form = {
    imoNumber: curSelectedShip.value.imoNumber,
    startTime: utcStartTime,
    endTime: utcEndTime
  }

  await ciiStore.fetchPastCiiData(form)

  if (pastCiiData.value.first) {
    ciiRate.value = pastCiiData.value.first[0].ciiRating
    simulatorData.value.pastData.ciiGrade = pastCiiData.value.first[0].ciiGrade
    simulatorData.value.pastData.co2Emission = pastCiiData.value.first[0].co2Emission
    simulatorData.value.pastData.distance = pastCiiData.value.first[0].distance
  }

  pastCiiColor.value = getColorCode(pastCiiData.value.first[0].ciiGrade)
  futureCiiColor.value = getColorCode(pastCiiData.value.first[1].ciiGrade)

  console.log('컬러')
  console.log(pastCiiColor.value)
  console.log(futureCiiColor.value)

  setChartOption()

  updateSliderWidth()
}

const cimulationOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },

  grid: {
    bottom: '20px'
  },

  legend: {
    data: ['CII Past Data', ' Simulation Data']
  },
  xAxis: [
    {
      type: 'category',
      data: chartDate.value
      // axisPointer: {
      //   type: 'shadow'
      // }
    }
  ],
  visualMap: {
    show: false,
    dimension: 0,
    pieces: [
      {
        lte: 0,
        color: pastCiiColor.value
      },
      {
        gt: 0,
        lte: 1,
        color: futureCiiColor.value
      }
    ]
  },
  yAxis: [
    {
      type: 'value',
      name: 'Co2 Emission',
      min: 0
    }
  ],
  series: series.value
})
const setChartOption = () => {
  let today = moment()
  let todayDate = today.utc().format('YY/MM')

  let selectedStartDate = moment(startDate.value)
  let selectedEndDate = moment(endDate.value)

  let firstDay = selectedStartDate.utc().format('YY/MM')
  let lastDay = selectedEndDate.utc().format('YY/MM')

  let chartStartDate = `${firstDay} - ${todayDate}`
  let chartEndDate = `${todayDate} - ${lastDay}`

  chartDate.value = [chartStartDate, chartEndDate]
  cimulationOption.value.xAxis[0].data = chartDate.value
  cimulationOption.value.visualMap.pieces[0].color = pastCiiColor.value
  cimulationOption.value.visualMap.pieces[1].color = futureCiiColor.value

  const co2EmissionIndex = findIndex('Co2 Emission')

  let pastChartData = removeComma(pastCiiData.value.first[0].co2Emission)
  pastChartData = parseFloat(pastChartData)
  let futureChartData = removeComma(pastCiiData.value.first[1].co2Emission)
  futureChartData = parseFloat(futureChartData)

  if (co2EmissionIndex == -1) {
    series.value.push({
      name: 'Co2 Emission',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value
        }
      },
      data: [pastChartData, futureChartData]
    })
  } else {
    console.log('Co2 Emission 있음' + co2EmissionIndex)
    console.dir(pastCiiData.value)
    series.value[co2EmissionIndex].data = [pastChartData, futureChartData]
  }

  const attainedCiiIndex = findIndex('Attained CII')

  if (attainedCiiIndex == -1) {
    series.value.push({
      name: 'Attained CII',
      type: 'line',
      // yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value
        }
      },
      data: [pastCiiData.value.first[0].attainedCii, pastCiiData.value.first[1].attainedCii]
    })
  } else {
    series.value[attainedCiiIndex].data = [
      pastCiiData.value.first[0].attainedCii,
      pastCiiData.value.first[1].attainedCii
    ]
  }
}

function findIndex(name) {
  for (let i = 0; i < series.value.length; i++) {
    if (series.value[i].name == name) {
      return i
    }
  }
  return -1
}

watch(curSelectedShip, fetchPastCiiData)

const simulateCiiData = async () => {
  let convertedForm = _.cloneDeep(pastCiiData.value.first)
  console.dir(convertedForm)
  delete convertedForm[0].type
  delete convertedForm[1].type

  let form = {
    imoNumber: curSelectedShip.value.imoNumber,
    pastData: convertedForm[0],
    futureData: convertedForm[1],
    targetCiiRating: ciiRate.value,
    parameterName: selectedParameter.value,
    requestType: requestType.value
  }

  const response = await ciiStore.simulateCiiData(form)

  const {
    second: {
      finalCiiGrade,
      finalCo2Emission,
      finalDistance,
      pastCiiGrade,
      pastCo2Emission,
      pastDistance,
      finalCiiRating
    }
  } = response

  simulatorData.value.futureData.ciiGrade = finalCiiGrade
  simulatorData.value.futureData.co2Emission = finalCo2Emission
  simulatorData.value.futureData.distance = finalDistance

  simulatorData.value.pastData.ciiGrade = pastCiiGrade
  simulatorData.value.pastData.co2Emission = pastCo2Emission
  simulatorData.value.pastData.distance = pastDistance

  pastCiiColor.value = getColorCode(pastCiiGrade)
  futureCiiColor.value = getColorCode(finalCiiGrade)

  ciiRate.value = finalCiiRating

  setChartOption()
  updateSliderWidth()
}

const debounceSimulate = () => {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(simulateCiiDataByText, TIMER_SECOND)
  // debounce(simulateCiiDataByText, 1000)
  // _.debounce(simulateCiiDataByText, 300)
  // setTimeout(simulateCiiDataByText, 1500);
}

const simulateCiiDataByText = async () => {
  console.log('텍스트 시뮬레이션')
  let convertedForm = _.cloneDeep(pastCiiData.value.first)
  delete convertedForm[0].type
  delete convertedForm[1].type

  let form = {
    imoNumber: curSelectedShip.value,
    pastData: convertedForm[0],
    futureData: convertedForm[1],
    targetCiiRating: ciiRate.value,
    parameterName: selectedParameter.value,
    requestType: 'text'
  }

  const response = await ciiStore.simulateCiiData(form)
  const {
    second: {
      finalCiiGrade,
      finalCo2Emission,
      finalDistance,
      pastCiiGrade,
      pastCo2Emission,
      pastDistance,
      finalCiiRating
    }
  } = response

  simulatorData.value.futureData.ciiGrade = finalCiiGrade
  simulatorData.value.futureData.co2Emission = finalCo2Emission
  simulatorData.value.futureData.distance = finalDistance

  simulatorData.value.pastData.ciiGrade = pastCiiGrade
  simulatorData.value.pastData.co2Emission = pastCo2Emission
  simulatorData.value.pastData.distance = pastDistance

  pastCiiColor.value = getColorCode(finalCiiGrade)
  futureCiiColor.value = getColorCode(pastCiiGrade)

  setChartOption()
  ciiRate.value = finalCiiRating
  updateSliderWidth()
}

const getColorCode = (grade) => {
  let gradeColorCode = ''
  switch (grade) {
    case 'A':
      gradeColorCode = '#8CE816'
      break
    case 'B':
      gradeColorCode = '#42D2A7'
      break
    case 'C':
      gradeColorCode = '#FEBD19'
      break
    case 'D':
      gradeColorCode = '#F68822'
      break
    case 'E':
      gradeColorCode = '#F04A4A'
      break
  }

  return gradeColorCode
}
const getColorByGrade = (grade) => {
  let gradeColor = ''
  switch (grade) {
    case 'A':
      gradeColor = 'gradeA'
      break
    case 'B':
      gradeColor = 'gradeB'
      break
    case 'C':
      gradeColor = 'gradeC'
      break
    case 'D':
      gradeColor = 'gradeD'
      break
    case 'E':
      gradeColor = 'gradeE'
      break
  }

  return gradeColor
}

const updateEditable = (editableTarget, name) => {
  editableTarget.value = name != selectedParameter.value
}

const changeEditable = () => {
  updateEditable(isEditableSPEED, 'SPEED')
  updateEditable(isEditableMDO, 'MDO')
  updateEditable(isEditableMGO, 'MGO')
  updateEditable(isEditableLFO, 'LFO')
  updateEditable(isEditableHFO, 'HFO')
  updateEditable(isEditableLPG, 'LPG')
  updateEditable(isEditableLNG, 'LNG')
}

const CII_MINMAX_DIFFERENT = 120
const updateSliderWidth = async () => {
  let imoNumber = curSelectedShip.value.imoNumber
  const {
    status,
    data: { data }
  } = await getCiiBoundary(imoNumber)

  if (status == 200) {
    console.dir(data)
    rangeAWidth.value = (((data[0] - 40) / CII_MINMAX_DIFFERENT) * 100).toFixed(1)
    rangeBWidth.value = (((data[1] - data[0]) / CII_MINMAX_DIFFERENT) * 100).toFixed(1)
    rangeCWidth.value = (((data[2] - data[1]) / CII_MINMAX_DIFFERENT) * 100).toFixed(1)
    rangeDWidth.value = (((data[3] - data[2]) / CII_MINMAX_DIFFERENT) * 100).toFixed(1)
    rangeEWidth.value = (((160 - data[3]) / CII_MINMAX_DIFFERENT) * 100).toFixed(1)

    let abs = Math.abs(
      100 -
        (parseFloat(rangeAWidth.value) +
          parseFloat(rangeBWidth.value) +
          parseFloat(rangeCWidth.value) +
          parseFloat(rangeDWidth.value) +
          parseFloat(rangeEWidth.value))
    )

    // rangeAWidth.value = (parseFloat(rangeAWidth.value) + abs / 2).toFixed(1)
    // rangeEWidth.value = (parseFloat(rangeEWidth.value) + abs / 2).toFixed(1)
  }
}
watch(selectedParameter, changeEditable)
</script>

<style scoped lang="scss">
.cii-slider .v-slider.v-input--horizontal .v-slider-track__fill {
  background: transparent !important;
}

.v-slider-thumb__surface {
  border: 2px solid #fff;
}

.cii-slider .v-slider-thumb {
  color: #5789fe !important;
}

.cii-simulation-table {
  &.v-table {
    thead {
      tr {
        th {
          background-color: #6e6e78;
          border-right: 1px solid #4d4d4d;
          color: #2c2c37;
          font-weight: 600;
        }
      }
    }
  }
}

.cii-title {
  font-size: 1.2rem;
}

.v-card-item {
  text-align: center;
}

.v-card .v-card-subtitle {
  font-size: 1.4rem;
  color: white;
  opacity: 1;
  .unit {
    font-size: 0.7em;
    color: #bababa;
  }
}

.cii-summary-card {
  .unit {
    font-size: 0.7em;
    color: #bababa;
  }
}

@media screen and (max-height: 850px) {
  .cii-simulation-page {
    overflow-y: scroll !important;
  }
}
</style>
