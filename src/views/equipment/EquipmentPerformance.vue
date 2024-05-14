<template>
  <v-sheet class="performance-container rounded-lg ma-4 pa-4">
    <div class="title">Main Engine Performance</div>
    <v-row no-gutters class="engine-data-item performance-chart">
      <v-col cols="4" class="pa-0">
        <EChart :option="loadSpeedrOption">

        </EChart>
      </v-col>
      <v-col cols="4" class="pa-0">
        <EChart :option="loadPressOption"></EChart>
      </v-col>

      <v-col cols="4" class="pa-0">
        <EChart :option="loadTcOption"></EChart>
      </v-col>

      <v-col cols="4" class="pa-0">
        <EChart :option="loadTcSpeedrOption"></EChart>
      </v-col>
      <v-col cols="4" class="pa-0">
        <EChart :option="loadScavOption" autoresize />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue'
import ShipFilter from '@/components/ShipFilter.vue'

import EChart from '@/components/echart/Echarts.vue'

const loadSpeedrOption = ref({
  title: {
    text: 'Load - Speed',
    top : '2%',
    left: 'cebter',
    textStyle: {
      color: '#fff'
    }

  },
  xAxis: { interval: 25,
    splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    }, },
  yAxis: {
    splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    },
  },
  legend: {
    data: ['Load-Speed'],
    right : '10%',
    bottom : '5%'
  },
  series: [
    {
      name: 'Load-Speed',
      symbolSize: 10,
      data: [
        [0,40],
        [5, 35],
        [5, 40],
        [5, 45],
        [10, 45],
        [10, 40],
        [15, 40],
        [15, 45],
        [15, 35],
        [15, 50],
        [15, 48],
        [20, 40],
        [20, 45],
        [20, 50],
        [20, 52],
        [20, 55],
        [25, 60],
        [25, 58],
        [25, 55],
        [25, 50],
        [30, 70],
        [30, 54],
        [30, 55],
        [30, 57],
        [30, 58],
        [35, 60],
        [35, 65],
        [35, 62],
        [35, 63],
        [35, 55],
        [35, 60],
        [35, 70],
        [40, 75],
        [40, 60],
        [40, 65],
        [45, 80],
        [45, 65],
        [45, 70], [45, 73],
        [45, 75],
        [48, 75],
        [48, 70],
        [48, 65],
        [48, 70],
        [50, 70],
        [50, 60],
        [50, 65],
        [50, 73],
        [50, 71],
        [50, 60],
        [50, 65],
        [50, 58],
        [55, 50],
        [55, 70],

        [55, 57],
        [55, 60],
        [55, 65],
        [55, 70],
        [55, 60], [60, 70],
        [60, 75],
        [60, 50],
        [60, 70],
        [60, 54],
        [60, 55],
        [60, 66],
        [65, 55],
        [65, 65],
        [65, 57],
        [65, 70],
        [65, 75],
        [65, 50],
        [65, 70],
        [65, 54],
        [65, 55],
        [65, 66],
        [65, 55],
        [65, 65],
        [65, 57],
        [65, 70],
        [65, 58],
        [65, 85],
        [65, 65],
        [70, 65],
        [70, 57],
        [70, 70],
        [70, 58],
        [70, 85],
        [70, 65],
        [75, 88],
        [75, 75],
        [75, 87],
        [75, 80],
        [75, 70],
        [75, 65],
        
        [70, 75],
        [70, 82],
        [75, 80],
        [75, 83],
        [75.0, 85],
        [80, 88],
        [80, 75],
        [80, 87],
        [80, 80],
        [80, 70],
        [80, 65],

        [85, 70],
        [85, 85],
        [85, 79],
        [85, 77],
        [85, 75],
        [85, 65],
        [90, 85],
        [90, 90],
      ],
      type: 'scatter'
    }
  ]
})

const loadPressOption = ref({
  title: {
    text: 'Load - Press',
    top: '2%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  legend: {
    data: ['Load-Pmax', 'Load-Pcomp'],
    right: '10%',
    bottom: '5%'
  },
  xAxis: { interval: 25,
    splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    }, },
  yAxis: {
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
      name: 'Load-Pmax',
      symbolSize: 10,
      data: [
        [25, 80],
        [30, 85],
        [35, 80],
        [35, 85],
        [40, 90],
        [40, 95],
        [40, 65],
        [45, 75],
        [48, 85],
        [45, 80],
        [45, 75],
        [48, 75],
        [48, 70],
        [48, 65],
        [48, 70],
        [50, 80],
        [55, 85],
        [60, 80],
        [60, 85],
        [50, 71],
        [50, 60],
        [50, 65],
        [55, 85],
        [60, 70],
        [65, 65], [60, 70],
        [65, 80],
        [70, 85],
        [70, 82],
        [75, 80],
        [75, 90],
        [75, 82],
        [80, 95],
        [85, 90],
        [85, 85],
        [90, 87],
      ],
      type: 'scatter'
    },
    {
      name: 'Load-Pcomp',
      symbolSize: 10,
      data: [
        [25, 60],
        [28, 70],
        [30, 65],
        [35, 60],
        [35, 55],
        [38, 65],
        [40, 58],
        [45, 70],
        [45, 60],
        [60, 65
        ],
        [70, 70],
        [65, 55],
        [65, 65],
        [65, 65],
        [55, 65],
        [60, 65],
        [65, 55],
        [68, 73],
        [60, 71],
        [50, 60],
        [55, 65],
        [55, 58],
        [60, 70],
        [55, 60], [60, 70],
        [65, 75],
        [70, 75],
        [70, 70],
        [75, 65],
        [75, 68],
        [75.0, 65],
        [75, 75],
        [80, 75],
        [85, 70],
        [90, 75],
        [95, 80],
        [100,]
      ],
      type: 'scatter'
    }
  ]
})

