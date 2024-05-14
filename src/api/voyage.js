import instance from '@/composables/useAxios.js'

export const insertVoyage = (voyageRegisterForm) => {
  return instance({
    url: '/ship/voyage/insert-voyage',
    method: 'POST',
    data: voyageRegisterForm
  })
}

export const updateVoyageInfo = (voyageEditForm) => {
  return instance({
    url: '/ship/voyage/update-voyage',
    method: 'POST',
    data: voyageEditForm
  })
}

export const updateVoyage = (voyageEditForm) => {
  return instance({
    url: '/ship/voyage/update-voyage-detail',
    method: 'POST',
    data: voyageEditForm
  })
}

export const deleteVoyageById = (voyageId) => {
  return instance({
    url: '/ship/voyage/remove-voyage',
    method: 'POST',
    params: { id: voyageId }
  })
}

export const getAllVoyageByImoNumber = (imoNumber) => {
  return instance({
    url: '/ship/voyage/get-all-voyage-by-ship',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getVoyageById = (voyageId) => {
  return instance({
    url: '/ship/voyage/get-voyage',
    method: 'GET',
    params: { id: voyageId }
  })
}

export const getVoyageTrack = (voyageId) => {
  return instance({
    url: '/ship/voyage/get-voyage-track',
    method: 'GET',
    params: { id: voyageId }
  })
}
