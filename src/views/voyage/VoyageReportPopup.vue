<template>
  <v-dialog
    model-value="isOpenVoaygeReport"
    width="793"
    height="820"
    class="voyage-report-detail-container"
    :scrim="false"
  >
    <v-card class="page rounded-lg overflow-hidden">
      <slot name="header">
        <div class="d-flex justify-end">
          <!-- 닫기 버튼 -->
          <v-btn
            :color="closeIconColor"
            class="d-flex justify-center text-center"
            variant="plain"
            append-icon="mdi-close"
            @click="$emit('close')"
          >
          </v-btn>
        </div>
        <div class="d-flex justify-end mt-4 pr-4 pb-4">
          <i-btn text="download" class="px-4" width="120" @click="download"></i-btn>
        </div>
      </slot>
      <slot name="text">
        <v-container
          fluid
          class="h-100 management-page detail-page voyage-report-detail overflow-auto"
          id="report"
        >
          <v-row class="ma-0 d-flex align-center report-header">
            <v-col cols="3" class="pl-0">
              <div class="d-flex justify-start">
                <v-img :src="reportLogo" />
              </div>
            </v-col>
            <v-col cols="6">
              <div class="d-flex justify-center" style="font-size: 1.5rem">Voyage Report</div>
            </v-col>
            <v-col cols="3">
              <div class="d-flex flex-column align-end justify-center">
                <div>Issued Date</div>
                <div>2024.03.24</div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-sheet>
                <div class="report-sub-title">Ship Information</div>
                <v-data-table :headers="shipInfoHeaders" :items="shipInformation"></v-data-table>
              </v-sheet>
              <v-sheet class="mt-4">
                <div class="report-sub-title">Voyage Route</div>
                <v-data-table :headers="voyageRouteHeaders" :items="voyageRoute"></v-data-table>
                <div class="voyage-route mt-4">
                  <v-img :src="voyageRouteImg" style="height: 250px" />
                </div>
              </v-sheet>
              <v-sheet class="mt-4">
                <div class="report-sub-title">Performance Summary</div>
                <v-data-table
                  :headers="performanceSummaryHeaders"
                  :items="performanceSummary"
                  item-key="name"
                ></v-data-table>
              </v-sheet>
              <v-sheet class="mt-4">
                <div class="report-sub-title">Engine Performance</div>
                <v-data-table
                  :headers="enginePerformaceHeader"
                  :items="engineSummary"
                ></v-data-table>
                <Echart :option="heatmapOption" class="w-100" style="height: 300px" />
              </v-sheet>
              <v-sheet class="mt-4">
                <div class="report-sub-title">Machinery Status</div>
                <v-data-table :headers="GEMachineryStatus" :items="GEMachineryData">
                  <template v-slot:item.ge1="{ item }">
                    <div :class="getColorByStatus(item.ge1)">●</div>
                  </template>

                  <template v-slot:item.ge2="{ item }">
                    <div :class="getColorByStatus(item.ge2)">●</div>
                  </template>
                </v-data-table>
                <div class="d-flex ga-4 mt-4 border px-4 py-2">
                  <div>※ Legend</div>
                  <div class="d-flex ga-2">
                    <div class="normal">●</div>
                    <div>NORMAL</div>
                  </div>
                  <div class="d-flex ga-2">
                    <div class="caution">●</div>
                    <div>CAUTION</div>
                  </div>
                  <div class="d-flex ga-2">
                    <div class="warning">●</div>
                    <div>WARNING</div>
                  </div>
                  <div class="d-flex ga-2">
                    <div>●</div>
                    <div>NO SIGNAL</div>
                  </div>
                </div>
              </v-sheet>

              <v-sheet class="mt-4">
                <div class="report-sub-title">Emission</div>
                <v-data-table :headers="emissionHeader" :items="emissionList">
                  <template v-slot:item="{ item }">
                    <tr class="text-center">
                      <td>{{ item.key }}</td>
                      <td>{{ item.noxTotal }} t</td>
                      <td>{{ item.coTotal }} t</td>
                      <td>{{ item.ch4Total }} t</td>
                      <td>{{ item.co2Total }} t</td>
                      <td>{{ item.so2Total }} t</td>
                    </tr>
                  </template>
                </v-data-table>
              </v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </slot>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { getDxGridInstance } from '@/composables/dxGridUtil.js'
