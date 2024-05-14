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

import EChart from '@/components/echart/Echarts.vue'

const shipStore = useShipStore()
const { selectedShip } = storeToRefs(shipStore);

const ciiStore = useCiiStore()
const { monthlyCiiData } = storeToRefs(ciiStore);

onMounted(() => {
  fetchMonthlyCiiData()
})

const year = ref('2024')
let series = ref([])
const test2 = ref([])


const hfo = ref(null)
let option = ref({
  grid: {
    bottom: 30,
    right: 20,
    left: 30
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
    data: ['Jau', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#54565F'
      }
    },
    max: monthlyCiiData.value.ciiGradeRangeE.second
  },
  series:  test2.value
})



const fetchMonthlyCiiData = async () => {
  let test = []

  await ciiStore.fetchMonthlyCiiData(selectedShip.value, year.value);

  option.value.yAxis.max = monthlyCiiData.value.ciiGradeRangeE.second 
  const indexOfAttainedCii = findFuelIndex('Attained CII');
  if (indexOfAttainedCii == -1) {
    test2.value.push({
      name: 'Attained CII',
      data: monthlyCiiData.value.attainedCiiList,
      type: 'bar',
      smooth: true
    })
  } else {
    test2.value[indexOfAttainedCii].data = monthlyCiiData.value.focLngList
  }

  const indexOfAttainedCiiLine = findFuelIndex('Attained CII Line');
  if (indexOfAttainedCiiLine == -1) {
    test2.value.push({
      name: 'Attained CII Line',
      color: '#FD8100',
      data: monthlyCiiData.value.attainedCiiList,
      type: 'line',
      smooth: true
    })
  } else {
    test2.value[indexOfAttainedCiiLine].data = monthlyCiiData.value.focLngList
  }

  const indexOfRequiredCii = findFuelIndex('Required CII');
  if (indexOfRequiredCii == -1) {
    test2.value.push({
      symbolSize: 0,
      name: 'Required CII',
      data: new Array(12).fill(monthlyCiiData.value.requiredCii),
      type: 'line',
      color: '#42D2A7',
      markArea : {
        emphasis: {
          disabled: true
        },
        data :[
          [{
            name: 'A',
            nameLocation: 'middle',
            label: {
              position: ['5%', '45%'],
              fontSize: '25px',
              color: '#fff'
            },
            yAxis: 0,
            itemStyle: {
              color: '#ADB2B81A',
              // opacity: 0.3,
            },
          },
          { 
            yAxis: monthlyCiiData.value.ciiGradeRangeA.second
          }],
          [
            {
              name: 'B',
              nameLocation: 'vertical',
              label: {
                position: ['5%', '50%'],
                fontSize: '25px',
                color: '#fff'
              },
              yAxis: monthlyCiiData.value.ciiGradeRangeB.first,
              itemStyle: {
                color: '#42D2A71A',
                // opacity: 0.3,
              },
            },
            {
              yAxis: monthlyCiiData.value.ciiGradeRangeB.second,
            },
          ],
          [
            {
              name: 'C',
              label: {
                position: ['5%', '45%'],
                fontSize: '25px',
                color: '#fff'
              },
              yAxis: monthlyCiiData.value.ciiGradeRangeC.first,
              itemStyle: {
                color: '#FD81001A',
              //  opacity: 0.3,
              },
            },
            { yAxis: monthlyCiiData.value.ciiGradeRangeC.second },
          ],
          [
            {
              name: 'D',
              label: {
                position: ['5%', '45%'],
                fontSize: '25px',
                color: '#fff'
              },
              yAxis: monthlyCiiData.value.ciiGradeRangeD.first,
              itemStyle: {
                color: '#FEBD191A',
                //  opacity: 0.3,
              },
            },
            { yAxis: monthlyCiiData.value.ciiGradeRangeD.second },
          ],
          [
            {
              name: 'E',
              label: {
                position: ['5%', '45%'],
                fontSize: '25px',
                color: '#fff'
              },
              yAxis: monthlyCiiData.value.ciiGradeRangeE.first,
              itemStyle: {
                color: '#5789FE1A',
                // /opacity: 0.3,
              },
            },
            { yAxis: monthlyCiiData.value.ciiGradeRangeE.second },
          ]
        ]
      }
    })
  } else {
    test2.value[indexOfRequiredCii] = {
      name: 'Required CII',
      symbolSize: 0,
      data: new Array(12).fill(monthlyCiiData.value.requiredCii) ,
      type: 'line',
      markArea: {
        emphasis: {
          disabled: true
        },
        data: [
          [{
            name: 'A',
            
            nameLocation: 'middle',
            label: {
              position: ['5%', '45%'],
              fontSize: '25px',
              color: '#fff'
            },
            yAxis: 0,
            itemStyle: {
              color: '#ADB2B81A',
              // opacity: 0.3,
            },
          },
          {
            yAxis: monthlyCiiData.value.ciiGradeRangeA.second
          }],
          [
            {
              name: 'B',
              label: {
                position: ['5%', '45%'],
                fontSize: '25px',
                color: '#fff'
              },
              nameLocation: 'vertical',
              yAxis: monthlyCiiData.value.ciiGradeRangeB.first,
              itemStyle: {
                color: '#42D2A71A',
                // opacity: 0.3,
              },
            },
            {
              yAxis: monthlyCiiData.value.ciiGradeRangeB.second,
            },
          ],
          [
            {
              name: 'C',
              label: {
                position: ['5%', '45%'],
                fontSize: '25px',
                color: '#fff'
              },
              yAxis: monthlyCiiData.value.ciiGradeRangeC.first,
              itemStyle: {
                color: '#FD81001A',
                //  opacity: 0.3,
              },
            },
            { yAxis: monthlyCiiData.value.ciiGradeRangeC.second },
          ],
          [
            {
              name: 'D',
              label: {
                position: ['5%', '45%'],
                fontSize: '25px',
                color: '#fff'
              },
              yAxis: monthlyCiiData.value.ciiGradeRangeD.first,
              itemStyle: {
                color: '#FEBD191A',
                //  opacity: 0.3,
              },
            },
            { yAxis: monthlyCiiData.value.ciiGradeRangeD.second },
          ],
          [
            {
              name: 'E',
              label: {
                position: ['5%', '45%'],
                fontSize: '25px',
                color: '#fff'
              },
              yAxis: monthlyCiiData.value.ciiGradeRangeE.first,
              itemStyle: {
                color: '#5789FE1A',
                // /opacity: 0.3,
              },
            },
            { yAxis: monthlyCiiData.value.ciiGradeRangeE.second },
          ]
        ]
      }
    }
  }
}



function findFuelIndex(name) {
  for (let i = 0; i < test2.value.length; i++) {
    if (test2.value[i].name === name) {
      return i;
    }
  }
  return -1; // MGO not found in the chart
}

watch(selectedShip, fetchMonthlyCiiData);
// watch(monthlyCiiData, setChartOption, {deep : true})

</script>
<style>
.chart2-container {
  height: 50%;
}
</style>
