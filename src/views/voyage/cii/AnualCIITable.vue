<template>
  <!-- <v-data-table :headers="headers" :items="ciiData" :hide-default-footer="true" item-key="fuel">
    <template #body="{ items }">
      <tr v-for="(item, index) in items" :key="index">
        <td>{{ platformText(item.fuel) }}</td>
        <td class="text-center" v-for="(usage, month) in item.usage" :key="month">
          {{ usage }}
        </td>
      </tr>
    </template>
</v-data-table> -->
  <v-data-table
    ref="ciiTable"
    class="cii-table text-center"
    :headers="headers"
    :items="ciiData"
    style="--v-table-row-height: 38px"
    :style="ciiTableRowStyle"
  >
    <template v-slot:item.key="{ item }">
      {{ getKeyName(item.Key) }}
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { useCiiStore } from '@/stores/ciiStore'

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

const ciiStore = useCiiStore()
// const { monthlyCiiData } = storeToRefs(ciiStore)
const { usedFuels } = storeToRefs(shipStore)

const ciiTable = ref()

let tableElement = 0
let ciiTableHeight = ref(0)
let ciiTableRowHeight = ref(0)
let ciiTableRowStyle = ref()
let curSelectedImoNumber = null

onMounted(() => {
  fetchMonthlyCiiData()
  console.log('테이블')
  console.dir(ciiTable.value)
  ciiTableRowHeight.value = 30

  tableElement = document.querySelector('.cii-table')
  if (tableElement) {
    ciiTableHeight.value = tableElement.clientHeight
    console.log('테이블 높이')
    console.log(ciiTableHeight)
  }
})

const year = ref('2024')
const targetLength = 12

const usedMDO = ref(false)
const usedMGO = ref(false)
const usedLFO = ref(false)
const usedHFO = ref(false)
const usedLPG = ref(false)
const usedLNG = ref(false)

let ciiData = ref()
const fetchMonthlyCiiData = async () => {
  // ciiData.value = ciiData.value.fill('-');
  curSelectedImoNumber = curSelectedShip.value.imoNumber
  const result = await ciiStore.fetchMonthlyCiiData(curSelectedImoNumber, year.value)
  usedMDO.value = usedFuels.value.includes('MDO')
  usedMGO.value = usedFuels.value.includes('MGO')
  usedLFO.value = usedFuels.value.includes('LFO')
  usedHFO.value = usedFuels.value.includes('HFO')
  usedLNG.value = usedFuels.value.includes('LNG')
  usedLPG.value = usedFuels.value.includes('LPG')

  console.log('결과값 null 인지')
  console.dir(result)
  if (result) {
    const {
      ciiGradeList,
      ciiRatingList,
      attainedCiiList,
      co2EmissionList,
      focTotalList,
      focHfoList,
      focMdoList,
      focMgoList,
      focLfoList,
      focLpgList,
      focLngList,
      speedList,
      distanceList
    } = result

    let data = {
      ciiGradeList,
      ciiRatingList,
      attainedCiiList,
      co2EmissionList,
      focTotalList,
      focHfoList,
      focLfoList,
      focMdoList,
      focMgoList,
      focLngList,
      focLpgList,
      speedList,
      distanceList
    }

    if (!usedMDO.value) {
      delete data.focMdoList
    }

    if (!usedMGO.value) {
      delete data.focMgoList
    }
    if (!usedLFO.value) {
      delete data.focLfoList
    }
    if (!usedHFO.value) {
      delete data.focHfoList
    }
    if (!usedLNG.value) {
      delete data.focLngList
    }
    if (!usedLPG.value) {
      delete data.focLpgList
    }

    let monthlyCiiData = formattedData(data)
    console.log('월간데이터')
    console.dir(monthlyCiiData)
    ciiData.value = monthlyCiiData
    getTableRowHeight(monthlyCiiData)
  }
}

const getTableRowHeight = (test2) => {
  tableElement = document.querySelector('.cii-table')
  ciiTableHeight.value = tableElement.clientHeight
  ciiTableRowHeight.value = ciiTableHeight.value / test2.length
  setTimeout(() => {
    console.log('행 높이')
    console.log(ciiTableRowHeight.value)
    tableElement.style.setProperty('--v-table-header-height', ciiTableRowHeight)
    ciiTableRowStyle.value = `--v-table-row-height: ${ciiTableRowHeight.value}px`
  }, 1000)
}

watch(curSelectedShip, fetchMonthlyCiiData)
const headers = [
  { title: 'Key', align: 'start', value: 'key' },
  { title: 'Jan', value: 'Jan' },
  { title: 'Feb', value: 'Feb' },
  { title: 'Mar', value: 'Mar' },
  { title: 'Apr', value: 'Apr' },
  { title: 'May', value: 'May' },
  { title: 'Jun', value: 'Jun' },
  { title: 'Jul', value: 'Jul' },
  { title: 'Aug', value: 'Aug' },
  { title: 'Sep', value: 'Sep' },
  { title: 'Oct', value: 'Oct' },
  { title: 'Nov', value: 'Nov' },
  { title: 'Dec', value: 'Dec' }
]

// const data = [
//   { emissionTotal: [1000, 800, 600, 700, 450, 650, 850, 1000, 800, 600, 700, 450] },
//   { focTotal: [1000, 800, 600, 700, 450, 650, 850, 1000, 800, 600, 700, 450] },
//   { hfo: [190, 300, 200, 400, 200, 200, 200, 190, 300, 200, 400, 200] },
//   { lfo: [550, 250, 50, 200, 100, 250, 300, 550, 250, 50, 200, 100] },
//   { mdo_mgo: [360, 150, 350, 100, 150, 250, 350, 360, 150, 350, 100, 150] },
//   { lpg: [0,0,0,0,0,0,0,0,0,0,0,0] },
//   { lng: [0,0,0,0,0,0,0,0,0,0,0,0] },
// ];

const keyNames = {
  ciiGradeList: 'CII Grade',
  ciiRatingList: 'CII Rating',
  attainedCiiList: 'Attained CII',
  co2EmissionList: 'CO2 (t)',
  focTotalList: 'Fuel (t)',
  focHfoList: 'HFO (t)',
  focMdoList: 'MDO (t)',
  focMgoList: 'MGO (t)',
  focLfoList: 'LFO (t)',
  focLpgList: 'LPG (t)',
  focLngList: 'LNG (t)',
  speedList: 'Speed(kn)',
  distanceList: 'Distance (nm)'
}

const formattedData = (data) => {
  const result = []
  for (const key in data) {
    const values = data[key]
    const item = {}

    item.Key = key

    let headerList = headers.filter((header) => header.title != 'Key')

    for (let i = 0; i < headerList.length; i++) {
      const header = headerList[i]
      item[header.title] = values[i] !== undefined ? values[i] : '-'
    }
    result.push(item)
  }
  return result
}

const getKeyName = (key) => {
  return keyNames[key] || key
}

window.addEventListener('resize', getTableRowHeight)
</script>
<style lang="scss">
.v-data-table-footer {
  display: none !important;
}

.cii-table {
}
</style>
