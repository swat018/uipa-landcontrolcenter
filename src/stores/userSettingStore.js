import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { getUserSetting, updateUserSettings } from '@/api/settingsApi.js'
import { useToast } from '@/composables/useToast'

import _ from 'lodash'

export const useUserSettingStore = defineStore('userSetting', () => {
  const { showResMsg } = useToast()

  const settingsForm = ref({
    id: null,
    settingDataMap: {
      popupOpacity: null
    }
  })

  const fetchUserSettings = async (id) => {
    try {
      const {
        status,
        data: { data }
      } = await getUserSetting(id)

      if (status == 200) {
        settingsForm.value = data
      }
    } catch (error) {
      console.log(error)
    }
  }

  const editUserSettings = async (editForm) => {
    try {
      const { status, response } = await updateUserSettings(editForm)
      if (status == 200) {
        showResMsg('정보가 수정되었습니다')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    settingsForm,
    fetchUserSettings,
    editUserSettings
  }
})
