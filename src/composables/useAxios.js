import axios from 'axios'

import { storeToRefs } from 'pinia'
import { goPage } from '@/composables/util.js'
import { useToast } from '@/composables/useToast'
import { useLoadingStore } from '@/stores/loadingStore'

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL
  // timeout: 20000
})

let backgroundApies = [
  '/ship/alarm/monitoring/condition',
  '/world-map/get-ship-data',
  '/world-map/get-total-info',
  '/ship/cii/get-cii-past',
  '/ship/cii/get-cii-future',
  '/ship/cii/get-cii-boundary',
  '/ship/info/get'
]

instance.interceptors.request.use((config) => {
  const loadingStore = useLoadingStore()
  const { loadingStatus } = storeToRefs(loadingStore)

  const isBackgroudApi = backgroundApies.includes(config.url)

  if (!isBackgroudApi) {
    loadingStatus.value = true
  }
  return config
})

instance.interceptors.response.use(
  (response) => {
    const loadingStore = useLoadingStore()
    const { loadingStatus } = storeToRefs(loadingStore)
    const isBackgroudApi = backgroundApies.includes(response.config.url)

    if (!isBackgroudApi) {
      loadingStatus.value = false
    }
    return response
  },
  (error) => {
    const { showResMsg } = useToast()
    const loadingStore = useLoadingStore()
    const { loadingStatus } = storeToRefs(loadingStore)
    const isBackgroudApi = backgroundApies.includes(error.config.url)
    let errorCode = ''
    let errMsg = ''

    if (error.response.data) {
      errorCode = error.response.data.errorCode
      errMsg = error.response.data.errorMsg
    }

    if (errorCode == 'UNAUTHENTICATED_USER') {
      localStorage.clear()
      goPage('/auth/login')
    }

    showResMsg(errMsg)
    if (!isBackgroudApi) {
      loadingStatus.value = false
    }

    return error
  }
)

export default instance