import { convertDateType, isValidDateRange, addDay } from '@/composables/util.js'
import emitter from '@/composables/eventbus.js'
import { useToast } from '@/composables/useToast'
import { useVoyageStore } from '@/stores/voyageStore'
import { insertVoyage, updateVoyage, updateVoyageInfo } from '@/api/voyage'
import { jsPDF } from 'jspdf'

import VoyageReportDetail from '@/views/voyage/VoyageReportDetail.vue'
import VoyageRegisterForm from '@/views/voyage/form/VoyageRegisterForm.vue'
import VoyageEditForm from '@/views/voyage/form/VoyageEditForm.vue'
import PortInfo from '@/components/voyage/PortInfo.vue'
import AppModal from '@/components/modal/AppModal.vue'
import Echart from '@/components/echart/Echarts.vue'

import voyageRouteImg from '/images/ins/ecdis.png'

import reportLogo from '/images/logo/report-logo.png'
import pdfIcon from '@/assets/images/file-pdf-one.png'

const props = defineProps({
  isOpenVoaygeReport: {
    type: Boolean
  }
})

const voyageReport = ref('all')

const shipInfoHeaders = [
  {
    title: 'Ship Name',
    key: 'shipName'
  },
  {
    title: 'IMO No.',
    key: 'imoNumber'
  },
  {
    title: 'Ship Type',
    key: 'ShipType'
  },
  {
    title: 'Class',
    key: 'class'
  },
  {
    title: 'GRT',
    key: 'grt'
  },
  {
    title: 'DWT',
    key: 'dwt'
  }
]

const voyageRouteHeaders = [
  { title: '', key: 'location' },
  {
    title: 'From',
    key: 'from'
  },
  {
    title: 'To',
    key: 'to'
  }
]

const shipInformation = ref([
  {
    shipName: 'ULSAN TAEWHA',
    imoNumber: '9917505',
    ShipType: 'Passenger Ship',
    class: 'KR',
    grt: 2676,
    dwt: 442
  }
])

const voyageRoute = ref([
  {
    location: 'Location',
    from: "37˚25.095'N (date : 11.01 UTC)",
    to: "126˚30.717'E (date : 11.30 UTC)"
  }
])

const performanceSummaryHeaders = [
  { title: 'Hour (Hours)', key: 'hours' },
  { title: 'Distance (NM)', key: 'distance' },
  { title: 'Avg.Speed (KN)', key: 'avgSpeed' },
  {
    title: 'FOC (M/T)',
    align: 'center',
    children: [
      { title: 'MDO', key: 'mdo' },
      { title: 'MGO', key: 'mgo' },
      { title: 'LNG', key: 'lng' }
    ]
  },
  { title: 'EEOI', key: 'eeoi' }
]

const performanceSummary = ref([
  {
    hours: 5,
    distance: 45,
    avgSpeed: 50,
    mdo: 230.4,
    mgo: 300,
    lng: 500,
    eeoi: 20.76
  }
])

const enginePerformaceHeader = [
  {
    title: 'Equipment',
    key: 'equipment'
  },
  {
    title: 'Running Hour',
    key: 'runningHour'
  },
  {
    title: 'Power (kW)',
    key: 'power'
  },
  {
    title: 'Avg.RPM (rpm)',
    key: 'avgRpm'
  },
  {
    title: 'Avg.Load(%)',
    key: 'avgLoad'
  }
]

const machineryStatus = [
  {
    title: 'Engine Speed',
    key: 'engineSpeed'
  },
  {
    title: 'T/C Speed',
    key: 'tcSpeed'
  },
  {
    title: 'Pmax & Pcomp',
    key: 'pmaxPcomp'
  },
  {
    title: 'Cyl Outlet Exh.Gas Temp',
    key: 'cylOutlet'
  },
  {
    title: 'T/C Inlet Exh. Gas Temp',
    key: 'tcInletExhGasTemp'
  },
  {
    title: 'T/C Outlet Exh. Gas Temp',
    key: 'tcOutlet'
  },
  {
    title: 'Ovarall Status',
    key: 'ovarallStatus'
  }
]

const engineSummary = ref([
  {
    equipment: 5,
    runningHour: 45,
    power: 45,
    avgRpm: 55,
    avgLoad: 50
  }
])

