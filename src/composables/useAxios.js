import axios from 'axios'
import { goPage } from '@/composables/util.js'
import { useToast } from '@/composables/useToast'


const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  // timeout: 20000
})

instance.interceptors.response.use((response)=> {
  return response

},(error)=>{
  const { showResMsg } = useToast()
  let errorCode = ''
  let errMsg = ''

  if(error.response.data){
    errorCode = error.response.data.errorCode
    errMsg = error.response.data.errorMsg
  }

  if(errorCode == "UNAUTHENTICATED_USER"){
    localStorage.clear()
    goPage('/auth/login')
  }

  showResMsg(errMsg)

  return error
})

export default instance
