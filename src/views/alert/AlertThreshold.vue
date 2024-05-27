<template>
  <v-sheet class="detail-page h-100">
    <v-sheet class="rounded-lg px-6 my-6" color="#333334">
      <div class="d-flex ga-3 py-4 justify-end">
        <div class="alarm-type"><span class="caution mr-2">●</span>Caution</div>
        <div class="alarm-type"><span class="warning mr-2">●</span>Warning</div>
      </div>
    </v-sheet>
    <v-sheet class="my-4 px-6 py-6 rounded-lg h-100" color="#333334">
      <div class="d-flex justify-end align-center mb-6 ga-2">
        <v-sheet class="desc-search-area">
          <i-input
            id="searchBox"
            v-model="searchDescription"
            prepend-inner-icon="mdi-magnify"
            single-line
            hide-details
            @input="searchByDescription"
            placeholder="Description을 입력해주세요"
          ></i-input>
        </v-sheet>

        <i-btn
          text="저장"
          color="#3D3D40"
          prepend-icon="mdi-content-save"
          @click="updateAlertThreshold"
        ></i-btn>
        <!-- <i-btn text="추가" color="#3D3D40" prepend-icon="mdi-plus" @click="addThreshold"></i-btn>
        <i-btn
          text="삭제"
          color="#F04A4A"
          prepend-icon="mdi-trash-can"
          @click="showDeleteModal"
        ></i-btn> -->
      </div>

      <DxDataGrid
        id="alertThresholdGrid"
        ref="alertThresholdGrid"
        :data-source="alertThresholds"
        key-expr="id"
        :column-auto-width="true"
        :show-borders="true"
        :selected-row-keys="selectedRowKeys"
        @row-updating="editingRow"
        @row-updated="editRow"
        class="alarm-threshold-container no-stripe"
      >
        <DxSelection mode="multiple" show-check-boxes-mode="always"></DxSelection>
        <DxEditing mode="cell" :allow-editin="true" />

        <DxColumn
          data-field="id"
          caption="No"
          alignment="center"
          :visible="false"
          :allow-editing="false"
          width="5%"
        >
        </DxColumn>
        <DxColumn data-field="description" caption="Description" width="20%" :allow-editing="false">
        </DxColumn>
        <DxColumn
          data-field="equipNo"
          caption="Equip No"
          alignment="center"
          :allow-editing="false"
        ></DxColumn>
        <DxColumn
          data-field="tagId"
          caption="Tag ID"
          alignment="center"
          :allow-editing="false"
        ></DxColumn>
        <DxColumn
          data-field="dataType"
          caption="Data Type"
          alignment="center"
          :allow-editing="false"
          width="10%"
        ></DxColumn>
        <DxColumn
          data-field="use"
          caption="Use"
          alignment="center"
          :allow-editing="true"
        ></DxColumn>
        <!-- Warning (On/Off) -->
        <DxColumn
          data-field="warningOnOff"
          caption="Caution"
          :visible="true"
          alignment="center"
          :allow-editing="true"
          header-cell-template="wariningOnOff-header"
          width="10%"
        >
        </DxColumn>
        <template #wariningOnOff-header="{ data }">
          <div class="d-flex align-center ga-2">
            <div class="danger">●</div>
            <div>
              Warning <br />
              (On/Off)
            </div>
          </div>
        </template>
        <!-- Low(Caution, Warning) -->
        <DxColumn caption="Low" alignment="center" :allow-editing="false">
          <DxColumn
            data-field="lowCaution"
            caption="Caution"
            :visible="true"
            alignment="center"
            :allow-editing="true"
            header-cell-template="cautionlow-header"
            cell-template="cautionlow-template"
            width="10%"
          />

          <DxColumn
            data-field="lowWarning"
            caption="Caution"
            :visible="true"
            alignment="center"
            :allow-editing="true"
            header-cell-template="warninglow-header"
            cell-template="warninglow-template"
            width="10%"
          >
          </DxColumn>
        </DxColumn>

        <template #cautionlow-header="{ data }">
          <div class="d-flex align-center ga-2">
            <div class="caution">●</div>
            <div>Caution</div>
          </div>
        </template>
        <template #cautionlow-template="{ data: templateOptions }">
          <div v-if="templateOptions.data.lowCaution">{{ templateOptions.data.lowCaution }}</div>
          <div v-else>-</div>
        </template>

        <template #warninglow-header="{ data }">
          <div class="d-flex align-center ga-2">
            <div class="warning">●</div>
            <div>Warning</div>
          </div>
        </template>

        <template #warninglow-template="{ data: templateOptions }">
          <div v-if="templateOptions.data.lowWarning">{{ templateOptions.data.lowWarning }}</div>
          <div v-else>-</div>
        </template>

        <!-- High(Caution, Warning) -->

        <DxColumn caption="High" alignment="center" :allow-editing="false">
          <DxColumn
            data-field="highCaution"
            caption="Caution"
            :visible="true"
            alignment="center"
            :allow-editing="true"
            header-cell-template="highCaution-header"
            cell-template="highCaution-template"
            width="10%"
          >
          </DxColumn>

          <DxColumn
            data-field="highWarning"
            caption="Caution"
            :visible="true"
            alignment="center"
            :allow-editing="true"
            header-cell-template="highWarning-header"
            cell-template="highWarning-template"
            width="10%"
          >
          </DxColumn>
        </DxColumn>

        <template #highCaution-header="{ data }">
          <div class="d-flex align-center ga-2">
            <div class="caution">●</div>
            <div>Caution</div>
          </div>
        </template>
        <template #highCaution-template="{ data: templateOptions }">
          <div v-if="templateOptions.data.highCaution">{{ templateOptions.data.highCaution }}</div>
          <div v-else>-</div>
        </template>
        <!-- Warning (High High) -->

        <template #highWarning-header="{ data }">
          <div class="d-flex align-center ga-2">
            <div class="warning">●</div>
            <div>Warning</div>
          </div>
        </template>

        <template #highWarning-template="{ data: templateOptions }">
          <div v-if="templateOptions.data.highWarning">{{ templateOptions.data.highWarning }}</div>
          <div v-else>-</div>
        </template>

        <DxScrolling mode="virtual" />
      </DxDataGrid>

      <AlertThresholdForm v-model="isShow" @closePopup="isShow = false" />
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { getAlertThresold, updateAlertThresod } from '@/api/alarmApi'

