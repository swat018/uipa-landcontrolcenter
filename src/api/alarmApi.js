import instance from '@/composables/useAxios.js'

export const getRealAlarm = (imoNumber) => {
  return instance({
    url: '/ship/alarm/monitoring/get',
    method: 'GET',
    params: { imoNumber }
  })
}


export const getSummaryAlarm = (imoNumber) => {
  return instance({
    url: '/ship/alarm/monitoring/summary',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getShipCondition = (imoNumbers) => {
  return instance({
    url : '/ship/alarm/monitoring/condition',
    method : 'GET',
    params : { imoNumberList : imoNumbers}
  }).then((response => {
    const { data : { data }} = response
    return data;
  }))
}