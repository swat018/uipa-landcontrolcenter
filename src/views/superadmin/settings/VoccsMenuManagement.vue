<template>
  <v-container fluid class="h-100 management-page detail-page settings">
    <v-row class="ma-0 h-100">
      <v-col cols="6">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div class="d-flex justify-space-between align-center">
              <div>선사별 권한그룹 목록</div>
              <div>
                <i-btn
                  class="bg-btn mr-1"
                  @click="showAddModal"
                  color="#3D3D40"
                  prepend-icon="mdi-plus"
                  text="새그룹추가"
                  width="120"
                ></i-btn>
                <i-btn
                  class="bg-btn ml-1"
                  @click="showDeleteModal"
                  color="#F04A4A"
                  prepend-icon="mdi-trash-can-outline"
                  text="삭제"
                  width="75"
                ></i-btn>
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <!-- 선사 목록 -->
                <DxDataGrid
                  id="voccGrid"
                  class="no-stripe title-container"
                  ref="voccGrid"
                  key-expr="id"
                  :show-borders="true"
                  :data-source="voccs"
                  :active-state-enabled="activeStatus"
                  :focused-row-enabled="activeStatus"
                  :selected-row-keys="selectedVoccId"
                  :on-focused-cell-changed="getUserdAndGroups"
                >
                  <DxScrolling mode="virtual" />
                  <DxSelection mode="single" />
                  <DxColumn data-field="id" :visible="false" class="pl-10"></DxColumn>
                  <DxColumn data-field="name" caption="선사명" :allow-editing="false"></DxColumn>
                </DxDataGrid>
              </v-col>
              <v-col>
                <!-- 권한 그룹 목록 -->
                <DxDataGrid
                  id="groupGrid"
                  class="no-stripe title-container"
                  ref="groupGrid"
                  key-expr="first"
                  :show-borders="true"
                  :data-source="voccGroups"
                  :active-state-enabled="activeStatus"
                  :focused-row-enabled="activeStatus"
                  :selected-row-keys="selectedGroupId"
                  :on-focused-cell-changed="getMenuGroup"
                >
                  <DxScrolling mode="virtual" />
                  <DxSelection mode="single" />
                  <DxColumn
                    data-field="first"
                    caption="groupId"
                    :visible="false"
                    class="pl-10"
                  ></DxColumn>
                  <DxColumn
                    data-field="second"
                    caption="권한그룹명"
                    :allow-editing="false"
                  ></DxColumn>
                </DxDataGrid>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- 메뉴 목록 -->
      <v-col cols="6">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div class="d-flex justify-space-between">
              <div class="align-self-center">메뉴 목록</div>
              <div>
                <i-btn text="저장" @click="saveMenusByGroup" class="bg-btn mr-1"></i-btn>
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <DxTreeList
              id="menus"
              ref="menusGrid"
              class="title-container no-stripe"
              :data-source="initMenus"
              :column-auto-width="true"
              key-expr="menuId"
              parent-id-expr="parentId"
              :selected-row-keys="selectedRowKeys"
              :autoExpandAll="true"
              noDataText="데이터가 없습니다"
              :show-borders="true"
            >
              <DxHeaderFilter :visible="false" />
              <DxScrolling column-rendering-mode="virtual" />
              <DxSelection mode="multiple" :recursive="true"></DxSelection>
              <DxColumn data-field="menuName" caption="메뉴명"></DxColumn>
            </DxTreeList>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!--  그룹 추가 팝업창 -->
  <AppModal v-model="isShowAddModal" @close="closeAddModal" title="새로운 그룹 추가">
    <template #default>
      <i-input
        bgColor="#F1F1F9"
        label="그룹명"
        v-model="newGroupName"
        placehoder="새로운 그룹명을 입력해주세요"
      ></i-input>
    </template>

    <template #actions>
      <i-btnGroup type="add" @close="closeAddModal" @add="registerGroup"></i-btnGroup>
    </template>
  </AppModal>

  <!--  삭제 확인 팝업창 -->
  <AppModal v-model="isShowDeleteModal" @close="closeDeleteModal">
    <template #default>
      <div v-if="selectdGroupId !== ''">
        <p v-if="selectedRowKeys.length != 0">현재 그룹에 할당된 사용자 목록이 있습니다</p>
        <p>정말로 삭제하시겠습니까?</p>
      </div>
      <div v-else>삭제할 그룹을 선택해주세요</div>
    </template>

    <template #actions>
      <i-btnGroup
        v-if="selectdGroupId !== ''"
        type="confirm"
        @close="closeDeleteModal"
        @confirm="removeGroup"
      ></i-btnGroup>
    </template>
  </AppModal>
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { getMenus, getMenusByGroup, saveMenuByGroup } from '@/api/permissionApi.js'
import AppModal from '@/components/modal/AppModal.vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useVoccStore } from '@/stores/voccStore'
import { DxColumn } from 'devextreme-vue/tree-list'
import { dxGridRefresh, getDxGridInstance } from '@/composables/dxGridUtil'
import _ from 'lodash'

