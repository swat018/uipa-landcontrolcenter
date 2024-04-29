<template>
  <div class="detail-page voyage-report d-flex flex-column pa-4">
    <v-sheet class="pa-4 rounded-lg report-container">
      <!-- 필터 -->
      <div class="d-flex justify-space-between align-center mb-4">
        <div class="title">항차 리포트</div>
        <div class="d-flex align-center ga-3">
          <v-btn-toggle v-model="shipCondition" color="#39393D" rounded="0" :mandatory="true" group
            density="comfortable">
            <v-btn value="all" :class="shipCondition == 'all' ? 'active' : 'inactive'">
              All
            </v-btn>
            <v-btn value="ballast" :class="shipCondition == 'ballast' ? 'active' : 'inactive'">
              BALLAST
            </v-btn>
            <v-btn value="laden" :class="shipCondition == 'laden' ? 'active' : 'inactive'">
              LADEN
            </v-btn>
          </v-btn-toggle>

          <div class="d-flex ga-2">
            <div class="datePicker"><input type="date" v-model="startDate" :max="todayDate" /></div>
            <div class="datePicker"><input type="date" v-model="endDate" :min="startDate" :disabled="endDateStatus" />
            </div>
            <i-btn @click="filterDate()" text="조회" width="90"></i-btn>
            <i-btn @click="openVoyagePopup()" text="등록" width="80" prepend-icon="mdi-plus" color="#3D3D40"></i-btn>
          </div>
        </div>
      </div>

      <!-- 리포트 -->
      <DxDataGrid id="voyageGrid" ref="voyageGrid" :data-source="voyages" key-expr="id" @row-click="clickVoyage"
        :column-auto-width="true">
        <DxSelection mode="single"></DxSelection>

        <DxColumn data-field="startPort" caption="Departure" :allow-editing="false" alignment="center"
          cell-template="departure-template" width="10%" min-width="120">
        </DxColumn>
        <template #departure-template="{ data: templateOptions }">
          <PortInfo :portName="templateOptions.data.startPortInfo.name" :time="templateOptions.data.startTime"
            :country="templateOptions.data.startPortInfo.country" class="d-flex flex-column justify-center">
          </PortInfo>
        </template>
        <DxColumn data-field="startTime" :visible="false">
        </DxColumn>

        <DxColumn data-field="endPort" caption="Arrival" cell-template="arrival-template" :allow-editing="false"
          width="10%" min-width="120" alignment="center">
        </DxColumn>
        <template #arrival-template="{ data: templateOptions }">
          <PortInfo :portName="templateOptions.data.endPortInfo.name" :time="templateOptions.data.endTime"
            :country="templateOptions.data.endPortInfo.country">
          </PortInfo>
        </template>
        <DxColumn data-field="endTime" :visible="false"></DxColumn>
        <DxColumn data-field="condition" caption="Condition" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="load" caption="Load(%)" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="rpm" caption="RPM" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="speed" caption="Speed(kn)" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="underway" caption="Underway(h)" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="distance" caption="Distance(nm)" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="slip" caption="Slip(%)" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="bf" caption="BF" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="dfoc" caption="DFOC(hours)" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="cargoCarried" caption="Cargo Carried(t)" alignment="center" :allow-editing="false">
        </DxColumn>
        <DxColumn data-field="eeoi" caption="EEOI" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="id" caption="Export" cell-template="pdf-template" alignment="center"
          :allow-editing="false">
        </DxColumn>
        <DxColumn cell-template="edit-template" aliignment="center"></DxColumn>
        <template #pdf-template="{ data: templateOptions }">
          <div class="d-inline-flex justify-center pa-1 rounded-lg" style="background-color : #B30B00">
            <v-img :src="pdfIcon" :width="25" @click="exportPdf(templateOptions.data.id)"></v-img>
          </div>
        </template>
        <template #edit-template="{ data: templateOptions }">
          <v-btn icon="mdi-square-edit-outline" @click="openEditPopup(templateOptions.data.id)"></v-btn>
        </template>
        <DxMasterDetail :enabled="false" template="detailTemplate"></DxMasterDetail>

        <template #detailTemplate="{ data: voyageDetail }">
          <VoyageReportDetail :template-data="voyageDetail" />
        </template>
        <DxPaging :page-size="10" />
        <DxScrolling mode="virtual" />
      </DxDataGrid>

      <VoyageRegisterForm v-model="isShow" @addVoyage="addVoyage" @closePopup="isShow = false"></VoyageRegisterForm>
      <VoyageEditForm v-model="isShowEditForm" :id="voyageId" @editVoyage="editVoyage"
        @closePopup="isShowEditForm = false">
      </VoyageEditForm>
    </v-sheet>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { getDxGridInstance, dxGridRefresh } from '@/composables/dxGridUtil.js'
