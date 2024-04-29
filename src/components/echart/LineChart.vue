<template>
  <!-- <v-card class="bg-card cardContainer h-100" min-height="230"> -->
    <!-- <v-col> -->
    <Echart class="chart-container" :option="option"></Echart>
    <!-- </v-col> -->
  <!-- </v-card> -->
</template>

<script setup>
import { ref } from 'vue'
import Echart from '@/components/echart/Echarts.vue'

const props = defineProps({
  series : {
    type : Object
  }
})

const option = ref({
  // style: 'height : 200px; width :100%',
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: props.series['name']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    splitLine: {
      show: true,
      lineStyle: {
        color: '#54565F'
      }
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#54565F'
      }
    }
  },
  series: props.series
})
</script>

<style></style>
