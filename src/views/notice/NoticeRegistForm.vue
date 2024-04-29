<template>
  <!-- <v-card class="">
    <v-card-text> -->
  <div class="pa-4">
    
    <v-form @submit.prevent class="w-75 mx-auto">
      <h3 class="mb-4">공지사항 등록</h3>
      <div>제목</div>
      <v-text-field variant="outlined" class="ml-2" v-model="notice.title"></v-text-field>
      <div class="mb-2">본문</div>
      <v-textarea variant="outlined" v-model="notice.contents"></v-textarea>
      <div class="d-flex justify-end">
        <div><v-btn block @click="goNoticeList" class="mt-3 py-4 bg-card" text="취소"></v-btn></diV>
        <div class="ml-2"><v-btn block @click="registerNotice" class="mt-3 py-4 bg-card" text="등록"></v-btn></div>
      </div>

    </v-form>
  </div>
  <!-- </v-card-text>
  </v-card> -->
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { goPage } from '@/composables/util.js'
import { useNoticeStore } from '@/stores/noticeStore';
import { useRoute } from 'vue-router'

const notice = ref({
  title: '',
  contents: ''
})

const route = useRoute();
const store = useNoticeStore()

const goNoticeList = () => {
  goPage('/notice')
}

const registerNotice = () => {
  const result = store.registerNotice(notice.value).then(response => {
    alert('공지사항 등록이 완료되었습니다');
    goPage('/notice');
  })
}


</script>

<style></style>