import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getShipInfo, getShipAisInfo } from '@/api/shipApi.js'
import { getVoyageList, getShipData } from '@/api/worldMap.js'
import { useToast } from '@/composables/useToast'
import {convertNumberFormat, convertDateType, convertDateTimeType } from '@/composables/util'
import { resetObject } from '@/composables/util'

export const useMapStore = defineStore('mapManagement', () => {
    const clickedShipInfo = ref({
        beam : 0,
        callSign : '',
        grossTonnage : 0,
        imoNumber : '',
        length : 0,
        mmsiNumber : '',
        name : '',
        nation : '',
        shipImage : '',
        type : '',
        voccId : null,
        yearBuilt : ''
      }
    )
    const selectedPopMenu = ref(null)
    const aisInfo = ref({
      startPort: 'NaN',
      endPort: 'NaN',
      startTime: 'NaN',
      endTime: 'NaN',
      endDateTime: 'NaN',
      process: 0,
      latitude: 0,
      longitude: 0,
      course: 0,
      speed: 0,
      draft: 0
    })

    const voyageList = ref([])

    const imoNumberList = ref([])
    const shipDataList = ref([])

    const vesselTrackStatus = ref(false)

    /**
     * 지도 위 클릭한 선박 정보 조회
     * @returns
     */
    const fetchShipSummary = async (imoNumber) => {
      try {
        const response = await getShipInfo(imoNumber)
        // ({
        //     data: { data: shipInfo.value }
        //   } = response)
        console.log('선박 정보')
        console.dir(response)
        clickedShipInfo.value = response.data.data
        sessionStorage.setItem('clickedShipInfo', JSON.stringify(clickedShipInfo.value))
        console.dir(clickedShipInfo.value)
      } catch (error) {
        console.error(error)
      }
    }

    const fetchShipAisInfo = async(imoNumber) =>{
      try{
        const response = await getShipAisInfo(imoNumber);
        console.log('AIS 정보')
        let { data : { data }} = response
        console.dir(response)

        data.startPort = data.startPort ? data.startPort : 'NaN'
        data.endPort = data.endPort ? data.endPort : 'NaN'
        data.startTime = data.startTime ? convertDateType(data.startTime) : 'NaN'
        data.endTime = data.endTime ? convertDateType(data.endTime) : 'NaN'
        data.endDateTime = data.endTime;

        data.course = data.course.toFixed(1)
        data.speed = data.speed.toFixed(1)
        data.draft = data.draft.toFixed(1)
        data.process = data.process.toFixed(1)

        console.log(data.speed)

        aisInfo.value = data;
      }catch(error){
        console.error(error)
      }
    }

    const fetchVoyageList = async (imoNumber) => {
      try {
        const response = await getVoyageList(imoNumber)
        let {
          data: { data }
        } = response

        voyageList.value = data
      } catch (error) {
        console.error(error)
      }
    }

    const fetchShipData = async (imoNumberList) => {
      try {
        const response = await getShipData(imoNumberList)
        let {
          data: { data }
        } = response

        console.log(data)
        shipDataList.value = data.data
      } catch (error) {
        console.error(error)
      }
    }

    const $reset = ()=>{
      resetObject(clickedShipInfo.value)
      resetObject(selectedPopMenu)
      selectedPopMenu.value = null
      voyageList.value = []
      imoNumberList.value = []
      shipDataList.value = []
    }

    return {
      aisInfo,
      voyageList,
      imoNumberList,
      shipDataList,
      clickedShipInfo,
      vesselTrackStatus,
      selectedPopMenu,
      fetchShipSummary,
      fetchShipAisInfo,
      fetchVoyageList,
      fetchShipData,
      $reset
    }
  },
//{
//   persist : true
// }
)
