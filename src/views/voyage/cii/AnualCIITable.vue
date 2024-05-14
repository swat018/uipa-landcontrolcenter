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
  <v-data-table class="cii-table" :headers="headers" :items="ciiData" height="100%"
    style="--v-table-header-height: 38px;">

    <template v-slot:item.key="{ item }">
      {{ platformText(item.Key) }}
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { useCiiStore } from '@/stores/ciiStore'

const shipStore = useShipStore()
const { selectedShip } = storeToRefs(shipStore);

const ciiStore = useCiiStore()
const { monthlyCiiData } = storeToRefs(ciiStore);


onMounted(() => {

  fetchMonthlyCiiData()
})

const year = ref('2024')
const targetLength = 12;

let ciiData = ref();
const fetchMonthlyCiiData = async () => {
  // ciiData.value = ciiData.value.fill('-');
  console.log('cii')
  console.dir(ciiData.value)
  const result = await ciiStore.fetchMonthlyCiiData(selectedShip.value, year.value)

  console.log('결과값 null 인지')
  console.dir(result)
  if (result) {
    const {
      ciiGradeList, ciiRatingList, attainedCiiList, co2EmissionList,
      focTotalList, focHfoList, focMdoList, focMgoList, focLfoList, focLngList,
      speedList, distanceList
    } = result

    let data = {
      ciiGradeList,
      ciiRatingList,
      attainedCiiList,
      co2EmissionList,
      focTotalList,
      focHfoList,
      focMdoList,
      focMgoList,
      focLfoList,
      focLngList,
      speedList,
      distanceList
    }


    let test2 = formattedData(data)
    ciiData.value = test2
  }

}

watch(selectedShip, fetchMonthlyCiiData);
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
  { title: 'Dec', value: 'Dec' },
];

// const data = [
//   { emissionTotal: [1000, 800, 600, 700, 450, 650, 850, 1000, 800, 600, 700, 450] },
//   { focTotal: [1000, 800, 600, 700, 450, 650, 850, 1000, 800, 600, 700, 450] },
//   { hfo: [190, 300, 200, 400, 200, 200, 200, 190, 300, 200, 400, 200] },
//   { lfo: [550, 250, 50, 200, 100, 250, 300, 550, 250, 50, 200, 100] },
//   { mdo_mgo: [360, 150, 350, 100, 150, 250, 350, 360, 150, 350, 100, 150] },
//   { lpg: [0,0,0,0,0,0,0,0,0,0,0,0] },
//   { lng: [0,0,0,0,0,0,0,0,0,0,0,0] },
// ];

const platformNames = {
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
  distanceList: 'Distance (nm)',
};


const formattedData = (data) => {
  const result = [];
  for (const key in data) {
    const values = data[key];
    const item = {};

    item.Key = key;

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      if (header.title != 'Key')
        item[header.title] = values[i] !== undefined ? values[i] : '-';
    }
    result.push(item);
  }

  return result;
};

const platformText = (platform) => {
  return platformNames[platform] || platform;
};
</script>
<style lang="scss">
.v-data-table-footer {
  display: none !important;
}

.cii-table {}
</style>