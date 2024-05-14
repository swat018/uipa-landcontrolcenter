<template>
  <v-container fluid class="rounded-lg detail-page tabs-content-test">
    <!-- test10 -->
    <v-row>
      <v-col cols="9">
        <v-row>
          <v-col cols="5" class="pl-0">
            <div class="mt-3">
              <div class="d-flex justify-end ga-2 mb-6">
                <i-btn text="추가" width="40" @click="showAddModal" color="#3D3D40"></i-btn>
                <i-btn text="삭제" width="40" color="#F04A4A"></i-btn>
                <i-btn text="데크 이미지 삽입" color="#3D3D40" width="120"></i-btn>
              </div>

              <DxDataGrid id="deckGrid" ref="deckGrid" key-expr="id" :data-source="fdsData.decks" :show-borders="true"
                :column-auto-width="true" class="decks-container no-stripe">
                <DxSelection mode="single"></DxSelection>
                <DxScrolling mode="virtual" />
                <DxColumn data-field="deckName" caption="Deck" alignment="center" :allow-editing="false"></DxColumn>
              </DxDataGrid>
            </div>
          </v-col>
          <v-col cols="7">
            <div class="mt-3 h-100">
              <v-img :src="floorplan" class="deck-image  " />
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="pl-0">
            <div class="d-flex justify-end ga-2 mb-6">
              <i-btn text="센서 추가" @click="changeComponent('SensorRegisterForm')" color="#3D3D40"></i-btn>
              <i-btn text="센서 삭제" color="#F04A4A"></i-btn>
            </div>
            <div>
              <DxDataGrid id="sensorGrid" ref="sensorGrid" key-expr="id" :data-source="fdsData.data"
                :column-auto-width="true" :show-borders="true" class="no-stripe sensors-container ">
                <DxSelection mode="single"></DxSelection>
                <DxScrolling mode="virtual" />
                <DxColumn data-field="deckName" caption="Deck" alignment="center" :allow-editing="false"></DxColumn>
                <DxColumn data-field="location" caption="Installation Location" alignment="center"
                  :allow-editing="false" />
                <DxColumn data-field="sensorType" caption="Sensor Type" alignment="center" :allow-editing="false"
                  width="10%" />

                <DxColumn data-field="tagId" caption="Tag ID" alignment="center" :allow-editing="false"></DxColumn>

                <DxColumn data-field="x" caption="X" alignment="center" width="auto" :allow-editing="false" />

                <DxColumn data-field="y" caption="Y" alignment="center" width="auto" :allow-editing="false" />

                <DxColumn data-field="id" caption="" cell-template="edit-template" alignment="center" width="5%"
                  :allow-editing="false" />
                <template #edit-template="{ data }">
                  <v-btn icon="mdi-file-edit-outline" @click="changeComponent('SensorEditForm')"></v-btn>
                </template>
              </DxDataGrid>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="pr-0">
        <v-sheet class="rounded-lg" color="#333334">
          <!-- <SensorRegisterForm /> -->
          <component :is="componentList[currentComponent]" :sensorId="sensorId" />
        </v-sheet>

      </v-col>
    </v-row>
    <!--  그룹 추가 팝업창 -->
    <AppModal v-model="isShowAddModal" @close="closeAddModal" title="데크 등록">
      <template #default>
        <i-input bgColor="#F1F1F9" label="그룹명" v-model="newDeckName" placehoder="데크명을 입력해주세요"></i-input>
      </template>

      <template #actions>
        <i-btnGroup type="add" @close="closeAddModal" @add="registerDeck"></i-btnGroup>
      </template>
    </AppModal>

  </v-container>
  <!-- 선박 데크 수정 영역 -->
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted, onBeforeUnmount, getCurrentInstance } from 'vue'

import { getDxGridInstance, dxGridRefresh } from '@/composables/dxGridUtil'

import SensorRegisterForm from '@/views/fds/SensorRegisterForm.vue';
import SensorEditForm from '@/views/fds/SensorEditForm.vue';
import AppModal from '@/components/modal/AppModal.vue'

