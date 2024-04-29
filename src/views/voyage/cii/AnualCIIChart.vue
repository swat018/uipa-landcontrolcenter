<template>
  <!-- <v-sheet class="bg-card cardContainer h-100" min-height="230"> -->

  <EChart :option="option" :style="option.style" autoresize class="chart2-container"></EChart>
  <!-- </v-sheet> -->
</template>
<script setup>
import { ref } from 'vue'
import EChart from '@/components/echart/Echarts.vue'

const option = ref({
  grid : {
    bottom : 30,
    right : 20,
    left : 30
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['HFO', 'LFO', 'Diesel', 'Total'],
    top : 15
  },
  xAxis: {
    type: 'category',
    data: ['Jau', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Now','Dec']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'HFO',
      data: [190, 300, 200, 400, 200, 200, 200,190,300, 200, 400, 200 ],
      type: 'line',
      smooth: true
    },
    {
      name: 'LFO',
      data: [550, 250, 50, 200, 100, 250, 300,550,250, 50, 200, 100],
      type: 'line',
      smooth: true
    },
    {
      name: 'Diesel',
      data: [360, 150, 350, 100, 150, 250, 350, 360, 150, 350, 100, 150],
      type: 'line',
      smooth: true
    },
    {
      name: 'LPG',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      type: 'line',
      smooth: true
    },
    {
      name: 'LNG',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
      type: 'line',
      smooth: true
    },
    {
      name: 'Fuel Total',
      data: [1000, 800, 600, 700, 450, 650, 850, 1000, 800, 600, 700, 450],
      type: 'bar'
    },
    {
      name: 'Foc Total',
      data: [1000, 800, 600, 700, 450, 650, 850, 1000, 800, 600, 700, 450],
      type: 'bar'
    },
  ]
});
</script>
<style>
.chart2-container{
  height: 50%;
}
</style>
