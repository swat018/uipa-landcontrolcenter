import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getAllVoyageByImoNumber } from '@/api/voyage.js'
import { useToast } from '@/composables/useToast'
import {convertNumberFormat, convertDateType, convertDateTimeType } from '@/composables/util'

export const useVoyageStore = defineStore('voyageManagement', () => {
  const voyages = ref([])
  /**
   * 지도 위 클릭한 선박 정보 조회
   * @returns
   */
  const fetchAllVoyageByImoNumber = async (imoNumber) => {
    try {
      ({ data: { data: voyages.value }} = await getAllVoyageByImoNumber(imoNumber))
            
    } catch (error) {
      console.error(error)
    }
  }


  return {
    voyages,
    fetchAllVoyageByImoNumber
  }
})