const data = [
  [0, 0, 5],
  [0, 1, 1],
  [0, 2, 0],
  [0, 3, 0],
  [0, 4, 0],
  [0, 5, 0],
  [0, 6, 0],
  [0, 7, 0],
  [0, 8, 0],
  [0, 9, 0],
  [0, 10, 0],
  [0, 11, 2],
  [0, 12, 4],
  [0, 13, 1],
  [0, 14, 1],
  [0, 15, 3],
  [0, 16, 4],
  [0, 17, 6],
  [0, 18, 4],
  [0, 19, 4],
  [0, 20, 3],
  [0, 21, 3],
  [0, 22, 2],
  [0, 23, 5],
  [1, 0, 7],
  [1, 1, 0],
  [1, 2, 0],
  [1, 3, 0],
  [1, 4, 0],
  [1, 5, 0],
  [1, 6, 0],
  [1, 7, 0],
  [1, 8, 0],
  [1, 9, 0],
  [1, 10, 5],
  [1, 11, 2],
  [1, 12, 2],
  [1, 13, 6],
  [1, 14, 9],
  [1, 15, 11],
  [1, 16, 6],
  [1, 17, 7],
  [1, 18, 8],
  [1, 19, 12],
  [1, 20, 5],
  [1, 21, 5],
  [1, 22, 7],
  [1, 23, 2],
  [2, 0, 1],
  [2, 1, 1],
  [2, 2, 0],
  [2, 3, 0],
  [2, 4, 0],
  [2, 5, 0],
  [2, 6, 0],
  [2, 7, 0],
  [2, 8, 0],
  [2, 9, 0],
  [2, 10, 3],
  [2, 11, 2],
  [2, 12, 1],
  [2, 13, 9],
  [2, 14, 8],
  [2, 15, 10],
  [2, 16, 6],
  [2, 17, 5],
  [2, 18, 5],
  [2, 19, 5],
  [2, 20, 7],
  [2, 21, 4],
  [2, 22, 2],
  [2, 23, 4],
  [3, 0, 7],
  [3, 1, 3],
  [3, 2, 0],
  [3, 3, 0],
  [3, 4, 0],
  [3, 5, 0],
  [3, 6, 0],
  [3, 7, 0],
  [3, 8, 1],
  [3, 9, 0],
  [3, 10, 5],
  [3, 11, 4],
  [3, 12, 7],
  [3, 13, 14],
  [3, 14, 13],
  [3, 15, 12],
  [3, 16, 9],
  [3, 17, 5],
  [3, 18, 5],
  [3, 19, 10],
  [3, 20, 6],
  [3, 21, 4],
  [3, 22, 4],
  [3, 23, 1],
  [4, 0, 1],
  [4, 1, 3],
  [4, 2, 0],
  [4, 3, 0],
  [4, 4, 0],
  [4, 5, 1],
  [4, 6, 0],
  [4, 7, 0],
  [4, 8, 0],
  [4, 9, 2],
  [4, 10, 4],
  [4, 11, 4],
  [4, 12, 2],
  [4, 13, 4],
  [4, 14, 4],
  [4, 15, 14],
  [4, 16, 12],
  [4, 17, 1],
  [4, 18, 8],
  [4, 19, 5],
  [4, 20, 3],
  [4, 21, 7],
  [4, 22, 3],
  [4, 23, 0],
  [5, 0, 2],
  [5, 1, 1],
  [5, 2, 0],
  [5, 3, 3],
  [5, 4, 0],
  [5, 5, 0],
  [5, 6, 0],
  [5, 7, 0],
  [5, 8, 2],
  [5, 9, 0],
  [5, 10, 4],
  [5, 11, 1],
  [5, 12, 5],
  [5, 13, 10],
  [5, 14, 5],
  [5, 15, 7],
  [5, 16, 11],
  [5, 17, 6],
  [5, 18, 0],
  [5, 19, 5],
  [5, 20, 3],
  [5, 21, 4],
  [5, 22, 2],
  [5, 23, 0],
  [6, 0, 1],
  [6, 1, 0],
  [6, 2, 0],
  [6, 3, 0],
  [6, 4, 0],
  [6, 5, 0],
  [6, 6, 0],
  [6, 7, 0],
  [6, 8, 0],
  [6, 9, 0],
  [6, 10, 1],
  [6, 11, 0],
  [6, 12, 2],
  [6, 13, 1],
  [6, 14, 3],
  [6, 15, 4],
  [6, 16, 0],
  [6, 17, 0],
  [6, 18, 0],
  [6, 19, 0],
  [6, 20, 1],
  [6, 21, 2],
  [6, 22, 2],
  [6, 23, 6]
].map(function (item) {
  return [item[1], item[0], item[2] || '-']
})

