<template>
  <!-- <v-sheet> -->
  <v-container fluid style="height : 100vh; max-height : calc(100vh - 65px - 48px - 62px - 40px )">
    <v-sheet class="px-6 py-6  mb-6 rounded-lg" color="#333334">
      <i-selectbox v-model="equipmentName" :items="equipments" item-title="name" item-value="id" variant="solo-filled"
        density="compact" return-object class="equipmentSelector" bg-color="#434348" :hide-details="true"></i-selectbox>
    </v-sheet>

    <v-row no-gutters class="mt-4 engine-data-item" style="height : 100vh; max-height : calc(100% / 2)">
      <v-col cols="6" class="px-1 h-100">
        <v-row class="h-100">
          <v-col cols="3" class="h-100">
            <v-sheet height="100%" class="rounded-lg d-flex flex-column justify-center align-center" color="#333334">

              <div class="rh-title">Engine Running Hour</div>
              <div class="rh-value">25550 <span>h</span></div>

              <div class="rh-title">Engine Power</div>
              <div class="rh-value">1080 <span>kw</span></div>
            </v-sheet>
          </v-col>
          <v-col cols="3" class="h-100">
            <EChart :option="powerBarOption" autoresize />
          </v-col>
          <v-col cols="6" class="h-100">
            <EChart :option="rpmGuageChartOption" autoresize />
          </v-col>
        </v-row>
      </v-col>
      <!-- L.O TEMP / Press -->

      <v-col cols="6" class="px-1 py-2 chart-bg h-100">
        <v-row class="h-100">
          <v-col class="h-100">
            <v-sheet class="d-flex flex-column h-100 justify-center rounded-lg ga-4" color="#333334">
              <div class="d-flex flex-wrap justify-space-between">
                <div>Scav.Air Press</div>
                <div>0.4 <span>bar</span></div>
              </div>
              <div class="d-flex justify-space-between">
                <div>Scav.Air Temp</div>
                <div>0.4 <span>℃</span></div>
              </div>
              <div class="d-flex justify-space-between">
                <div>L.O Inlet Press</div>
                <div>0.4 <span>bar</span></div>
              </div>
              <div class="d-flex justify-space-between">
                <div>L.O Inlet Temp</div>
                <div>0.4 <span>℃</span></div>
              </div>
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet class="d-flex flex-column h-100 justify-center rounded-lg ga-4" color="#333334">
              <div class="d-flex flex-column justify-space-between align-center">
                <div>Scav.Air Press</div>
                <div>0.4 <span>bar</span></div>
              </div>
              <div class="d-flex flex-column justify-space-between align-center">
                <div>Scav.Air Temp</div>
                <div>0.4 <span>℃</span></div>
              </div>
              <div class="d-flex flex-column justify-space-between align-center">
                <div>L.O Inlet Press</div>
                <div>0.4 <span>bar</span></div>
              </div>
              <div class="d-flex flex-column justify-space-between align-center">
                <div>L.O Inlet Temp</div>
                <div>0.4 <span>℃</span></div>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row style="height : 100vh; max-height : calc(100% / 2)">
      <v-col cols="4" class="px-1 py-2 chart-bg">
        <EChart :option="tcChartOption" autoresize />
      </v-col>
      <v-col cols="8" class="px-1 py-2 chart-bg">
        <EChart :option="rpmOption" autoresize />
      </v-col>

      <!-- <v-col v-for="i in 8" :key="i" cols="4" class="pa-0">
      <EChart :option="rpmOption" autoresize />
    </v-col> -->

      <!-- <div class="engine-data-item d-flex">
      <div class="running-hour-container d-flex flex-wrap w-100">
        <div class="runing-hour-item">
          <div class="rh-title">ME1 Running Hours</div>
          <div class="rh-value">25550</div>
        </div>
        <div class="runing-hour-item">
          <div class="rh-title">ME2 Running Hours</div>
          <div class="rh-value">25550</div>
        </div>
        <div class="runing-hour-item">
          <div class="rh-title">ME3 Running Hours</div>
          <div class="rh-value">25550</div>
        </div>
        <div class="runing-hour-item">
          <div class="rh-title">ME4 Running Hours</div>
          <div class="rh-value">25550</div>
        </div>
      </div>
    </div>
    <div class="engine-data-item">
      <EChart :option="rpmOption" autoresize />
    </div>
    <div class="engine-data-item">
      <EChart :option="rpmOption" autoresize />
    </div>
    <div class="engine-data-item">
      <EChart :option="rpmOption" autoresize />
    </div>
    <div class="engine-data-item">
      <EChart :option="rpmOption" autoresize />
    </div>
    <div class="engine-data-item">
      <EChart :option="rpmOption" autoresize />
    </div>
    <div class="engine-data-item">
      <EChart :option="rpmOption" autoresize />
    </div>
    <div class="engine-data-item">
      <EChart :option="rpmOption" autoresize />
    </div>
    <div class="engine-data-item">
      <EChart :option="rpmOption" autoresize />
    </div> -->

      <!-- display : grid -->
      <!-- <div class="container w-100">
      <div class="d-flex flex-wrap h-3">
        <div class="item d-flex flex-column justify-center">
          <div>ME2 Running Hours</div>
          <div>1550 h</div>
        </div>
        <div class="item d-flex flex-column justify-center">
          <div>ME2 Running Hours</div>
          <div>1550 h</div>
        </div>
        <div class="item d-flex flex-column justify-center">
          <div>ME2 Running Hours</div>
          <div>1550 h</div>
        </div>
        <div class="item d-flex flex-column justify-center">
          <div>ME2 Running Hours</div>
          <div>1550 h</div>
        </div>
      </div>
      <div class="h-3">
        <EChart :option="rpmOption" autoresize />

      </div>
      <div class="h-3">
        <EChart :option="rpmOption" autoresize />
      </div>
      <div class="h-3">
        <EChart :option="rpmOption" autoresize />
      </div>
      <div class="h-3">
        <EChart :option="rpmOption" autoresize />
      </div>
      <div class="h-3">
        <EChart :option="rpmOption" autoresize />
      </div>
      <div class="h-3">
        <EChart :option="rpmOption" autoresize />
      </div>
      <div class="h-3">
        <EChart :option="rpmOption" autoresize />
      </div>
      <div class="h-3">
        <EChart :option="rpmOption" autoresize />
      </div>
    </div> -->


      <!-- v-row v-col row 1개 -->
      <!-- <v-container class="fill-height" fluid>
      <v-row class="fill-height">
        <v-col cols="4" class="d-flex flex-wrap ga-4">
          <div class="rh-item d-flex flex-column justify-center align-center ">
            <div class="rh-title">ME1 Running Hours</div>
            <div class="rh-value">30</div>
          </div>
          <div class="rh-item d-flex flex-column justify-center align-center ">
            <div class="rh-title">ME2 Running Hours</div>
            <div class="rh-value">30</div>
          </div>
          <div class="rh-item d-flex flex-column justify-center align-center ">
            <div class="rh-title">ME3 Running Hours</div>
            <div class="rh-value">30</div>
          </div>
          <div class="rh-item d-flex flex-column justify-center align-center ">
            <div class="rh-title">ME4 Running Hours</div>
            <div class="rh-value">30</div>
          </div>
        </v-col>
        <v-col cols="4">
          <EChart :option="rpmOption" autoresize />
        </v-col>
        <v-col cols="4">
          <EChart :option="rpmOption" autoresize />
        </v-col>


        <v-col cols="4">
          <EChart :option="rpmOption" autoresize />
        </v-col>
        <v-col cols="4">
          <EChart :option="rpmOption" autoresize />
        </v-col>
        <v-col cols="4">
          <EChart :option="rpmOption" autoresize />
        </v-col>

        <v-col cols="4">
          <EChart :option="rpmOption" autoresize />
        </v-col>
        <v-col cols="4">
          <EChart :option="rpmOption" autoresize />
        </v-col>
        <v-col cols="4">
          <EChart :option="rpmOption" autoresize />
        </v-col>
      </v-row>
    </v-container> -->

      <!-- v-row v-col row 여러개 -->
      <!-- <v-container class="h-100" fluid>
      <v-row style="height : calc(100% / 3)">
        <v-col class="test" style="display : grid; grid-template-columns : repeat(2, 1fr); gap : 12px">
          <div class="rh-item d-flex flex-column justify-center align-center ">
            <div class="rh-title">ME1 Running Hours</div>
            <div class="rh-value">30</div>
          </div>
          <div class="rh-item d-flex flex-column justify-center align-center ">
            <div class="rh-title">ME2 Running Hours</div>
            <div class="rh-value">30</div>
          </div>
          <div class="rh-item d-flex flex-column justify-center align-center ">
            <div class="rh-title">ME3 Running Hours</div>
            <div class="rh-value">30</div>
          </div>
          <div class="rh-item d-flex flex-column justify-center align-center ">
            <div class="rh-title">ME4 Running Hours</div>
            <div class="rh-value">30</div>
          </div>
        </v-col>
        <v-col>
          <EChart :option="rpmOption" autoresize />
        </v-col>
        <v-col>
          <EChart :option="rpmOption" autoresize />
        </v-col>
      </v-row>
      <v-row style="height : calc(100% / 3)">
        <v-col>
          <EChart :option="rpmOption" autoresize />
        </v-col>
        <v-col>
          <EChart :option="rpmOption" autoresize />
        </v-col>
        <v-col>
          <EChart :option="rpmOption" autoresize />
        </v-col>
      </v-row>
      <v-row style="height : calc(100% / 3)">
        <v-col>
          <EChart :option="rpmOption" autoresize />
        </v-col>
        <v-col>
          <EChart :option="rpmOption" autoresize />
        </v-col>
        <v-col>
          <EChart :option="rpmOption" autoresize />
        </v-col>
      </v-row>
    </v-container> -->

      <div>

      </div>
    </v-row>
  </v-container>
  <!-- </v-sheet> -->
