<template>
  <v-layout class="column rounded rounded-md">
    <v-main class="d-flex justify-center align-center" style="min-height: 300px">
      <router-view></router-view>
    </v-main>
  </v-layout>
</template>

<script setup>
import BaseHeader from '../layout/header/BaseHeader.vue'
</script>

<style scoped>
/* .v-main {
  flex-direction: column;
} */
</style>
