<template>
  <!-- <div class="d-flex flex-column flex-grow-1 flex-shrink-1 detail-page"> -->
  <v-sheet class="tabs-content-container detail-page py-6" style="overflow: visible;">
    <v-row no-gutters class="">
      <v-col cols="6">
        <v-sheet class="d-flex ga-4">
          <div class="d-flex ga-2">
            <div class="datePicker">
              <input type="datetime-local" v-model="startDate" :max="yesterday" />
            </div>
            <div class="datePicker">
              <input type="datetime-local" v-model="endDate" :min="tomorrow" />
            </div>
            <i-btn @click="fetchPastCiiData()" text="조회" width="90"></i-btn>
          </div>
          <div class="d-flex align-center">Date (2024-01-01 ~ 2024-12-31)</div>
        </v-sheet>
      </v-col>
      <v-col cols="6">
        <v-row no-gutters class="align-center">
          <v-col cols="4">
            <div class="d-flex ga-2">
              <div class="d-flex align-center">Parameter</div>
              <div class="datePicker">
                <i-selectbox v-model="selectedParameter" :items="parameters" variant="solo-filled" density="compact"
                  class="equipmentSelector" bg-color="#434348" placeholder="Parameter를 선택해주세요" :hide-details="true"
                  width="20%"></i-selectbox>
              </div>
            </div>
          </v-col>
          <v-col cols="8">
            <v-sheet class="px-5 align-center">
              <div class="d-flex ga-2">
                <div class="d-flex align-center">CII Rating</div>
                <v-sheet class="align-center" color="#000000" style="flex: 1">
                  <v-sheet class="cii-slider d-flex flex-column">
                    <div class="d-flex gc-1 align-center" style="position: relative">
                      <v-sheet min-width="10%" height="12" color="#8CE816"
                        style="border-bottom-left-radius: 20px; border-top-left-radius: 20px">
                      </v-sheet>
                      <v-sheet min-width="15%" height="12" color="#42D2A7" style=""> </v-sheet>
                      <v-sheet min-width="50%" height="12" color="#FEBD19" style=""> </v-sheet>
                      <v-sheet min-width="10%" height="12" color="#F68822" style=""> </v-sheet>
                      <v-sheet min-width="15%" height="12" color="#F04A4A"
                        style="border-top-right-radius: 20px; border-bottom-right-radius: 20px">
                      </v-sheet>
                      <v-slider ref="ciirateSlider" id="ciirateSlider" style="
                          position: absolute;
                          width: 100%;
                          transform: translateY(-70%);
                          top: 0%;
                          height: 12px;
                        " min="40" max="160" v-model="ciiRate" thumb-label="always"
                        @mouseup="simulateCiiData"></v-slider>
                    </div>

                    <div class="d-flex mt-1">
                      <div class="text-center" style="width: 10%; opacity: 0.5">A</div>
                      <div class="text-center" style="width: 15%; opacity: 0.5">B</div>
                      <div class="text-center" style="width: 50%; opacity: 0.5">C</div>
                      <div class="text-center" style="width: 15%; opacity: 0.5">D</div>
                      <div class="text-center" style="width: 10%; opacity: 0.5">E</div>
                    </div>
                  </v-sheet>
                </v-sheet>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- 테이블  -->
    <v-row class="align-center mt-6 mb-3">
      <DxDataGrid id="cii-simulator-grid2" ref="ciiSimulatorGrid" class="" :data-source="pastCiiData.first"
        @cellPrepared="onCellPrepared" @editor-prepared="onEditorPrepared" key-expr="type" show-borders="true">
        <!-- <DxSelection mode="single"></DxSelection> -->
        <DxColumn data-field="type" caption="id" alignment="center" :visible="false"></DxColumn>

        <DxColumn data-field="sailing" alignment="center" header-cell-template="sailing-header"
          :allow-editing="false" />
        <template #sailing-header="{ data }">
          <p>
            Sailing <br />
            (day)
          </p>
        </template>

        <DxColumn data-field="distance" caption="Distance(nm)" alignment="center" header-cell-template="distance-header"
          :allow-editing="false" />
        <template #distance-header="{ data }">
          <p>
            Distance <br />
            (nm)
          </p>
        </template>

        <DxColumn data-field="speed" caption="Speed(kn)" alignment="center" header-cell-template="speed-header"
          cell-template="speed-template" :allow-editing="false">
        </DxColumn>
        <template #speed-header="{ data }">
          <p>Speed<br />(kn)</p>
        </template>

        <template #speed-template="{ data: templateOptions }">
          <div class="speed-data">{{ templateOptions.data.speed }}</div>
        </template>

        <DxColumn data-field="foc" v-model:visible="isFocVisible" caption="FOC(mt)" alignment="center">
          <DxColumn data-field="focHfo" v-model:visible="isHFOVisible" :allow-editing="true" caption="HFO"
            alignment="center" cell-template="hfo-template"></DxColumn>
          <DxColumn data-field="focLfo" v-model:visible="isLFOVisible" :allow-editing="true" caption="LFO"
            alignment="center" cell-template="lfo-template"></DxColumn>
          <DxColumn data-field="focMdo" v-model:visible="isMDOVisible" :allow-editing="true" caption="MDO"
            alignment="center" cell-template="mdo-template"></DxColumn>
          <DxColumn data-field="focMgo" v-model:visible="isMGOVisible" :allow-editing="true" caption="MGO"
            alignment="center" cell-template="mgo-template"></DxColumn>
          <DxColumn data-field="focLpg" v-model:visible="isLPGVisible" :allow-editing="true" caption="LPG"
            alignment="center" cell-template="lpg-template"></DxColumn>
          <DxColumn data-field="focLng" v-model:visible="isLNGVisible" :allow-editing="true" caption="LNG"
            alignment="center" cell-template="lng-template"></DxColumn>
        </DxColumn>

        <template #hfo-template="{ data: templateOptions }">
          <div class="hfo-data">{{ templateOptions.data.focHfo }}</div>
        </template>
        <template #lfo-template="{ data: templateOptions }">
          <div class="lfo-data">{{ templateOptions.data.focLfo }}</div>
        </template>
        <template #mdo-template="{ data: templateOptions }">
          <div class="mdo-data">{{ templateOptions.data.focMdo }}</div>
        </template>
        <template #mgo-template="{ data: templateOptions }">
          <div class="mgo-data">{{ templateOptions.data.focMgo }}</div>
        </template>
        <template #lpg-template="{ data: templateOptions }">
          <div class="lpg-data">{{ templateOptions.data.focLpg }}</div>
        </template>
        <template #lng-template="{ data: templateOptions }">
          <div class="lng-data">{{ templateOptions.data.focLng }}</div>
        </template>

        <DxColumn data-field="co2Emission" caption="Total CO₂,Emission(kn)" alignment="center"
          header-cell-template="totalEmission-header" :allow-editing="false" />
        <template #totalEmission-header="{ data }">
          <p>
            Total <br />
            Co2 Emission<br />
            (kn)
          </p>
        </template>
        <DxColumn data-field="requiredCii" caption="Required Cll" alignment="center"
          header-cell-template="requireCII-header" :allow-editing="false" />

        <template #requireCII-header="{ data }">
          <p>
            Required <br />
            CII
          </p>
        </template>
        <DxColumn data-field="attainedCii" caption="Attained Cll" alignment="center"
          header-cell-template="attainedCll-header" :allow-editing="false" />
        <template #attainedCll-header="{ data }">
          <p>
            Attained <br />
            CII
          </p>
        </template>
        <DxColumn data-field="ciiRating" caption="Cll Rating" alignment="center" header-cell-template="rating-header"
          :allow-editing="false" />

        <template #rating-header="{ data }">
          <p>
            CII <br />
            Rating
          </p>
        </template>

        <DxColumn data-field="ciiGrade" caption="Cll Grade" alignment="center" header-cell-template="grade-header"
          :allow-editing="false" />

        <template #grade-header="{ data }">
          <p>
            CII <br />
            Grade
          </p>
        </template>

        <!-- <DxPaging />/ -->
        <DxScrolling mode="virtual"></DxScrolling>
        <DxEditing :allow-updating="true" mode="cell" />
      </DxDataGrid>
    </v-row>

    <v-row class="mt-0">
      <v-col cols="4" class="h-100">
        <v-card color="#333334" class="px-6 test5 rounded-lg">
          <v-card-title class="cii-title">
            <div>CII 예상 지표</div>
          </v-card-title>
          <v-card-text>
            <div class="test5">
              <Echart :option="cimulationOption"> </Echart>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8" class="test5">
        <v-card color="#333334" class="py-3 px-6 h-100">
          <v-card-title class="cii-title">
            <div style="line-height: 1">CII 요약</div>
          </v-card-title>
          <v-card-text>
            <v-sheet color="#333334" class="mb-4">
              <div class="mb-2 cii-sub-title">현재 CII 지표 (2024-01-01 ~ 2024-04-29)</div>
              <v-row>
                <v-col>
                  <v-card class="grade-item d-flex">
                    <template v-slot:prepend>
                      <div>
                        <v-img :src="ciiGrade" width="50" />
                      </div>
                    </template>

                    <v-card-item>
                      <v-card-title>CII 등급</v-card-title>
                      <v-card-subtitle>
                        <span :class="getColorByGrade(pastCiiData.second.pastCiiGrade)">
                          {{ pastCiiData.second.pastCiiGrade }}</span>
                      </v-card-subtitle>
                    </v-card-item>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card class="grade-item d-flex">
                    <template v-slot:prepend>
                      <v-img :src="distance" width="50" />
                    </template>

                    <v-card-item>
                      <v-card-title>운항거리</v-card-title>
                      <v-card-subtitle>
                        {{ pastCiiData.second.pastDistance }}<span class="unit"> nm</span>
                      </v-card-subtitle>
                    </v-card-item>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card class="grade-item d-flex">
                    <template v-slot:prepend>
                      <v-img :src="co2Emission" width="50" />
                    </template>

                    <v-card-item>
                      <v-card-title>CO2 배출량</v-card-title>
                      <v-card-subtitle>
                        {{ pastCiiData.second.pastDistance }}<span class="unit"> tCO₂</span>
                      </v-card-subtitle>
                    </v-card-item>
                  </v-card>
                </v-col>
              </v-row>
            </v-sheet>
            <v-divider></v-divider>
            <v-sheet color="#333334" class="mt-4">
              <div class="mb-2 cii-sub-title">총 CII 지표 (2024-01-01 ~ 2024-12-31)</div>
              <v-row>
                <v-col>
                  <v-card class="grade-item d-flex">
                    <template v-slot:prepend>
                      <div>
                        <v-img :src="ciiGrade" width="50" />
                      </div>
                    </template>

                    <v-card-item>
                      <v-card-title>CII 등급</v-card-title>
                      <v-card-subtitle>
                        <span :class="getColorByGrade(pastCiiData.second.pastCiiGrade)">
                          {{ pastCiiData.second.pastCiiGrade }}</span>
                      </v-card-subtitle>
                    </v-card-item>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card class="grade-item d-flex">
                    <template v-slot:prepend>
                      <v-img :src="distance" width="50" />
                    </template>

                    <v-card-item>
                      <v-card-title>운항거리</v-card-title>
                      <v-card-subtitle>
                        {{ pastCiiData.second.pastDistance }}<span class="unit"> nm</span>
                      </v-card-subtitle>
                    </v-card-item>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card class="grade-item d-flex">
                    <template v-slot:prepend>
                      <v-img :src="co2Emission" width="50" />
                    </template>

                    <v-card-item>
                      <v-card-title>CO2 배출량</v-card-title>
                      <v-card-subtitle>
                        {{ pastCiiData.second.pastDistance }}<span class="unit"> tCO₂</span>
                      </v-card-subtitle>
                    </v-card-item>
                  </v-card>
                </v-col>
              </v-row>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
  <!-- </div> -->
