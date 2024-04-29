import { reactive, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import {
  registerShip,
  updateShip,
  updateShipImage,
  getShipsByVocc,
  getShipsByFleetId,
  getShipInfo,
  deleteShip
} from '@/api/shipApi.js'
import { useFleetStore } from '@/stores/fleetStore'
import { useToast } from '@/composables/useToast'
import _ from 'lodash'


export const useShipStore = defineStore('shipManagement', () => {
  const ships = ref([])
  const shipInfo = ref()
  const currentShip = ref(null)
  const fleetStore = useFleetStore()
  const { showResMsg } = useToast()

  /**
   * 선박 추가
   * @param {*} shipRegisterForm 
   * @returns 
   */
  const addShip = async (shipRegisterForm) => {
    try {
      const response = await registerShip(shipRegisterForm)
      console.dir(response)
      let {  data : { statusCode } } = response
      console.log(statusCode)
      let status = parseInt(statusCode.substr(0,3))
      console.log(status)
      if (status == 201) {
        ships.value.push(shipRegisterForm)
        showResMsg('선박이 성공적으로 추가가 되었습니다')
        return status
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 선박 정보 수정
   * @param {} shipEditForm 
   */
  const editShipInfo = async (shipEditForm) => {
    try {
      const response = await updateShip(shipEditForm)
      const status = response.status
      if(status == 200){
        shipInfo.value = { ...shipEditForm }
        showResMsg('선박 정보가 수정되었습니다')
      }
    }catch (error) {
      const errorMsg = error.response.data.errorMsg
      showResMsg(errorMsg)
    }
  }


  /**
   * 선박 이미지 변경
   * @param {*} imoNumber 
   * @param {*} image 
   * @returns 
   */
  const changeShipImage = async (imoNumber, image) => {
    try {
      const { status } = await updateShipImage(imoNumber, image)

      if (status == 200) {
        const result = btoa(String.fromCharCode.apply(null, image))
        shipInfo.value.shipImage = result
        return status
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 선사의 선박 목록 조회
   * 선박 정보에 선사 아이디, 선사명 추가
   * @returns
   */
  const fetchShipsByVocc = async () => {
    try {
      const response = await getShipsByVocc()
        const { data : { data : result } } = response
  
        if (fleetStore.fleets.length <= 0) {
          await fleetStore.fetchFleetsByVocc()
        }
        let fleetInfo = {}
        const newShipInfo = result.map((item) => {
          fleetInfo = isIncludedShip(fleetStore.fleets, item)
          return { ...item, ...fleetInfo }
        })

        ships.value = _.cloneDeep(newShipInfo)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 선단 아이디를 통해 선사의 선박 목록 조회
   * @param {} voccId 
   */
  const fetchShipsByFleetId = async (fleetId) => {
    const result = await getShipsByFleetId(fleetId)
    return result.data
  }

  /**
   * 선박 정보 조회
   * @returns
   */
  const fetchShipInfo = async (imoNumber) => {
    try {
      const response = await getShipInfo(imoNumber)
      // ({
      //     data: { data: shipInfo.value }
      //   } = response)
      shipInfo.value = response.data.data
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 선박 정보 삭제
   * @returns
   */
  const removeShip = async (imoNumber) => {
    try {
      const response = await deleteShip(imoNumber)
      const status = response.status
      if(status == 200){
        const index = ships.value.findIndex((ship) => ship.imoNumber === imoNumber)
        ships.value.splice(index, 1)
        showResMsg('해당 선박이 성공적으로 삭제되었습니다')
        return status
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    ships,
    currentShip,
    shipInfo,
    addShip,
    editShipInfo,
    changeShipImage,
    fetchShipsByVocc,
    fetchShipsByFleetId,
    fetchShipInfo,
    removeShip
  }
}, {
  persist : true
})

/**
 * 선사에 선박이 속하는지 확인
 * @param {*} fleets 
 * @param {*} ship 
 * @returns 
 */
const isIncludedShip = (fleets, ship) => {
  for (let fleet of fleets) {
    if (fleet['imoNumberList'] === null) return

    if (fleet['imoNumberList'].includes(ship.imoNumber)) {
      return { fleetId: fleet['id'], fleetName: fleet['name'] }
    }
  }
}
