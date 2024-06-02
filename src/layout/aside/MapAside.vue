<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    @click="rail = false"
    style="background: #1f1e1e"
  >
    <v-list density="compact">
      <v-list-item v-if="rail" :prepend-avatar="rail ? getLogoImage : getLogoImage"> </v-list-item>
      <v-list-item class="d-flex justify-center" v-else
        ><v-img :src="getLogoImage" width="150" height="50" cover></v-img>
      </v-list-item>

      <v-list-item v-if="!rail" class="pa-0">
        <v-sheet class="mt-5 pa-4" color="#1f1e1e">
          <i-input
            id="searchBox"
            v-model="searchShip"
            prepend-inner-icon="mdi-magnify"
            single-line
            hide-details
            @input="searchByShip"
            style="width: 220px"
            placeholder="선박명을 입력해주세요"
          ></i-input>

          <DxTreeList
            id="fleetsGrid"
            ref="fleetsGrid"
            :data-source="initFleetsAndShip"
            key-expr="id"
            parent-id-expr="parentId"
            :selected-row-keys="selectedRowKeys"
            :autoExpandAll="true"
            @row-click="selectShip"
            :on-selection-changed="checkShip"
            class="noStripe map-ship-selector mt-4"
            style="background-color: #1f1e1e; height: 100vh; max-height: calc(100vh - 250px)"
          >
            <DxSelection
              mode="multiple"
              :recursive="true"
              show-check-boxes-mode="always"
            ></DxSelection>
            <DxColumn
              data-field="displayName"
              cell-template="status-template"
              caption="Select all"
            />
            <DxColumn data-field="shipStatus" caption="Status" :visible="false" />
            <template #status-template="{ data: templateOptions }">
              <div class="ship-container d-flex">
                <div
                  class="mr-4 ship-name ellipsis"
                  :class="getSelectShipClass(templateOptions.data)"
                  :title="templateOptions.data.displayName"
                  :data-tooltip="templateOptions.data.displayName"
                >
                  {{ templateOptions.data.displayName }}
                </div>
                <div
                  class="ship-alarm-type"
                  v-if="
                    templateOptions.data.parentId != 0 &&
                    templateOptions.data.shipStatus != '' &&
                    templateOptions.data.shipStatus != null
                  "
                  :class="getStatus(templateOptions.data.shipStatus)"
                >
                  ●
                </div>
              </div>
            </template>
          </DxTreeList>
        </v-sheet>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-divider></v-divider>
      <div class="d-flex">
        <v-btn variant="text" icon="mdi-chevron-double-left" @click.stop="rail = !rail"></v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/authStore'
import { useAccessMenuStore } from '@/stores/accessMenuStore'
import { useVoccStore } from '@/stores/voccStore'
import { useShipStore } from '@/stores/shipStore'

import { getVoccListAll, fetchShipCondition } from '@/api/voccApi'
import { getShipInfo } from '@/api/shipApi'

import { getDxGridInstance } from '@/composables/dxGridUtil'
import emitter from '@/composables/eventbus.js'
import { fetchMachineData, isStatusOk } from '@/composables/util'

import uipaLogoImgKr from '@/assets/images/uipa_logo_kr.png'
import { changeShipByImoNumber } from '@/api/worldMap'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const voccStore = useVoccStore()
const { voccInfo, fleetsAndShip } = storeToRefs(voccStore)
const shipStore = useShipStore()
const { checkedShips, curSelectedShip } = storeToRefs(shipStore)

/**
 * 사이드바 접힘 여부 관련 변수
 */
const drawer = ref(true)
const rail = ref(false)

const voccs = ref('')
const userRole = ref()
const initFleetsAndShip = ref([])

// DevExtreme 관련 속성
const voccsGrid = ref(null)
let voccsInstance = ''
const fleetsGrid = ref(null)
let fleetsInstance = ''
const selectedRowKeys = ref([])

let treeSelectMode = 'leavesOnly'

// 알람 상태 조회 주기
const SECOND_IN_ONE_MINUTE = 1000 * 60
let interval = null

onMounted(async () => {
  userRole.value = userInfo.value.role

  if (userRole.value != 'ROLE_LCC_ADMIN') {
    await fetchVocc()
  } else {
    await fetchVoccAll()
  }

  fetchFleetAndShipByVocc()
  fleetsInstance = getDxGridInstance(fleetsGrid)

  if (checkedShips.value.length != 0) {
    selectedRowKeys.value = checkedShips.value.map((ship) => ship.id)
  }
  interval = setInterval(fetchShipAlarm, SECOND_IN_ONE_MINUTE)
})

onUnmounted(() => {
  clearInterval(interval)
})

