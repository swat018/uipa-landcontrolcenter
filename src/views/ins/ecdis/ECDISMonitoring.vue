<template>
  <v-sheet class="title-image-container rounded-lg ">
    <div class="title text-center d-flex justify-center align-center mb-6">ECDIS</div>
    <div class="image-container ecdis">
      <v-img :src="ecdis" aspect-ratio="16/9" />
    </div>
  </v-sheet>
</template>

<script setup>
import ecdis from '/images/ins/ecdis.png'
</script>

<style scoped>
.title {
  font-size : 2em;
  line-height: 1;
}

.image-container {
  height: calc(100% - 48px);
}

.ecdis .v-img {
  min-height: 650px;
}
</style>