</template>

<script setup>
import { ref, onMounted, watch, computed, onBeforeMount } from 'vue'
import PortInfo from '@/components/voyage/PortInfo.vue'
import ciiSimulationData from '@/assets/mockup/ciiSimulationData.json'
import Echart from '@/components/echart/Echarts.vue'
import moment from 'moment'

import { useShipStore } from '@/stores/shipStore'
import { useCiiStore } from '@/stores/ciiStore'

import ciiGrade from '/icons/grade.png'
import distance from '/icons/distance.png'
import co2Emission from '/icons/co2Emission.png'
import { storeToRefs } from 'pinia'
import _ from 'lodash'

const startDate = ref('')
const endDate = ref('')
const todayDate = ref('')

const parameters = ref(['Speed'])

const shipStore = useShipStore()
const { selectedShip, shipMachineInfo, usedFuels } = storeToRefs(shipStore)

const ciiStore = useCiiStore()
const { pastCiiData } = storeToRefs(ciiStore)

const selectedParameter = ref('Speed')

const test = ref(false)
const ciiRate = ref()
// const ciirateSlider = ref();

// ciirateSlider.value.addEventListener("click", test5);

const ciiSimulatorGrid = ref()
const isHFOVisible = ref(false)
const isLFOVisible = ref(false)
const isMDOVisible = ref(false)
const isMGOVisible = ref(false)
const isLPGVisible = ref(false)
const isLNGVisible = ref(false)
const isFocVisible = ref(false)

