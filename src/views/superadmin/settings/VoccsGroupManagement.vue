<template>
  <v-container fluid class="h-100 management-page detail-page settings">
    <v-row class="ma-0 h-100">
      <v-col cols="6">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div class="d-flex justify-space-between align-center">
              <div>선사별 권한그룹 목록</div>
              <div>
                <i-btn class="bg-btn mr-1" @click="showAddModal" color="#3D3D40" prepend-icon="mdi-plus" text="새그룹추가"
                  width="120"></i-btn>
                <i-btn class="bg-btn ml-1" @click="showDeleteModal" color="#F04A4A" prepend-icon="mdi-trash-can-outline"
                  text="삭제" width="75"></i-btn>
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <!-- 선사 목록 -->
                <DxDataGrid id="voccGrid" class="no-stripe title-container" ref="voccGrid" key-expr="id"
                  :show-borders="true" :data-source="voccs" :active-state-enabled="activeStatus"
                  :focused-row-enabled="activeStatus" :selected-row-keys="selectedVoccId"
                  :on-focused-cell-changed="getUserdAndGroups">
                  <DxScrolling mode="virtual" />
                  <DxSelection mode="single" />
                  <DxColumn data-field="id" :visible="false" class="pl-10"></DxColumn>
                  <DxColumn data-field="name" caption="선사명" :allow-editing="false"></DxColumn>
                </DxDataGrid>
              </v-col>
              <v-col>
                <!-- 권한 그룹 목록 -->
                <DxDataGrid id="groupGrid" class="no-stripe title-container" ref="groupGrid" key-expr="first"
                  :show-borders="true" :data-source="voccGroups" :active-state-enabled="activeStatus"
                  :focused-row-enabled="activeStatus" :selected-row-keys="selectedGroupId"
                  :on-focused-cell-changed="getUsersGroup">
                  <DxScrolling mode="virtual" />
                  <DxSelection mode="single" />
                  <DxColumn data-field="first" caption="groupId" :visible="false" class="pl-10"></DxColumn>
                  <DxColumn data-field="second" caption="권한그룹명" :allow-editing="false"></DxColumn>
                </DxDataGrid>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- 사용자 목록 -->
      <v-col cols="6">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div class="d-flex justify-space-between">
              <div class="align-self-center">사용자 목록</div>
              <div>
                <i-btn text="저장" @click="saveUserByGroup" class="bg-btn mr-1"></i-btn>
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <DxDataGrid id="users" ref="userGrid" class="no-stripe title-container" key-expr="userId"
              :data-source="initUsers" :column-auto-width="true" :selected-row-keys="selectedRowKeys"
              :show-borders="true" @row-prepared="onRowPrepared" :show-column-lines="false"
              @selection-changed="onSelectionChanged" @editor-preparing="onEditorPreparing"
              :show-column-headers="false">
              <DxScrolling mode="virtual" />

              <DxSelection mode="multiple" show-check-boxes-mode="always" :recursive="true"></DxSelection>
              <DxColumn data-field="username" caption="사용자명" cell-template="cellTemplate"></DxColumn>
              <DxColumn data-field="groupName" class="" :visible="false"></DxColumn>

              <template #cellTemplate="{ data: templateOptions }">
                <div class="d-flex align-self-center">
                  <div class="userName">{{ templateOptions.data.username }}</div>
                  <div v-if="templateOptions.data.groupName != null" class="groupName ml-2"
                    :class="changeColor(templateOptions.data.groupName)">{{
                    templateOptions.data.groupName
                    }}</div>
                  <div v-else class="groupName ml-2" :class="changeColor(templateOptions.data.groupName)">그룹 없음</div>
                </div>
              </template>
            </DxDataGrid>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!--  그룹 추가 팝업창 -->
  <AppModal v-model="isShowAddModal" @close="closeAddModal" title="새로운 그룹 추가">
    <template #default>
      <i-input bgColor="#F1F1F9" label="그룹명" v-model="newGroupName" placehoder="새로운 그룹명을 입력해주세요"></i-input>
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
      <i-btnGroup v-if="selectdGroupId !== ''" type="confirm" @close="closeDeleteModal"
        @confirm="removeGroup"></i-btnGroup>
    </template>
  </AppModal>
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
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
const selectdGroupId = ref('')
const selectedGroupName = ref()
const selectedVoccName = ref()

let oldGroupKeys = []