import { convertDateType, isValidDateRange, addDay } from '@/composables/util.js'
import emitter from '@/composables/eventbus.js'
import { useToast } from '@/composables/useToast'
import { useVoyageStore } from '@/stores/voyageStore'
import { insertVoyage, updateVoyage } from '@/api/voyage'

import VoyageReportDetail from '@/views/voyage/VoyageReportDetail.vue';
import VoyageRegisterForm from '@/views/voyage/form/VoyageRegisterForm.vue';
import VoyageEditForm from '@/views/voyage/form/VoyageEditForm.vue';
import PortInfo from '@/components/voyage/PortInfo.vue';

import pdfIcon from '@/assets/images/file-pdf-one.png'

const shipCondition = ref('all')
const startDate = ref('')
const endDate = ref('')
const endDateStatus = ref(true)

const voyageGrid = ref('')
const voyageInstance = ref('')

const isShow = ref(false)
const isShowEditForm = ref(false)

const { showResMsg } = useToast()

const voyageStore = useVoyageStore()
const { voyages } = storeToRefs(voyageStore)

const voyageId = ref()

const todayDate = ref()

onMounted(() => {
  voyageInstance.value = getDxGridInstance(voyageGrid)
  // getAllVoyageByImoNumber()c

  let today = new Date()
  todayDate.value = convertDateType(today)
})

const clickVoyage = (e) => {
  console.log(e)
  const isExpanded = e.component.isRowExpanded(e.key)

  if (isExpanded) {
    e.component.collapseRow(e.key)
  } else {
    e.component.collapseAll(-1);
    e.component.expandRow(e.key);
  }
}


watch(startDate, () => {

  if (startDate.value) {
    endDateStatus.value = false;
  } else {
    endDateStatus.value = true;
  }
})

const getAllVoyageByImoNumber = async (imoNumber) => {
  await voyageStore.fetchAllVoyageByImoNumber(imoNumber)
}

emitter.on('selectShipOnDetailPage', getAllVoyageByImoNumber)
const openVoyagePopup = () => {
  isShow.value = true;
}

const addVoyage = async (newVoyageData) => {
  const { startPort, endPort, startTime, endTime } = newVoyageData;
  newVoyageData.imoNumber = '9876544'

  if (!startPort || !endPort) {
    showResMsg('출발지 또는 목적지는 필수 입력 항목입니다')
    return;
  }

  if (startPort == endPort) {
    showResMsg('출발지와 목적지가 같습니다')
    return;
  }

  if (!isValidDateRange(startTime, endTime)) {
    showResMsg('도착시각이 출발시각보다 빠릅니다')
    return;
  }

  const response = await insertVoyage(newVoyageData)

  if (response.status == 201) {
    isShow.value = false;
    getAllVoyageByImoNumber()
    showResMsg('항차 정보가 등록되었습니다')
  }
}

const editVoyage = async (voyageEditForm) => {
  const { startPort, endPort, startTime, endTime } = voyageEditForm;

  if (!startPort || !endPort) {
    showResMsg('출발지 또는 목적지는 필수 입력 항목입니다')
    return;
  }

  if (startPort == endPort) {
    showResMsg('출발지와 목적지가 같습니다')
    return;
  }

  if (!isValidDateRange(startTime, endTime)) {
    showResMsg('도착시각이 출발시각보다 빠릅니다')
    return;
  }

  const response = await updateVoyage(voyageEditForm)

  if (response.status == 201) {
    isShowEditForm.value = false;
    getAllVoyageByImoNumber()
    showResMsg('해당 항차 정보가 수정되었습니다')
  }
}


const openEditPopup = (id) => {
  voyageId.value = id;
  isShowEditForm.value = true;
}

const exportPdf = (id) => {

}

const filterShipCondition = () => {
  console.dir(voyageInstance.value)
  let condition = shipCondition.value
  if (condition == 'all') {
    voyageInstance.value.clearFilter();
  } else {
    voyageInstance.value.filter(['condition', '=', condition])
  }
}

const filterDate = () => {
  if (!startDate.value || !endDate.value) {
    voyageInstance.value.clearFilter()
    return;
  }
  if (!isValidDateRange(startDate.value, endDate.value)) {
    showResMsg('도착시각이 출발시각보다 빠릅니다')
    return;
  }

  let addedEndDate = addDay(endDate.value, 1);
  addedEndDate = convertDateType(addedEndDate)

  voyageInstance.value.filter(['startTime', '>=', startDate.value], "and", ['startTime', '<=', addedEndDate])
}

watch(shipCondition, filterShipCondition)
</script>

<style scoped>
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

#voyageGrid tr.dx-row.dx-data-row>td {
  height: 45px;
}

.report-container {
  height: calc(100vh - 65px - 32px);
}

#voyageGrid {
  height: calc(100% - 60px);
}
</style>