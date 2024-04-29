<template>
  <div class="d-flex flex-column flex-grow-1 flex-shrink-1 detail-page">
    <v-sheet class="rounded-lg h-100">
      <!-- 필터 -->
      <div class="d-flex justify-end ga-2 my-4">
        <div class="datePicker"><input type="date" v-model="startDate" /></div>
        <div class="datePicker"><input type="date" v-model="endDate" /></div>
        <i-btn @click="btnSearch()" text="조회" width="90"></i-btn>
      </div>

      <DxDataGrid id="cii-rating-grid" ref="cii-rating-grid" :data-source="cllRatingData" key-expr="id"
        :column-auto-width="true">
        <DxSelection mode="single"></DxSelection>
        <DxColumn data-field="voyage" caption="Voyage" alignment="center"></DxColumn>
        <DxColumn data-field="departure" caption="Departure" alignment="center" cell-template="departure-template"
          :allow-editing="false"></DxColumn>
        <template #departure-template="{ data: templateOptions }">
          <PortInfo :portName="templateOptions.data.departure.portName" :time="templateOptions.data.time"
            :country="templateOptions.data.departure.startPortCountry">
          </PortInfo>
        </template>
        <DxColumn data-field="arrival" caption="Arrival" alignment="center" cell-template="arrival-template"
          :allow-editing="false"></DxColumn>
        <template #arrival-template="{ data: templateOptions }">
          <PortInfo :portName="templateOptions.data.arrival.portName" :time="templateOptions.data.time"
            :country="templateOptions.data.arrival.endPortCountry">
          </PortInfo>
        </template>
        <DxColumn data-field="underway" caption="UnderWay(h)" alignment="center" header-cell-template="underway-header">
        </DxColumn>
        <template #underway-header="{ data }">
          <p>UnderWay <br> (h)</p>
        </template>
        <DxColumn data-field="distance" caption="Distance(nm)" alignment="center"
          header-cell-template="distance-header">
        </DxColumn>
        <template #distance-header="{ data }">
          <p>Distance <br> (nm)</p>
        </template>
        <DxColumn data-field="avgSpeed" caption="Avg Speed(kn)" alignment="center" header-cell-template="speed-header">
        </DxColumn>
        <template #speed-header="{ data }">
          <p>Avg <br> Speed<br> (kn)</p>
        </template>
        <DxColumn data-field="focMT" caption="FOC(mt)" alignment="center">
          <DxColumn data-field="mdo/mgo" caption="MDO/MGO" alignment="center"></DxColumn>
          <DxColumn data-field="lfo" caption="LFO" alignment="center"></DxColumn>
          <DxColumn data-field="hfo" caption="HFO" alignment="center"></DxColumn>
          <DxColumn data-field="lpg_p" caption="LPG(P)" alignment="center"></DxColumn>
          <DxColumn data-field="lpg_b" caption="LPG(B)" alignment="center"></DxColumn>
          <DxColumn data-field="mto" caption="Mto" alignment="center"></DxColumn>
        </DxColumn>
        <DxColumn data-field="totalco2" caption="Total CO₂,Emission(kn)" alignment="center"
          header-cell-template="totalEmission-header"></DxColumn>
        <template #totalEmission-header="{ data }">
          <p>Total <br> Co2 Emission<br> (kn)</p>
        </template>
        <DxColumn data-field="requiredCll" caption="Required Cll" alignment="center"
          header-cell-template="requireCII-header">
        </DxColumn>
        <template #requireCII-header="{ data }">
          <p>Required <br> CII</p>
        </template>
        <DxColumn data-field="attainedCll" caption="Attained Cll" alignment="center"
          header-cell-template="attainedCll-header">
        </DxColumn>
        <template #attainedCll-header="{ data }">
          <p>Attained <br> CII</p>
        </template>
        <DxColumn data-field="cllRating" caption="Cll Rating" alignment="center" header-cell-template="rating-header">
        </DxColumn>
        <template #rating-header="{ data }">
          <p> CII <br> Rating</p>
        </template>

        <DxColumn data-field="cllGrade" caption="Cll Grade" alignment="center" header-cell-template="grade-header">
        </DxColumn>
        <template #grade-header="{ data }">
          <p> CII <br> Grade</p>
        </template>

        <DxPaging />
        <DxScrolling column-rendering-mode="virtual"></DxScrolling>
      </DxDataGrid>
    </v-sheet>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PortInfo from '@/components/voyage/PortInfo.vue';
import cllRatingData from '@/assets/mockup/cllRatingData.json'

const startDate = ref('')
const endDate = ref('')

</script>

<style scoped>
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
</style>