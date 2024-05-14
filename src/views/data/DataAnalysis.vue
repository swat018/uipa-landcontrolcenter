<template>
  <v-sheet class="tabs-content-test">
    <v-sheet class="px-6 py-6  my-6 rounded-lg" color="#333334">
      <div class="d-flex justify-space-between align-center">
        <!-- <div class="align-center">Equipment</div> -->
        <div class="d-flex ga-2">
          <input class="noticeList-datePicker" type="date" v-model="startDate" />
          <input class="noticeList-datePicker" type="date" v-model="endDate" />

          <v-autocomplete v-model="equipments[0]" :items="equipments" variant="solo-filled" density="compact"
            class="equipmentSelector" bg-color="#434348" :hide-details="true" placeholder="장비를 선택해주세요"></v-autocomplete>
        </div>
      </div>
    </v-sheet>

    <!-- <div class="chart-analysis-container d-flex flex-wrap">
      <div class="chart-item">
        <Echart :option="option"></Echart>
      </div>
      <div class="chart-item">
        <Echart :option="option"></Echart>
      </div>
      <div class="chart-item">
        <Echart :option="option"></Echart>
      </div>
      <div class="chart-item">
        <Echart :option="option"></Echart>
      </div>
    </div> -->
    <!-- Grid -->
    <!-- <div class="chart-analysis-container">
      <div class="chart-grid">
        <div class="chart-item">
          <Echart :option="option"></Echart>
        </div>
        <div class="chart-item">
          <Echart :option="option"></Echart>
        </div>
        <div class="chart-item">
          <Echart :option="option"></Echart>
        </div>
        <div class="chart-item">
          <Echart :option="option"></Echart>
        </div>
      </div>
    </div> -->

    <!-- <v-sheet class="mt-6 pa-3 rounded-lg test" color="#333334">
      <v-row class="h-100">
        <v-col cols="6" lg="6">
          <Echart :option="option" class="test2"></Echart>
        </v-col>
        <v-col cols="6" lg="6">
          <Echart :option="speedPowerOption" class="test2"></Echart>
        </v-col>


        <v-col cols="6" lg="6">
          <Echart :option="fuelPowerOption" class="test2"></Echart>
        </v-col>
        <v-col cols="6">
          <Echart :option="powerPropellerOption" class="test2"></Echart>
        </v-col>
      </v-row>
    </v-sheet> -->
    <v-container class="performance-chart-container" fluid>
      <v-row dense class="h-100">
        <v-col cols="6" class="col">
          <v-sheet class="h-100 rounded-lg" color="#333334">
            <Echart :option="option"></Echart>
          </v-sheet>
        </v-col>
        <v-col cols="6" class="col"> <v-sheet class="h-100 rounded-lg" color="#333334">
            <Echart :option="speedPowerOption"></Echart>
          </v-sheet></v-col>
        <v-col cols="6" class="col">
          <v-sheet class="h-100" color="#333334">
            <Echart :option=" fuelPowerOption"></Echart>
          </v-sheet>
        </v-col>
        <v-col cols="6" class="col"> <v-sheet class="h-100" color="#333334">
            <Echart :option=" powerPropellerOption"></Echart>
          </v-sheet></v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { setLineBar, LineChart, chartOption } from '@/components/echart/basic/linebar.js'
import Echart from '@/components/echart/Echarts.vue'

import analysisData from '@/assets/mockup/analysis.json'

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);




const selected = ref([])
const selectedTags = []
const lineChart = ref(null)
const tags = ref([])

const startDate = ref(null)
const endDate = ref(null)

const equipments = ref(['ME1', 'ME2', 'GE1'])

// 정적 팩토리 기법 사용해보기
const lineChartClass = new LineChart()

