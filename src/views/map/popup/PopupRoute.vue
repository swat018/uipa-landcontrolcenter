<template>
  <v-sheet class="pa-3 rounded-lg popupLayout pointer-cursor" ref="popupRoute" height="790" v-if="isRouteShow" width="900">
    <!--  국가이미지, 선박명, 닫기 버튼 -->
    <v-sheet class="">
      <div class="d-flex justify-space-between align-center ">
        <div class="d-flex align-center">
          <div class="d-flex align-center ga-4">
            <div class="align-center boatName" style="line-height: 1;">항로계획</div>
          </div>
        </div>
        <v-btn icon="mdi-close" width="" size="small" variant="text" @click="closePopup"></v-btn>
      </div>
    </v-sheet>
    <v-sheet color="#3C3C3F" class="px-3 py-3 d-flex rounded-lg">
      <v-row>
        <v-col cols="5">
          <v-table height="25">
            <colgroup><col width="60%"></col><col width="40%"></col></colgroup>
            <tr>
              <th class="text-center">항로계획명</th>
              <th class="text-center" style="padding: 0 1rem">편집일자</th>
            </tr>
          </v-table>
          <v-table class="RMList" height="625">
            <colgroup><col width="60%"></col><col width="40%"></col></colgroup>
            <tr
              v-for="(item, index) in routelist"
              v-if="routelist.length > 0"
              :key="item.routeid"
              :class="{ selected: selectedMIndex === index }"
              @click="[selectRowM(index),route_choice(item.routeid)]"
            >
              <td class="text-center">{{ item.routename }}</td>
              <td>{{ item.modifydate }}</td>
            </tr>
            <tr v-if="routelist.length === 0">
              <td colspan = "2">항로계획 정보가 없습니다.</td>
            </tr>
          </v-table>
          <button @click="route_reset()" style="color: white; border-width: 1px; border-style: solid; border-color: white; padding: 0.1rem">항로 추가</button>&nbsp;
          <button @click="route_delete()" style="color: white; border-width: 1px; border-style: solid; border-color: white; padding: 0.1rem">항로 삭제</button>
        </v-col>
        <v-col cols="7">
          <v-table height="60">
            <colgroup><col width="25%"><col width="20%"><col width="20%"><col width="20%"><col width="15%"></colgroup>
            <tbody>
              <tr>
                <th class="text-center" >항로계획명</th><th colspan="3"><input v-model="routeMaster.routename" placeholder="항로계획명을 입력하세요"></th>
                <th><button @click="saveRouteM()" style="color: white; border-width: 1px; border-style: solid; border-color: white; padding: 0.1rem; width: 40px">저장</button></th>
              </tr>
              <!--<tr>
                <th class="text-center">편집자</th><th><input v-model="routeMaster.makename" placeholder="편집자명을 입력하세요"></th>
                <th class="text-center">편집일자</th><th><p>{{routeMaster.modifydate}}</p></th>
              </tr>-->
            </tbody>
          </v-table>
          <v-table height="60">
            <colgroup><col width="20%"><col width="30%"><col width="20%"><col width="30%"></colgroup>
            <tbody>
              <tr>
                <th class="text-center">편집자</th><th><p>{{routeMaster.makename}}</p></th>
                <th class="text-center" style="padding: 0 1rem">편집일자</th><th><p>{{routeMaster.modifydate}}</p></th>
              </tr>
            </tbody>
          </v-table>
          <v-table height="25">
            <!--<colgroup><col width="25%"><col width="25%"><col width="25%"><col width="25%"></colgroup>-->
            <colgroup><col width="20%"><col width="30%"><col width="30%"></colgroup>
            <tr>
              <th class="text-center">순번</th>
              <!--<th class="text-center">이탈허용거리(NM)</th>-->
              <th class="text-center">위도</th>
              <th class="text-center">경도</th>
            </tr>
          </v-table>
          <v-table class="RDList" height="450" width="455">
            <!--<colgroup><col width="25%"><col width="25%"><col width="25%"><col width="25%"></colgroup>-->
            <colgroup><col width="20%"><col width="30%"><col width="30%"></colgroup>
            <tr
              v-for="(rd_item, index) in routeDetail"
              :key="rd_item.r_pointid"
              @click="selectRowD(index)"
              :class="{ selected: selectedDIndex === index }"
              v-if="routeDetail.length > 0"
            >
              <td class="text-center">{{ index+1 }}</td>
              <!--<td class="text-center"></td>-->
              <td class="text-center"><input class="text-center" v-model="rd_item.lat"></td>
              <td class="text-center"><input class="text-center" v-model="rd_item.lon"></td>
            </tr>
          </v-table>
          <button @click="addRow()" style="color: white; border-width: 1px; border-style: solid; border-color: white; padding: 0.1rem">WP 추가</button>&nbsp;
          <button @click="updateRow()" style="color: white; border-width: 1px; border-style: solid; border-color: white; padding: 0.1rem">WP 수정</button>&nbsp;
          <button @click="removeRow()" style="color: white; border-width: 1px; border-style: solid; border-color: white; padding: 0.1rem">WP 삭제</button>
        </v-col>
      </v-row>
    </v-sheet>
  </v-sheet>