const heatmapOption = ref({
  tooltip: {
    position: 'top'
  },
  grid: {
    top: '10%',
    left: '5%',
    right: '0'
  },
  xAxis: {
    type: 'category',
    data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    interval: 10,
    splitArea: {
      show: true
    }
  },
  yAxis: {
    type: 'category',
    data: [0, 20, 40, 60, 80, 100],
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
    bottom: '0%'
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

let initPage

const printReport = () => {
  var frame = document.getElementById('report')

  frame.focus()
  frame.contentWindow.print()
}

// const beforePrint = () => {
//   initPage = document.body.innerHTML
//   document.body.innerHTML = document.querySelector('.report').innerHTML
// }

// const afterPrint = () => {
//   document.body.innerHTML = initPage
// }

// window.onbeforeprint = beforePrint
// window.onafterprint = afterPrint

const download = () => {
  printReport()
}

const GEMachineryStatus = [
  { title: '', align: 'center', value: 'key' },
  { title: 'G/E 1', align: 'center', value: 'ge1' },
  { title: 'G/E 2', align: 'center', value: 'ge2' }
]

const GEMachineryData = [
  {
    key: 'Engine Speed',
    ge1: 'NORMAL',
    ge2: 'NORMAL'
  },
  {
    key: 'T/C Speed',
    ge1: 'NORMAL',
    ge2: 'NORMAL'
  },
  {
    key: 'Pmax & Pcomp',
    ge1: 'NO SIGNAL',
    ge2: 'NO SIGNAL'
  },
  {
    key: 'Cyl Outlet Exh. Gas Temp',
    ge1: 'NORMAL',
    ge2: 'CAUTION'
  },
  {
    key: 'T/C inlet Exh. Gas Temp',
    ge1: 'NORMAL',
    ge2: 'NORMAL'
  },
  {
    key: 'T/C Outlet Exh. Gas Temp',
    ge1: 'NORMAL',
    ge2: 'WARNING'
  },
  {
    key: 'Ovarall Status',
    ge1: 'NORMAL',
    ge2: 'NORMAL'
  }
]

const emissionHeader = [
  { title: '', align: 'center', value: 'key' },
  { title: 'NOx Total', align: 'center', value: 'noxTotal' },
  { title: 'CO Total', align: 'center', value: 'coTotal' },
  { title: 'CH4 Total', align: 'center', value: 'ch4Total' },
  { title: 'CO2 Total', align: 'center', value: 'co2Total' },
  { title: 'SO2 Total', align: 'center', value: 'so2Total' }
]

const emissionList = [
  {
    key: 'G/E 1',
    noxTotal: 27.3,
    coTotal: 0,
    ch4Total: 0,
    co2Total: 0,
    so2Total: 682
  },
  {
    key: 'G/E 2',
    noxTotal: 27.3,
    coTotal: 0,
    ch4Total: 0,
    co2Total: 0,
    so2Total: 682
  }
]

const getColorByStatus = (status) => {
  let alarmColor = ''
  switch (status) {
    case 'NORMAL':
      alarmColor = 'normal'
      break
    case 'CAUTION':
      alarmColor = 'caution'
      break
    case 'NO SIGNAL':
      alarmColor = 'gray'
      break

    case 'WARNING':
      alarmColor = 'warning'
      break
  }
  return alarmColor
}
</script>

<style lang="scss" scoped>
input[type='date'] {
  border: 1px solid #49494e;
  padding: 5px;
  border-radius: 8px;
  /* cursor: default; */
  font-size: 1rem;
}
.title {
  font-size: 1.2em;
}

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

#voyageGrid tr.dx-row.dx-data-row > td {
  height: 45px;
}

.report-container {
  height: calc(100vh - 65px - 32px);
}

/* #voyageGrid {
  height: calc(100% - 60px);
} */

.v-btn--icon.v-btn--density-default.actionBtn {
  width: 35px;
  height: 35px;
  /* padding: 4px; */
}

.actionBtn i {
  font-size: 20px;
}

.voyage-route {
  .v-img__img--contain {
    object-fit: fill;
  }
}

.report {
  page: a4sheet;
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  margin: 10mm auto;
  border-radius: 5px;
  /* background: white; */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

@page a4sheet {
  size: A4;
  margin: 0;
}
@media print {
  .report {
    margin: 0;
    border: initial;
    border-radius: initial;
    width: initial;
    min-height: initial;
    box-shadow: initial;
    background: initial;
    page-break-after: always;
  }
}

.report-header {
  height: 80px;
  align-content: center;
}

.report-sub-title {
  font-size: 1.1rem;
  margin-bottom: 8px;
}
</style>
