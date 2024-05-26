import { reactive, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import {
    getRouteInfoById
  } from '@/api/routePlanApi'

export const useRouteStore = defineStore(
    'routeManagement',
    () => {
        const routeMaster = ref({
            routeid:0,
            routename: '',
            makename: '',
            makedate: '',
            modifydate: '',
            usefg: ''
        })
        const routeDetail = ref({
            routeid: 0,
            lon: '',
            lat: ''
        })

        const routelist = ref([])

        const fetchRouteInfoById = async (id) => {
            const result = await getRouteInfoById(id)
            console.log(result)
            return result
        }

        return {
            routeMaster,
            routeDetail,
            routelist,
            fetchRouteInfoById
        }
    }
)
