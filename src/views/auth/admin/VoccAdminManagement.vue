<template>
  <v-container fluid class="h-100">
    <v-row class="ma-0 h-100">
      <v-col cols="12" lg="9">
        <v-card class="pa-1 h-100" rounded="30">
          <v-card-title class="d-flex justify-space-between mb-4">
            <div>선사 대표 관리자 목록</div>
            <i-btn prepend-icon="mdi-plus" color="#3D3D40" text="등록" width="75" height="35"
              @click.stop="changeComponent($event, 'VoccAdminRegisterForm')"></i-btn>
          </v-card-title>
          <v-card-text>
            <v-table class="list-table management-container">
              <thead>
              </thead>
              <tbody>
                <tr v-for="(admin, index) in admins" :key="admin.id">
                  <td>{{ admin.nameKor }}</td>
                  <td>{{ admin.nickname }}</td>
                  <td class="d-flex justify-end align-center">
                    <i-btn :text="admin.activated ? '사용 가능' : '계정 잠금'"
                      :prepend-icon="admin.activated ? 'mdi-lock-open' : 'mdi-lock'"
                      :color="admin.activated ? '#fff' : '#737373'" variant="text" readonly
                      class="d-flex justify-end align-center">
                    </i-btn>
                  </td>
                  <td class="text-center">
                    <i-btn :text="isEditing(index) ? '수정중' : '수정'" :color="isEditing(index) ? '#7A8294' : '#4E83FF'"
                      :disable="isEditing(index)" :dataId="index" name="VoccAdminEditForm"
                      @click.stop="changeComponent($event, 'VoccAdminEditForm', admin.id, index)">
                    </i-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="3">
        <component :is="componentList[currentComponent]" :voccAdminId="_voccAdminId" class="h-100"></component>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref, onBeforeMount, provide } from 'vue'
import { useVoccStore } from '@/stores/voccStore.js'

import DefaultText from '@/components/DefaultText.vue'
import VoccAdminRegisterForm from '@/views/auth/admin/VoccAdminRegisterForm.vue'
import VoccAdminEditForm from '@/views/auth/admin/VoccAdminEditForm.vue'


const admins = ref([])
const currentComponent = ref('DefaultText')
const _voccAdminId = ref()
const currentId = ref('')


const componentList = {
  DefaultText,
  VoccAdminRegisterForm,
  VoccAdminEditForm,
}

onBeforeMount(() => {
  getVoccAdminAll()
})

const getVoccAdminAll = async () => {
  const voccStore = useVoccStore()
  const result = await voccStore.getVoccAdmins()
  admins.value = result
}

/**
 * 수정 버튼 인덱스 값에 따른 컴포넌트 변경
 * */
const changeComponent = (event, name, voccId = '', index = '') => {
  _voccAdminId.value = voccId
  console.dir(typeof (event))
  //typeof(event) == 'string'? currentComponent.value = event : currentComponent.value = event.target.name

  currentComponent.value = name;
  currentId.value = index
}

const isEditing = (index) => {
  return parseInt(currentId.value) === index;
}

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

@media (max-height : 800px) {
  .management-container {
    max-height: 724px;
    height: 724px;
    overflow-y: auto;
  }
}
</style>