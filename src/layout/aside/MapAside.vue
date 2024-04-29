<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false" class="bg-aside">
    <v-list density="compact">
      <v-list-item v-if="rail" :prepend-avatar="rail ? getLogoImage : getLogoImage"> </v-list-item>
      <v-list-item class="d-flex justify-center" v-else><v-img :src="getLogoImage" width="150" height="50"
          cover></v-img>
      </v-list-item>

      <!-- <v-list-item v-if="!rail" class="mt-4 pa-0">
        <v-sheet class="pa-5" color="#29292D">
          <i-input id="searchBox" v-model="searchVocc" prepend-inner-icon="mdi-magnify" single-line hide-details
            @input="searchByVocc" style="width:220px" placeholder="선사명을 입력해주세요"></i-input>

          <DxDataGrid ref="voccsGrid" class="noStripe mt-4" :data-source="voccs" key-expr="id" height="180"
            :show-column-lines="false" :on-selection-changed="selectVocc">
            <DxColumn data-field="id" caption="id" :visible="false" />
            <DxColumn data-field="name" caption="Select All" :allow-editing="false" />

            <DxSelection mode="multiple" show-check-boxes-mode="always" />
            <DxScrolling mode="virtual" />/
          </DxDataGrid>
        </v-sheet>

      </v-list-item> -->
      <v-list-item v-if="!rail" class="pa-0">
        <v-sheet class="mt-5 pa-4" color="#29292D">
          <i-input id="searchBox" v-model="searchShip" prepend-inner-icon="mdi-magnify" single-line hide-details
            @input="searchByShip" style="width:220px" placeholder="선박명을 입력해주세요"></i-input>

          <DxTreeList id="menus" ref="fleetsGrid" :data-source="initFleetsAndShip" key-expr="id"
            parent-id-expr="parentId" :selected-row-keys="selectedRowKeys" :autoExpandAll="true"
            :on-selection-changed="selectShip" height="360" class="noStripe mt-4">
            <DxSelection mode="multiple" :recursive="true" show-check-boxes-mode="always"></DxSelection>
            <DxColumn data-field="displayName" cell-template="status-template" caption="Select all" />
            <DxColumn data-field="shipStatus" caption="Status" :visible="false" />
            <template #status-template="{ data: templateOptions }">
              <div class="d-flex">
                <div class="mr-4 ellipsis" :title="templateOptions.data.displayName">{{
                  templateOptions.data.displayName }}</div>
                <div v-if="templateOptions.data.parentId != 0
                            && templateOptions.data.shipStatus != '' 
                            && templateOptions.data.shipStatus != null"
                  :class="getStatus(templateOptions.data.shipStatus)">●</div>
              </div>
            </template>
          </DxTreeList>
        </v-sheet>

      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-divider></v-divider>
      <div class=" d-flex">
        <v-btn variant="text" icon="mdi-chevron-double-left" @click.stop="rail = !rail"></v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useAccessMenuStore } from '@/stores/accessMenuStore'
import { storeToRefs } from 'pinia'
import { useVoccStore } from '@/stores/voccStore'
import { getVoccListAll, fetchShipCondition } from '@/api/voccApi'
import { getDxGridInstance } from '@/composables/dxGridUtil'
import emitter from '@/composables/eventbus.js'

import uipaLogoImgKr from '@/assets/images/uipa_logo_kr.png'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const { accessMenus } = useAccessMenuStore()
const voccStore = useVoccStore()
const { voccInfo, fleetsAndShip } = storeToRefs(voccStore)

const drawer = ref(true)
const rail = ref(false)

const voccs = ref('')
const userRole = ref()
const initFleetsAndShip = ref([])

// DevExtreme 관련 속성
const voccsGrid = ref(null)
const fleetsGrid = ref(null)
const selectedRowKeys = ref()
let voccsInstance = '';
let fleetsInstance = '';

let treeSelectMode = 'leavesOnly'


const SECOND_IN_ONE_MINUTE = 1000 * 15
let interval = null


