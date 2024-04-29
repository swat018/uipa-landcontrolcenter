import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
 	const isShow = ref(false)
	const resMessage = ref('')

	const showResMsg = (message) => {
			isShow.value = true
			resMessage.value = message
		}

  return {
    isShow,
    resMessage,
    showResMsg
  }
})