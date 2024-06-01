<template>
  <v-sheet class="ins-content-container rounded-lg">
    <div class="ecdis pt-3">
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
  min-height: 600px;
}
</style>
