<template>
  <v-card class="h-100">
    <v-card-title>
      <div>선사 사용자 수정</div>
    </v-card-title>
    <v-card-text class="title-form-container">
      <v-form @submit.prevent>
        <div class="mb-1">선사명</div>
        <i-input type="text" v-model="voccUserInfo.voccName" :disabled='true'>
        </i-input>
        <div class="mt-4 mb-1">아이디</div>
        <i-input type="text" v-model="voccUserInfo.username" :disabled='true'>
        </i-input>
        <div class="mt-4 mb-1">비밀번호</div>
        <div class="d-flex">
          <i-input type="password" v-model="voccUserInfo.password" class="mr-2" :disabled='true' />
          <i-btn text="비밀번호 초기화" width="120" @click="showPasswordResetModal"></i-btn>
        </div>
        <div class="mt-4 mb-1">닉네임</div>
        <i-input type="text" v-model="voccUserInfo.nickname" placeholder="닉네임을 입력하여 주십시오" :disabled='true'>
        </i-input>
        <div class="mt-4 mb-1">이메일</div>
        <i-input type="text" v-model="voccUserInfo.email" placeholder="이메일을 입력하여 주십시오" :disabled='true'>
        </i-input>
        <div class="mt-4 mb-1">활성화 상태</div>
        <!-- <i-btnToggle :toggles="toggles" v-model="voccAdminInfo.activated"></i-btnToggle> -->
        <v-btn-toggle v-model="toggle" color="#5789FE">
          <i-btn text="사용가능" @click="showStautsModal('active')" :value="true"></i-btn>
          <i-btn text="계정잠금" @click="showStautsModal('inactive')" :value="false"></i-btn>
        </v-btn-toggle>
        <div class="mt-4 mb-1">계정 권한</div>
        <div class="d-flex ga-3">
          <div class="align-self-center"> {{ convertRoleName(voccUserInfo.role) }}</div>
          <i-btn text="권한 변경" @click="showEditRoleModal()"></i-btn>
        </div>

        <i-btnGroup class="d-flex justify-space-between mt-8" :btnGroup="btnGroup" @cancle="cancleChange($event)"
          @delete="showDeleteModal"></i-btnGroup>

      </v-form>


      <AppModal v-model="isShowPasswordResetModal" @close="closePasswordResetModal" title="정말로 비밀번호 초기화 하시겠습니까? ">

        <template #default>
          <p>초기화된 비밀번호는 <br>해당 선사 사용자의 이메일로 발송됩니다</p>
        </template>

        <template #actions>
          <i-btnGroup type="confirm" @close="closePasswordResetModal" @confirm="resetPassword"></i-btnGroup>
        </template>
      </AppModal>

      <AppModal v-model="isShowStautsModal" @close="closeStautsModal">

        <template #default>
          <p>{{ statusModalMessage }}</p>
        </template>

        <template #actions>
          <i-btnGroup type="confirm" @close="closeStautsModal" @confirm="changeAcitveStatus"></i-btnGroup>
        </template>
      </AppModal>

      <AppModal v-model="isShowDeleteModal" @close="closeDeleteModal">

        <template #default>
          <p>정말로 계정을 삭제 처리 하시겠습니까?</p>
        </template>

        <template #actions>
          <i-btnGroup type="confirm" @close="closeDeleteModal" @confirm="removeVoccUser"></i-btnGroup>
        </template>
      </AppModal>

      <AppModal v-model="isShowEditRoleModal" @close="closeEditRoleModal">
        <template #default>
          <p>{{ roleEditMessage }}</p>
        </template>

        <template #actions>
          <i-btnGroup type="confirm" @close="closeEditRoleModal" @confirm="editUserRole"></i-btnGroup>
        </template>
      </AppModal>

    </v-card-text>
  </v-card>


</template>

