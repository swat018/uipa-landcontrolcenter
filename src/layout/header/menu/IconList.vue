<template>
  <div class="d-flex">
    <div class="align-self-center">
      <v-btn icon="mdi-satellite-variant"></v-btn>
    </div>
    <div class="align-self-center">
      <v-btn icon="mdi-video"></v-btn>
    </div>
    <div class="align-self-center">
      <AlarmCount></AlarmCount>
    </div>
    <div class="align-self-center">
      <v-btn icon="mdi-cog" @click="goAccountPage()"></v-btn>
    </div>
    <div class="align-self-center">
      <AccountInfo></AccountInfo>
    </div>
  </div>
</template>

<script setup>
import AccountInfo from '@/layout/header/menu/AccountInfo.vue'
import AlarmCount from '@/layout/header/menu/AlarmCount.vue'
import { goPage } from '@/composables/util.js'


const goAccountPage = () => {
  goPage('/settings/account')
}
</script>

<style>

</style>