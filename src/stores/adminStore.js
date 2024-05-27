import { defineStore } from 'pinia'
import { ref } from 'vue'
import { goPage } from '@/composables/util.js'
import {
  updateSettingInformation,
  getCCTVSetting,
  getDataSetting,
  getPopupOpacitySetting
} from '@/api/settingsApi.js'
// import { useAxios } from '@/composables/useAxios'
import {
  registerVocc,
  updateVoccInfo,
  getVoccListAll,
  getVoccAdminListAll,
  getVoccAdmin,
  getVoccAdminInfo,
  getVoccsWithoutAdmin,
  getVoccUserListAll,
  getAdminsByVoccId,
  getVoccUser,
  getVoccInfoByVoccId,
  deleteVoccAdmin,
  joinVoccUser,
  deleteVoccUser,
  changeUserActivate,
  changeUserRole,
  updateVoccLogo,
  getFleetAndShipByVocc,
  getVoccs,
  getMyVoccAdmins,
  updatePresidentAdmin,
  getUsersByVoccId
} from '@/api/voccApi'

import { useToast } from '@/composables/useToast'

export const useAdminStore = defineStore(
  'admin',
  () => {
    const voccsAdmins = ref([])
    const voccsUsers = ref([])

    const voccAdminEditForm = ref({
      voccName: '',
      username: '',
      password: '********',
      nickname: '',
      email: '',
      role: '',
      activated: ''
    })

    const voccUserInfo = ref({
      id: 0,
      voccName: '',
      username: '',
      nickname: '',
      email: '',
      role: '',
      activated: ''
    })

    // 선사 기초 정보
    const voccInfo = ref()
    const fleetsAndShip = ref([])

    const cctvInterval = ref({
      key: 'cctvRemoveInterval',
      valueInt: null,
      valueString: null
    })

    const dataInterval = ref({
      key: 'dataRefreshInterval',
      valueInt: null,
      valueString: null
    })

    const popupOpacity = ref({
      key: 'popupOpacity',
      valueInt: null,
      valueString: null
    })

    const { showResMsg } = useToast()

    /**
     * 선사 목록 조회
     * @param
     * @returns
     */
    const fetchVoccListAll = async () => {
      const response = await getVoccListAll()
      const {
        data: { data }
      } = response

      if (response.status == 200) {
        return data
      }
    }

    const fetchVoccs = async () => {
      const response = await getVoccs()
      const {
        data: { data }
      } = response

      if (response.status == 200) {
        return data
      }
    }

    /**
     * 관리자가 없는 선사 목록 조회
     */
    const fetchVoccsWithoutAdmin = async () => {
      let result
      await getVoccsWithoutAdmin()
        .then((response) => {
          console.dir(response)
          result = response
        })
        .catch((err) => {
          console.log(err)
        })
      return result
    }

    /**
     * 선사 정보 조회
     * @param {Number} voccUserId
     * @returns
     */

    const fetchVoccInfoByVoccId = async (voccId) => {
      try {
        const response = await getVoccInfoByVoccId(voccId)
        const {
          data: { data }
        } = response
        return data
      } catch (error) {
        const errMsg = error.response.data.errorMsg
        showResMsg(errMsg)
        // console.dir(error)
      }
    }

    /**
     * 선사 정보 수정
     * @param {*} voccId
     * @param {*} editForm
     * @returns
     */
    const editVoccInfo = async (voccId, editForm) => {
      try {
        delete editForm.logoImage
        const response = await updateVoccInfo(editForm)
        const status = response.status
        if (status == 200) {
          ;({
            data: { data: voccInfo.value }
          } = response)
          voccInfo.value = { voccId, ...editForm }
          sessionStorage.setItem('voccInfo', JSON.stringify(voccInfo.value))
          return status
        }
      } catch (error) {
        console.log(error)
      }
    }

    const changeLogoImage = async (image) => {
      try {
        const { status } = await updateVoccLogo(image)

        if (status == 200) {
          const result = btoa(String.fromCharCode.apply(null, image))
          voccInfo.value.logoImage = result
          return status
        }
      } catch (error) {
        console.error(error)
      }
    }

    /**
     * 선사 관리자 등록
     * @param {*} param
     * @returns
     */
    const joinVoccAdmin = async (voccId, registerForm) => {
      try {
        let role
        if (voccId == 0) {
          role = 'ROLE_LCC_ADMIN'
        } else {
          role = 'ROLE_VOCC_ADMIN'
        }
        registerForm.role = role

        const response = await registerVocc(registerForm)
        const { status, data } = response
        if (status == 200) {
          registerForm.id = data
          registerForm.activated = true

          let newUserVoccName = registerForm.voccName
          let voccsAdminVoccName = voccsAdmins.value[0].voccName
          if (newUserVoccName == voccsAdminVoccName) {
            voccsAdmins.value.push(registerForm)
          }
          showResMsg('관리자 등록이 성공적으로 되었습니다')

          return status
        }

        console.dir(response)
      } catch (error) {
        const errMsg = error.response.data.errorMsg
        showResMsg(errMsg)
      }
    }

    /**
     * 선사별 관리자 목록 조회(UIPA)
     * @param
     * @returns
     */
    const getVoccAdmins = async () => {
      let result
      await getVoccAdminListAll()
        .then((response) => {
          result = response
          voccsAdmins.value = response
        })
        .catch((err) => {
          console.log(err)
        })

      return result
    }

    /**
     * 선사 관리자 목록 조회
     * @param
     * @returns
     */
    const fetchMyVoccAdmins = async () => {
      let result
      await getMyVoccAdmins()
        .then((response) => {
          result = response
          voccsAdmins.value = response

          console.dir(voccsAdmins)
        })
        .catch((err) => {
          console.log(err)
        })

      return result
    }

    /**
     * 선사 아이디를 통한 관리자 목록 조회
     * @param {*} voccId
     * @returns
     */

    const fetchAdminsByVoccId = async (voccId) => {
      const result = await getAdminsByVoccId(voccId)
      console.log('관리자 목록')
      console.dir(result)
      voccsAdmins.value = result

      console.dir(voccsAdmins.value)
      return result
    }

    const fetchVoccAdminInfo = async (voccId, userId) => {
      try {
        const response = await getVoccAdminInfo(voccId, userId)
        const {
          data: { data }
        } = response

        console.dir(response)
        voccAdminEditForm.value = {
          userId: data.userId,
          voccName: data.voccName,
          username: data.username,
          nickname: data.nickname,
          email: data.email,
          role: data.role,
          activated: data.activated
        }
      } catch (error) {
        console.log(error)
      }

      return voccAdminEditForm
    }

    /**
     * 선사 관리자 삭제
     * @param {} voccAdminId
     * @param {*} removeVoccAdminInfo
     */
    const removeAdmin = async (voccAdminId, removeVoccAdminInfo) => {
      try {
        const response = await deleteVoccAdmin(removeVoccAdminInfo)

        const { status } = response

        if (status == 200) {
          const index = voccsAdmins.value.findIndex((voccAdmin) => voccAdmin.id === voccAdminId)
          voccsAdmins.value.splice(index, 1)
          showResMsg('선사 관리자가 삭제되었습니다')
        }
      } catch (error) {
        const errMsg = error.response.data.errorMsg
        showResMsg(errMsg)
      }
    }

    const registerVoccUserByAdmin = async (registerForm) => {
      try {
        const result = await joinVoccUser(registerForm)
        if (result.status == 200) {
          let newUserVoccName = registerForm.voccName
          let voccsUserVoccName = voccsUsers.value[0].voccName
          if (newUserVoccName == voccsUserVoccName) {
            voccsUsers.value.push(registerForm)
          }
          showResMsg('사용자 등록이 성공적으로 되었습니다')
          console.log('사용자 등록 성공 후')
          console.dir(voccsUsers)
        }
      } catch (err) {
        const errMsg = err.response.data.errorMsg
        showResMsg(errMsg)
      }
    }

    /**
     * 선사 사용자 목록 조회
     * @param
     * @returns
     */
    const getVoccUsers = async () => {
      let result
      await getVoccUserListAll()
        .then((response) => {
          result = response
          voccsUsers.value = response
        })
        .catch((err) => {
          console.log(err)
        })

      return result
    }

    /**
     * 선사 아이디를 통한 사용자 목록 조회
     * @param {*} voccId
     * @returns
     */

    const fetchUsersByVoccId = async (voccId) => {
      const result = await getUsersByVoccId(voccId)
      voccsUsers.value = result
      return result
    }

    /**
     * 선사 사용자 정보 조회
     * @param {Number} voccUserId
     * @returns
     */

    const getVoccUserInfo = async (voccId, userId) => {
      try {
        const response = await getVoccUser(voccId, userId)
        const {
          data: { data }
        } = response
        voccUserInfo.value = data
      } catch (error) {
        console.error(error)
      }
    }

    /**
     * 선사 사용자 삭제
     * @param {} voccAdminId
     * @param {*} removeVoccUserInfo
     */
    const removeVoccUser = async (voccUserId, removeVoccUserInfo) => {
      await deleteVoccUser(removeVoccUserInfo).then(() => {
        const index = voccsUsers.value.findIndex((voccUser) => voccUser.id === voccUserId)
        voccsUsers.value.splice(index, 1)
        showResMsg(' 사용자가 삭제되었습니다')
      })
    }

    const changeActiveByAdmin = async (userName, activate, type) => {
      let result = ''
      await changeUserActivate(userName, activate)
        .then((response) => {
          result = response
          voccsUsers.value.forEach((user) => {
            if (user.username == userName) {
              user.activated = activate
            }
          })
          voccUserInfo.value.activated = activate
          showResMsg('계정 활성화 상태를 성공적으로 변경하였습니다')
        })
        .catch((error) => {
          console.log(error)
        })
      return result
    }

    const changeAdminActive = async (userName, activate) => {
      let result = ''
      await changeUserActivate(userName, activate)
        .then((response) => {
          result = response
          voccsAdmins.value.forEach((admin) => {
            if (admin.username == userName) {
              admin.activated = activate
            }
          })
          voccAdminEditForm.value.activated = activate
          showResMsg('계정 활성화 상태를 성공적으로 변경하였습니다')
        })
        .catch((error) => {
          console.log(error)
        })
      return result
    }

    const changeRole = async (editUserInfo) => {
      const { username, userRole } = editUserInfo
      await changeUserRole(username, userRole).then((response) => {
        voccsUsers.value.forEach((user) => {
          if (user.username == username) {
            user.role = userRole
          }
        })
        showResMsg('권한이 성공적으로 변경 되었습니다')
      })
    }

    const fetchFleetAndShipByVocc = async (voccids) => {
      fleetsAndShip.value = await getFleetAndShipByVocc(voccids)
    }

    const changePresidentAdmin = async (form) => {
      const response = await updatePresidentAdmin(form)
      console.dir(response)
      if (response.status == 200) {
        if (!form.appoint) {
          showResMsg('대표 관리자가 해제되었습니다')
        } else {
          showResMsg('대표 관리자가 할당되었습니다')
        }
      }
    }

    const editSettingInformation = async (settingsForm) => {
      try {
        console.log('스토어')
        console.dir(settingsForm)
        const response = await updateSettingInformation(settingsForm)

        if (response.status == 200) {
          showResMsg('정보가 수정 되었습니다')
        }
      } catch (error) {
        console.error(error)
      }
    }

    const fetchCCTVSetting = async () => {
      try {
        const {
          status,
          data: { data }
        } = await getCCTVSetting(cctvInterval.value.key)

        if (status == 200) {
          cctvInterval.value = data
        }
      } catch (error) {
        console.error(error)
      }
    }

    const fetchDataSetting = async () => {
      try {
        const {
          status,
          data: { data }
        } = await getDataSetting(dataInterval.value.key)

        if (status == 200) {
          dataInterval.value = data
        }
      } catch (error) {
        console.error(error)
      }
    }

    const fetchPopupOpacitySetting = async () => {
      try {
        const {
          status,
          data: { data }
        } = await getPopupOpacitySetting(popupOpacity.value.key)

        if (status == 200) {
          popupOpacity.value = data
        }
      } catch (error) {
        console.error(error)
      }
    }

    return {
      voccInfo,
      voccsUsers,
      voccsAdmins,
      voccAdminEditForm,
      voccUserInfo,
      fleetsAndShip,
      dataInterval,
      cctvInterval,
      popupOpacity,
      joinVoccAdmin,
      fetchVoccInfoByVoccId,
      editVoccInfo,
      changeLogoImage,
      fetchVoccsWithoutAdmin,
      fetchVoccListAll,
      fetchVoccs,
      getVoccAdmins,
      registerVoccUserByAdmin,
      getVoccUsers,
      getVoccUserInfo,
      removeAdmin,
      removeVoccUser,
      changeActiveByAdmin,
      changeAdminActive,
      changeRole,
      fetchFleetAndShipByVocc,
      fetchMyVoccAdmins,
      fetchAdminsByVoccId,
      fetchUsersByVoccId,
      changePresidentAdmin,
      fetchVoccAdminInfo,
      editSettingInformation,
      fetchCCTVSetting,
      fetchDataSetting,
      fetchPopupOpacitySetting
    }
  },
  {
    persist: true,
    persistOptions: {
      key: 'voccStore'
    }
  }
)
