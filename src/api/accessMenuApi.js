import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.MODE.VITE_APP_API_URL,
  timeout : 3000
})

export const getAccessMenu = () => {
  return axios
    .get('/api/menu-group/get-accessible-menu')
}
