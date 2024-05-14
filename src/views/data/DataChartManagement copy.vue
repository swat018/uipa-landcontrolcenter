<template>
  <v-sheet class="h-100 py-6">
    <v-sheet class="px-6 py-6 rounded-lg" color="#333334">
      <div class="d-flex justify-space-between align-center">
        <!-- <div class="align-center">Equipment</div> -->
        <div class="d-flex ga-2">
          <input class="noticeList-datePicker" type="date" v-model="startDate" />
          <input class="noticeList-datePicker" type="date" v-model="endDate" />
          <i-selectbox v-model="equipments[0]" :items="equipments" item-title="name" item-value="id"
            variant="solo-filled" density="compact" return-object class="equipmentSelector" bg-color="#434348"
            :hide-details="true"></i-selectbox>

          <i-selectbox v-model="dataTypes[0]" :items="dataTypes" variant="solo-filled" density="compact" return-object
            class="equipmentSelector" bg-color="#434348" placeholder="SensorType을 선택해주세요"
            :hide-details="true"></i-selectbox>
          <!-- <i-btn @click="periodData()" text="조회"></i-btn> -->
        </div>
      </div>
    </v-sheet>

    <div class="d-flex ga-3 mr-2 my-4">
      <div class="d-flex ga-2">
        <input class="noticeList-datePicker" type="date" v-model="startDate" />
        <input class="noticeList-datePicker" type="date" v-model="endDate" />
        <v-autocomplete v-model="equipments[0]" :items="equipments" variant="solo-filled" density="compact"
          class="equipmentSelector" bg-color="#434348" :hide-details="true" placeholder="장비를 선택해주세요"></v-autocomplete>

        <i-selectbox v-model="dataTypes[0]" :items="dataTypes" variant="solo-filled" density="compact"
          class="equipmentSelector" bg-color="#434348" placeholder="SensorType을 선택해주세요"
          :hide-details="true"></i-selectbox>
        <!-- <i-btn @click="periodData()" text="조회"></i-btn> -->
      </div>
    </div>
    <div class="d-flex">
      <div class="equiment-chart-container">
        <Echart :option="option"></Echart>
      </div>
      <div class="equiment-select-container">
        <DxDataGrid id="equimentGrid" ref="equimentGrid" :data-source="alertHistoryDetail" key-expr="id"
          :selected-row-keys="selectedRowKeys">
          <DxSelection mode="multiple" show-check-boxes-mode="always"></DxSelection>
          <DxScrolling mode="virtual" />
          <!-- row-rendering-mode="virtual" -->
          <DxColumn data-field="equipmentNo" caption="Equip No" alignment="center" :allow-editing="false" width="15%" />
          <DxColumn data-field="tagId" catpion="Tag ID" alignment="center" :allow-editing="false" width="15%" />
          <DxColumn data-field="description" catpion="Dscription" alignment="left" :allow-editing="false" />

        </DxDataGrid>
      </div>
    </div>
    <div>
      <!-- <div>
        <i-input id="searchBox" v-model="searchShip" prepend-inner-icon="mdi-magnify" single-line hide-details
          @input="searchByShip" placeholder="Search Description"></i-input>
      </div>
      <div>
        <v-row class="d-flex align-center">
          <v-col>
            <EChart ref="lineChart" :option="option2" :style="option2.style"></EChart>
          </v-col>
          <v-col>
            <v-table>
              <thead class="table-header">
                <tr>
                  <th class="text-center"></th>
                  <th class="text-center">Equip</th>
                  <th class="text-center">Tag</th>
                  <th class="text-center">Description</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="tag in tags" :key="tag.tagNo">
                  <td class="text-center">
                    <v-checkbox @change="selectTag($event)" :label="tag.tagName" :value="tag.tagNo"
                      v-model="selected"></v-checkbox>
                  </td>
                  <td class="text-center">{{ tag.tagName }}</td>
                  <td class="text-center">{{ tag.tagNo }}</td>
                  <td class="text-center">{{ tag.description }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </div> -->
    </div>

  </v-sheet>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { setLineBar, LineChart, chartOption } from '@/components/echart/basic/linebar.js'

import Echart from '@/components/echart/Echarts.vue'
import alertHistoryDetail from '@/assets/mockup/alertHistoryDetail.json'

const selected = ref()
const selectedTags = []
const lineChart = ref(null)
const tags = ref([])


const selectedRowKeys = ref([1,5,7])
const equipments = ref(['ME1', 'ME2', 'GE1'])
const dataTypes = ref(['Value', 'Boolean'])
// 정적 팩토리 기법 사용해보기
const lineChartClass = new LineChart()

const startDate = ref(null)
const endDate = ref(null)

const option = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  toolbox: {
    show: true,
    top : '0%',
    right : '2%',
    feature: {
      dataZoom: {
        show : true,
        title : {
          zoom: 'Zoom',
          back : 'Restore'
        },
        yAxisIndex: 'none',
        iconStyle: {
          borderColor: "#fff",  // Default icon border color
          emphasis: {
            borderColor: "#5789FE"  // Icon border color when activated
          }
        }
      },
    }
  },
  grid: {
      top : '10%',
      left: '1%',
      right: '3%',
      bottom: '0%',
      containLabel: true
    },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    // prettier-ignore
    data: ['04/27 00:00', '04/27 00:15', '04/27 00:30', '04/27 00:45', '04/27 01:00', '04/27 01:15', '04/27 01:30', '04/27 01:45', '04/27 02:00', '04/27 02:15', '04/27 02:30', '04/27 02:45', '04/27 03:00', '04/27 03:15', '04/27 03:30', '04/27 03:45', '04/27 04:00', '04/27 04:15', '04/27 04:30', '04/27 04:45']
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}'
    },
    boundaryGap : [0, '30%'],
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
      name: 'ME1 RPM',
      type: 'line',
      smooth: true,
      // prettier-ignore
      data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
    },
    {
      name: 'ME1 L.O Inet Temp',
      type: 'line',
      smooth: true,
      // prettier-ignore
      data: [350, 330, 230, 210, 300, 350, 480, 280, 330, 450, 230, 350, 200, 400, 300, 450, 380, 480, 500, 450],
    }, 
    {
      name: 'ME1 Exh. gas Temp',
      type: 'line',
      smooth: true,
      // prettier-ignore
      data: [300, 280, 300, 320, 300, 320, 310, 330, 350, 310, 300, 280, 350, 180, 200, 400, 200, 300, 280, 200],
    }

  ]
})

