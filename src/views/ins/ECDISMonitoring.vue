<template>
  <v-sheet class="tabs-content-container h-100 px-3 py-6 rounded-lg">
    <div class="ecdis">
      <v-img :src="ecdis" aspect-ratio="16/9" />
    </div>
  </v-sheet>
</template>

<script setup>
import ecdis from '/images/ins/ecdis.png'
</script>

<style scoped>
.title {
  font-size: 2em;
  line-height: 1;
}

/* .image-container {
  height: calc(100% - 48px);
} */

.ecdis .v-img {
  min-height: 650px;
}
</style>
