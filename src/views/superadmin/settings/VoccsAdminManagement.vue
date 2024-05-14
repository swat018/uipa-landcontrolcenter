<template>
  <v-container fluid class="h-100 management-page">
    <v-row class="ma-0 h-100">
      <v-col cols="12" lg="9">
        <v-card class="h-100" rounded="30">
          <v-card-title class="d-flex justify-space-between align-center">
            <div>선사별 관리자 목록</div>
            <i-btn prepend-icon="mdi-plus" color="#3D3D40" text="등록" width="75"
              @click.stop="changeComponent($event, 'AdminRegisterForm')"></i-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <DxDataGrid id="voccs-grid" class="no-stripe title-container" ref="voccsGrid" key-expr="id"
                  :show-borders="true" :data-source="voccs" :show-column-headers="false"
                  :active-state-enabled="activeStatus" :focused-row-enabled="activeStatus"
                  :on-focused-cell-changed="fetchAdminsByVoccId">
                  <DxScrolling column-rendering-mode="virtual" />
                  <DxSelection mode="single" />
                  <DxColumn data-field="id" :visible="false" class="pl-10"></DxColumn>
                  <DxColumn data-field="name" caption="선사명" :allow-editing="false"></DxColumn>
                </DxDataGrid>
              </v-col>

              <v-col cols="8">
                <v-data-table class="admins-list title-container" no-data-text="데이터가 없습니다">
                  <thead>
                  </thead>
                  <tbody>
                    <tr v-for="(admin, index) in admins" :key="admin.id">
                      <!-- <td>{{ admin.name }} </td> -->
                      <td class="username">{{ admin.nickname }}<span class="ml-2"
                          style="background : #5789FE; padding : 5px 10px; border-radius : 50px; "
                          v-if="admin.presidentAdminUser">대표</span>
                      </td>
                      <td class="activate-status">
                        <i-btn :text="admin.activated ? '사용 가능' : '계정 잠금'"
                          :prepend-icon="admin.activated ? 'mdi-lock-open' : 'mdi-lock'"
                          :color="admin.activated ? '#fff' : '#737373'" variant="text" readonly
                          class="d-flex justify-end align-center">
                        </i-btn>
                      </td>
                      <td class="modify-btn">
                        <i-btn :text="isEditing(index) ? '수정중' : '수정'" :color="isEditing(index) ? '#7A8294' : '#4E83FF'"
                          :disable="isEditing(index)" :dataId="index" name="AdminEditForm"
                          @click.stop="changeComponent($event, 'AdminEditForm', admin.voccId, index, admin.userId)">
                        </i-btn>
                      </td>

                      <td class="president-btn">
                        <i-btn v-if="!isExistPresentAdmin" text="대표 관리자 할당" class="mr-4" width="120" color="#434348 "
                          @click="changePresidentAdmin(admin.voccId, admin.username, !admin.presidentAdminUser)"></i-btn>
                        <i-btn v-if="admin.presidentAdminUser" class="mr-4"
                          @click="changePresidentAdmin(admin.voccId, admin.username, !admin.presidentAdminUser)"
                          text="대표 관리자 해제" width="120" color="#F04A4A"></i-btn>
                      </td>

                    </tr>
                  </tbody>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="3">
        <component :is="componentList[currentComponent]" :voccId="_voccId" :userId="selectedUserId" class="h-100">
        </component>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref, onBeforeMount, computed, provide } from 'vue'
import { useVoccStore } from '@/stores/voccStore.js'
import { useAdminStore } from '@/stores/adminStore.js'

import DefaultText from '@/components/DefaultText.vue'
import AdminRegisterForm from '@/views/superadmin/settings/form/AdminRegisterForm.vue'
import AdminEditForm from '@/views/superadmin/settings/form/AdminEditForm.vue'

const voccStore = useVoccStore()
const adminStore = useAdminStore()

const { voccsAdmins } = adminStore;

const voccs = ref([])
const admins = ref([])



const currentComponent = ref('DefaultText')
const _voccId = ref()
const selectedUserId = ref()
const currentId = ref('')




const componentList = {
  DefaultText,
  AdminRegisterForm,
  AdminEditForm,
}

onBeforeMount(() => {
  fetchVoccs()
  // getVoccAdminAll()
})


const fetchVoccs = async () => {
  const result = await voccStore.fetchVoccs();
  voccs.value = result;
}
/**
 * 수정 버튼 인덱스 값에 따른 컴포넌트 변경
 * */
const changeComponent = (event, name, voccId = '', index = '', userId = '') => {
  _voccId.value = voccId
  console.log(_voccId.value)
  selectedUserId.value = userId;
  console.dir(typeof (event))
  //typeof(event) == 'string'? currentComponent.value = event : currentComponent.value = event.target.name

  currentComponent.value = name;
  currentId.value = index
}

const isEditing = (index) => {
  return parseInt(currentId.value) === index;
}

const fetchAdminsByVoccId = async (e) => {
  const result = await adminStore.fetchAdminsByVoccId(e.row.key)
  admins.value = result;
}

const isExistPresentAdmin = computed(() => {
  const result = admins.value.some((admin) => admin.presidentAdminUser == true)
  return result;
})

const changePresidentAdmin = async (voccId, username, appoint) => {

  const form = { voccId, username, appoint }
  await voccStore.changePresidentAdmin(form)

  let index = admins.value.findIndex((admin) => admin.username == username)

  admins.value[index].presidentAdminUser = appoint;

}
provide('changeComponent', changeComponent)

</script>

<style scoped>
.admins-list {
  border: 1px solid #49494E;
}

.admins-list tr:nth-child(odd) {
  background: #2F2F32;
}

.admins-list th {
  border-right: 1px solid #49494E;
}

.admins-list .title {
  font-size: 1.2em;
}

/* .voccs-grid {
  flex : 1 1 30%;
} */


.admins-list {
  flex: 1 1 70%;
}


@media (max-height : 800px) {
  .management-container {
    max-height: 724px;
    height: 724px;
    overflow-y: auto;
  }
}
</style>