</template>

<script setup>
import { ref, computed } from 'vue'
import EChart from '@/components/echart/Echarts.vue'

const powerBarOption = ref({
  grid: {
    top: '5%',
    bottom: '5%',
    left: '15%'
  },
  xAxis: {
    type: 'category',
    data: ['RPM']
  },
  yAxis: {
    type: 'value',
    max: 100
  },
  series: [
    {
      data: [50],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }
  ]
})

const rpmOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '5%',
    top: '15%',
    right: '13%',
    bottom: '15%',
    show: false
  },

  legend: {
    orient: 'vertical',
    top: 45,
    // type: 'scroll',
    right: 15,
    // right: 45,

    // padding: 1,
    // height: 1,
    itemGap: 6,
    // // right: 5,
    // textStyle: {
    //   fontSize: 5,
    //   lineHeight: 1,
    //   height: 1
    // },
    data: ['ME1 RPM', 'ME2 RPM', 'ME3 RPM', 'ME4 RPM']
  },
  title: {
    text: "RPM",
    left: 'left',
    // top: 10,
    textStyle: {
      color: '#fff',
      fontSize: '16px'
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:20', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00'],
    // splitLine: {
    //   show: true,
    //   lineStyle: {
    //     color: '#54565F'
    //   }
    // }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        width: 1,
        type: "dashed",
        color: "#5C5C5E",
        opacity: 0.5
      },
    },
    interval: 20,
    max: 80
  },
  series: [
    {
      name: 'ME1 RPM',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [50, 55, 53, 52, 50, 52, 53, 50, 55, 53, 52, 50, 52, 53, 55]
    },
    {
      name: 'ME2 RPM',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [40, 45, 40, 50, 45, 40, 35, 40, 45, 40, 45, 40, 45, 38, 40]
    },
    {
      name: 'ME3 RPM',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [60, 55, 65, 60, 65, 60, 55, 60, 65, 55, 60, 65, 60, 65, 60]
    },
    {
      name: 'ME4 RPM',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [25, 35, 40, 35, 25, 30, 25, 30, 35, 20, 35, 30, 35, 40, 35]
    },
  ]
})

