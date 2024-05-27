import instance from '@/composables/useAxios.js'
import { method } from 'lodash'

export const updateSettingInformation = (settingsForm) => {
  return instance({
    url: '/system-setting/update-data',
    method: 'POST',
    data: settingsForm
  })
}

export const getCCTVSetting = (cctvKey) => {
  return instance({
    url: '/system-setting/get-data',
    method: 'GET',
    params: { key: cctvKey }
  })
}

export const getDataSetting = (dataKey) => {
  return instance({
    url: '/system-setting/get-data',
    method: 'GET',
    params: { key: dataKey }
  })
}

export const getPopupOpacitySetting = (popupKey) => {
  return instance({
    url: '/system-setting/get-data',
    method: 'GET',
    params: { key: popupKey }
  })
}

export const getUserSetting = (userId) => {
  return instance({
    url: '/user-setting/get-data',
    method: 'GET',
    params: { id: userId }
  })
}

export const updateUserSettings = (settingsForm) => {
  return instance({
    url: '/user-setting/update-data',
    method: 'POST',
    data: settingsForm
  })
}