const loadTcOption = ref({
  title: {
    text: 'Load - T/C',
    top: '2%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }

  },
  legend: {
    data: ['Load-T/C Inlet Gas', 'Load-T/C Outlet Gas'],
    right: '10%',
    bottom: '5%'
  },
  xAxis: {
    interval: 25, splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    }, },
  yAxis: {
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
      name: 'Load-T/C Inlet Gas',
      symbolSize: 10,
      data: [
        [25, 480],
        [30, 485],
        [35, 490],
        [35, 495],
        [35, 510],
        [35, 450],
        [40, 465],
        [40, 475],
        [40, 495],
        [45, 510],
        [45, 450],
        [45, 500],
        [50, 460],
        [50, 510],
        [50, 430],
        [55, 485],
        [55, 495],
        [55, 515],
        [55, 520],
        [60, 525],
        [65, 518],
        [65, 525],
        [65, 510],
        [70, 515],
        [70, 485],
        [75, 505],
        [75, 475],
        [75, 510],
        [75, 510],
        [80, 510],

      ],
      type: 'scatter'
    },
    {
      name: 'Load-T/C Outlet Gas',
      symbolSize: 10,
      data: [
        [25, 380],
        [30, 385],
        [35, 390],
        [35, 395],
        [35, 410],
        [35, 350],
        [40, 365],
        [40, 375],
        [40, 395],
        [45, 410],
        [45, 350],
        [45, 400],
        [50, 360],
        [50, 410],
        [50, 330],
        [55, 285],
        [55, 295],
        [55, 315],
        [55, 320],
        [60, 325],
        [65, 318],
        [65, 325],
        [65, 310],
        [70, 315],
        [70, 285],
        [75, 305],
        [75, 315],
        [75, 270],
        [75, 280],
        [80, 290],
        [100,]

      ],
      type: 'scatter'
    }
  ]
})

const loadTcSpeedrOption = ref({
  title: {
    text: 'Load - T/C Speed',
    top: '2%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }

  },
  xAxis: {
    interval: 25, splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    }, },
  yAxis: {
    splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    },
},
  legend: {
    data: ['Load-T/CSpeed'],
    right: '10%',
    bottom: '5%'
  },
  series: [
    {
      name: 'Load-T/CSpeed',
      symbolSize: 10,
      data: [
        [25, 25],
        [30, 30],
        [35, 35],
        [35, 40],
        [35, 45],
        [35, 45],
        [40, 45],
        [40, 50],
        [40, 55],
        [45, 60],
        [45, 65],
        [48, 60],
        [48, 70],
        [48, 60
        ],
        [48, 60],
        [50, 55],
        [50, 60],
        [50, 70],
        [55, 75],
        [55, 58],
        [55, 75],
        [55, 60],
        [60, 70],
        [60, 75],
        [60, 80],
        [65, 75],
        [70, 75],
        [70, 82],
        [75, 80],
        [75, 83],
        [75.0, 85],
        [80, 88],
        [80, 75],
        [80, 87],
        [80, 80],
        [100,]
      ],
      type: 'scatter'
    }
  ]
})

const loadScavOption = ref({
  title: {
    text: 'Load - Scav Air Pressure',
    top: '2%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }

  },
  xAxis: {
    interval: 25, splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    }, },
  yAxis: {
    splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    },
},
  legend: {
    data: ['Load-Scav Air Pressure'],
    right: '10%',
    bottom: '5%'
  },
  series: [
    {
      name: 'Load-Scav Air Pressure',
      symbolSize: 10,
      data: [
        [10, 14],
        [10, 16],
        [10, 18],
        [10, 25],
        [10, 30],
        [10, 35],
        [15, 25],
        [15, 31],
        [15, 35],
        [35, 40],
        [35, 45],
        [35, 45],
        [40, 45],
        [35, 40],
        [35, 45],
        [35, 45],

        [40, 45],
        [40, 50],
        [40, 55],
        [45, 60],
        [30, 30],
        [35, 35],
        [35, 40],
        [35, 45],
        [35, 45],
        [40, 45],
        [40, 50],
        [40, 55],
        [45, 60],
        [45, 55],
        [48, 60],
        [48, 60],
        [25, 25],
        [30, 30],
        [35, 35],
        [35, 40],
        [35, 45],
        [35, 45],
        [40, 45],
        [40, 50],
        [40, 55],
        [45, 60],
        [45, 55],
        [48, 60],
        [48, 60],
        [48, 60
        ],
        [48, 60],
        [50, 65],
        [50, 65],
        [50, 70],
        [55, 65],
        [55, 70],
        [55, 68],
        [55, 65],
        [60, 70],
        [60, 75],
        [60, 75],
        [65, 75],
        [70, 75],
        [70, 82],
        [75, 80],
        [75, 83],
        [75.0, 85],
        [80, 88],
        [80, 90],
        [80, 95],
        [80, 80],
        [100,]
      ],
      type: 'scatter'
    }
  ]
})
</script>

<style scoped  lang="scss">
.performance-container{
  height: calc(100vh - 65px - 32px);

  min-height: 600px;
  overflow: auto;
  // gap : 16px;
}

.performance-chart{
  height: calc(100% - 25px);
}

.performance-container .chart-item {
  flex : 1 1 30%;
  background: yellow;
}

.engine-data-item {
  > div {
    /* flex: 0 1 33.3%; */
    height: calc(100% / 2);
  }
}

</style>