const labelOption = {
  show: true,
  distance: 15,
  verticalAlign: 'middle',
  formatter: '{c}  {name|{a}}',
  fontSize: 16,
  rich: {
    name: {}
  }
};

const tcChartOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['RPM', 'LOAD', 'TEMP', 'PRESS']
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center',
  },
  xAxis: [
    {
      type: 'value'
    }
  ],
  yAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['TC1', 'TC2']
    }

  ],
  series: [
    {
      name: 'RPM',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [320, 332]
    },
    {
      name: 'LOAD',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [220, 182]
    },
    {
      name: 'TEMP',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [150, 232]
    },
    {
      name: 'PRESS',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [98, 77]
    }
  ]
})

const rpmGuageChartOption = ref({
  grid: {
    left: '0%',
    right: '10%',
    bottom: 0
  }, series: [
    {
      type: 'gauge',
      center: ['50%', '60%'],
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 60,
      splitNumber: 12,
      itemStyle: {
        color: '#FFAB91'
      },
      progress: {
        show: true,
        width: 30
      },
      pointer: {
        show: false
      },
      axisLine: {
        lineStyle: {
          width: 30
        }
      },
      axisTick: {
        distance: -45,
        splitNumber: 5,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      splitLine: {
        distance: -52,
        length: 14,
        lineStyle: {
          width: 3,
          color: '#999'
        }
      },
      axisLabel: {
        distance: -20,
        color: '#999',
        fontSize: 16
      },
      anchor: {
        show: false
      },
      title: {
        show: false
      },
      detail: {
        valueAnimation: true,
        width: '60%',
        lineHeight: 40,
        borderRadius: 8,
        offsetCenter: [0, '-15%'],
        fontSize: 50,
        fontWeight: 'bolder',
        formatter: '{value} °C',
        color: 'inherit'
      },
      data: [
        {
          value: 20
        }
      ]
    },
    {
      type: 'gauge',
      center: ['50%', '60%'],
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 60,
      itemStyle: {
        color: '#FD7347'
      },
      progress: {
        show: true,
        width: 8
      },
      pointer: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      detail: {
        show: false
      },
      data: [
        {
          value: 20
        }
      ]
    }
  ]
})

const equipments = [
  {
    id: 1,
    name: 'ME1'
  },
  {
    id: 2,
    name: 'ME2'
  },
  {
    id: 3,
    name: 'GE1'
  },
  {
    id: 4,
    name: 'GE2'
  },
  {
    id: 5,
    name: 'GE3'
  }
]


</script>

<style lang="scss">
.item {
  flex: 1 1 40%;
}

.v-card.item {
  background: #5F5F67
}


.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}


.rh-item {
  background: #333334;
  flex: 1 1 40%;
}

.rh-title {
  font-size: 1.2em;
}

.rh-value {
  font-size: 2.5em;
  font-weight: bold;
}

.engine-data-item {
  >div {
    /* flex: 0 1 33.3%; */
    height: calc(100% / 3);
  }
}

.running-hour-container {
  gap: 16px;
}

.runing-hour-item {
  flex: 1 1 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #333334;
}

.chart-bg {
  // background: #2d2d30;
}
</style>