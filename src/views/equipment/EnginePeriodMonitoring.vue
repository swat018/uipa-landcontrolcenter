<template>
  <v-sheet class="tabs-content-container w-100">
    <v-sheet class="px-6 py-6  my-6 rounded-lg" color="#333334">
      <div class="d-flex justify-space-between align-center">
        <!-- <div class="align-center">Equipment</div> -->
        <div class="d-flex ga-2">
          <input class="noticeList-datePicker" type="date" v-model="startDate" />
          <input class="noticeList-datePicker" type="date" v-model="endDate" />
        </div>
      </div>
    </v-sheet>

    <!-- L.O TEMP / Press -->

    <v-row no-gutters style="height: 100vh; max-height: calc(100% - 48px);">
      <v-col cols="6" class="col pb-3 pr-3 h-50">
        <v-sheet class="h-100" color="red rounded-lg">
          <EChart :option="heatmapOption"></Echart>
        </v-sheet>
      </v-col>
      <v-col cols="6" class="col pb-3 pl-3  h-50">
        <v-sheet class="h-100" color="red rounded-lg">
          <EChart :option="stackBarOption">

          </Echart>
        </v-sheet></v-col>
      <v-col cols="6" class="col pt-3 pr-3  h-50">
        <v-sheet class="h-100" color="red rounded-lg">
          <EChart :option="stackLineSeries"></Echart>
        </v-sheet>
      </v-col>
      <v-col cols="6" class="col pt-3 pl-3  h-50"> <v-sheet class="h-100" color="red rounded-lg">
          <EChart :option="barOptions"></Echart>
        </v-sheet></v-col>
    </v-row>

  </v-sheet>
</template>

<script setup>
import { ref, computed } from 'vue'
import EChart from '@/components/echart/Echarts.vue'

const startDate = ref(null)
const endDate = ref(null)

const hours = [
  '12a', '1a', '2a', '3a', '4a', '5a', '6a',
  '7a', '8a', '9a', '10a', '11a',
  '12p', '1p', '2p', '3p', '4p', '5p',
  '6p', '7p', '8p', '9p', '10p', '11p'
];
// prettier-ignore
const days = [
  'Saturday', 'Friday', 'Thursday',
  'Wednesday', 'Tuesday', 'Monday', 'Sunday'
];
// prettier-ignore
const data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]]
  .map(function (item) {
    return [item[1], item[0], item[2] || '-'];
  });

