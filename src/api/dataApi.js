import instance from '@/composables/useAxios.js'
import { method } from 'lodash'

export const getMonitoring = (imoNumber) => {
  return instance({
    url: '/ship/engine/get-monitoring',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getPeriodEngineData = (periodForm) => {
  return instance({
    url: '/ship/engine/get-period',
    method: 'GET',
    params: { ...periodForm }
  })
}

export const getEnginePerformanceData = (performanceForm) => {
  return instance({
    url: '/ship/engine/get-performance',
    method: 'GET',
    params: { ...performanceForm }
  })
}

export const getAnalysisData = (requestForm) => {
  return instance({
    url: '/ship/data-analysis/get-analysis-chart',
    method: 'GET',
    params: requestForm
  })
}

export const getEquimentList = (requestForm) => {
  return instance({
    url: '/ship/data-analysis/essential-data/get-all-simple',
    method: 'GET',
    params: requestForm
  })
}
