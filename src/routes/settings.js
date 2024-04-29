/**
 * 대메뉴 : 설정
 */
import SettingLayout from '@/layout/SettingLayout.vue'
/**
 * 소메뉴 : 계정관리
 */
import AccountManagement from '@/views/auth/AccountManagement.vue'
import VoccAdminManagement from '@/views/auth/admin/VoccAdminManagement.vue'
import VoccUserManagement from '@/views/settings/vocc/admin/VoccUserManagement.vue'
import GroupManagement from '@/views/settings/group/GroupManagement.vue'
import MenuManagement from '@/views/settings/menu/MenuManagement.vue'
import AccessLogs from '@/views/settings/logs/AccessLogs.vue'
import VoccInfoManagement from '@/views/settings/vocc/VoccInfoManagement.vue'
import TagManagement from '@/views/settings/tag/TagManagement.vue'
import OperationManagement from '@/views/settings/operation/OperationManagement.vue'


const settingsRoutes = [
  {
    path: '/settings',
    component: SettingLayout,
    children: [
      {
        name: 'AccountManagement',
        path: 'account',
        component: AccountManagement
      },
      {
        name: 'VoccAdminManagement',
        path: 'vocc/admin',
        component: VoccAdminManagement,
        meta: { requiresAuth: true, roles: ['ROLE_LCC_ADMIN'] }
      },
      {
        name: 'VoccUserManagement',
        path: 'vocc/user',
        component: VoccUserManagement,
        meta: { requiresAuth: true, roles: ['ROLE_LCC_ADMIN', 'ROLE_VOCC_ADMIN'] }
      },
      {
        name: 'GroupManagement',
        path: 'group',
        component: GroupManagement
      },
      // {
      //   name : 'MenuManagement',
      //   path : 'menu',
      //   component : MenuManagement
      // },
      {
        name: 'AccessLogs',
        path: 'accesslog',
        component: AccessLogs,
        meta: { requiresAuth: true, roles: ['ROLE_LCC_ADMIN'] }
      },
      {
        name: 'MenuManagement',
        path: 'menu',
        component: MenuManagement
      },
      {
        name: 'VoccInfoManagement',
        path: 'vocc',
        component: VoccInfoManagement
      },
      {
        name: 'TagManagement',
        path: 'tag',
        component: TagManagement
      },
      {
        name: 'OperationManagement',
        path: 'operation',
        component: OperationManagement
      }
    ]
  }
]

export default settingsRoutes