const requestType = ref('slide')

const emissionChartData = ref([])
const attainedData = ref([])

const series = ref([])
const chartDate = ref([])

const isEditingSpeed = ref()

const ciiSimulator = ref()

const yesterday = ref()
const tomorrow = ref()
const firstDayOfYear = ref()
const lastDayOfYear = ref()

const ciiDataSource = ref()

onMounted(() => {
  const today = moment()

  todayDate.value = today.utc().format('YYYY-MM-DD hh:mm')
  yesterday.value = today.utc().subtract(1, 'days').format('YYYY-MM-DD hh:mm')
  tomorrow.value = today.utc().add(2, 'days').format('YYYY-MM-DD hh:mm')

  console.log('오늘' + todayDate.value)

  // 올해 첫날 가져오기
  firstDayOfYear.value = today.utc().startOf('year')
  startDate.value = firstDayOfYear.value.format('YYYY-MM-DD HH:mm')

  // 올해 마지막 날짜 가져오기
  lastDayOfYear.value = today.utc().endOf('year')
  endDate.value = lastDayOfYear.value.format('YYYY-MM-DD HH:mm')

  changeParameter()
  fetchPastCiiData()
  // ciirateSlider.value.addEventListener("click", test5);
  // console.log('데브 그리드')

  // ciiSimulatorGrid.value.dataSource[1].speedTF;

  // console.log('스피드')
  // console.dir(ciiDataSource)
  // console.log(ciiDataSource.value.speed)
  // ciiSimulatorGrid.value.dataSource[1].speed  = true;
  // console.dir(ciiSimulatorGrid.value)

  // isEditingSpeed.value = ciiSimulatorGrid.value.dataSource[1].speedTF;
})