import _ from 'lodash'

import alertThreshold from '@/assets/mockup/alertThreshold.json'
import AlertThresholdForm from '@/views/alert/AlertThresholdForm.vue'
// import DataTileSource from 'ol/source/DataTile'
const shipStore = useShipStore()
const { selectedShip } = storeToRefs(shipStore)

const alertThresholdGrid = ref(null)
const alertThresholdInstance = ref()
const alertThresholds = ref()

const isShow = ref(false)
const selectedRowKeys = ref([])
import { useToast } from '@/composables/useToast'
const { showResMsg } = useToast()

let originAlertThreshold = []
onMounted(() => {
  fetchAlertThreshold()
  alertThresholdInstance.value = alertThresholdGrid.value.instance
})

const fetchAlertThreshold = async () => {
  let imoNumber = selectedShip.value
  const {
    status,
    data: { data }
  } = await getAlertThresold(imoNumber)

  if (parseInt(status / 100) == 2) {
    alertThresholds.value = data
    originAlertThreshold = [...data]
  }
}

const addThreshold = () => {
  isShow.value = true
}

const updateAlertThreshold = async () => {
  console.dir(alertThresholdGrid.value.instance.getSelectedRowsData)
  let selectedRows = alertThresholdGrid.value.instance.getSelectedRowsData()
  let updatedData = _.cloneDeep(selectedRows)

  updatedData.forEach((data) => {
    data.imoNumber = selectedShip.value
    delete data.id
    delete data.description
    delete data.equipNo
    delete data.dataType
  })

  const { status } = await updateAlertThresod(updatedData)

  if (status == 200 || status == 204) {
    fetchAlertThreshold()
    showResMsg('THRESHOLD 정보가 업데이트 되었습니다')
  }
  console.log('선택한 Row')
  console.dir(updatedData)
}

// const editRow = (e) => {
//   const index = selectedRowKeys.value.findIndex((row) => row == e.key)

//   console.dir(e)

//   if (index != -1) {
//     selectedRowKeys.value[index] = { ...e.key }
//   } else {
//     selectedRowKeys.value.push(e.key)
//     alertThresholdInstance.value.selectRows(e.data.id, true)
//   }
// }

const editingRow = (e) => {
  console.dir(e)

  let rowKey = e.key
  let updateCellKey = Object.keys(e.newData)
  let updateCell = e.newData.key

  console.log('수정 전')
  console.dir(alertThresholdGrid.value)
  console.dir(alertThresholdInstance.value)

  if (updateCellKey == 'lowCaution' || updateCellKey == 'lowWarning') {
    if (e.oldData.highCaution || e.oldData.highWarning) {
      alertThresholdGrid.value.dataSource[rowKey][updateCellKey] =
        originAlertThreshold[rowKey][updateCellKey]

      alertThresholdInstance.value.editCell(rowKey, originAlertThreshold[rowKey][updateCellKey])
      showResMsg('High Caution 또는 High Warning이 빈 값이어야 합니다')
      return
    }
  } else if (updateCellKey == 'highCaution' || updateCellKey == 'highWarning') {
    if (e.oldData.lowCaution || e.oldData.lowWarning) {
      alertThresholdGrid.value.dataSource[rowKey][updateCellKey] =
        originAlertThreshold[rowKey][updateCellKey]
      alertThresholdInstance.value.editCell(rowKey, originAlertThreshold[rowKey][updateCellKey])

      showResMsg('Low Caution 또는 Low Warning이 빈 값이어야 합니다')
      return
    }
  }

  const index = selectedRowKeys.value.findIndex((row) => row == e.key)

  console.dir(e)

  if (index != -1) {
    selectedRowKeys.value[index] = { ...e.key }
  } else {
    selectedRowKeys.value.push(e.key)
    alertThresholdInstance.value.selectRows(e.key, true)
  }
  console.log(updateCell)
}

const searchDescription = ref('')
const searchByDescription = () => {
  alertThresholdInstance.value.searchByText(searchDescription.value)
}
watch(selectedShip, fetchAlertThreshold)
</script>

<style scoped>
.alarm-type {
  font-size: 0.8rem;
}

div#alertThresholdGrid td#dx-col-37 {
  text-align: center !important;
}

.desc-search-area {
  width: 15%;
}
</style>