let instance = null
let voccInstance = null
onBeforeMount(() => {
  fetchVoccs()
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
  console.dir(e.row.key)

  selectedVoccId.value = e.row.key
  initUsers.value = []
  const result = await authStore.fetchGroupsByVoccId(e.row.key)

  console.dir(result)
  voccGroups.value = result.userGroupIdAndNameList
  voccUsers.value = result.userGroupInfoByUserList

}

const changeColor = (groupName) => {
  return groupName ? 'primary' : 'gray';
}

const voccs = ref();
const fetchVoccs = async () => {
  const result = await voccStore.fetchVoccs();
  voccs.value = result;
  console.dir(voccs)
}

const fetchGroupsByVoccId = () => {

}


// 그룹 선택시, 메뉴 목록에서 해당 그룹에 할당한 메뉴를 체크해주는 기능
const getUsersGroup = (e) => {
  console.dir(e)
  const cellKey = e['row']['data']['first'];
  const cellValue = e['row']['data']['second'];

  selectdGroupId.value = cellKey
  selectedGroupName.value = cellValue
  initUsers.value = _.cloneDeep(voccUsers.value);

  selectedRowKeys.value = initUsers.value.filter((user) => user.groupId === cellKey)
    .map((user) => user.userId)
  oldGroupKeys = selectedRowKeys.value

  dxGridRefresh(userGrid)
}

/**
 * 할당된 그룹이 있을 경우, 체크박스 및 클릭 이벤트 비활성화
 * onEditorPreparing은 체크박스 비활성화된 것처럼만 보이고,
 * 실제 동작하기 때문에 이벤트를 막는 코드 추가
 * @param {*} e 
 */
const onRowPrepared = (e) => {
  if (e.rowType !== "data") return;
  const isSelected = selectedRowKeys.value.includes(e.key);

  if (e.data.groupName != null && selectdGroupId.value != e.data.groupId) {
    e.rowElement.style.pointerEvents = 'none';
  }
}

/**
 * 할당된 그룹이 있을 경우, 체크박스 비활성화
 * @param {*} e 
 */
const onEditorPreparing = (e) => {

  // 타입이 dataRow일 경우만 동작
  if (e.type !== "selection" || e.parentType !== 'dataRow') return;
  if (e.row.data.groupName != null && selectdGroupId.value != e.row.data.groupId) {
    e.editorOptions.disabled = true;
  }
}

const saveUserByGroup = async () => {
  let userInfo1 = {}
  let groupId = selectdGroupId.value;

  // 기존 그룹에 없는 사용자 배열
  const newValue = selectedRowKeys.value.filter(x => !(oldGroupKeys.includes(x)))
  // 기존 그룹에 삭제될 사용자 배열
  const removedValue = oldGroupKeys.filter(x => !(selectedRowKeys.value.includes(x)))

  try {
    let result = false;

    if (newValue.length > 0) {
      userInfo1 = {
        voccId: selectedVoccId.value,
        groupName: selectedGroupName.value,
        userIdList: newValue
      }
      result = await authStore.addUserByVoccId(groupId, userInfo1)

      if (result) {
        initUsers.value = initUsers.value.forEach((user) => {
          if (userInfo1.userIdList.includes(user.userId)) {
            user.groupName = userInfo1.groupName
            user.groupId = groupId
          }
        })
      }
    }

    if (removedValue.length > 0) {
      userInfo1 = {
        voccId: selectedVoccId.value,
        groupName: selectedGroupName.value,
        userIdList: removedValue
      }
      result = await authStore.removeUserByVoccId(userInfo1)

      if (result) {
        initUsers.value.forEach((user) => {
          if (userInfo1.userIdList.includes(user.userId)) {
            user.groupName = null
            user.groupId = null
          }
        })
      }
    }

    if (result) {
      // initUsers.value = [...users.value]
      oldGroupKeys = [...selectedRowKeys.value]
      console.log('저장 후')
      console.dir(voccGrid.value)
      console.dir(voccInstance)
      instance.option('focusedRowKey', null)
      voccInstance.option('focusedRowKey', null)

      dxGridRefresh(userGrid)
      showResMsg('사용자 목록이 업데이트 되었습니다')
    }
  } catch (err) {
    console.dir(err)
  }

}

/**
 * 그룹 삭제
 */
const removeGroup = () => {
  authStore.removeGroup(selectedVoccId.value, selectedGroupName.value).then(() => {

    setTimeout(() => {
      closeDeleteModal()
      dxGridRefresh(groupGrid)
      selectdGroupId.value = ''
      instance.option('focusedRowKey', null)
      initUsers.value = []
    }, 2000)
  })
}

const onSelectionChanged = (e) => {
  selectedRowKeys.value = e.selectedRowKeys
}


/**
 * 그룹 추가 팝업창
*/
const isShowAddModal = ref(false)
const showAddModal = () => {
  if (selectedVoccId.value != null && selectedVoccId.value.length != 0) {
    isShowAddModal.value = true;
  } else {
    showResMsg('선사를 선택해주세요')
  }
}
const closeAddModal = () => {
  isShowAddModal.value = false;
}
// 그룹 추가
const newGroupName = ref('')
const registerGroup = () => {
  const instance = getDxGridInstance(groupGrid)
  authStore.registerGroup(selectedVoccId.value, newGroupName.value).then((response) => {
    setTimeout(() => {
      closeAddModal()
      dxGridRefresh(groupGrid)
      newGroupName.value = ''
      instance.option('focusedRowKey', null)
    }, 1500)
  })
}

/**
 * 삭제 확인 팝업창
 */
const isShowDeleteModal = ref(false)
const showDeleteModal = () => {
  if (selectdGroupId.value != null && selectdGroupId.value.length != 0) {
    isShowDeleteModal.value = true
  } else {
    showResMsg('권한 그룹을 선택해주세요')
  }
}
const closeDeleteModal = () => {
  isShowDeleteModal.value = false
}

</script>

<style scoped>
.groupName {
  /* background: #4E83FF; */
  border-radius: 10px;
  padding: 2px 4px;
}

.groupName.primary {
  background: #4E83FF;
}

.groupName.gray {
  background: #959595;
  border-radius: 10px;
  padding: 2px 4px;
}
</style>
