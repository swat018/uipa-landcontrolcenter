<template>
  <v-sheet class="pa-4">
    <v-sheet color="#222224" class="d-flex justify-center">
      <table class="fuelInfo-table">
        <caption class="mb-4 text-left plan-title">
          1. Ship particulars
        </caption>
        <colgroup>
          <col width="25%" />
          <col width="25%" />
          <col width="25%" />
          <col width="25%" />
        </colgroup>
        <tbody>
          <tr>
            <th class="title">Name of Ship</th>
            <td><i-input></i-input></td>
            <th class="title">IMO Number</th>
            <td colspan="3"><i-input></i-input></td>
          </tr>
          <tr>
            <th class="title">Company</th>
            <td><i-input></i-input></td>
            <th class="title">Flag</th>
            <td colspan="3"><i-input></i-input></td>
          </tr>
          <tr>
            <th class="title">Ship Type</th>
            <td><i-input></i-input></td>
            <th class="title">Gross Tonnage</th>
            <td colspan="3"><i-input></i-input></td>
          </tr>
          <tr>
            <th class="title">NT</th>
            <td><i-input></i-input></td>
            <th class="title">DWT</th>
            <td colspan="3"><i-input></i-input></td>
          </tr>
          <tr>
            <th class="title">EEDI (if applicable)</th>
            <td><i-input></i-input></td>
            <th class="title">Ice Class</th>
            <td colspan="3"><i-input></i-input></td>
          </tr>
        </tbody>
      </table>
    </v-sheet>
    <v-sheet class="d-flex justify-center mt-4">
      <!-- 선박 연료유 사용량 -->
      <table class="fuel-usage-table text-center">
        <caption class="mb-4 text-left plan-title">
          2. Record of revision of Fuel Oil Consumption Data Collection Plan
        </caption>
        <colgroup>
          <col width="25%" />
          <col width="75%" />
        </colgroup>
        <tbody>
          <tr>
            <th class="title">Date of Revison</th>
            <th class="title">Revised Provision</th>
          </tr>
          <tr>
            <td><i-input type="date"></i-input></td>
            <td colspan="3"><i-input></i-input></td>
          </tr>
          <tr>
            <td><i-input type="date"></i-input></td>
            <td colspan="3"><i-input></i-input></td>
          </tr>
        </tbody>
      </table>
    </v-sheet>

    <v-sheet color="#222224" class="d-flex justify-center mt-4">
      <table class="fuelInfo-table oil-consumer">
        <caption class="mb-4 text-left plan-title">
          3. Ship engines and other fuel oil consumers and fuel oil types used
        </caption>
        <colgroup>
          <col width="10%" />
          <col width="40%" />
          <col width="25%" />
          <col width="25%" />
        </colgroup>
        <tbody>
          <tr class="pa-4">
            <th class="title"></th>
            <th class="title">Engines or other fuel oil consumers</th>
            <th class="title">Power</th>
            <th class="title">Fuel Oil Type</th>
          </tr>
          <tr>
            <td class="title">1</td>
            <td class="title">Type/model of main engine</td>
            <td><i-input></i-input></td>
            <td>
              <i-selectbox
                :items="method"
                density="compact"
                bg-color="#434348"
                hide-details
              ></i-selectbox>
            </td>
          </tr>
          <tr>
            <td class="title">2</td>
            <td class="title">Type/model of auxiliary engine</td>
            <td><i-input></i-input></td>
            <td>
              <i-selectbox
                :items="method"
                density="compact"
                bg-color="#434348"
                hide-details
              ></i-selectbox>
            </td>
          </tr>
          <tr>
            <td class="title">3</td>
            <td class="title">Boiler</td>
            <td><i-input></i-input></td>
            <td>
              <i-selectbox
                :items="method"
                density="compact"
                bg-color="#434348"
                hide-details
              ></i-selectbox>
            </td>
          </tr>
          <tr>
            <td class="title">4</td>
            <td class="title">Inert gas generator</td>
            <td><i-input></i-input></td>
            <td>
              <i-selectbox
                :items="method"
                density="compact"
                bg-color="#434348"
                hide-details
              ></i-selectbox>
            </td>
          </tr>
        </tbody>
      </table>
    </v-sheet>

    <!-- Emission Factor -->
    <v-sheet class="d-flex justify-center mt-4">
      <table class="fuel-usage-table text-center">
        <caption class="mb-4 text-left plan-title">
          4. Emission Factor
        </caption>
        <colgroup>
          <col width="70%" />
          <col width="30%" />
        </colgroup>
        <tbody>
          <tr>
            <th class="title">Fuel Oil Type</th>
            <th class="title">
              CF <br />
              (t-Co2/t-Fuel)
            </th>
          </tr>
          <tr>
            <td>Diesel/Gas oil (e.g. ISO 8217 grades DMX through DMB)</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td>Light fuel oil (LFO) (e.g. ISO 8217 grades RMA through RMD)</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td>Heavy fuel oil (HFO) (e.g. ISO 8217 grades RME through RMK)</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td>Liquefied petroleum gas (LPG) (Propane)</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td>Liquefied natural gas (LNG)</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <th class="title">Fuel Oil Type</th>
            <th class="title">
              CF <br />
              (t-Co2/t-Fuel)
            </th>
          </tr>
          <!-- <tr>
            <td>Methanol</td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td>Ethanol</td>
            <td><i-input></i-input></td>
          </tr> -->
          <tr>
            <td>Other (………)</td>
            <td><i-input></i-input></td>
          </tr>
        </tbody>
      </table>
    </v-sheet>

    <v-sheet class="d-flex justify-center mt-4">
      <!-- 선박 연료유 사용량 -->
      <table class="fuel-usage-table text-center">
        <caption class="mb-4 text-left plan-title">
          5. Method to measure fuel oil consumption
        </caption>
        <colgroup>
          <col width="25%" />
          <col width="75%" />
        </colgroup>
        <tbody>
          <tr>
            <th class="title">Method</th>
            <th class="title">Description</th>
          </tr>
          <tr>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td><i-input></i-input></td>
            <td><i-input></i-input></td>
          </tr>
        </tbody>
      </table>
    </v-sheet>
    <v-sheet class="d-flex justify-center mt-4">
      <!-- 선박 연료유 사용량 -->
      <table class="fuel-usage-table text-center">
        <caption class="mb-4 text-left plan-title">
          6. Method to measure distance travelled
        </caption>
        <colgroup>
          <col width="100%" />
        </colgroup>
        <tbody>
          <tr>
            <th class="title">Description</th>
          </tr>
          <tr>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td><i-input></i-input></td>
          </tr>
        </tbody>
      </table>
    </v-sheet>
    <v-sheet class="d-flex justify-center mt-4">
      <!-- 선박 연료유 사용량 -->
      <table class="fuel-usage-table text-center">
        <caption class="mb-4 text-left plan-title">
          7. Method to measure hours underway
        </caption>
        <colgroup>
          <col width="100%" />
        </colgroup>
        <tbody>
          <tr>
            <th class="title">Description</th>
          </tr>
          <tr>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td><i-input></i-input></td>
          </tr>
        </tbody>
      </table>
    </v-sheet>
    <v-sheet class="d-flex justify-center mt-4">
      <!-- 선박 연료유 사용량 -->
      <table class="fuel-usage-table text-center">
        <caption class="mb-4 text-left plan-title">
          8. Processes that will be used to report the data to the Administration
        </caption>
        <colgroup>
          <col width="100%" />
        </colgroup>
        <tbody>
          <tr>
            <th class="title">Description</th>
          </tr>
          <tr>
            <td><i-input></i-input></td>
          </tr>
          <tr>
            <td><i-input></i-input></td>
          </tr>
        </tbody>
      </table>
    </v-sheet>
    <v-sheet class="d-flex justify-center mt-4">
      <!-- 선박 연료유 사용량 -->
      <table class="fuel-usage-table text-center">
        <caption class="mb-4 text-left plan-title">
          9. Data quality
        </caption>
        <colgroup>
          <col width="100%" />
        </colgroup>
        <tbody>
          <tr>
            <th class="title">Description</th>
          </tr>
          <tr>
            <td><i-input></i-input></td>
          </tr>
          <tr>
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
  min-width: 700px;
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

table.fuelInfo-table.oil-consumer td:not(:last-child) {
  border-right: 1px solid #49494e;
}

.plan-title {
  font-size: 1.2em;
}
</style>
