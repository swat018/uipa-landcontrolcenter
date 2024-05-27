/**
 * 대메뉴 : MONITORING
 */
import BaseLayout from '@/layout/BaseLayout.vue'
/**
 * 소메뉴 : SHIP DASHBOARD, ALERTS, FIRE DETECTION, CCTV, INS
 */
import AlertManagement from '@/views/alert/AlertManagement.vue'
import FdsManagement from '@/views/fds/FdsManagement.vue'
import CCTVtManagement from '@/views/ins/cctv/CCTVManagement.vue'
import INSManagement from '@/views/ins/InsManagement.vue'

const monitoringRoutes = [
  {
    path: '/monitoring',
    component: BaseLayout,
    children: [
      {
        name: 'FdsManagement',
        path: 'fds',
        component: FdsManagement
      },
      {
        name: 'AlertManagement',
        path: 'alert',
        component: AlertManagement
      },
      {
        name: 'CCTVManagement',
        path: 'cctv',
        component: CCTVtManagement
      },
      {
        name: 'INSManagement',
        path: 'ins',
        component: INSManagement
      }
    ]
  }
]

export default monitoringRoutes