const fetchShipAlarm = async () => {
  const imoNumberList = fleetsAndShip.value
    .filter((ship) => ship.imoNumber != '')
    .map((result) => result.imoNumber)
  const result = await fetchShipCondition(imoNumberList)
  fleetsAndShip.value.forEach((item) => {
    if (result.hasOwnProperty(item.imoNumber)) {
      item.shipStatus = result[item.imoNumber]
    }
  })
}

const fetchVoccAll = async () => {
  const result = await voccStore.fetchVoccs()
  voccs.value = result
}

const fetchVocc = async () => {
  if (!voccInfo) {
    await voccStore.fetchVocc()
  }
  const { id, name } = voccInfo.value
  voccs.value = [{ id, name }]
}

const fetchFleetAndShipByVocc = async () => {
  let voccids = voccs.value.map((vocc) => vocc.id).toString()

  const voccIdString = voccids.toString()
  const result = await voccStore.fetchFleetAndShipByVocc(voccIdString)

  initFleetsAndShip.value = [...fleetsAndShip.value]
}

const getStatus = (status) => {
  let colorClass = ''
  switch (status) {
    case 'NORMAL':
      colorClass = 'normal'
      break
    case 'WARNING':
      colorClass = 'warning'
      break
    case 'DANGER':
      colorClass = 'danager'
      break
    case 'BLANK':
      colorClass = 'normal'
      break
  }

  return colorClass
}

const getLogoImage = computed(() => {
  let logoImage = ''
  if (voccInfo.value.logoImage) {
    logoImage = `data:image/png;base64,${voccInfo.value.logoImage}`
  }
  return voccInfo.value.logoImage ? logoImage : uipaLogoImgKr
})

const selectShip = async (e) => {
  console.dir(e)
  let selectedShipImoNumber = e.data.imoNumber

  if (selectedShipImoNumber) {
    const {
      status,
      data: { data }
    } = await getShipInfo(selectedShipImoNumber)
    if (isStatusOk(status)) {
      let uuid = userInfo.value.uuid
      changeShipByImoNumber(uuid, selectedShipImoNumber)
      curSelectedShip.value = { ...data }
      await fetchMachineData(data.imoNumber)
      await shipStore.fetchUsedFuels()
    }
  }
}

let selectedImonumbers = []
const checkShip = async () => {
  const selectedShips = fleetsInstance.getSelectedRowsData(treeSelectMode)

  console.dir(selectedShips)

  selectedImonumbers = getImoNumbers(selectedShips)

  checkedShips.value = [...selectedImonumbers]
  selectedRowKeys.value = checkedShips.value.map((ship) => ship.id)
}

const getImoNumbers = (selectedShips) => {
  const imoNumbers = selectedShips
    .filter((ship) => ship.imoNumber != null && ship.imoNumber != '')
    .map((ship) => {
      return { id: ship.id, imoNumber: ship.imoNumber }
    })
  return imoNumbers
}

const getSelectShipClass = (data) => {
  let className = ''
  let selectedShipImoNumber = data.imoNumber
  let voccName = data.voccName
  let displayName = data.displayName
  let curSelectedImoNumber = curSelectedShip.value.imoNumber
  if (selectedShipImoNumber == curSelectedImoNumber) {
    className = 'active'
  }

  if (voccName == displayName) {
    className += 'voccName'
  }

  return className
}

const searchShip = ref('')
const searchByShip = () => {
  fleetsInstance.searchByText(searchShip.value)
}
</script>

<style scoped>
.sidemenu:hover,
.sidemenu:active,
.sidemenu.v-list-item--active {
  border-left: 5px solid #4e83ff;
}

.voccSelection .dx-data-row:nth-child(odd) {
  background: #29292d !important;
}

.voccSelection .dx-data-row:nth-child(even) {
  background: #29292d !important;
}

.ship-alarm-type.normal {
  color: #5789fe;
}

.ship-alarm-type.warning {
  color: #f7c63a;
}

.ship-alarm-type.blank {
  color: #909cb4;
}

.ship-alarm-type.danger {
  color: #ff0045;
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
}

/* TOOLTIP */
.ship-container {
  position: relative;
}

#fleetsGrid {
}

.ellipsis.ship-name {
  cursor: pointer;
  font-size: 0.8rem;
  color: #9c9c9c;
  display: flex;
  align-self: center;
}

.ship-name.active {
  background: #5789fe;
  border-radius: 5px;
  padding: 2px;
  font-size: 0.9rem;
  color: #fff;
}

.ship-name.voccName {
  color: #3ea15d;
}

.map-ship-selector .dx-treelist .dx-row > td {
  padding: 4px 7px;
}

/* .ship-name[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 99;
  background: red;
  padding: 5px;
  border-radius: 5px;
} */
</style>
