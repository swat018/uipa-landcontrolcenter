import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getCiiListByImoNumber,
  getAnnualCiiData,
  getMonthlyCiiData,
  getPastCiiData,
  updateCiiFutureData
} from '@/api/cii.js'
import { useToast } from '@/composables/useToast'
import {
  convertNumberFormat,
  convertFloatFormatObject,
  convertDateTimeType,
  convertStringToFloat
} from '@/composables/util'

export const useCiiStore = defineStore('ciiManagement', () => {
  const { showResMsg } = useToast()
  const ciiList = ref([])
  const annualCiiData = ref({})
  const monthlyCiiData = ref({
    ciiGradeList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ciiRatingList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    attainedCiiList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    co2EmissionList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focTotalList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focHfoList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focMdoList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focMgoList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focLfoList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focLpgList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focLngList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ciiGradeRangeA: {
      first: null,
      second: null
    },
    ciiGradeRangeB: {
      first: null,
      second: null
    },
    ciiGradeRangeC: {
      first: null,
      second: null
    },
    ciiGradeRangeD: {
      first: null,
      second: null
    },
    ciiGradeRangeE: {
      first: null,
      second: null
    }
  })
  const pastCiiData = ref({
    first: [
      {
        sailing: null,
        distance: null,
        speed: null,
        focHfo: null,
        focLfo: null,
        focMdo: null,
        focMgo: null,
        focLpg: null,
        focLng: null,
        co2Emission: null,
        requiredCii: null,
        attainedCii: null,
        ciiRating: null,
        ciiGrade: null
      },
      {
        sailing: null,
        distance: null,
        speed: null,
        focHfo: null,
        focLfo: null,
        focMdo: null,
        focMgo: null,
        focLpg: null,
        focLng: null,
        co2Emission: null,
        requiredCii: null,
        attainedCii: null,
        ciiRating: null,
        ciiGrade: null
      }
    ],
    second: {
      pastCiiGrade: null,
      pastDistance: null,
      pastCo2Emission: null,
      finalCiiGrade: null,
      finalDistance: null,
      finalCo2Emission: null
    }
  })

  /**
   * 지도 위 클릭한 선박 정보 조회
   * @returns
   */
  const fetchCiiListByImoNumber = async (imoNumber) => {
    try {
      const {
        data: { data }
      } = await getCiiListByImoNumber(imoNumber)

      if (data != null) {
        ciiList.value = data.map((cii) => convertFloatFormatObject(cii))
      } else {
        ciiList.value = []
      }
      console.dir(ciiList.value)
    } catch (error) {
      console.dir(error)
    }
  }

  const fetchAnualCiiData = async (imoNumber, year) => {
    try {
      const {
        data: { data }
      } = await getAnnualCiiData(imoNumber, year)

      if (data != null) {
        annualCiiData.value = convertFloatFormatObject(data)
      } else {
        annualCiiData.value = []
      }
    } catch (error) {
      console.dir(error)
    }
  }

  const fetchMonthlyCiiData = async (imoNumber, year) => {
    try {
      const {
        data: { data }
      } = await getMonthlyCiiData(imoNumber, year)

      if (data) {
        monthlyCiiData.value = convertFloatFormatObject(data)
        console.log('Monthly Api 데이터 변환 후')
        console.dir(monthlyCiiData)
      } else {
        monthlyCiiData.value = convertFloatFormatObject(monthlyCiiData.value)
      }

      return monthlyCiiData.value
    } catch (error) {
      console.dir(error)
    }
  }

  const fetchPastCiiData = async (form) => {
    try {
      console.log('과거 데이터 요청 폼')
      console.dir(form)
      const {
        data: { data }
      } = await getPastCiiData(form)

      console.log('변환 전')
      console.dir(data)

      if (data) {
        pastCiiData.value = convertFloatFormatObject(data)
      } else {
        pastCiiData.value = convertFloatFormatObject(pastCiiData.value)
      }

      console.dir('변환 후')
      console.dir(pastCiiData.value)

      return pastCiiData.value
    } catch (error) {
      console.dir(error)
    }
  }

  const simulateCiiData = async (form) => {
    try {
      console.log('미래 데이터 요청 폼')
      console.dir(form)
      form.pastData = convertStringToFloat(form.pastData)
      form.futureData = convertStringToFloat(form.futureData)

      console.log('변환 후 form')
      console.dir(form)

      const {
        data: { data }
      } = await updateCiiFutureData(form)

      // console.dir(response)

      if (data) {
        pastCiiData.value.first[1] = convertFloatFormatObject(data.first)
        pastCiiData.value.second = data.second
        showResMsg('시뮬레이션 데이터가 업데이트 되었습니다')
      } else {
        pastCiiData.value.first[1] = convertFloatFormatObject(pastCiiData.value)
      }

      return pastCiiData.value
    } catch (error) {
      console.dir(error)
    }
  }

  return {
    ciiList,
    pastCiiData,
    annualCiiData,
    monthlyCiiData,
    fetchCiiListByImoNumber,
    fetchAnualCiiData,
    fetchMonthlyCiiData,
    fetchPastCiiData,
    simulateCiiData
  }
})
