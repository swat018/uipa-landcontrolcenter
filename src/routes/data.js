/**
 * 대메뉴 : 설정
 */
import BaseLayout from '@/layout/BaseLayout.vue'
/**
 * 소메뉴 : 알람 모니터링
 */
import DataManagement from '@/views/data/DataManagement.vue'

const dataRoutes = [
  {
    path: '/data',
    component: BaseLayout,
    children: [
      {
        name: 'DataManagement',
        path: 'management',
        component: DataManagement
      }
    ]
  }
]

export default dataRoutes
