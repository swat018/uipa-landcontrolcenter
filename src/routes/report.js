/**
 * 대메뉴 : REPORT
 */
import BaseLayout from '@/layout/BaseLayout.vue'
/**
 * 소메뉴 : IMO DCS
 */
import ImoDcs from '@/views/voyage/imodcs/ImoDcs.vue'

const reportRoutes = [
  {
    path: '/voyage',
    component: BaseLayout,
    children: [
      {
        name: 'ImoDcs',
        path: 'imodcs',
        component: ImoDcs
      }
    ]
  }
]

export default reportRoutes
