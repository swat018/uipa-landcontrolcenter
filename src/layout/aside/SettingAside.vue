<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false" class="bg-aside">
    <v-list density="compact">
      <v-list-item v-if="rail" :prepend-avatar="rail ? getLogoImage : getLogoImage"> </v-list-item>
      <v-list-item class="d-flex justify-center" v-else><v-img :src="getLogoImage" width="300" height="50"></v-img>
      </v-list-item>
      
      <v-list-item v-for="menu in settingMenus" :key="menu.routerName" :title="menu.menuName" :value="menu.routerName"
        @click="goPage(menu.routerPath)" class="py-3 active-class sidemenu">
      </v-list-item>
    </v-list>

    <template>

      <v-list-item title="test"></v-list-item>

    </template>


    <template v-slot:append>
      <v-divider></v-divider>
      <div class="d-flex">
        <v-btn variant="text" icon="mdi-chevron-double-left" @click.stop="rail = !rail"></v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useVoccStore } from '@/stores/voccStore'
import { useAccessMenuStore } from '@/stores/accessMenuStore'
import { goPage } from '@/composables/util'
import { Role } from '@/common/globalReference.js'


import uipaLogoImg from '@/assets/images/uipa-logo.png'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)

const voccStore = useVoccStore()
const { voccInfo } = storeToRefs(voccStore)

const menuStore = useAccessMenuStore()
const { accessMenus } = storeToRefs(menuStore)

const drawer = ref(true)
const rail = ref(false)
let userRole = ''

const settingMenus = ref()

const menuRole = {
  lccAdmin : 'LCC_ADMIN',
  voccAdmin : 'VOCC_ADMIN',
  voccUser :  'VOCC_USER',
  anyone : 'ANYONE'
}


onMounted(() => {
  userRole= userInfo.value.role
  getSettingMenus()
})

/**
 * 로고 이미지 출력
 * - 선사 로고 이미지가 있을 경우 - 선사 로고 이미지 출력
 * - 선사 로고 이미지가 없을 경우 - UIPA 로고 이미지 출력
 */
const getLogoImage = computed(() => {
  let logoImage = ''
  if (voccInfo.value.logoImage) {
    console.log(typeof (voccInfo.value.logoImage))
    logoImage = `data:image/png;base64,${voccInfo.value.logoImage}`
  }
  return voccInfo.value.logoImage ? logoImage : uipaLogoImg
})


const getSettingMenus = () => {
  let test = ''

  let settingMenu = accessMenus.value.filter(menu => menu.menuId == 50)
  settingMenu = settingMenu[0].children

  console.dir(settingMenu)
  switch (userRole){
    case Role.lccAdmin:
      test = settingMenu;
      break;
    case Role.voccAdmin:
      test = settingMenu.filter(menu => menu.accessRole != menuRole.lccAdmin)
      break;
    case Role.voccUser:
      console.log('유저')
      test = settingMenu.filter(menu => menu.accessRole == menuRole.voccUser)
  }
  settingMenus.value = test;
  // console.log('셋팅')
  // console.dir(settingMenus.value)

}



</script>

<style scoped>
.sidemenu:hover,
.sidemenu:active,
.sidemenu.v-list-item--active {
  border-left: 5px solid #4e83ff;
}
</style>