<script setup>
import { onMounted, inject, ref, defineProps, watchEffect, toRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js'
import { useVoccStore } from '@/stores/voccStore.js'
import { useToast } from '@/composables/useToast'
const { showResMsg } = useToast()

import { convertRoleName } from '@/composables/user'

import BaseChangeForm from '@/layout/modify/BaseChangeForm.vue'
import AppModal from '@/components/modal/AppModal.vue'

const authStore = useAuthStore()
const voccStore = useVoccStore()
const { voccInfo, voccUserInfo } = storeToRefs(voccStore);

const props = defineProps({
  voccId: {
    type: [Number, String]
  },
  voccUserId: {
    type: [Number, String]
  }
})

const toggle = ref('')
const btnGroup = [
  { id: 'cancel-btn', action: 'cancle', text: '수정 취소', color: '#5E616A', width: '48%' },
  { id: 'change-btn', action: 'delete', text: '계정 삭제', color: '#4E83FF', width: '48%' },
]

/**
 * 사용자가 선택한 사용자 정보 조회
 */
const voccUserId = toRef(props.voccUserId)
onMounted(() => {
  const result = getInfo(props.voccUserId)
  if (!voccInfo.value) {
    fetchVoccInformation()
  }
})
const fetchVoccInformation = async () => {
  await voccStore.fetchMyVoccInfo()
  console.dir(voccInfo.value)
}

/**
 * 수정 버튼 클릭 시, EditForm은 이미 렌더링 된 상태라서
 * 정보가 재조회가 안되는 문제 발생
 * => voccUserId가 바뀌면 사용자 정보 조회하는 함수 재호출
 */
const getInfo = async () => {
  await voccStore.getVoccUserInfo(props.voccId, props.voccUserId)
    .then((response) => {
      // voccAdminInfo.value = response
      voccUserInfo.value.password = '********'
      toggle.value = voccUserInfo.value.activated
    })
    .catch((error) => {
      console.error()
      showResMsg('네트워크 오류')
    })
}

watchEffect(async () => {
  getInfo()
}), { immediat: true };

/**
 * 비밀번호 초기화 
 * - 팝업창 표시
 * - 비밀번호 초기화 api 호출
 */
const isShowPasswordResetModal = ref(false)
const showPasswordResetModal = () => {
  isShowPasswordResetModal.value = true;
}
const closePasswordResetModal = () => {
  isShowPasswordResetModal.value = false;
}

const resetPassword = () => {
  const userName = voccUserInfo.value.username
  authStore.resetPassword(userName).then(() => {
    showResMsg('비밀번호 초기화 되었습니다')
    setTimeout(() => {
      isShowPasswordResetModal.value = false
    }, 500)
  })
}

/**
 * 계정 활성화 상태 변경
 * - 팝업창 표시
 * - 계정 활성화 상태 변경 api 호출
 */
const isShowStautsModal = ref(false)
const statusModalMessage = ref('')

const showStautsModal = (type) => {
  if (type == 'active') {
    statusModalMessage.value = '정말로 계정을 활성화 하시겠습니까?'
  } else {
    statusModalMessage.value = '정말로 계정을 비활성화 하시겠습니까?'
  }
  isShowStautsModal.value = true
}

const closeStautsModal = () => {
  isShowStautsModal.value = false
  toggle.value = voccUserInfo.value.activated
}

const changeAcitveStatus = async () => {
  const userName = voccUserInfo.value.username
  const activate = voccUserInfo.value.activated
  const type = 'voccUser'

  await voccStore.changeActive(userName, !activate, type).then(() => {
    isShowStautsModal.value = false;
    refreshUsers()
  })


}

/**
 * 계정 권한 변경
 * - 팝업창 표시
 * - 계정 권한 api 호출
 */

const isShowEditRoleModal = ref(false)
const roleEditMessage = ref('')
const loggineUserRole = sessionStorage.getItem('userRole')


const showEditRoleModal = () => {
  const selectedUserRole = voccUserInfo.value.role

  let message = ''
  if (loggineUserRole == 'ROLE_LCC_ADMIN') {
    if (selectedUserRole == 'ROLE_LCC_ADMIN') {
      message = '정말로 사용자로 권한 변경하시겠습니까?'
    } else {
      message = '정말로 시스템관리자로 권한 변경하시겠습니까?'
    }
  } else {
    if (selectedUserRole == 'ROLE_VOCC_ADMIN') {
      message = '정말로 사용자로 권한 변경하시겠습니까?'
    } else {
      message = '정말로 관리자로 권한 변경하시겠습니까?'
    }
  }
  roleEditMessage.value = message;
  isShowEditRoleModal.value = true
}
const closeEditRoleModal = () => {
  isShowEditRoleModal.value = false
}

const editUserRole = () => {
  let role;
  const selectedUserRole = voccUserInfo.value.role
  const loggineUserRole = sessionStorage.getItem('userRole')
  // 현재 권한이 일반 사용자인지
  if (selectedUserRole === 'ROLE_VOCC_USER') {
    role = (loggineUserRole === 'ROLE_LCC_ADMIN') ? 'ROLE_LCC_ADMIN' : 'ROLE_VOCC_ADMIN'
  } else {
    roleEditMessage.value = '정말로 일반사용자로 권한 변경하시겠습니까?'
    role = 'ROLE_VOCC_USER'
  }

  const editUserInfo = {
    username: voccUserInfo.value.username,
    userRole: role,
  }

  voccStore.changeRole(editUserInfo).then(() => {
    closeEditRoleModal()
    cancleChange()
  })
}

/**
 * 계정 삭제
 * - 팝업창 표시
 * - 계정 삭제 api 호출
 */

const isShowDeleteModal = ref(false)
const showDeleteModal = () => {
  isShowDeleteModal.value = true
}
const closeDeleteModal = () => {
  isShowDeleteModal.value = false
}

const removeVoccUser = () => {
  let voccUserId = props.voccUserId
  const removeVoccUserInfo = {
    removeUserVoccName: voccInfo.value.name,
    removeUsername: voccUserInfo.value.username
  }

  voccStore.removeVoccUser(voccUserId, removeVoccUserInfo).then(() => {
    isShowDeleteModal.value = false
    cancleChange()
    refreshUsers()
  })
}


/**
 * 수정 취소 버튼 클릭 시, 
 * DefaultText 컴포넌트로 변경
 */
const emit = defineEmits(['changeComponent'])
const changeComponent = inject('changeComponent', 'DefaultText')
const refreshUsers = inject('refreshUsers')
const cancleChange = (e) => {
  changeComponent(e, 'DefaultText')
}

</script>

<style scope>
.inactive {
  color: #737373 !important
}
</style>