const option = ref({
  title: {
    text: 'Engine Fuel Consumption',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
    , top: '2%'

  },
  grid: {
    bottom: '20%',
    top: '15%'
  },

  xAxis: {
    name: 'Speed (knots)',
    nameLocation: 'center',
    nameGap: 30,
    nameTextStyle: {
      color: "#fff",
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    },
  },
  yAxis: {
    name: 'Fuel Consumption (kg/h)',
    nameLocation: 'middle',
    nameGap: 30,
    nameTextStyle: {
      color: "#fff",
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    },


  },
  series: [
    {
      symbolSize: 10,
      data: [
        [1.05, 1.33],
        [1.05, 3.33],
        [2, 1.33],
        [2, 3.33],
        [2.02, 4.47],
        [3.03, 4.23],
        [3, 3.33],
        [4.05, 4.96],
        [4.05, 3.96],
        [4.05, 2.96],
        [5.02, 5.68],
        [5.02, 4.8],
        [5.02, 6.2],
        [5.02, 4.2],
        [5.02, 5.2],
        [6.03, 5.24],
        [6.03, 6.24],
        [6.03, 7.24],
        [7.08, 5.82],
        [7.08, 4.82],
        [7.08, 6.82],
        [8.07, 6.95],
        [8.07, 5.5],
        [9.05, 8.81],
        [9.15, 7.2],
        [9.15, 5.2],
        [10.0, 8.04],
        [10.0, 6.33],
        [11.0, 8.33],
        [11.5, 7.2],
        [12.0, 6.26],
        [12.0, 8.84],
        [12.5, 6.82],
        [12.2, 7.83],
        [13.4, 6.81],
        [13.0, 7.58],
        [14.0, 8.96],
        [14.0, 8.96],
        [14.0, 7.66],
      ],
      type: 'scatter'
    },
    {
      symbolSize: 5,
      data: [
        [0, 0.5],
        [1, 2],
        [4, 4.5],
        [6, 5.5],
        [8, 6.5],
        [10, 7.5],
        [12, 8.5],
        [15, 10],],
      type: 'line'
    }
  ]
})

const speedPowerOption = ref({
  title: {
    text: 'Speed - Power Curve',
    left: 'center',
    textStyle: {
      color: '#fff'
    },top: '2%'

  },
  grid: {
    bottom: '20%',
    top: '15%'
  },
  xAxis: {
    name: 'Speed (knot)',
    nameLocation: 'center',
    nameGap: 30,
    nameTextStyle: {
      color: "#fff",
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    },
  },
  yAxis: {
    name: 'Power (kW)',
    nameLocation: 'middle',
    nameGap: 40,
    nameTextStyle: {
      color: "#fff",
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    },

  },
  series: [
    {
      symbolSize: 0,
      data: [
        [0, 50],
        [10, 50],
        [40, 80],
        [60, 150],
        [70, 200],
        [100, 300],
      ],
      type: 'line',
      smooth: true
    },
    {
      symbolSize: 0,
      data: [
        [0, 80],
        [10, 150],
        [20, 200],
        [40, 250],
        [60, 300],
        [100, 350],
      ],
      type: 'line',
      smooth: true
    },
    {
      symbolSize: 0,
      data: [
        [0, 60],
        [10, 100],
        [40, 150],
        [60, 200],
        [80, 300],
        [100, 400],
      ],
      type: 'line',
      smooth: true
    }
  ]
})