import floorplan from '@/assets/images/ship/floorplan/floorPlan.png'
import fdsData from '@/assets/mockup/fdsManagement.json'

const currentComponent = ref('SensorRegisterForm')
const componentList = {
  // NoSelectShip,
  SensorRegisterForm,
  SensorEditForm
}

const sensorId = ref()
const sensorGrid = ref()

const newDeckName = ref('')
const isShowAddModal = ref(false)
const showAddModal = () => {
  isShowAddModal.value = true;
}
const closeAddModal = () => {
  isShowAddModal.value = false;
}

const sensorTypes = ['열 감지기', '연기 감지기']
const statuses = [
  { id: 1, text: '정상', 'status': 'normal' },
  { id: 2, text: '신호없음', 'status': 'warning' },
  { id: 3, text: '경보', 'status': 'danger' }]

const getColorByAlarmType = (alarmType) => {
  let alarmColor = ''
  switch (alarmType) {
    case 'normal':
      alarmColor = 'normal'
      break;
    case 'warning':
      alarmColor = 'warning'
      break;

    case 'danger':
      alarmColor = 'danger'
      break;
  }
  return alarmColor;
}

const getTextByAlarmType = (alarmType) => {
  let alarmStatus = ''
  switch (alarmType) {
    case 'normal':
      alarmStatus = '정상'
      break;
    case 'warning':
      alarmStatus = '신호없음'
      break;
    case 'danger':
      alarmStatus = '경보'
      break;
  }

  return alarmStatus;
}

const getDescriptionByAlarmType = (alarmType) => {
  let alarmStatus = ''
  switch (alarmType) {
    case 'normal':
      alarmStatus = '센서가 정상 작동하고 있습니다.'
      break;
    case 'warning':
      alarmStatus = '센서가작동하지않거나, 오류를 일으키는 상태입니다'
      break;
    case 'danger':
      alarmStatus = '화재가 감지 되었습니다'
      break;
  }
  return alarmStatus;
}

const changeComponent = (name) => {
  const instance = getDxGridInstance(sensorGrid)
  currentComponent.value = name;
  if (name != 'SensorEditForm') {
    instance.clearSelection();
  }
}



</script>

<style scoped>
.normal {
  color: #42D2A7;
  border-color: #42D2A7;
}

.warning {
  color: #FD8100
}

.danger {
  color: #F04A4A;
  border-color: #F04A4A;
}

.alarm-type {
  font-size: 1.2em;
  ;
}

.sensor-management-container {
  flex: 3 3 0;
}

.form-container {
  flex: 1 1 0;
}

.deck-modify-item {
  flex: 1 1 0;
}


.sensors-container {
  /* height: calc(100% - 56px); */
  height: 100%;
  /* max-height: calc((100% - 24px - 24px) * 0.5 - 24px) ; */
  max-height: calc((100vh - 65px - 24px - 62px - 24px - 40px - 24px - 24px - 24px) * 0.5 - 24px);
}

.decks-container {
  /* height: calc(100% - 56px); */
  height: 100vh;
  max-height: calc((100vh - 65px - 24px - 62px - 24px - 40px - 24px - 24px - 24px) * 0.5 - 64px);
}

/* max-height: calc((100vh - 65px - 24px - 62px - 24px - 40px - 24px - 24px - 24px) * 0.65); */
/* calc((100vh - 65px - 24px - 62px - 24px - 40px - 24px - 24px - 24px) * 0.5 - 64px) */


.test10 {
  height: 100vh;
  max-height: calc(100vh - 65px - 24px - 62px - 24px);
}

/* #deckGrid {
  height: 100%;
} */

.image-container {
  flex: 2 2 0;
}

.deck-list {
  flex: 1 1 auto;
}

.deck-modify-container.d-flex.ga-4 {
  height: 20%;
}


.tabs-content-test {
  height: 100vh;
  max-height: calc(100vh - 65px - 24px - 62px - 24px - 24px);
}
</style>
