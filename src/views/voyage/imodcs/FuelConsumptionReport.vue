<template>
  <v-sheet class="pa-4">
    <v-sheet color="#222224" class="d-flex justify-center">
      <table class="fuelInfo-table">
        <colgroup>
          <col width="25%" />
          <col width="25%" />
          <col width="50%" />
        </colgroup>
        <tbody>


          <tr>
            <th colspan="2" class="title">Start date (dd/mm/yyyy)</th>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <th colspan="2" class="title">End date (dd/mm/yyyy)</th>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <th colspan="2" class="title">IMO Number</th>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <th colspan="2" class="title">Ship Type</th>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <th colspan="2" class="title">Gross Tonnage</th>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <th colspan="2" class="title">NT</th>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <th colspan="2" class="title">DWT</th>
            <td><i-input></i-input></td>
          </tr>

          <tr>
            <th colspan="2" class="title">EEID (if applicable) <br> (gCO2/t.nm)</th>
            <td><i-input></i-input></td>
          </tr>

          <tr>
            <th colspan="2" class="title">Ice Class (if applicable)</th>
            <td><i-input></i-input></td>
          </tr>

          <tr>
            <th rowspan="5">Power output <br> (rated power) <br> (kW)</th>
            <td class="text-center">Main <br> Propulsion <br> Power</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td class="text-center">No. 1 Auxiliary <br> Engin</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td class="text-center">No. 2 Auxiliary <br> Engin</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td class="text-center">No. 3 Auxiliary <br> Engin</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td class="text-center">No. 4 Auxiliary <br> Engin</td>
            <td><i-input></i-input></td>
          </tr>

          <tr>
            <th colspan="2" class="title">Distance Travelled (nm)</th>
            <td><i-input></i-input></td>
          </tr>

          <tr>
            <th colspan="2" class="title">Hours underway (h)</th>
            <td><i-input></i-input></td>
          </tr>

          <tr>
            <th rowspan="8" class="title"> Fuel Oil <br> Consumption <br> (t)</th>
            <td class="text-center">Diesel / Gas Oil <br> (cf : 3.206)</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td class="text-center">LFO <br> (cf : 3.151)</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td class="text-center">HFO <br> (cf : 3.114)</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td class="text-center">LPG <br> (cf : 3.151)</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td class="text-center">LNG <br> (cf : 2.750)</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td class="text-center">Methanol <br> (cf : 1.375)</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td class="text-center">Ethanol <br> (cf : 1.913)</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td class="text-center">Other (...) <br> (Cf : ...)</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td colspan="2" class="text-center">Method used to measure <br> Uel oil consumption</td>
            <td><i-selectbox :items="method" density="compact" bg-color="#434348" hide-details></i-selectbox></td>
          </tr>
        </tbody>
      </table>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue'
import AnualCIIReport from '@/views/voyage/cii/AnualCIIReport.vue'
import CllMonitoring from '@/views/voyage/cii/CllMonitoring.vue';


const method = ['1.연료유공금서(BDN) 사용', '2. 유량계 사용', '3.벙커 탱크 모니터링', '4. LNG 화물탱크 모니터링', '5. LNG 이외의 화물을 연료로 사용하는 선박의 화물탱크 모니터링']
</script>

<style scoped>
.basic-container-title {
  flex: 1 1 0;
  font-size: 1.2em;
}

.basic-container-info {
  flex: 5 1 0;
}

.basic-container-item {
  width: 240px;
}

.basic-container-item.fuel {
  flex: 1 1 20%;
}

.basic-container-item.etc {
  flex: 1 1 0;
}

.fuel-container {
  flex: 2 1 auto;
}

/* 선박 기본 정보 및 선박 연료유 사용량 테이블 공통 CSS */

.fuelInfo-table,
.fuel-usage-table {
  border: 1px solid #49494E;
  min-width: 700px;
  border-spacing: 0px;
}

/* 선박 기본 정보  테이블 관련 CSS */
table.fuelInfo-table .cii-purpose-tr.odd {
  background: #222224;
}

table.fuelInfo-table th {
  border-right: 1px solid #49494E;
}

table.fuelInfo-table tr:nth-child(odd) {
  background: #2F2F32;
}

table.fuelInfo-table td,
.fuel-usage-table td {
  padding: 10px 20px;
}

table.fuelInfo-table .cii-purpose-tr.even {
  background: #2F2F32;
}

table.fuelInfo-table tr.eedi-cf {
  background: #222224;
  border-top: 1px solid #49494E;
  border-bottom: 1px solid #49494E;
}

table.fuelInfo-table .eedi-cf-tr.odd {
  background: #2F2F32;
}

table.fuelInfo-table .eedi-cf-tr.even {
  background: #222224;
}

table.fuelInfo-table tr.cii-purpose th {
  border-bottom: 1px solid #49494E;
}

table.fuelInfo-table .title {
  font-size: 1em;
}

table.fuel-usage-table tr:nth-child(even) {
  background: #2F2F32;
}

table.fuel-usage-table .title {
  font-size: 1em;
}

.eedi-cf-th {
  border-left: 1px solid #49494E;
}

/* 선박 연료유 사용량  테이블 관련 CSS */
table.fuel-usage-table .fuel-usage th {
  border-right: 1px solid #49494E;
  background: #2F2F32;
}

table.fuel-usage-table tr.etc.odd {
  background: #2F2F32;
}

table.fuel-usage-table tr.etc.even {
  background: #222224;
}

table.fuel-usage-table tr.machine-output {
  background: #222224;
}

table.fuel-usage-table th.title {
  border-right: 1px solid #49494E;
}

.fuel-usage-table tr td:nth-child(2):not(:last-child) {
  border-left: 1px solid #49494E;
  border-right: 1px solid #49494E;
}

tr.fuel-usage th.title {
  border-bottom: 1px solid #49494E;
}


table.fuel-usage-table tr td:last-child {
  border-left: 1px solid #49494E;
}
</style>