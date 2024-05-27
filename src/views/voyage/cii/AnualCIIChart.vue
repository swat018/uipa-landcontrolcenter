<template>
  <!-- <v-sheet class="bg-card cardContainer h-100" min-height="230"> -->

  <EChart :option="option" :style="option.style" autoresize class="cii-chart"></EChart>
  <!-- </v-sheet> -->
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { useCiiStore } from '@/stores/ciiStore'

import {
  getCiiListByImoNumber,
  getAnnualCiiData,
  getMonthlyCiiData,
  getPastCiiData,
  updateCiiFutureData
} from '@/api/cii.js'

import {
  convertNumberFormat,
  convertFloatFormatObject,
  convertDateTimeType,
  convertStringToFloat
} from '@/composables/util'

import EChart from '@/components/echart/Echarts.vue'

const shipStore = useShipStore()
const { selectedShip } = storeToRefs(shipStore)

const ciiStore = useCiiStore()
// const { monthlyCiiData } = storeToRefs(ciiStore)

onMounted(() => {
  fetchMonthlyCiiData()
})

const year = ref('2024')
let series = ref([])
const test2 = ref([])
const monthlyCiiData = ref([])

let option = ref({
  grid: {
    bottom: 30,
    right: 5,
    left: 20
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    // data: ['HFO', 'MDO', 'MGO', 'LFO', 'LPG', 'LNG', 'Required CII', 'Attained CII'],
    top: 15
  },
  xAxis: {
    type: 'category',
    data: ['', 'Jau', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#54565F'
      }
    },
    max: 0
  },
  series: [
    {
      name: 'Attained CII',
      data: 0,
      type: 'bar',
      smooth: true
    },
    {
      name: 'Attained CII Line',
      color: '#FD8100',
      data: 0,
      type: 'line',
      smooth: true
    },
    {
      symbolSize: 0,
      name: 'Required CII',
      data: [],
      type: 'line',
      color: '#42D2A7',
      markArea: {
        emphasis: {
          disabled: true
        },
        data: [
          [
            {
              name: 'A',
              nameLocation: 'middle',
              label: {
                position: 'insideLeft',
                fontSize: '25px',
                color: '#fff'
              },
              yAxis: 0,
              itemStyle: {
                color: '#ADB2B81A'
                // opacity: 0.3,
              }
            },
            {
              yAxis: 0
            }
          ],
          [
            {
              name: 'B',
              nameLocation: 'vertical',
              label: {
                position: 'insideLeft',
                fontSize: '25px',
                color: '#fff'
              },
              yAxis: 0,
              itemStyle: {
                color: '#42D2A71A'
                // opacity: 0.3,
              }
            },
            {
              yAxis: 0
            }
          ],
          [
            {
              name: 'C',
              label: {
                position: 'insideLeft',
                fontSize: '25px',
                color: '#fff'
              },
              yAxis: 0,
              itemStyle: {
                color: '#FD81001A'
                //  opacity: 0.3,
              }
            },
            { yAxis: 0 }
          ],
          [
            {
              name: 'D',
              label: {
                position: 'insideLeft',
                fontSize: '25px',
                color: '#fff'
              },
              yAxis: 0,
              itemStyle: {
                color: '#FEBD191A'
                //  opacity: 0.3,
              }
            },
            { yAxis: 0 }
          ],
          [
            {
              name: 'E',
              label: {
                position: 'insideLeft',
                fontSize: '25px',
                color: '#fff'
              },
              yAxis: 0,
              itemStyle: {
                color: '#5789FE1A'
                // /opacity: 0.3,
              }
            },
            { yAxis: 0 }
          ]
        ]
      }
    }
  ]
})

const fetchMonthlyCiiData = async () => {
  const {
    data: { data }
  } = await getMonthlyCiiData(selectedShip.value, year.value)

  if (data) {
    monthlyCiiData.value = convertFloatFormatObject(data)
    console.log('Monthly Api 데이터 변환 후')
    console.dir(monthlyCiiData)
  } else {
    monthlyCiiData.value = convertFloatFormatObject(monthlyCiiData.value)
  }
  let test = []

  // await ciiStore.fetchMonthlyCiiData(selectedShip.value, year.value)

  console.log('월별 데이터')
  console.dir(monthlyCiiData)

  option.value.yAxis.max = monthlyCiiData.value.ciiGradeRangeE.second

  option.value.yAxis.max = monthlyCiiData.value.ciiGradeRangeE.second
  let attainedCII = [...monthlyCiiData.value.attainedCiiList]
  let requiredCII = new Array(12).fill(monthlyCiiData.value.requiredCii)

  attainedCII.unshift('-')
  requiredCII.unshift('-')

  console.log('달성량')
  console.dir(attainedCII)
  option.value.series[0].data = attainedCII
  option.value.series[1].data = attainedCII
  option.value.series[2].data = requiredCII
  option.value.series[2].markArea.data[0][1].yAxis = monthlyCiiData.value.ciiGradeRangeA.second
  option.value.series[2].markArea.data[1][0].yAxis = monthlyCiiData.value.ciiGradeRangeB.first
  option.value.series[2].markArea.data[1][1].yAxis = monthlyCiiData.value.ciiGradeRangeB.second
  option.value.series[2].markArea.data[2][0].yAxis = monthlyCiiData.value.ciiGradeRangeC.first
  option.value.series[2].markArea.data[2][1].yAxis = monthlyCiiData.value.ciiGradeRangeC.second
  option.value.series[2].markArea.data[3][0].yAxis = monthlyCiiData.value.ciiGradeRangeD.first
  option.value.series[2].markArea.data[3][1].yAxis = monthlyCiiData.value.ciiGradeRangeD.second
  option.value.series[2].markArea.data[4][0].yAxis = monthlyCiiData.value.ciiGradeRangeE.first
  option.value.series[2].markArea.data[4][1].yAxis = monthlyCiiData.value.ciiGradeRangeE.second
}

function findFuelIndex(name) {
  for (let i = 0; i < test2.value.length; i++) {
    if (test2.value[i].name === name) {
      return i
    }
  }
  return -1 // MGO not found in the chart
}

watch(selectedShip, fetchMonthlyCiiData)
// watch(monthlyCiiData, setChartOption, {deep : true})
</script>
<style></style>
