<template>
  <v-sheet class="ins-content-container h-100 px-3 py-6 rounded-lg">
    <div class="radar-image-container">
      <v-img :src="radar" aspect-ratio="16/9" />
    </div>
  </v-sheet>
</template>

<script setup>
import radar from '/images/ins/radar.jpg'
</script>

<style scoped>
.image-container.radar img.v-img__img--contain {
  object-fit: fill;
  background: #010f02;
}

@media (max-height: 800px) {
  .radar-image-container {
    overflow-y: auto;
  }
}
</style>