</template>

<script setup>

import { onMounted, ref, watch, computed, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouteStore } from '@/stores/routeStore'
import { useToast } from '@/composables/useToast'
import emitter from '@/composables/eventbus'
import axios from 'axios'

const routeStore = useRouteStore()
const { routelist, routeMaster, routeDetail, selectedMIndex, selectedDIndex, drawactive } = storeToRefs(routeStore);

const { showResMsg } = useToast()

const props = defineProps({
  isRouteShow: {
    type: Boolean,
    defalut: false
  }
})

const emit = defineEmits(['closePopup'])

const closePopup = () => {
  route_reset()
  emit('closePopup')
}

const selectRowM = (index) => {
  selectedMIndex.value = index;
}

const route_choice = (id) => {
  routeStore.fetchRouteInfoById(id)
  //routeStore.fetchRouteDetailInfoById(id)
  axios.get(baseUrl+"/api/route/detail",{
    params: {
      id: id
    }}).then((response) => {
    if (response.data.length != 0) {
      const result = response.data;
      routeDetail.value = result;
    } else {
      routeDetail.value = ref([{}])
    }
    emitter.emit('draw_route_d1');
  })
}

const route_reset = () => {
  routeStore.resetroute()
  emitter.emit('draw_route_d1');
}

const route_delete = () => {
  if(routeMaster.value.routeid === 0) {
    showResMsg('항로계획을 선택해주세요.')
  } else {
    routeStore.RouteMDelete(routeMaster.value.routeid)
    selectedMIndex.value = null
    selectedDIndex.value = null
    drawactive.value = false
  }
}

const saveRouteM = () => {
  routeStore.RouteMSave(routeMaster.value.routeid, routeMaster.value.routename, routeMaster.value.makename)
}

const selectRowD = (index) => {
  selectedDIndex.value = index
  drawactive.value = true
}

const addRow = () => {
  if(routeMaster.value.routeid === 0) {
    showResMsg('항로계획을 선택해주세요.')
  } else {
    let obj = {routeid: routeMaster.routeid, lon: '', lat: '', seq: 0}
    console.log(isNaN(selectedDIndex.value))
    if (selectedDIndex.value === null) {
      if(routeDetail.value.length == 0||typeof routeDetail.value.length == "undefined" || routeDetail.value.length == null) {
        routeDetail.value = [obj]
      } else {
        routeDetail.value.push(obj)
      }
      selectRowD(routeDetail.value.length-1)
    } else {
      routeDetail.value.splice(selectedDIndex.value + 1, 0, obj)
      selectRowD(selectedDIndex.value + 1)
    }
  }
}

const updateRow = () => {
  emitter.emit('route_Interaction1');
}

const removeRow = () => {
  if(selectedDIndex.value === null) {
    showResMsg('삭제할 항로계획 순번을 선택해주세요.')
  } else {
    routeStore.routeDetail.splice(selectedDIndex.value, 1);
    selectedDIndex.value = null
    emitter.emit('draw_route_d1');
  }
}
</script>

<style scoped>
.popupLayout {
  position: absolute;
  top: 35px;
  z-index: 999;
  left: 15px;
  height: calc(100% - 24px);
}

table th {
  padding: 0
}

.RMList tr:hover:not(:first-child) {
  background: #7F7F7F;
}
.RMList tr.selected {
  background: #7F7F7F;
}

.RDList tr:hover:not(:first-child) {
  background: #7F7F7F;
}
.RDList tr.selected {
  background: #7F7F7F;
}
</style>
