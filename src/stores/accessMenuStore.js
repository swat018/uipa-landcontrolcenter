import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAccessMenu } from '@/api/accessMenuApi.js'
import router from '@/routes/index.js'

export const useAccessMenuStore = defineStore(
  'AccessMenu',
  () => {
    const accessMenus = ref([])

    const fetchAccessMenu = async () => {
      let result = ''
      await getAccessMenu().then((response) => {
        console.dir(response)
        if (response.status == 200) {
          const menus = response.data.data.firstMenuList
          menus.forEach((parentMenu, index) => {
            const { data, children } = parentMenu
            if (data != null) {
              accessMenus.value.push(data)
              if (children != null) {
                accessMenus.value[index]['children'] = []
                children.forEach((childrenMenu) => {
                  accessMenus.value[index]['children'].push(childrenMenu.data)
                })
              }
            }
          })

          result = menus;
        }
      }).catch((error)=>{
        // goPage('/noAccess')
        console.dir(error)
        const errMessage = error.response.data.errorMsg;
        router.push({ name: 'NoAccess', state: { message: errMessage } })
      })
      return result
    }

    return { accessMenus, fetchAccessMenu }
  },
  {
    persist: true,
    persistOptions: {
      key: 'menuStore' // Unique key for each store
    }
  }
)
