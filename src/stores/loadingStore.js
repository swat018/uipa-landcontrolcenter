import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const loadingStatus = ref(false)

  return {
    loadingStatus
  }
})
