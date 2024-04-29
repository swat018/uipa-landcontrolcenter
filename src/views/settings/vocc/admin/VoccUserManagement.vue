<template>
  <v-container fluid class="h-100">
  <v-row class="ma-0 h-100">
    <v-col cols="12" lg="9">
      <v-card class="cardContainer h-100" rounded="30">
        <v-card-title class="d-flex justify-space-between mb-4">
          <div>사용자 목록</div>
          <i-btn prepend-icon="mdi-plus" color="#3D3D40" text="등록" width="75" height="35"
           @click.stop="changeComponent($event, 'VoccUserRegisterForm')"></i-btn>
          </v-card-title>
        <v-card-text>
          <v-table class="list-table management-container">
            <thead>
            </thead>
            <tbody>
              <tr v-for="(voccUser, index) in voccUsers" :key="voccUser.id">
                <td>{{ voccUser.nickname }}</td>
                <td class="text-center">{{ convertRoleName(voccUser.role) }}</td>
                <td class="d-flex justify-end align-center">
                    <i-btn :text="voccUser.activated ? '사용 가능' : '계정 잠금'"
                           :prepend-icon="voccUser.activated ? 'mdi-lock-open' : 'mdi-lock'"
                           :color="voccUser.activated ? '#fff' : '#737373'"
                          variant="text" readonly
                          class="d-flex justify-end align-center">
                    </i-btn>
                </td>
                <td class="text-center">
                  <i-btn :text="isEditing(index) ? '수정중' : '수정'" 
                         :color="isEditing(index) ? '#7A8294' : '#4E83FF'" 
                         :disable="isEditing(index)"
                         :dataId="index" 
                          name="VoccAdminEditForm"
                          @click.stop="changeComponent($event,'VoccUserEditForm', voccUser.id, index)">
                  </i-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <component  :is="componentList[currentComponent]" :voccUserId="_voccUserId" class="h-100"></component>
    </v-col>
  </v-row>

  </v-container>
</template>

<script setup>
import { ref, onBeforeMount, provide } from 'vue'
import { useVoccStore } from '@/stores/voccStore.js'
import { convertRoleName } from '@/composables/user.js'
import DefaultText from '@/components/DefaultText.vue'
import VoccUserRegisterForm from '@/views/settings/vocc/admin/VoccUserRegisterForm.vue'
import VoccUserEditForm from '@/views/settings/vocc/admin/VoccUserEditForm.vue'
import { storeToRefs } from 'pinia'
const currentComponent = ref('DefaultText')
const voccStore = useVoccStore()
const { voccUsers  } = storeToRefs(voccStore)
const _voccUserId = ref()
const currentId = ref('')


const componentList = {
  DefaultText,
  VoccUserRegisterForm,
  VoccUserEditForm,
}

onBeforeMount(() => {
  getVoccUserAll()

})

const getVoccUserAll = async () => {
  await voccStore.getVoccUsers()
}

/**
 * 수정 버튼 인덱스 값에 따른 컴포넌트 변경
 * */
const changeComponent = (event, name, voccUserId ='', index='') => {
  _voccUserId.value = voccUserId
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
.v-row {
  height: 100%;
}

.v-card {
  height: 100%;
}

.list-table{
  border: 1px solid #49494E;
}

.list-table  tr:nth-child(odd) {
  background: #2F2F32;
}

.list-table  th {
  border-right: 1px solid #49494E;
}

.list-table .title {
  font-size: 1.2em;
}

/* .active {
  background: '#4E83FF';
  color: '#fff'
}

.inactive {
  background: '#7A8294';
  color: '#525C71'

} */

 @media (max-height : 800px){
  .management-container {
    max-height: 724px;
    height: 724px;
    overflow-y: auto ;
  }
}
</style>