const fuelPowerOption = ref({
  title: {
    text: 'Fuel Consumption - Power Curve',
    left: 'center',
    textStyle: {
      color: '#fff'
    }, top: '2%'

  },
  grid: {
    bottom: '20%',
    top: '15%'
  },
  xAxis: {
    name: 'Power (kW)',
    nameLocation: 'center',
    nameGap: 40,
    nameTextStyle: {
      color: "#fff",
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    },
  },
  yAxis: {
    name: 'Fuel Consumption (kg/h)',
    nameLocation: 'center',
    nameGap: 40,
    nameTextStyle: {
      color: "#fff",
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    },
  },
  series: [
    {
      symbol: 'triangle',
      symbolSize: 10,
      data: [
        [0, 50],
        [10, 50],
        [40, 80],
        [60, 150],
        [70, 200],
        [100, 300],
      ],
      type: 'line',
      smooth: true
    },
    {
      symbol: 'circle',
      symbolSize: 8,
      data: [
        [0, 70],
        [10, 30],
        [40, 22],
        [50, 20],
        [70, 20],
        [80, 20],
        [90, 20],
        [100, 20],
      ],
      type: 'line',
      smooth: true
    },
    {
      symbol: 'rect',
      symbolSize: 8,
      data: [
        [0, 60],
        [10, 100],
        [40, 200],
        [60, 290],
        [70, 330],
        [100, 400],
      ],
      type: 'line',
      smooth: true
    }
  ]
})

const powerPropellerOption = ref({
  title: {
    text: 'Power - Propeller RPM Curve',
    left: 'center',
    textStyle: {
      color: '#fff'
    },
    top: '2%'

  },
  grid: {
    bottom: '20%',
    top: '15%'
  },
  xAxis: {
    name: 'Propeller Speed (rpm)',
    nameLocation: 'center',
    nameGap: 30,
    nameTextStyle: {
      color: "#fff",
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    },
  },
  yAxis: {
    name: 'Power (kW)',
    nameLocation: 'middle',
    nameGap: 40,
    nameTextStyle: {
      color: "#fff",
      fontSize: '12px'
    },
    splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    },
  },
  series: [
    {
      symbolSize: 0,
      data: [
        [0, 0],
        [20, 80],
        [40, 150],
        [60, 250],
        [80, 340],
        [100, 400],
      ],
      type: 'line',
      smooth: true
    },
    {
      symbolSize: 0,
      data: [
        [0, 0],
        [20, 20],
        [40, 50],
        [60, 100],
        [80, 150],
        [100, 250],
      ],
      type: 'line',
      smooth: true
    },
    {
      symbolSize: 0,
      data: [
        [0, 0],
        [20, 30],
        [40, 80],
        [60, 150],
        [80, 280],
        [100, 400],
      ],
      type: 'line',
      smooth: true
    }
  ]
})


onMounted(() => {
})

</script>

<style lang="scss" scoped>
.v-window.analysis-tab-container.d-flex.flex-column .v-window__container {
  /* background : red; */
  flex: 1 1 auto;
}

.analysis-chart-container {
  height: calc(100% - 45px);
}

/* Flex */
/* .chart-analysis-container{
  flex : 1 1 0;
  gap : 16px;
  background : orange;
} */

/* 
.chart-item {
  background: #222224;
  flex: 1 1 40%;
}
*/
/* height : 100%; */



/* Grid */
.chart-analysis-container {
  /* flex: 1 1 0; */

  /* background : yellow; */
}

.chart-grid {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  background: orange;
}

.chart-item {
  background: #222224;
}


.analysis-tab-container .v-window-item {
  height: 100%;
}

.card-bg {
  background: #434348;
}

.v-row.analysis-chart-container {
  >div {
    height: calc(100% / 2);
  }
}

.test {
  height: 100vh;
  max-height: calc(100vh - 65px - 24px - 24px - 44px - 24px - 24px)
}

.test2 {
  height: 100vh;
  max-height: calc((100vh - 65px - 24px - 24px - 44px - 24px - 24px) / 2)
}

.tabs-content-test {
  height: 100vh;
  max-height: calc(100vh - 65px - 24px - 62px - 24px - 24px);
}

.performance-chart-container {
  height: 100vh;
  max-height: calc(100% - 92px - 24px);
  // background: blue;
}

.col {
  height: calc(100% / 2);
}

// .col{
//   background : red;
//       height: 100vh;
//     max-height: calc((99vh - 65px - 24px - 62px - 24px - 24px - 40px - 24px - 24px - 24px - 24px) / 2);
// }</style>