// const option = ref({
//   style: 'width : 80%; height : 300px',
//   title: {
//     text: 'Tag Line'
//   },
//   tooltip: {
//     trigger: 'axis'
//   },
//   legend: {
//     // data : [],
//   },
//   grid: {
//     left: '3%',
//     right: '4%',
//     bottom: '3%',
//     containLabel: true
//   },
//   xAxis: {
//     type: 'category',
//     data: []
//   },
//   yAxis: {
//     type: 'value'
//   },
//   series: []
// })

// const option2 = ref({
//   style: 'width : 95%; height : 55vh',
//   title: {
//     text: 'Tag Line'
//   },
//   tooltip: {
//     trigger: 'axis'
//   },
//   legend: {
//     // data : [],
//   },
//   grid: {
//     left: '3%',
//     right: '4%',
//     bottom: '3%',
//     containLabel: true
//   },
//   xAxis: {
//     type: 'category',
//     data: []
//   },
//   yAxis: {
//     type: 'value'
//   },
//   series: []
// })

// const mainEngineSeries = {
//   name: 'M/E',
//   type: 'line',
//   data: [50, 30, 40, 50, 60, 70, 80]
// }

// const mainEngineSeries2 = {
//   name: 'M/E2',
//   type: 'line',
//   data: [25, 20, 30, 45, 65, 35, 40]
// }

// const vdrSeries = {
//   name: 'VDR1',
//   type: 'line',
//   data: [10, 5, 25, 30, 55, 45, 15]
// }

// const equipmentSeries = {
//   'M/E': mainEngineSeries,
//   VDR1: vdrSeries,
//   'M/E2': mainEngineSeries2
// }

// onMounted(() => {
// })

// const getTagList = async () => {
//   // await store.getTagList()
//   // tags.value = store.tagList
// }

// const selectTag = (event) => {
//   // 체크 여부
//   let isChecked = event.srcElement.checked
//   // 장비명
//   let name = event.srcElement.labels[0].innerText
//   // 장비 태그아이디
//   let tagId = event.srcElement.value

//   console.log(`선택 목록 ${JSON.stringify(selected.value)}`)

//   if (selected.value.length != 0) {
//     const requestData = {
//       rangeStart: '-30m',
//       rangeStop: '',
//       timeSortOption: 'DESC',
//       fieldKeyList: selected.value
//     }

//     const result = setChartOption(requestData)
//   } else {
//     option2.value = option
//   }
// }

// const setChartOption = async (param) => {
//   // const result = await equipmentStore.getGELoadData(param)
//   let result = ''
//   const tagId = param.fieldKeyList[0]

//   const date = result['fieldMap'][`${tagId}`]['key']

//   const keys = Object.keys(result['fieldMap'])
//   const seriesList = []

//   for (let i = 0; i < keys.length; i++) {
//     let obj = {}
//     let key = keys[i]
//     obj['type'] = 'line'
//     obj['name'] = key
//     obj['data'] = result['fieldMap'][key]['value']

//     console.log('시리즈' + JSON.stringify(result['fieldMap'][key]))

//     seriesList.push(obj)
//   }

//   const options = setLineBar(keys, date, seriesList)

//   option2.value = options

//   console.log(JSON.stringify(option2.value))
// }
</script>

<style>
.equiment-chart-container {
  flex: 2 2 0;
}

.equiment-select-container {
  flex: 1 1 0;
}
</style>