const heatmapOption = ref({
  tooltip: {
    position: 'top'
  },
  grid: {
    height: '50%',
    top: '10%'
  },
  xAxis: {
    type: 'category',
    data: hours,
    splitArea: {
      show: true
    }
  },
  yAxis: {
    type: 'category',
    data: days,
    splitArea: {
      show: true
    }
  },
  visualMap: {
    min: 0,
    max: 10,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '15%'
  },
  series: [
    {
      name: 'Punch Card',
      type: 'heatmap',
      data: data,
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

var stackBarSeries = [
  {
    data: [120, 200, 150, 80, 70, 110, 130],
    type: 'bar',
    stack: 'a',
    name: 'a'
  },
  {
    data: [10, 46, 64, '-', 0, '-', 0],
    type: 'bar',
    stack: 'a',
    name: 'b'
  },
  {
    data: [30, '-', 0, 20, 10, '-', 0],
    type: 'bar',
    stack: 'a',
    name: 'c'
  },
  {
    data: [30, '-', 0, 20, 10, '-', 0],
    type: 'bar',
    stack: 'b',
    name: 'd'
  },
  {
    data: [10, 20, 150, 0, '-', 50, 10],
    type: 'bar',
    stack: 'b',
    name: 'e'
  }
];

const stackBarOption = ref({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: stackBarSeries
})

const stackInfo = {};
for (let i = 0; i < stackBarSeries[0].data.length; ++i) {
  for (let j = 0; j < stackBarSeries.length; ++j) {
    const stackName = stackBarSeries[j].stack;
    if (!stackName) {
      continue;
    }
    if (!stackInfo[stackName]) {
      stackInfo[stackName] = {
        stackStart: [],
        stackEnd: []
      };
    }
    const info = stackInfo[stackName];
    const data = stackBarSeries[j].data[i];
    if (data && data !== '-') {
      if (info.stackStart[i] == null) {
        info.stackStart[i] = j;
      }
      info.stackEnd[i] = j;
    }
  }
}
for (let i = 0; i < stackBarSeries.length; ++i) {
  const data = stackBarSeries[i].data;
  const info = stackInfo[stackBarSeries[i].stack];
  for (let j = 0; j < stackBarSeries[i].data.length; ++j) {
    // const isStart = info.stackStart[j] === i;
    const isEnd = info.stackEnd[j] === i;
    const topBorder = isEnd ? 20 : 0;
    const bottomBorder = 0;
    data[j] = {
      value: data[j],
      itemStyle: {
        borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder]
      }
    };
  }
}

const stackLineSeries = ref({
  title: {
    text: 'Stacked Line'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
})



const rawData = [
  [100, 302, 301, 334, 390, 330, 320],
  [320, 132, 101, 134, 90, 230, 210],
  [220, 182, 191, 234, 290, 330, 310],
  [150, 212, 201, 154, 190, 330, 410],
  [820, 832, 901, 934, 1290, 1330, 1320]
];
const totalData = [];
for (let i = 0; i < rawData[0].length; ++i) {
  let sum = 0;
  for (let j = 0; j < rawData.length; ++j) {
    sum += rawData[j][i];
  }
  totalData.push(sum);
}
const grid = {
  left: 100,
  right: 100,
  top: 50,
  bottom: 50
};
const barSeries = [
  'Direct',
  'Mail Ad',
  'Affiliate Ad',
  'Video Ad',
  'Search Engine'
].map((name, sid) => {
  return {
    name,
    type: 'bar',
    stack: 'total',
    barWidth: '60%',
    label: {
      show: true,
      formatter: (params) => Math.round(params.value * 1000) / 10 + '%'
    },
    data: rawData[sid].map((d, did) =>
      totalData[did] <= 0 ? 0 : d / totalData[did]
    )
  };
});

const barOptions = ref({
  legend: {
    selectedMode: false
  },
  grid,
  yAxis: {
    type: 'value'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  barSeries
})

const rpmOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '5%',
    top: '15%',
    right: '30%',
    bottom: '10%'
  },

  legend: {
    orient: 'vertical',
    top: 45,
    // type: 'scroll',
    right: 48,
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
    data: ['GE1 RPM', 'GE2 RPM', 'GE3 RPM', 'GE4 RPM']
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
  series: [
    {
      name: 'GE1 RPM',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [50, 55, 53, 52, 50, 52, 53, 50, 55, 53, 52, 50, 52, 53, 55]
    },
    {
      name: 'GE2 RPM',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [40, 45, 40, 50, 45, 40, 35, 40, 45, 40, 45, 40, 45, 38, 40]
    },
    {
      name: 'GE3 RPM',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [60, 55, 65, 60, 65, 60, 55, 60, 65, 55, 60, 65, 60, 65, 60]
    },
    {
      name: 'GE4 RPM',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [25, 35, 40, 35, 25, 30, 25, 30, 35, 20, 35, 30, 35, 40, 35]
    },
  ]
})
const powerOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '5%',
    top: '15%',
    right: '35%',
    bottom: '10%'
  },

  legend: {
    orient: 'vertical',
    top: 45,
    // type: 'scroll',
    right: 60,
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
    data: ['GE1 POWER', 'GE2 POWER', 'GE3 POWER', 'GE4 POWER',
      'GE1 OUTPUT',
      'GE2 OUTPUT',
      'GE3 OUTPUT',
      'GE4 OUTPUT']
  },
  title: {
    text: "POWER & OUTPUT",
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
  series: [
    {
      name: 'GE1 POWER',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [20, 25, 30, 35, 40, 45, 50, 50, 55, 60, 65, 70, 75, 80, 85]
    },
    {
      name: 'GE2 POWER',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [40, 55, 60, 65, 55, 55, 60, 65, 60, 60, 60, 60, 60, 65, 60]
    },
    {
      name: 'GE3 POWER',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [45, 50, 45, 50, 45, 50, 45, 50, 45, 50, 45, 50, 45, 50, 45]
    },
    {
      name: 'GE4 POWER',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
    },
    {
      name: 'GE1 OUTPUT',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [100, 155, 160, 165, 155, 155, 160, 165, 160, 160, 160, 160, 160, 165, 160]
    },
    {
      name: 'GE2 OUTPUT',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [140, 155, 160, 165, 155, 155, 150, 145, 150, 145, 150, 150, 155, 165, 160]
    },
    {
      name: 'GE3 OUTPUT',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [135, 140, 135, 150, 145, 150, 145, 150, 145, 145, 140, 140, 135, 140, 135]
    },
    {
      name: 'GE4 OUTPUT',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [120, 125, 130, 130, 135, 140, 130, 135, 125, 120, 130, 110, 115, 130, 125]
    },
  ]
})
const foOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '5%',
    top: '15%',
    right: '30%',
    bottom: '10%'
  },

  legend: {
    orient: 'vertical',
    top: 45,
    // type: 'scroll',
    // left: 'left',
    right: 20,

    // padding: 1,
    // height: 1,
    itemGap: 6,
    // // right: 5,
    // textStyle: {
    //   fontSize: 5,
    //   lineHeight: 1,
    //   height: 1
    // },
    data: ['GE1 L.O Temp', 'GE2 L.O Temp', 'GE3 L.O Temp', 'GE4 L.O Temp',
      'GE1 L.O Press',
      'GE2 L.O Press',
      'GE3 L.O Press',
      'GE4 L.O Press']
  },
  title: {
    text: "L.O Temp & Press",
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
    },
  },
  series: [
    {
      name: 'GE1 L.O Temp',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [50, 55, 53, 52, 50, 52, 53, 50, 55, 53, 52, 50, 52, 53, 55]
    },
    {
      name: 'GE2 L.O Temp',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [40, 55, 60, 65, 55, 50, 45, 50, 55, 48, 50, 38, 50, 53, 55]
    },
    {
      name: 'GE3 L.O Temp',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [45, 50, 48, 60, 55, 55, 48, 30, 45, 48, 50, 50, 51, 52, 38]
    },
    {
      name: 'GE4 L.O Temp',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [35, 40, 80, 50, 45, 48, 50, 48, 38, 20, 45, 50, 60, 70, 60]
    },
    {
      name: 'GE1 L.O Press',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [3, 4.5, 2.5, 3, 3.5, 4.8, 5, 3.2, 4.5, 2, 1, 2.8, 3, 3.5, 0.5]
    },
    {
      name: 'GE2 L.O Press',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [1, 2.5, 3, 4, 4.5, 4.2, 3.3, 2.7, 2.3, 2, 1.5, 2.0, 5.5, 2.8, 2]
    },
    {
      name: 'GE3 L.O Press',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [3, 4.5, 2.5, 3, 3.5, 4.8, 5, 3.2, 4.5, 2, 1, 2.8, 3, 3.5, 0.5]
    },
    {
      name: 'GE4 L.O Press',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [3, 4.5, 2.5, 3, 3.5, 4.8, 5, 3.2, 4.5, 2, 1, 2.8, 3, 3.5, 0.5]
    },
  ]
})

const scavOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '5%',
    top: '15%',
    right: '35%',
    bottom: '10%'
  },

  legend: {
    orient: 'vertical',
    top: 45,
    // type: 'scroll',
    // left: 'left',
    right: 20,

    // padding: 1,
    // height: 1,
    itemGap: 6,
    // // right: 5,
    // textStyle: {
    //   fontSize: 5,
    //   lineHeight: 1,
    //   height: 1
    // },
    data: ['GE1 Scav Air Temp', 'GE2 Scav Air Temp', 'GE3 Scav Air Temp', 'GE4 Scav Air Temp',
      'GE1 Scav Air Press',
      'GE2 Scav Air Press',
      'GE3 Scav Air Press',
      'GE4 Scav Air Press']
  },
  title: {
    text: "Scav Air Temp & Press",
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
  series: [
    {
      name: 'GE1 Scav Air Temp',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [50, 55, 53, 52, 50, 52, 53, 50, 55, 53, 52, 50, 52, 53, 55]
    },
    {
      name: 'GE2 Scav Air Temp',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [40, 55, 60, 65, 55, 50, 45, 50, 55, 48, 50, 38, 50, 53, 55]
    },
    {
      name: 'GE3 Scav Air Temp',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [45, 50, 48, 60, 55, 55, 48, 30, 45, 48, 50, 50, 51, 52, 38]
    },
    {
      name: 'GE4 Scav Air Temp',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [35, 40, 80, 50, 45, 48, 50, 48, 38, 20, 45, 50, 60, 70, 60]
    },
    {
      name: 'GE1 Scav Air Press',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [3, 4.5, 2.5, 3, 3.5, 4.8, 5, 3.2, 4.5, 2, 1, 2.8, 3, 3.5, 0.5]
    },
    {
      name: 'GE2 Scav Air Press',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [1, 2.5, 3, 4, 4.5, 4.2, 3.3, 2.7, 2.3, 2, 1.5, 2.0, 5.5, 2.8, 2]
    },
    {
      name: 'GE3 Scav Air Press',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [3, 4.5, 2.5, 3, 3.5, 4.8, 5, 3.2, 4.5, 2, 1, 2.8, 3, 3.5, 0.5]
    },
    {
      name: 'GE4 Scav Air Press',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [3, 4.5, 2.5, 3, 3.5, 4.8, 5, 3.2, 4.5, 2, 1, 2.8, 3, 3.5, 0.5]
    },
  ]
})

const loadOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '5%',
    top: '15%',
    right: '30%',
    bottom: '10%'
  },

  legend: {
    orient: 'vertical',
    top: 45,
    // type: 'scroll',
    right: 48,
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
    data: ['GE1 LOAD', 'GE2 LOAD', 'GE3 LOAD', 'GE4 LOAD']
  },
  title: {
    text: "LOAD",
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
  series: [
    {
      name: 'GE1 LOAD',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [70, 65, 60, 55, 50, 45, 40, 35, 35, 30, 30, 29, 28, 28, 28]
    },
    {
      name: 'GE2 LOAD',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [40, 55, 60, 65, 55, 50, 45, 45, 45, 45, 50, 45, 50, 53, 55]
    },
    {
      name: 'GE3 LOAD',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [20, 30, 20, 30, 20, 30, 20, 30, 20, 30, 20, 30, 20, 30, 20]
    },
    {
      name: 'GE4 LOAD',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [35, 40, 45, 50, 50, 50, 55, 60, 65, 65, 70, 75, 75, 75, 80]
    },
  ]
})


const tcRpmOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '5%',
    top: '15%',
    right: '30%',
    bottom: '10%'
  },

  legend: {
    orient: 'vertical',
    top: 45,
    // type: 'scroll',
    right: 48,
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
    data: ['TC1 RPM', 'TC2 RPM']
  },
  title: {
    text: "TC RPM",
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
  series: [
    {
      name: 'TC1 RPM',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [50, 55, 53, 52, 50, 52, 53, 50, 55, 53, 52, 50, 52, 53, 55]
    },
    {
      name: 'TC2 RPM',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [40, 55, 60, 65, 55, 50, 45, 50, 55, 48, 50, 38, 50, 53, 55]
    },
  ]
})

const tcInletTempOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '5%',
    top: '15%',
    right: '30%',
    bottom: '10%'
  },

  legend: {
    orient: 'vertical',
    top: 45,
    // type: 'scroll',
    right: 20,
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
    data: ['TC1 Inlet Temp', 'TC2 Inlet Temp']
  },
  title: {
    text: "TC Inlet Temp",
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
  series: [
    {
      name: 'TC1 Inlet Temp',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [50, 55, 53, 52, 50, 52, 53, 50, 55, 53, 52, 50, 52, 53, 55]
    },
    {
      name: 'TC2 Inlet Temp',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [40, 55, 60, 65, 55, 50, 45, 50, 55, 48, 50, 38, 50, 53, 55]
    },
  ]
})

const cylinderOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '5%',
    top: '15%',
    right: '35%',
    bottom: '10%'
  },

  legend: {
    orient: 'vertical',
    top: 45,
    // type: 'scroll',
    right: 60,
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
    data: ['GE1 Cylinder', 'GE2 Cylinder', 'GE3 Cylinder', 'GE4 Cylinder']
  },
  title: {
    text: "Cylinder",
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
  series: [
    {
      name: 'GE1 Cylinder',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [50, 55, 53, 52, 50, 52, 53, 50, 55, 53, 52, 50, 52, 53, 55]
    },
    {
      name: 'GE2 Cylinder',
      type: 'line',
      smooth: true,
      center: ['50%', '60%'],
      data: [40, 55, 60, 65, 55, 50, 45, 50, 55, 48, 50, 38, 50, 53, 55]
    },
    {
      name: 'GE3 Cylinder',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [45, 50, 48, 60, 55, 55, 48, 30, 45, 48, 50, 50, 51, 52, 38]
    },
    {
      name: 'GE4 Cylinder',
      type: 'line',
      smooth: true,
      // center: ['50%', '60%'],
      data: [35, 40, 80, 50, 45, 48, 50, 48, 38, 20, 45, 50, 60, 70, 60]
    },
  ]
})
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

.performance-chart-container {
  height: 100vh;
  max-height: calc(100% - 92px - 24px);
  // background: blue;
}

.tabs-content-test {
  height: 100vh;
  max-height: calc(100vh - 65px - 24px - 62px - 24px - 24px);
}
</style>