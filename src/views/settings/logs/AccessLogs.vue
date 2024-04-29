<template>
  <div class="pa-4 h-100">
    <v-sheet class="accessLog pa-4 h-100 rounded-lg">
      <div class="accessLog_title">사용자 접속 기록</div>

      <!-- 날짜 검색 필터, 업데이트 / 다운로드 버튼 영역 -->
      <div class="d-flex my-4">
        <!-- 날짜 검색 필터 -->
        <div class="d-flex justify-space-between ga-3">
          <input type="date" v-model="startDate" />
          <input type="date" v-model="endDate" />
          <i-btn @click="periodData()" text="조회"></i-btn>
        </div>
        <v-spacer></v-spacer>
        <!-- 업데이트 / 다운로드 버튼 -->
        <div class="d-flex justify-space-between align-center ga-3">
          <i-btn text="업데이트" @click="refreshAccessLog" color="#3D3D40" width="100" prepend-icon="mdi-refresh"></i-btn>
          <i-btn text="다운로드" color="#3D3D40" width="100" prepend-icon="mdi-download"></i-btn>
        </div>
      </div>

      <!-- 사용자 접속 기록 그리드  -->
      <DxDataGrid id="grid" class="accesslog-container" :data-source="accessLogs" :show-borders="true">
        <DxPaging :page-size="20" />
        <!-- :page-size="10" -->
        <DxScrolling column-rendering-mode="virtual" />
        <DxColumn data-field="voccName" caption="선사명"></DxColumn>
        <DxColumn data-field="userGroupName" caption="사용자그룹"></DxColumn>
        <DxColumn data-field="username" caption="아이디"></DxColumn>
        <DxColumn data-field="loginTime" caption="로그인시간"></DxColumn>
        <DxColumn data-field="logoutTime" caption="로그아웃시간"></DxColumn>
        <DxColumn data-field="connectIp" caption="접속ip"></DxColumn>
      </DxDataGrid>
    </v-sheet>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia';


const authStore = useAuthStore()

const { accessLogs } = storeToRefs(authStore)
const startDate = ref()
const endDate = ref()

onMounted(() => {
  fetchAccessLogs()
})

/*
 사용자 접속 기록 조회
*/

const fetchAccessLogs = async (startDate = "", endDate = "") => {
  // console.log(`시작날짜 :  ${startTime} , endDate : ${endTime}`)
  await authStore.fetchAccessLog(startDate, endDate)
}

/**
 * 기간별 사용자 접속 기록 조회
 */
const periodData = () => {
  let selectedStartDate = startDate.value
  let selectedEndDate = endDate.value
  // let selectedStartDate = moment.utc(startDate.value).format()
  // let selectedEndDate = moment.utc(endDate.value).format()

  fetchAccessLogs(selectedStartDate, selectedEndDate)
}

/**
 * 사용자 접속 기록 새로고침 
 */
const refreshAccessLog = () => {
  fetchAccessLogs()
}
</script>

<style scope>
.dx-widget.dx-datagrid-pager.dx-pager {
  justify-content: center;
  display: flex;
}
</style>