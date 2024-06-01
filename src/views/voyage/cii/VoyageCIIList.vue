<template>
  <v-sheet class="detail-page rounded-lg h-100">
    <!-- 필터 -->
    <div class="d-flex justify-end ga-2 my-6">
      <div class="datePicker"><input type="date" v-model="startDate" :max="todayDate" /></div>
      <div class="datePicker">
        <input type="date" v-model="endDate" :min="startDate" :disabled="endDateStatus" />
      </div>
      <i-btn @click="filterDate()" text="조회" width="90"></i-btn>
    </div>

    <DxDataGrid
      id="cii-monitoring-grid"
      ref="ciiMonitoringGrid"
      class="tabs-date-filter-container"
      :data-source="ciiList"
      key-expr="id"
      :show-borders="true"
    >
      <DxSelection mode="single"></DxSelection>
      <DxColumn data-field="voyage" caption="id" alignment="center" :visible="false"></DxColumn>
      <DxColumn
        data-field="departure"
        caption="Departure"
        alignment="center"
        cell-template="departure-template"
        :allow-editing="false"
        width="10%"
      ></DxColumn>
      <template #departure-template="{ data: templateOptions }">
        <PortInfo
          :portName="templateOptions.data.departure"
          :time="templateOptions.data.departureTime"
          :country="templateOptions.data.departurePortInfo.country"
        >
        </PortInfo>
      </template>
      <DxColumn
        data-field="arrival"
        caption="Arrival"
        alignment="center"
        cell-template="arrival-template"
        :allow-editing="false"
        width="10%"
      ></DxColumn>
      <template #arrival-template="{ data: templateOptions }">
        <PortInfo
          :portName="templateOptions.data.arrivalPortInfo.name"
          :time="templateOptions.data.arrivalTime"
          :country="templateOptions.data.arrivalPortInfo.country"
        >
        </PortInfo>
      </template>
      <DxColumn
        data-field="underway"
        caption="UnderWay(h)"
        alignment="center"
        header-cell-template="underway-header"
      >
      </DxColumn>
      <template #underway-header="{ data }">
        <p>
          UnderWay <br />
          (h)
        </p>
      </template>
      <DxColumn
        data-field="distance"
        caption="Distance(nm)"
        alignment="center"
        header-cell-template="distance-header"
      >
      </DxColumn>
      <template #distance-header="{ data }">
        <p>
          Distance <br />
          (nm)
        </p>
      </template>
      <DxColumn
        data-field="speed"
        caption="Avg Speed(kn)"
        alignment="center"
        header-cell-template="speed-header"
      >
      </DxColumn>
      <template #speed-header="{ data }">
        <p>
          Avg <br />
          Speed<br />
          (kn)
        </p>
      </template>
      <DxColumn data-field="focMT" caption="FOC(mt)" alignment="center">
        <DxColumn
          data-field="detailFocMap.MDO/MGO"
          caption="MDO/MGO"
          alignment="center"
          :visible="usedMDOMGO"
        />
        <DxColumn
          data-field="detailFocMap.LFO"
          caption="LFO"
          alignment="center"
          :visible="usedLFO"
        />
        <DxColumn
          data-field="detailFocMap.HFO"
          caption="HFO"
          alignment="center"
          :visible="usedHFO"
        />
        <DxColumn
          data-field="detailFocMap.LPG"
          caption="LPG"
          alignment="center"
          :visible="usedLPG"
        />
        <DxColumn
          data-field="detailFocMap.LNG"
          caption="LNG"
          alignment="center"
          :visible="usedLNG"
        />
      </DxColumn>
      <!-- Co2 Emission -->
      <DxColumn
        data-field="co2Emission"
        caption="Total CO₂,Emission(kn)"
        alignment="center"
        header-cell-template="totalEmission-header"
      ></DxColumn>
      <template #totalEmission-header="{ data }">
        <p>
          Total <br />
          Co2 Emission<br />
          (kn)
        </p>
      </template>
      <DxColumn
        data-field="requiredCii"
        caption="Required Cll"
        alignment="center"
        header-cell-template="requireCII-header"
      >
      </DxColumn>
      <template #requireCII-header="{ data }">
        <p>
          Required <br />
          CII
        </p>
      </template>
      <DxColumn
        data-field="attainedCii"
        caption="Attained Cll"
        alignment="center"
        header-cell-template="attainedCll-header"
      >
      </DxColumn>
      <template #attainedCll-header="{ data }">
        <p>
          Attained <br />
          CII
        </p>
      </template>
      <DxColumn
        data-field="ciiRating"
        caption="Cll Rating"
        alignment="center"
        header-cell-template="rating-header"
      >
      </DxColumn>
      <template #rating-header="{ data }">
        <p>
          CII <br />
          Rating
        </p>
      </template>

      <DxColumn
        data-field="ciiGrade"
        caption="Cll Grade"
        alignment="center"
        header-cell-template="grade-header"
      >
      </DxColumn>
      <template #grade-header="{ data }">
        <p>
          CII <br />
          Grade
        </p>
      </template>

      <DxPaging />
      <DxScrolling mode="virtual"></DxScrolling>
    </DxDataGrid>
  </v-sheet>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import emitter from '@/composables/eventbus.js'
