<template>
  <v-sheet class="title-image-container rounded-lg">
    <div class="title text-center d-flex justify-center align-center mb-6">RADAR</div>
    <div class="image-container radar">
      <v-img :src="radar" />
    </div>
  </v-sheet>
</template>

<script setup>
import radar from '/images/ins/radar.jpg'
</script>

<style scoped>
.title {
  font-size: 2em;
  line-height: 1;
  /* margin-bottom: 12px; */
}

.image-container {
  height: calc(100% - 48px);
}

.ecdis-container {
  height: calc(100vh - 65px - 48px);
  /* justify-content: center; */
}

.image-container.radar img.v-img__img--contain {
  object-fit: contain;
  background: #010F02;
}

.radar .v-img{
  min-height: 650px;
}

@media (max-height : 800px) {
  .image-container.radar {
    overflow-y: auto;
  }
}

</style>