// const test5 = (fuel) =>{
//   alert('test')
//   ciiSimulatorGrid.value.instance.columnOption("HFO", "visible", false);
//   console.log('그리드드')
//   // console.dir(ciiSimulatorGrid.value.instance())
// //  return false;
// }

const onCellPrepared = (e) => {
  if (e.rowType != 'data') {
    return
  }

  if (e.key == 'past') {
    return
  }

  if (e.rowIndex == 0) {
    return
  }

  if (e.column.caption == 'Speed(kn)' && selectedParameter.value == 'Speed') {
    console.log('선택한 파라미터')
    console.log(selectedParameter.value)
    e.row.isEditing = true
    console.dir(e)
    // e.cellElement.bgColor = "red"

    // e.column.allowEditing = true;
    return
  }

  if (e.column.caption == selectedParameter.value) {
    console.log('선택한 파라미터')
    console.log(selectedParameter.value)
    e.element.isEditing = true
    // e.cellElement.bgColor = "red"
  }
}
const onEditorPrepared = (e) => {
  // console.log('셀 에디터 준비')
  alert('셀 에디터ㅓㅓ')
  // console.dir(e)

  console.log('셀 에디터ㅓㅓㅓ')
  console.dir(e)
  if (e.rowType != 'data') {
    return
  }

  if (e.key == 'past') {
    return
  }

  if (e.rowIndex == 0) {
    return
  }

  //  if(e.column.caption == 'Speed(kn)' && selectedParameter.value == 'Speed'){
  //        console.log('선택한 파라미터')
  //   console.log(selectedParameter.value)
  //       e.element.isEditing = true;
  //       //  e.cellElement.bgColor = "red"
  //       e.cellElement.css("background-color", "red");
  //   // e.column.allowEditing = true;
  //   return;
  // }

  // if(e.column.caption == selectedParameter.value){
  //   console.log('선택한 파라미터')
  //   console.log(selectedParameter.value)
  //   e.element.isEditing = true;
  //   // e.cellElement.bgColor = "red"

  // }
}

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
  console.log('사용 연료 !')
  console.dir(usedFuels.value)
  if (usedFuels.value && usedFuels.value.length != 0) {
    parameters.value = ['Speed', ...usedFuels.value]
  }
}

