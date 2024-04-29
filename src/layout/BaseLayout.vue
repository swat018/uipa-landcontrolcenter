<template>
  <BaseAside></BaseAside>
  <DetailPageHeader/>
   <v-main>
    <router-view></router-view>
    </v-main>
</template>

<script setup>

import DetailPageHeader from '@/layout/header/DetailPageHeader.vue'
import BaseAside from '@/layout/aside/BaseAside.vue'

</script>

<style scoped>
</style>
