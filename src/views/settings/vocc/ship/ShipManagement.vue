<template>
  <v-container fluid class="pa-0 h-100">
    <v-row class="h-100">
      <v-col cols="6">
        <v-card class="mt-4 h-100" rounded="30">
          <v-card-title>
            <div class="d-flex justify-space-between">
              <div class="align-center">선박명</div>
              <div v-if="role != 'ROLE_VOCC_USER'">
                <i-btn text="새 선박 등록" @click="changeComponent('ShipInfoRegisterForm')" color="#3D3D40"
                  prepend-icon="mdi-plus" width="120"></i-btn>
                <i-btn @click="showConfirmModal('정말로 선택한 선박을 삭제 하시겠습니까?')" class="ml-2" text="삭제" color="#F04A4A"
                  prepend-icon="mdi-trash-can" width="80"></i-btn>
              </div>
            </div>
          </v-card-title>

          <v-card-text>
            <DxDataGrid ref="shipGrid" :data-source="ships" key-expr="imoNumber" class="tab-container"
              :active-state-enabled="activeStatus" :focused-row-enabled="activeStatus"
              :on-focused-cell-changed="selectShip" @refresh-grid="refreshGrid">
              <DxScrolling column-rendering-mode="virtual" />
              <DxColumn data-field="imoNumber" caption="imoNumber" :visible="false" class="pl-10"
                :allow-editing="false"></DxColumn>
              <DxColumn data-field="name" caption="선박명" :allow-editing="false" cell-template="shipName-template">
              </DxColumn>
              <template #shipName-template="{ data : templateOptions }">
                <div class="d-flex justify-space-between align-center">
                  <div>{{ templateOptions.data.name }}</div>
                  <i-btn text="이미지 변경" @click="changeComponent('ShipImageEditForm')"></i-btn>
                </div>
              </template>
            </DxDataGrid>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card class="mt-4 h-100" rounded="30">
          <v-card-title>
            <div>선박정보</div>
          </v-card-title>
          <v-card-text>
            <component :is="componentList[currentComponent]" :shipImoNumber="shipImoNumber"
              style="background-color: #1F1E1E;" @change-component="changeComponent"></component>
            <!-- <ShipInfoEditForm :shipImoNumber="shipImoNumber" ></ShipInfoEditForm> -->

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <AppModal v-model="showModal" @close="closeConfirmModal">
    <template #default>
      {{ modalMessage }}
    </template>

    <template #actions>
      <div v-if="shipImoNumber">
        <i-btnGroup type="delete" @close="closeConfirmModal" @delete="removeShip"></i-btnGroup>
      </div>
    </template>
  </AppModal>
</template>

<script setup>
import { ref, onMounted, computed, provide } from 'vue'

import ColTwoLayout from '@/layout/ColTwoLayout.vue'
import NoSelectShip from '@/components/NoSelectShip.vue'
import ShipInfoEditForm from '@/views/settings/vocc/ship/form/ShipInfoEditForm.vue'
import ShipInfoRegisterForm from '@/views/settings/vocc/ship/form/ShipInfoRegisterForm.vue'
import ShipImageEditForm from '@/views/settings/vocc/ship/form/ShipImageEditForm.vue'
import AppModal from '@/components/modal/AppModal.vue'

import { useShipStore } from '@/stores/shipStore'
import { storeToRefs } from 'pinia'

import { getDxGridInstance, dxGridRefresh } from '@/composables/dxGridUtil'

import { useToast } from '@/composables/useToast'
const { showResMsg } = useToast()

const colType = ref(1)
const shipsByVocc = ref('')
const shipStore = useShipStore()
const { ships } = storeToRefs(shipStore)
const shipImoNumber = ref("")

const shipGrid = ref()
provide("shipGrid", shipGrid)

let role;
/**
 * 선박 목록 조회
 */
onMounted(() => {
  fetchVoccShips()
  role = sessionStorage.getItem('userRole')
})



const fetchVoccShips = async () => {
  await shipStore.fetchShipsByVocc()
  shipsByVocc.value = [...ships.value]
  console.dir(shipsByVocc)
}

/**
 * 선박 상세 조회
 */
const activeStatus = ref(true)
const selectShip = async (e) => {
  // 선택한 선박의 IMO 번호
  const cellKey = e['row']['key'];
  shipImoNumber.value = cellKey
  changeComponent('ShipInfoEditForm')
}

/**
 * 동적 컴포넌트 변경 
 * 버튼에 따라 등록 폼, 수정 폼 변경
 */
const currentComponent = ref('NoSelectShip')
const componentList = {
  NoSelectShip,
  ShipInfoEditForm,
  ShipInfoRegisterForm,
  ShipImageEditForm
}

const changeComponent = (name) => {
  const instance = getDxGridInstance(shipGrid)

  currentComponent.value = name;
  if (name != 'ShipInfoEditForm') {
    instance.clearSelection();
  }
}


/**
 * 선박 삭제 확인 팝업창
 */
const showModal = ref(false)
const modalMessage = ref('')
const showConfirmModal = (message) => {
  if (!shipImoNumber.value) {
    modalMessage.value = '선박을 선택해주세요';
  } else {
    modalMessage.value = message;
  }
  showModal.value = true;
}
const closeConfirmModal = () => {
  showModal.value = false;
}


/**
 * 선박 삭제 
 */
const removeShip = async () => {
  const instance = getDxGridInstance(shipGrid)
  const result = await shipStore.removeShip(shipImoNumber.value)
  if(result == 200)
  setTimeout(() => {
      showModal.value = false;
      refreshGrid()
      instance.option('focusedRowKey', null)
      changeComponent('NoSelectShip')
  }, 500)
}

const refreshGrid = () => {
  console.log('새로 고침')
  dxGridRefresh(shipGrid)
}

</script>

<style scoped>
 @media (max-height : 825px){
  .tab-container {
    height: 724px;
    max-height: 724px;
    overflow-y: auto ;
  }
}


</style>