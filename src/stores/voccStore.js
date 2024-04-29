import { defineStore } from 'pinia'
import { ref } from 'vue'
import { goPage } from '@/composables/util.js'
// import { useAxios } from '@/composables/useAxios'
import {
  registerVocc,
  updateVoccInfo,
  getVoccListAll,
  getVoccAdminListAll,
  getVoccAdmin,
  getVoccsWithoutAdmin,
  getVoccUserListAll,
  getVoccUser,
  getVoccInfo,
  deleteVoccAdmin,
  joinVoccUser,
  deleteVoccUser,
  changeUserActivate,
  changeUserRole,
  updateVoccLogo,
  getFleetAndShipByVocc
} from '@/api/voccApi'
import { useToast } from '@/composables/useToast'

export const useVoccStore = defineStore(
  'vocc',
  () => {
    const voccAdmins = ref([])
    const voccUsers = ref([])

    const voccAdminInfo = ref({
      username: '',
      password: '********',
      nickname: '',
      email: '',
      role: '',
      activated: ''
    })

    const voccUserInfo = ref({
      id: 0,
      username: '',
      nickname: '',
      email: '',
      role: '',
      activated: ''
    })

    // 선사 기초 정보
    const voccInfo = ref()
    const fleetsAndShip = ref([])

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

    const fetchVoccInfo = async () => {
      try {
        const response = await getVoccInfo()
        ;({
          data: { data: voccInfo.value }
        } = response)

        if (!voccInfo.value.address) {
          voccInfo.value.address = ''
        }

        if (!voccInfo.value.ceoName) {
          voccInfo.value.ceoName = ''
        }
        sessionStorage.setItem('voccInfo', JSON.stringify(voccInfo.value))
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
          sessionStorage.setItem(JSON.stringify(voccInfo.value))
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
    const joinVoccAdmin = async (registerForm) => {
      try {
        const response = await registerVocc(registerForm)
        const { status, data } = response

        if (status == 200) {
          registerForm.id = data
          registerForm.activated = true

          voccAdmins.value.push(registerForm)

          showResMsg('관리자 등록이 성공적으로 되었습니다')

          return status
        }

        console.dir(response)
      } catch (error) {
        const errMsg = error.response.data.errorMsg
        showResMsg(errMsg)
      }
      // await registerVocc(registerForm)
      //   .then((response) => {
      //     result = response
      //     console.dir(registerForm)
      //     registerForm.id = response.data
      //     registerForm.activated = true
      //     registerForm.name = registerForm.voccName
      //     voccAdmins.value.push(registerForm)
      //     showResMsg('관리자 등록이 성공적으로 되었습니다')
      //   })
      //   .catch((err) => {})
      // return result
    }

    /**
     * 선사 관리자 목록 조회
     * @param
     * @returns
     */
    const getVoccAdmins = async () => {
      let result
      await getVoccAdminListAll()
        .then((response) => {
          result = response
          voccAdmins.value = response
        })
        .catch((err) => {
          console.log(err)
        })

      return result
    }

    const getVoccAdminInfo = async (voccAdminId) => {
      await getVoccAdmin(voccAdminId).then((response) => {
        const result = response
        voccAdminInfo.value = {
          name: result.name,
          username: result.getUserData.username,
          nickname: result.getUserData.nickname,
          email: result.getUserData.email,
          role: result.getUserData.role,
          activated: result.getUserData.activated
        }
      })

      return voccAdminInfo
    }

    /**
     * 선사 관리자 삭제
     * @param {} voccAdminId
     * @param {*} removeVoccAdminInfo
     */
    const removeAdmin = async (voccAdminId, removeVoccAdminInfo) => {
      try{
        const response = await deleteVoccAdmin(removeVoccAdminInfo)

        const { status } = response;

        if(status == 200){
          const index = voccAdmins.value.findIndex((voccAdmin) => voccAdmin.id === voccAdminId)
          voccAdmins.value.splice(index, 1)
          showResMsg('선사 관리자가 삭제되었습니다')
        }
      }catch(error){
        const errMsg = error.response.data.errorMsg
        showResMsg(errMsg)
      }
    }

    const registerVoccUser = async (registerForm) => {
      try {
        const result = await joinVoccUser(registerForm)
        console.dir(result)
        if (result.status == 200) {
          voccUsers.value.push(registerForm.value)
          showResMsg('사용자 등록이 성공적으로 되었습니다')
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
          voccUsers.value = response
        })
        .catch((err) => {
          console.log(err)
        })

      return result
    }

    /**
     * 선사 사용자 정보 조회
     * @param {Number} voccUserId
     * @returns
     */

    const getVoccUserInfo = async (voccUserId) => {
      let result
      await getVoccUser(voccUserId).then((response) => {
        result = response
        voccUserInfo.value = response
      })
      return result
    }

    /**
     * 선사 사용자 삭제
     * @param {} voccAdminId
     * @param {*} removeVoccUserInfo
     */
    const removeVoccUser = async (voccUserId, removeVoccUserInfo) => {
      await deleteVoccUser(removeVoccUserInfo).then(() => {
        const index = voccUsers.value.findIndex((voccUser) => voccUser.id === voccUserId)
        voccUsers.value.splice(index, 1)
        showResMsg(' 사용자가 삭제되었습니다')
      })
    }

    const changeActive = async (userName, activate, type) => {
      let result = ''
      await changeUserActivate(userName, activate)
        .then((response) => {
          result = response
          if (type == 'voccAdmin') {
            voccAdmins.value.forEach((admin) => {
              if (admin.username == userName) {
                admin.activated = activate
              }
            })
          } else if (type == 'voccUser') {
            voccUsers.value.forEach((user) => {
              if (user.username == userName) {
                user.activated = activate
                console.log(user.activated)
              }
            })

            voccUserInfo.value.activated = activate
          }

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
        voccUsers.value.forEach((user) => {
          if (user.username == username) {
            user.role = userRole
          }
        })
        showResMsg('권한이 성공적으로 변경 되었습니다')
      })
    }

    const fetchFleetAndShipByVocc = async (voccids) => {
      fleetsAndShip.value = await getFleetAndShipByVocc(voccids)
      console.dir(fleetsAndShip.value)
    }

    return {
      voccInfo,
      voccUsers,
      voccAdmins,
      voccAdminInfo,
      voccUserInfo,
      fleetsAndShip,
      joinVoccAdmin,
      fetchVoccInfo,
      editVoccInfo,
      changeLogoImage,
      fetchVoccsWithoutAdmin,
      fetchVoccListAll,
      getVoccAdmins,
      getVoccAdminInfo,
      registerVoccUser,
      getVoccUsers,
      getVoccUserInfo,
      removeAdmin,
      removeVoccUser,
      changeActive,
      changeRole,
      fetchFleetAndShipByVocc
    }
  },
  {
    persist: true,
    persistOptions: {
      key: 'voccStore'
    }
  }
)
