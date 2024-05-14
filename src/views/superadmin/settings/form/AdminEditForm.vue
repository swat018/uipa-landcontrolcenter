<template>
  <v-card class="h-100">
    <v-card-title>
      <div>선사 관리자 수정</div>
    </v-card-title>

    <v-card-text class="title-form-container">
      <v-form @submit.prevent>
        <div class="mb-1">선사명</div>
        <i-input type="text" v-model="voccAdminEditForm.voccName" :disabled='true'>
        </i-input>
        <div class="mt-4 mb-1">아이디</div>
        <i-input type="text" v-model="voccAdminEditForm.username" :disabled='true'>
        </i-input>
        <div class="mt-4 mb-1">비밀번호</div>
        <div class="d-flex">
          <i-input type="password" v-model="voccAdminEditForm.password" class="mr-2" :disabled='true' />
          <i-btn text="비밀번호 초기화" width="120" @click="showPasswordResetModal"></i-btn>
        </div>
        <div class="mt-4 mb-1">닉네임</div>
        <i-input type="text" v-model="voccAdminEditForm.nickname" placeholder="닉네임을 입력하여 주십시오" :disabled='true'>
        </i-input>
        <div class="mt-4 mb-1">이메일</div>
        <i-input type="text" v-model="voccAdminEditForm.email" placeholder="이메일을 입력하여 주십시오" :disabled='true'>
        </i-input>
        <div class="mt-4 mb-1">활성화 상태</div>
        <!-- <i-btnToggle :toggles="toggles" v-model="voccAdminInfo.activated"></i-btnToggle> -->
        <v-btn-toggle v-model="toggle" color="#5789FE">
          <i-btn text="사용가능" @click="showStautsModal('active')" :value="true"></i-btn>
          <i-btn text="계정잠금" @click="showStautsModal('inactive')" :value="false"></i-btn>
        </v-btn-toggle>
        <div class="mt-4 mb-1">계정 권한</div>
        <span>선사 관리자</span>

        <i-btnGroup class="d-flex justify-space-between mt-8" :btnGroup="btnGroup" @cancle="cancleChange($event)"
          @delete="showDeleteModal"></i-btnGroup>
      </v-form>

    </v-card-text>
  </v-card>

  <AppModal v-model="isShowPasswordResetModal" @close="closePasswordResetModal" title="정말로 비밀번호 초기화 하시겠습니까? ">
    <template #default>
      <p>초기화된 비밀번호는 <br>선사 관리자의 이메일로 발송됩니다</p>
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
      <i-btnGroup type="confirm" @close="closeDeleteModal" @confirm="removeAdmin"></i-btnGroup>
    </template>
  </AppModal>

</template>

<script setup>
import { onMounted, inject, computed, ref, reactive, defineProps, watchEffect, watch, toRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js'
import { useVoccStore } from '@/stores/voccStore.js'
import { useAdminStore } from '@/stores/adminStore.js'
import BaseChangeForm from '@/layout/modify/BaseChangeForm.vue'
import { useAlert } from '@/composables/modal'
import AppModal from '@/components/modal/AppModal.vue'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const voccStore = useVoccStore()
const adminStore = useAdminStore()

const { voccAdminEditForm } = storeToRefs(adminStore);
const { showResMsg } = useToast()


const test = computed(() => {
  return voccAdminEditForm.value.activated ? 'red' : 'yellow'
})


const btnGroup = [
  { id: 'cancel-btn', action: 'cancle', text: '수정 취소', color: '#5E616A', width: '48%' },
  { id: 'change-btn', action: 'delete', text: '계정 삭제', color: '#4E83FF', width: '48%' },
]


const toggle = ref('')

const props = defineProps({
  voccId: {
    type: [Number, String]
  },
  userId: {
    type: [Number, String]
  }
})

const adminId = toRef(props.voccAdminId)

onMounted(() => {
  const result = getInfo()
})

const getInfo = async () => {
  console.log('vocc 들고오는지')
  console.log(props.voccId)
  await adminStore.fetchVoccAdminInfo(props.voccId, props.userId)

  // voccAdminInfo.value = response
  voccAdminEditForm.value.password = '********'
  toggle.value = voccAdminEditForm.value.activated

  console.dir(voccAdminEditForm.value)

}

watchEffect(async () => {
  getInfo()
}), { immediat: true };


const isActivated = computed(() => {
  return voccAdminEditForm.value.activated ? '활성화' : '비활성화'
})


/**
 * 비밀번호 초기화
 */
const isShowPasswordResetModal = ref(false)
const showPasswordResetModal = () => {
  isShowPasswordResetModal.value = true;
}
const closePasswordResetModal = () => {
  isShowPasswordResetModal.value = false;
}

const resetPassword = () => {
  const userName = voccAdminEditForm.value.username
  authStore.resetPassword(userName).then(() => {
    alert('초기화 되었습니다')
    setTimeout(() => {
      isShowPasswordResetModal.value = false
    }, 500)
  })
}

/**
 * 계정 활성화 상태 변경
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
  toggle.value = voccAdminEditForm.value.activated
}

const changeAcitveStatus = () => {
  const userName = voccAdminEditForm.value.username
  const activate = voccAdminEditForm.value.activated
  const type = 'voccAdmin'
  adminStore.changeAdminActive(userName, !activate, type).then(() => {
    isShowStautsModal.value = false;
  })
}

/**
 * 계정 삭제
 */

const isShowDeleteModal = ref(false)
const showDeleteModal = () => {
  isShowDeleteModal.value = true
}
const closeDeleteModal = () => {
  isShowDeleteModal.value = false
}

const removeAdmin = () => {
  let voccAdminId = props.voccAdminId
  const removeAdminInfo = {
    removeUserVoccName: voccAdminEditForm.value.name,
    removeUsername: voccAdminEditForm.value.username
  }

  voccStore.removeAdmin(voccAdminId, removeAdminInfo).then(() => {
    isShowDeleteModal.value = false
  })
  cancleChange()
}



const emit = defineEmits(['changeComponent'])
const changeComponent = inject('changeComponent', 'DefaultText')

const cancleChange = (e) => {
  changeComponent(e, 'DefaultText')
}

</script>

<style scope>
.inactive {
  color: #737373 !important
}
</style>
