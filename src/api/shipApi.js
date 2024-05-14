import axios from 'axios'
import instance from '@/composables/useAxios.js'

export const registerShip = (shipRegisterForm) => {
  return instance({
    url : '/ship/info/register',
    method : 'POST',
    data : shipRegisterForm
  })
}

export const updateShip = (shipRegisterForm) => {
  return instance({
    url  : '/ship/info/change',
    method : 'POST',
    data : shipRegisterForm
  })
}

export const updateShipImage = (imoNumber, image) =>{
  return instance({
    url: '/ship/info/update-ship-image',
    method: 'POST',
    params: { imoNumber },
    data: image,
    headers: {
      'Content-Type': 'application/octet-stream' // or appropriate content type
    }
  })
}

export const getShipsByVocc = () => {
  return instance({
    url : '/ship/info/get-all',
    method : 'GET',
  })
}

export const getShipsByFleetId = (fleetId) => {
  return axios
    .get(`/api/vocc/get-ship-list-by-fleet?fleetId=${fleetId}`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.log(error)
    })
}

export const getShipInfo = (imoNumber) => {
  return instance({
    url : '/ship/info/get',
    method : 'GET',
    params : { imoNumber }
  })
}

export const getShipDetailInfo = (imoNumber) => {
  return instance({
    url: '/ship/info/get-detail',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getShipAisInfo = (imoNumber) => {
  return instance({
    url: 'world-map/get-ais',
    method : 'GET',
    params : { imoNumber }
  })
}

export const deleteShip = (imoNumber) => {
  return instance({
    url: '/ship/info/remove',
    method: 'POST',
    params : { imoNumber }
  })
}

export const getShipMachineInfo = (imoNumber) => {
  return instance({
    url: '/ship/info/get-machine-data',
    method: 'GET',
    params: { imoNumber }
  })
}

