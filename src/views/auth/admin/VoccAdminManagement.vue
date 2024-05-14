<template>
  <v-container fluid class="h-100 management-page">
    <v-row class="ma-0 h-100">
      <v-col cols="9" lg="9">
        <v-card class="h-100" rounded="30">
          <v-card-title class="d-flex justify-space-between align-center">
            <div>선사 관리자 목록</div>
            <i-btn prepend-icon="mdi-plus" color="#3D3D40" text="등록" width="75"
              @click.stop="changeComponent($event, 'VoccAdminRegisterForm')"></i-btn>
          </v-card-title>
          <v-card-text>
            <v-table class="list-table title-container">
              <thead>
              </thead>
              <tbody>
                <tr v-for="(admin, index) in admins" :key="admin.id">
                  <!-- <td>{{ admin.name }} </td> -->
                  <td class="username">{{ admin.nickname }}
                    <span class="ml-2"
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
                      :disable="isEditing(index)" :dataId="index" name="VoccAdminEditForm"
                      @click.stop="changeComponent($event, 'VoccAdminEditForm', admin.voccId, index, admin.userId)">
                    </i-btn>
                  </td>
                  <td class="president-btn">
                    <i-btn v-if="!isExistPresentAdmin" text="대표 관리자 할당" width="120" color="#434348 "
                      @click="changePresidentAdmin(admin.voccId, admin.username, !admin.presidentAdminUser)"></i-btn>
                    <i-btn v-if="admin.presidentAdminUser"
                      @click="changePresidentAdmin(admin.voccId, admin.username, !admin.presidentAdminUser)"
                      text="대표 관리자 해제" width="120" color="#F04A4A"></i-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3" lg="3">
        <component :is="componentList[currentComponent]" :voccId="_voccId" :userId="selectedUserId" class="h-100">
        </component>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref, onBeforeMount, provide, computed } from 'vue'
import { useVoccStore } from '@/stores/voccStore.js'

import DefaultText from '@/components/DefaultText.vue'
import VoccAdminRegisterForm from '@/views/auth/admin/VoccAdminRegisterForm.vue'
import VoccAdminEditForm from '@/views/auth/admin/VoccAdminEditForm.vue'


const admins = ref([])
const currentComponent = ref('DefaultText')
const _voccId = ref()
const currentId = ref('')
const voccStore = useVoccStore()
const selectedUserId = ref('')

const componentList = {
  DefaultText,
  VoccAdminRegisterForm,
  VoccAdminEditForm,
}

onBeforeMount(() => {
  getVoccAdminAll()
})

const getVoccAdminAll = async () => {

  const result = await voccStore.fetchMyVoccAdmins()
  admins.value = result
}

/**
 * 수정 버튼 인덱스 값에 따른 컴포넌트 변경
 * */
const changeComponent = (event, name, voccId = '', index = '', userId = '') => {
  _voccId.value = voccId
  selectedUserId.value = userId;
  console.dir(typeof (event))
  //typeof(event) == 'string'? currentComponent.value = event : currentComponent.value = event.target.name

  currentComponent.value = name;
  currentId.value = index
}

const isEditing = (index) => {
  return parseInt(currentId.value) === index;
}
const changePresidentAdmin = async (voccId, username, appoint) => {

  const form = { voccId, username, appoint }
  await voccStore.changePresidentAdmin(form)

  let index = admins.value.findIndex((admin) => admin.username == username)

  admins.value[index].presidentAdminUser = appoint;

}

const isExistPresentAdmin = computed(() => {
  const result = admins.value.some((admin) => admin.presidentAdminUser == true)
  return result;
})

provide('changeComponent', changeComponent)

</script>

<style scoped>
.list-table {
  border: 1px solid #49494E;
}

.list-table tr:nth-child(odd) {
  background: #2F2F32;
}

.list-table th {
  border-right: 1px solid #49494E;
}

.list-table .title {
  font-size: 1.2em;
}

.title-container{
  /* height: 100vh; */
  /* max-height: calc(100vh - 65px - 48px - 56px - 48px ); */
}

@media (max-height : 800px) {
  .management-container {
    max-height: 724px;
    height: 724px;
    overflow-y: auto;
  }
}
</style>