<template>
  <PopupSelectedShipSummary class="ma-3" :curSelectedShipImoNumber="selectedImoNumber" />
  <v-sheet class="ins-content-container px-3 mx-3 py-3 rounded-lg">
    <div class="rader-image-container">
      <v-img :src="radar" aspect-ratio="16/9" />
    </div>
  </v-sheet>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onUnmounted } from 'vue'
import PopupSelectedShipSummary from '@/components/ship/PopupSelectedShipSummary.vue'
import radar from '/images/ins/radar.jpg'

import { v4 } from 'uuid'

let eventSource = ''
const selectedImoNumber = ref()

let interval = ''

onBeforeMount(() => {
  clearInterval(interval)
  interval = null
  // let uuid = crypto.randomUUID()
  let uuid = v4()
  eventSource = new EventSource(`/api/sse/subscribe?subScribeId=${uuid}`)

  eventSource.addEventListener('sse', (e) => {
    recieveImoNumber(e)
  })
})

onMounted(() => {
  let url = new URLSearchParams(location.search)
  let imoNumber = url.get('imoNumber')
  selectedImoNumber.value = imoNumber

  // CCTV 조회
})

onUnmounted(() => {
  eventSource.close()
})

const recieveImoNumber = (e) => {
  console.log('구독 이벤트')
  console.dir(e)
  let curSelectedShipImoNumber = null
  const result = JSON.parse(e.data)

  if (result.sseReturnCode == 'CHANGED_SHIP') {
    console.log('선박 변경')
    console.dir(e)
    curSelectedShipImoNumber = result.msg
    console.log(e.msg)
    console.log(result.msg)
    if (result.msg) {
      selectedImoNumber.value = result.msg
    }
  }
}
</script>

<style scoped>
.image-container.radar img.v-img__img--contain {
  object-fit: fill;
  background: #010f02;
}

.ins-content-container {
  height: 100vh;
  max-height: calc(100vh - 60px - 36px);
}

.rader-image-container {
  height: 100%;
  max-height: calc(100%);
}

/* @media (max-height: 800px) {
  .radar-image-container {
    overflow-y: auto;
  }
} */
</style>