const authStore = useAuthStore()
const { users, groups } = storeToRefs(authStore)

const voccStore = useVoccStore()

import { useToast } from '@/composables/useToast'
const { showResMsg } = useToast()

const groupGrid = ref(null)
const userGrid = ref()
const voccGrid = ref()

const initUsers = ref([])

const activeStatus = ref(true)
const voccGroups = ref([])
const voccUsers = ref([])

// 선택한 메뉴 key 배열
const selectedRowKeys = ref([])
const selectedVoccId = ref([])
const selectedGroupId = ref()
const selectedGroupName = ref()
const selectedVoccName = ref()

let oldGroupKeys = []

let instance = null
let voccInstance = null
const menusGrid = ref(null)
const initMenus = ref([])
const menus = ref([])

const selectedGroupKey = ref([])

const isShowAddModal = ref(false)
const isShowDeleteModal = ref(false)

onBeforeMount(() => {
  fetchVoccs()
  getMenus().then((response) => {
    // const { data : { data : allMenu }} = response;
    const allMenu = response.data.data
    const filterMenu = allMenu.filter((menu) => menu.accessRole != 'LCC_ADMIN')
    menus.value = filterMenu
    // ({ data: menus.value = response.data })
  })
  // 그룹 목록 조회
  // if (groups.value.length == 0) {
  //   getUserdAndGroups()
  // }
})

onMounted(() => {
  voccInstance = getDxGridInstance(voccGrid)
  instance = getDxGridInstance(groupGrid)

  console.log('선사 그리드')
  console.dir(voccGrid)
})

const getUserdAndGroups = async (e) => {
  console.log('유저 그룹')
  console.dir(e)

  selectedVoccId.value = e.row.keysaveMenuByGroup
  initUsers.value = []
  const result = await authStore.fetchGroupsByVoccId(e.row.key)

  console.dir(result)
  voccGroups.value = result.userGroupIdAndNameList
  voccUsers.value = result.userGroupInfoByUserList
}

const changeColor = (groupName) => {
  return groupName ? 'primary' : 'gray'
}

const voccs = ref()
const fetchVoccs = async () => {
  const result = await voccStore.fetchVoccs()
  voccs.value = result
  console.dir(voccs)
}

const fetchGroupsByVoccId = () => {}

// 그룹 선택시, 메뉴 목록에서 해당 그룹에 할당한 메뉴를 체크해주는 기능
const getUsersGroup = (e) => {
  console.dir(e)
  const cellKey = e['row']['data']['first']
  const cellValue = e['row']['data']['second']

  selectdGroupId.value = cellKey
  selectedGroupName.value = cellValue
  initUsers.value = _.cloneDeep(voccUsers.value)

  selectedRowKeys.value = initUsers.value
    .filter((user) => user.groupId === cellKey)
    .map((user) => user.userId)
  oldGroupKeys = selectedRowKeys.value
}

// 메뉴 선택 시 실행되는 함수
// 그룹 선택시, 메뉴 목록에서 해당 그룹에 할당한 메뉴를 체크해주는 기능
const getMenuGroup = (e) => {
  selectedGroupKey.value = e['row']['key']
  initMenus.value = [...menus.value]

  getMenusByGroup(selectedGroupKey.value).then((response) => {
    const result = response.data.data
    if (result.length > 0) {
      // 할당된 메뉴가 있을 경우, 메뉴 업데이트
      selectedRowKeys.value = result
    } else {
      // 할당된 메뉴가 없을 경우, 이전 선택된 메뉴 초기화
      selectedRowKeys.value = []
    }
  })
}

// 저장할 경우 백엔드로 정보 전달
const saveMenusByGroup = async () => {
  const selectedMenuKeys = getDxGridInstance(menusGrid).getSelectedRowKeys('all')
  const selectedMenu = menus.value
    .filter((menu) => selectedMenuKeys.includes(menu.menuId))
    .map((item) => item.menuId)

  const groupForm = {
    groupId: selectedGroupKey.value,
    menuIdArray: selectedMenu
  }

  try {
    const response = await saveMenuByGroup(groupForm)
    console.log('저장 후 결과')
    console.dir(response)
    if (response.status == 200) {
      showResMsg('메뉴 목록이 업데이트 되었습니다')
    }
  } catch (error) {
    const errorMsg = error.response.data.errorMsg
    showResMsg(errorMsg)
  }
}

const closeAddModal = () => {
  isShowAddModal.value = false
}
</script>

<style scoped>
.groupName {
  /* background: #4E83FF; */
  border-radius: 10px;
  padding: 2px 4px;
}

.groupName.primary {
  background: #4e83ff;
}

.groupName.gray {
  background: #959595;
  border-radius: 10px;
  padding: 2px 4px;
}
</style>
