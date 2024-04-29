<template>
  <div class="menuContainer d-flex">
    <div v-for="(item, index) in accessMenus">
      <v-menu open-on-hover v-if="item.menuId != 50">
        <template v-slot:activator="{ props }">
          <v-btn @click="goPage(item.routerPath)" color="white" v-bind="props">
            {{ item.menuName }}
          </v-btn>
        </template>

        <v-list v-if="item.children">
          <v-list-item v-for="(children, index) in item.children" :key="index">
            <v-list-item-title @click="goPage(children.routerPath)">{{ children.menuName
              }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>

</template>

<script setup>
import { goPage } from '@/composables/util.js'
import { useAccessMenuStore } from '@/stores/accessMenuStore'
const { accessMenus } = useAccessMenuStore()

</script>

<style></style>