import PortInfo from '@/components/voyage/PortInfo.vue'
import cllRatingData from '@/assets/mockup/cllRatingData.json'
import { useToast } from '@/composables/useToast'
import { useCiiStore } from '@/stores/ciiStore'
import { useShipStore } from '@/stores/shipStore'
import { convertDateType, isValidDateRange, addDay } from '@/composables/util.js'
import { getDxGridInstance } from '@/composables/dxGridUtil.js'

const startDate = ref('')
const endDate = ref('')

const ciiStore = useCiiStore()
const { ciiList } = storeToRefs(ciiStore)

const shipStore = useShipStore()
const { curSelectedShip, usedFuels } = storeToRefs(shipStore)

const { showResMsg } = useToast()

const fules = ['mdo', 'lfo', 'hfo', 'lpg']

const usedMDOMGO = ref(false)
const usedLFO = ref(false)
const usedHFO = ref(false)
const usedLPG = ref(false)
const usedLNG = ref(false)

const todayDate = ref()
const endDateStatus = ref(true)

const hasName = computed(() => {
  return !!ciiList['detailFocMap'].MTO
})
const ciiMonitoringGrid = ref('')
const ciiMonitoringInstance = ref('')
onMounted(() => {
  ciiMonitoringInstance.value = getDxGridInstance(ciiMonitoringGrid)

  let today = new Date()
  todayDate.value = convertDateType(today)
})

const getUsedFuelStatus = () => {
  usedMDOMGO.value = usedFuels.value.includes('MDO') || usedFuels.value.includes('MGO')
  usedLFO.value = usedFuels.value.includes('LFO')
  usedHFO.value = usedFuels.value.includes('HFO')
  usedLNG.value = usedFuels.value.includes('LNG')
  usedLPG.value = usedFuels.value.includes('LPG')
}

const fetchCiiListByImoNumber = async () => {
  let imoNumber = curSelectedShip.value.imoNumber
  await ciiStore.fetchCiiListByImoNumber(imoNumber)
  getUsedFuelStatus()
}

const filterDate = () => {
  if (!startDate.value || !endDate.value) {
    ciiMonitoringInstance.value.clearFilter()
    return
  }
  if (!isValidDateRange(startDate.value, endDate.value)) {
    showResMsg('도착시각이 출발시각보다 빠릅니다')
    return
  }

  let addedEndDate = addDay(endDate.value, 1)
  addedEndDate = convertDateType(addedEndDate)

  ciiMonitoringInstance.value.filter(['departureTime', '>=', startDate.value], 'and', [
    'departureTime',
    '<=',
    addedEndDate
  ])
}

watch(startDate, () => {
  if (startDate.value) {
    endDateStatus.value = false
  } else {
    endDateStatus.value = true
  }
})

watch(curSelectedShip, fetchCiiListByImoNumber)
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
