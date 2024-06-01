import instance from '@/composables/useAxios.js'

export const changeShipByImoNumber = (subScribeId, imoNumber) => {
  return instance({
    url: '/sse/changed-ship',
    method: 'POST',
    params: { subScribeId, imoNumber }
  })
}

export const getVoyageList = (imoNumber) => {
  return instance({
    url: '/world-map/get-simple-voyage',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getTotalInfo = (imoNumber) => {
  return instance({
    url: '/world-map/get-total-info',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getShipData = (imoNumberList) => {
  return instance({
    url: '/world-map/get-ship-data',
    method: 'GET',
    params: { imoNumberList: imoNumberList }
  })
}

export const getShipWakeCurrent = (imoNumber) => {
  return instance({
    url: '/world-map/get-ship-wake-current',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getShipWakePast = (imoNumber, startTime, endTime) => {
  return instance({
    url: '/world-map/get-ship-wake-past',
    method: 'GET',
    params: { imoNumber, startTime, endTime }
  })
}
