<template>
  <v-sheet class="pa-4">
    <v-sheet color="#222224" class="d-flex justify-center">
      <table class="fuelInfo-table">
        <colgroup>
          <col width="15%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="15%" />
        </colgroup>
        <thead style="height: 80px">
          <tr>
            <th rowspan="2">
              Date of Operations <br />
              (dd/mm/yyyy)
            </th>
            <th colspan="7">Fuel Oil Type/Mass(MT)</th>
            <th rowspan="2">Descriptions</th>
          </tr>
          <tr>
            <th>DO/GO</th>
            <th>LFO</th>
            <th>HFO</th>
            <th>LPG(P)</th>
            <th>LPG(B)</th>
            <th>LNG</th>
            <th>Others(CF)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="9" class="text-center" style="border-top: 1px solid #49494e">1. BDN</td>
          </tr>
          <tr v-for="i in 5">
            <td><i-input placeholder="09/01/2019"></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td colspan="9" class="text-center">2. Correction for the tank oil remainings</td>
          </tr>
          <tr v-for="i in 3">
            <td><i-input placeholder="09/01/2019"></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
          </tr>

          <tr>
            <td colspan="9" class="text-center">3. Other corrections</td>
          </tr>
          <tr v-for="i in 3">
            <td><i-input placeholder="09/01/2019"></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td colspan="9" class="text-center">Annual Fuel Consumption</td>
          </tr>
          <tr>
            <td><i-input placeholder="09/01/2019"></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
          </tr>
        </tbody>
      </table>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue'

const method = [
  '1.연료유공금서(BDN) 사용',
  '2. 유량계 사용',
  '3.벙커 탱크 모니터링',
  '4. LNG 화물탱크 모니터링',
  '5. LNG 이외의 화물을 연료로 사용하는 선박의 화물탱크 모니터링'
]
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
  border: 1px solid #49494e;
  min-width: 1240px;
  border-spacing: 0px;
}

/* 선박 기본 정보  테이블 관련 CSS */
table.fuelInfo-table .cii-purpose-tr.odd {
  background: #222224;
}

table.fuelInfo-table th {
  border-right: 1px solid #49494e;
}

table.fuelInfo-table tr:nth-child(odd) {
  background: #2f2f32;
}

table.fuelInfo-table td,
.fuel-usage-table td {
  padding: 10px 20px;
}

table.fuelInfo-table .cii-purpose-tr.even {
  background: #2f2f32;
}

table.fuelInfo-table tr.eedi-cf {
  background: #222224;
  border-top: 1px solid #49494e;
  border-bottom: 1px solid #49494e;
}

table.fuelInfo-table .eedi-cf-tr.odd {
  background: #2f2f32;
}

table.fuelInfo-table .eedi-cf-tr.even {
  background: #222224;
}

table.fuelInfo-table tr.cii-purpose th {
  border-bottom: 1px solid #49494e;
}

table.fuelInfo-table .title {
  font-size: 1em;
}

table.fuel-usage-table tr:nth-child(even) {
  background: #2f2f32;
}

table.fuel-usage-table .title {
  font-size: 1em;
}

.eedi-cf-th {
  border-left: 1px solid #49494e;
}

/* 선박 연료유 사용량  테이블 관련 CSS */
table.fuel-usage-table .fuel-usage th {
  border-right: 1px solid #49494e;
  background: #2f2f32;
}

table.fuel-usage-table tr.etc.odd {
  background: #2f2f32;
}

table.fuel-usage-table tr.etc.even {
  background: #222224;
}

table.fuel-usage-table tr.machine-output {
  background: #222224;
}

table.fuel-usage-table th.title {
  border-right: 1px solid #49494e;
}

.fuel-usage-table tr td:nth-child(2):not(:last-child) {
  border-left: 1px solid #49494e;
  border-right: 1px solid #49494e;
}

tr.fuel-usage th.title {
  border-bottom: 1px solid #49494e;
}

table.fuel-usage-table tr td:last-child {
  border-left: 1px solid #49494e;
}
</style>
