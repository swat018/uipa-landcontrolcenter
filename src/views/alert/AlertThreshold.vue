<template>
  <v-sheet class="detail-page h-100">
    <v-sheet class="rounded-lg px-6 my-6" color="#333334">
      <div class="d-flex ga-3 py-4 justify-end">
        <div class="alarm-type"><span class="warning mr-2">●</span>Caution</div>
        <div class="alarm-type"><span class="danger mr-2">●</span>Warning</div>
      </div>
    </v-sheet>
    <v-sheet class="my-4 px-6 py-6 rounded-lg h-100" color="#333334">
      <div class="d-flex justify-end align-center mb-6 ga-2">
        <i-btn text="저장" color="#3D3D40" prepend-icon="mdi-content-save" @click="saveTags"></i-btn>
        <i-btn text="추가" color="#3D3D40" prepend-icon="mdi-plus" @click="addThreshold"></i-btn>
        <i-btn text="삭제" color="#F04A4A" prepend-icon="mdi-trash-can" @click="showDeleteModal"></i-btn>
      </div>

      <DxDataGrid id="alertThresholdGrid" ref="realAlarmGrid" class="alarm-buttons-container" :column-auto-width="true"
        key-expr="id" @row-click="clickAlarm" :data-source="alertThreshold">
        <DxSelection mode="single"></DxSelection>
        <DxScrolling column-rendering-mode="virtual" />
        <DxColumn data-field="id" caption="No" alignment="center" :visible="false" :allow-editing="false" width="5%">
        </DxColumn>
        <DxColumn data-field="description" caption="Description" width="auto" :allow-editing="false">
        </DxColumn>
        <DxColumn data-field="equipmentNo" caption="Equip No" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="tagId" caption="Tag ID" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="dataType" caption="Data Type" alignment="center" :allow-editing="false"></DxColumn>
        <DxColumn data-field="use" caption="Use" alignment="center" :allow-editing="false"></DxColumn>
        <!-- Warning (On/Off) -->
        <DxColumn data-field="wariningOnOff" caption="Caution" :visible="true" alignment="center" :allow-editing="false"
          header-cell-template="wariningOnOff-header">
        </DxColumn>
        <template #wariningOnOff-header="{ data }">
          <div class="d-flex align-center ga-2">
            <div class="danger">●</div>
            <div>Warning <br> (On/Off)</div>
          </div>
        </template>
        <!-- Low(Caution, Warning) -->
        <DxColumn caption="Low" alignment="center" :allow-editing="false">
          <DxColumn data-field="cautionLow" caption="Caution" :visible="true" alignment="center" :allow-editing="false"
            header-cell-template="cautionlow-header">
          </DxColumn>

          <DxColumn data-field="warningLow" caption="Caution" :visible="true" alignment="center" :allow-editing="false"
            header-cell-template="warninglow-header">
          </DxColumn>
        </DxColumn>

        <template #cautionlow-header="{ data }">
          <div class="d-flex align-center ga-2">
            <div class="warning">●</div>
            <div>Caution</div>
          </div>
        </template>
        <!-- High(Caution, Warning) -->

        <template #warninglow-header=" { data }">
          <div class="d-flex align-center ga-2">
            <div class="danger">●</div>
            <div>Warning</div>
          </div>
        </template>

        <DxColumn caption="High" alignment="center" :allow-editing="false">
          <DxColumn data-field="cautionHigh" caption="Caution" :visible="true" alignment="center" :allow-editing="false"
            header-cell-template="cautionhigh-header">
          </DxColumn>

          <DxColumn data-field="wariningHigh" caption="Caution" :visible="true" alignment="center"
            :allow-editing="false" header-cell-template="warningHigh-header">
          </DxColumn>
        </DxColumn>
        <!-- Caution (High) -->

        <template #cautionhigh-header="{ data }">
          <div class="d-flex align-center ga-2">
            <div class="warning">●</div>
            <div>Caution</div>
          </div>
        </template>
        <!-- Warning (High High) -->

        <template #warningHigh-header="{ data }">
          <div class="d-flex align-center ga-2">
            <div class="danger">●</div>
            <div>Warning </div>
          </div>
        </template>

        <DxScrolling mode="virtual" />
      </DxDataGrid>

      <AlertThresholdForm v-model="isShow" @addVoyage="addVoyage" @closePopup="isShow = false" />
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import alertThreshold from '@/assets/mockup/alertThreshold.json'
import AlertThresholdForm from '@/views/alert/AlertThresholdForm.vue'

const alertThresholdGrid = ref(null)

const isShow = ref(false)

const addThreshold = () => {
  isShow.value = true;
}


</script>

<style scoped>
.normal {
  color: #42D2A7;
  border-color: #42D2A7;
}


.alarm-type {
  font-size: 1rem;
}


div#alertThresholdGrid td#dx-col-14 {
  text-align: center !important;
}
</style>
