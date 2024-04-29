<template>
  <MapAside />
  <BaseHeader :isNoSideBar="isNoSideBar"></BaseHeader>
  <v-main>
    <router-view></router-view>
  </v-main>
  <!-- <BaseFooter></BaseFooter> -->
</template>

<script setup>
import { ref } from 'vue'
import BaseHeader from '@/layout/header/BaseHeader.vue'
import MapAside from '@/layout/aside/MapAside.vue'

const isNoSideBar = ref(false)
</script>

<style scoped>
/* .v-main {
  flex-direction: column;
  height: calc(100% - 100px);
} */

/* footer {
  height: 150px;
} */

</style>
