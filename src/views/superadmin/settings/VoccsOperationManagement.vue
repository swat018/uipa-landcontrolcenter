<template>
  <v-container fluid class="h-100 management-page detail-page settings">
    <v-row class="ma-0 h-100">
      <v-col cols="6">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div>선사별 선박 목록</div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <!-- 선사 목록 -->
                <DxDataGrid id="groupGrid" class="title-container" ref="groupGrid" key-expr="id" :data-source="voccs"
                  :active-state-enabled="activeStatus" :focused-row-enabled="activeStatus"
                  :on-focused-cell-changed="test" :show-borders="true">
                  <DxScrolling column-rendering-mode="virtual" />
                  <DxSelection mode="single" />
                  <DxColumn data-field="id" :visible="false" class="pl-10"></DxColumn>
                  <DxColumn data-field="name" caption="선사명" :allow-editing="false"></DxColumn>
                </DxDataGrid>
              </v-col>
              <v-col>
                <!-- 권한 그룹 목록 -->
                <DxDataGrid id="groupGrid" class="title-container" ref="groupGrid" key-expr="first"
                  :data-source="groups" :active-state-enabled="activeStatus" :focused-row-enabled="activeStatus"
                  :on-focused-cell-changed="test" :show-borders="true">
                  <DxScrolling column-rendering-mode="virtual" />
                  <DxSelection mode="single" />
                  <DxColumn data-field="first" caption="groupId" :visible="false" class="pl-10"></DxColumn>
                  <DxColumn data-field="second" caption="선박명" :allow-editing="false"></DxColumn>
                </DxDataGrid>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- 사용자 목록 -->
      <v-col cols="6">
        <v-sheet class="px-6 rounded-lg tabs-container">
          <v-tabs v-model="tab" color="#5789FE" align-tabs="left">
            <v-tab :value="tabItem[0]">기준연료정보</v-tab>
            <v-tab :value="tabItem[1]">환경규제정보</v-tab>
            <v-tab :value="tabItem[2]">선박제원관리</v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item :value="tabItem[0]">
              <VoccsFuelInformation :voccId="_voccId" />
            </v-window-item>
            <v-window-item :value="tabItem[1]">
              <VoccsImoDcsInformation />
            </v-window-item>
            <v-window-item :value="tabItem[2]">
              <VoccsEquipmentManagement />
            </v-window-item>
          </v-window>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useVoccStore } from '@/stores/voccStore'

import VoccsFuelInformation from '@/views/superadmin/settings/operation/VoccsFuelInformation.vue';
import VoccsImoDcsInformation from '@/views/superadmin/settings/operation/VoccsImoDcsInformation.vue';
import VoccsEquipmentManagement from '@/views/superadmin/settings/operation/VoccsEquipmentManagement.vue'
import { onMounted } from 'vue';
const tab = ref('fuel')
const tabItem = ref([
  'fuel', 'imodcs', 'usedFuel'
])
const voccStore = useVoccStore()

onMounted(()=>{
  fetchVoccs()
})

const voccs = ref();
const fetchVoccs = async () => {
  const result = await voccStore.fetchVoccs();
  voccs.value = result;
  console.dir(voccs)
}

const _voccId = ref()

const test = (e) =>{
  console.dir(e)
  _voccId.value = e.row.key;

  alert('셀 선택')
}

</script>

<style scoped>


</style>