let role = ''
onMounted(async () => {
  userRole.value = userInfo.value.role

  if (userRole.value != 'ROLE_LCC_ADMIN') {
    await fetchVocc()
  } else {
    await fetchVoccAll()
  }

  fetchFleetAndShipByVocc()
  // voccsInstance = getDxGridInstance(voccsGrid)
  fleetsInstance = getDxGridInstance(fleetsGrid)

  interval = setInterval(fetchShipAlarm, SECOND_IN_ONE_MINUTE)

})

onUnmounted(() => {
  clearInterval(interval)
})

const fetchShipAlarm = async () => {
  const imoNumberList = fleetsAndShip.value.filter(ship => ship.imoNumber != "")
                                            .map(result => result.imoNumber)
  const result = await fetchShipCondition(imoNumberList)
  fleetsAndShip.value.forEach(item => {
    if (result.hasOwnProperty(item.imoNumber)) {
      item.shipStatus = result[item.imoNumber];
    }
  });
}

const fetchVoccAll = async () => {
  const result = await voccStore.fetchVoccListAll();
  voccs.value = result;
}

const fetchVocc = async () => {
  if (!voccInfo) {
    await voccStore.fetchVocc()
  }
  const { id, name } = voccInfo.value
  voccs.value = [{ id, name }]
}

const selectVocc = (e) => {
  let selectedVoccIds = e.selectedRowKeys;
  // api 요청
  fetchFleetAndShipByVocc(selectedVoccIds)
  // 결과값을 변환
}

const fetchFleetAndShipByVocc = async () => {
  // api 요청
  let voccids = voccs.value.map(vocc => vocc.id).toString();

  const test = voccids.toString()
  const result = await voccStore.fetchFleetAndShipByVocc(test)
  // 결과값 반환

  initFleetsAndShip.value = [...fleetsAndShip.value]
}

const getStatus = (status) => {
  let colorClass = ''
  switch (status) {
    case 'NORMAL':
      colorClass = 'blue'
      break;
    case 'WARNING':
      colorClass = 'orange'
      break;
    case 'DANGER':
      colorClass = 'red'
      break;
    case 'BLANK':
      colorClass = 'blue'
      break;
  }

  return colorClass;
}


const getLogoImage = computed(()=>{
  let logoImage = ''
  if(voccInfo.value.logoImage){
    logoImage = `data:image/png;base64,${voccInfo.value.logoImage}`
  }
  return voccInfo.value.logoImage ? logoImage : uipaLogoImgKr
})


const searchVocc = ref('')
const searchByVocc = () => {
  voccsInstance.searchByText(searchVocc.value);
}

let selectedImonumbers = []
const selectShip = () => {
  const selectedShips = fleetsInstance.getSelectedRowsData(treeSelectMode);

  selectedImonumbers = getImoNumbers(selectedShips)

  emitter.emit('selectedShip', selectedImonumbers)
}

const getImoNumbers = (selectedShips) => {
  const imoNumbers = selectedShips.filter(ship => ship.imoNumber != null && ship.imoNumber != '')
                                  .map(ship => ship.imoNumber);
  return imoNumbers;
}


const searchShip = ref('')
const searchByShip =  () => {
  fleetsInstance.searchByText(searchShip.value)
}

const test = (e) => {
  console.dir(e)
  if(e.data.imoNumber){
    emitter.emit('clickShipName', e.data.imoNumber)
  }
}

</script>

<style scoped>
.sidemenu:hover,
.sidemenu:active,
.sidemenu.v-list-item--active {
  border-left: 5px solid #4e83ff;
}

.voccSelection .dx-data-row:nth-child(odd){
  background : #29292D !important;
}

.voccSelection .dx-data-row:nth-child(even){
  background: #29292D !important;
}

.blue {
  color: #5789FE;
}

.orange {
  color: #F7C63A
}


.gray {
  color: #909CB4;
}

.red {
  color: #FF0045
}

.ellipsis{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width : 100px
}

</style>
