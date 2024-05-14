import instance from '@/composables/useAxios.js'
import { method } from 'lodash'

export const getMonitoring = (imoNumber) => {
    return instance({
        url: '/ship/engine/get-monitoring',
        method: 'GET',
        params: {imoNumber} 
    })
}