const fetchPastCiiData = async () => {
  console.log('파라미터 변경')
  displayColumn()
  await changeParameter()

  let parseStartTimeZone = moment.parseZone(startDate.value)
  let parseEndTimeZone = moment.parseZone(endDate.value)

  let utcStartTime = parseStartTimeZone.toISOString()
  let utcEndTime = parseEndTimeZone.toISOString()

  let form = {
    imoNumber: selectedShip.value,
    startTime: utcStartTime,
    endTime: utcEndTime
  }

  console.log('CII 과거 데이터 조회')
  console.dir(form)
  await ciiStore.fetchPastCiiData(form)

  console.log('cii data')
  console.dir(pastCiiData)
  console.dir(pastCiiData.value.first)

  if (pastCiiData.value.first) {
    console.log('과거 데이터가 있는지?')
    ciiRate.value = pastCiiData.value.first[0].ciiRating
  }

  console.log('Rating')
  console.log(ciiRate.value)
  setChartOption()

  ciiSimulatorGrid.value.dataSource[1].speedTF = true
  console.log('스피드')
  console.dir(ciiSimulatorGrid.value.dataSource[1])
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
    data: ['CII Past Data', 'Attained CII']
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
        lte: 1,
        color: 'green'
      },
      {
        gt: 1,
        lte: 2,
        color: '#4e83ff'
      }
      // {
      //   gt: 8,
      //   lte: 14,
      //   color: 'green'
      // },
      // {
      //   gt: 14,
      //   lte: 17,
      //   color: 'red'
      // },
      // {
      //   gt: 17,
      //   color: 'green'
      // }
    ]
  },
  yAxis: [
    {
      type: 'value',
      name: 'Co2 Emission',
      min: 0
      // interval: 20,
    }
    // {
    //   type: 'value',
    //   name: 'Temperature',
    //   min: 0,
    //   max: 25,
    //   interval: 5,
    //   axisLabel: {
    //     formatter: '{value}'
    //   }
    // }
  ],
  // series: [
  //   {
  //     name: 'Co2 Emission',
  //     type: 'bar',
  //     tooltip: {
  //       valueFormatter: function (value) {
  //         return value;
  //       }
  //     },
  //     data: emissionChartData.value
  //   },
  //   {
  //     name: 'Attained CII',
  //     type: 'line',
  //     // yAxisIndex: 1,
  //     tooltip: {
  //       valueFormatter: function (value) {
  //         return value;
  //       }
  //     },
  //     data: attainedData.value
  //   }
  // ]
  series: series.value
})
const setChartOption = () => {
  let today = moment()
  let todayDate = today.utc().format('YY/MM')

  // 올해 첫날 가져오기
  let firstDay = today.utc().startOf('year').format('YY/MM')
  // 올해 마지막 날짜 가져오기
  let lastDay = today.utc().endOf('year').format('YY/MM')

  let chartStartDate = `${firstDay} - ${todayDate}`
  let chartEndDate = `${todayDate} - ${lastDay}`

  // todayDate.value = today.utc().format('YY/MM')
  // yesterday.value = today.utc().subtract(1, 'days').format('YYYY-MM-DD hh:mm')
  // tomorrow.value = today.utc().add(2, 'days').format('YYYY-MM-DD hh:mm')

  chartDate.value = [chartStartDate, chartEndDate]

  cimulationOption.value.xAxis[0].data = chartDate.value

  const co2EmissionIndex = findIndex('Co2 Emission')

  if (co2EmissionIndex == -1) {
    series.value.push({
      name: 'Co2 Emission',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value
        }
      },
      data: [pastCiiData.value.first[0].co2Emission, pastCiiData.value.first[1].co2Emission]
    })
  } else {
    console.log('Co2 Emission 있음' + co2EmissionIndex)
    series.value[co2EmissionIndex].data = [
      pastCiiData.value.first[0].co2Emission,
      pastCiiData.value.first[1].co2Emission
    ]
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

watch(selectedShip, fetchPastCiiData)

const simulateCiiData = async () => {
  let convertedForm = _.cloneDeep(pastCiiData.value.first)

  console.log('변환')
  console.dir(convertedForm)
  delete convertedForm[0].type
  delete convertedForm[1].type

  let form = {
    imoNumber: selectedShip.value,
    pastData: convertedForm[0],
    futureData: convertedForm[1],
    targetCiiRating: ciiRate.value,
    parameterName: selectedParameter.value,
    requestType: requestType.value
  }

  await ciiStore.simulateCiiData(form)

  setChartOption()
  ciiSimulatorGrid.value.instance.refresh()
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
</script>

<style scoped lang="scss">
.cargoCapacityContainer {
  background-color: #111115;
}

.v-btn.inactive {
  background-color: #111115;
  color: #ffffff80;
}

.v-btn.active {
  color: #fff;
}

.row-height {
  height: calc((100% - 70px) / 2);
}

// .grade-container {
//   flex: 1 1 auto;
//   gap: 8px;
// }

// .summary-container {
//   flex: 1;
//   padding-top: 16px;
//   padding-bottom: 16px;
// }

.grade-item {
  flex: 1 1 30%;
  background: #2d2d30;
}

.grade-container {
  .v-card-title {
    font-size: 1.2em;
  }

  .v-card-subtitle {
    font-size: 1.8em;
    color: #fff;
    opacity: 1;

    .unit {
      font-size: 0.6em;
      color: #bababa;
    }
  }
}

.cii-slider .v-slider.v-input--horizontal .v-slider-track__fill {
  background: transparent !important;
}

.cii-rating-grid .dx-data-row:nth-child(odd) {
  background: #1b1b1c;
}

.v-slider-thumb__surface {
  border: 2px solid #fff;
}

.cii-slider .v-slider-thumb {
  color: #5789fe !important;
}

.cii-slider .v-slider-track__fill {
  background: transparent !important;
}

tr.dx-row.dx-data-row.dx-column-lines:nth-child(2) .speed-data,
tr.dx-row.dx-data-row.dx-column-lines:nth-child(2) .mdo-data,
tr.dx-row.dx-data-row.dx-column-lines:nth-child(2) .hfo-data {
  padding-top: 8px;
  background: #cdcdcd;
  color: #000;
  border-radius: 10px;
  padding-bottom: 8px;
}

#cii-simulator-grid2 {
  height: 100vh;
  max-height: calc((100vh - 65px - 24px - 62px - 24px - 40px - 24px) * 0.27);
}

.test5 {
  height: 100vh;
  max-height: calc((100vh - 65px - 24px - 62px - 24px - 40px - 24px) * 0.68);
  min-height: 720px;
}

.cii-title {
  font-size: 1.2rem;
}

.detail-page #cii-simulator-grid2 .dx-header-row {
  height: 35px;
}

.cii-predict-indicator {
  height: 100%;
  max-height: calc(100% - 24px - 30px);
}

.cii-sub-title {
  font-size: 0.9rem;
}
</style>
