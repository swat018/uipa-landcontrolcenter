<template>
  <v-data-table :headers="headers" :items="formattedData" :hide-default-footer="true" item-key="fuel">
    <template #body="{ items }">
      <tr v-for="(item, index) in items" :key="index">
        <td>{{ platformText(item.fuel) }}</td>
        <td v-for="(usage, month) in item.usage" :key="month">
          {{ usage }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
const headers = [
  { title: 'Fuel', align: 'start', value: 'fuel' },
  { title: 'Jan', value: '1' },
  { title: 'Feb', value: '2' },
  { title: 'Mar', value: '3' },
  { title: 'April', value: '4' },
  { title: 'May', value: '5' },
  { title: 'Jun', value: '6' },
  { title: 'Jul', value: '7' },
  { title: 'Aug', value: '8' },
  { title: 'Sep', value: '9' },
  { title: 'Oct', value: '10' },
  { title: 'Nov', value: '11' },
  { title: 'Dec', value: '12' },
];

const data = [
  { fuelTotal: [1000, 800, 600, 700, 450, 650, 850, 1000, 800, 600, 700, 450] },
  { focTotal: [1000, 800, 600, 700, 450, 650, 850, 1000, 800, 600, 700, 450] },
  { hfo: [190, 300, 200, 400, 200, 200, 200, 190, 300, 200, 400, 200] },
  { lfo: [550, 250, 50, 200, 100, 250, 300, 550, 250, 50, 200, 100] },
  { diesel: [360, 150, 350, 100, 150, 250, 350, 360, 150, 350, 100, 150] },
  { lpg: [0,0,0,0,0,0,0,0,0,0,0,0] },
  { lng: [0,0,0,0,0,0,0,0,0,0,0,0] },
];

const platformNames = {
  fuelTotal: 'Fuel(Total)',
  focTotal: 'Foc(Total)',
  hfo: 'HFO',
  lfo: 'LFO',
  diesel: 'DIESEL',
  lpg: 'LPG',
  lng: 'LNG'
};

const formattedData = computed(() => {
  const test = data.map(item => {
    const fuel = Object.keys(item)[0];
    const usage = item[fuel];
    const formattedUsage = {};
    usage.forEach((value, index) => {
      formattedUsage[index + 1] = value;
    });
    return { fuel, usage: formattedUsage };
  });

  console.dir(test)
  return test;

});

const platformText = (platform) => {
  return platformNames[platform] || platform;
};
</script>
<style>
.v-data-table-footer {
  display: none !important;
}
</style>