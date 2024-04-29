/**
 * 대메뉴 : 운항정보
 */
import BaseLayout from '@/layout/BaseLayout.vue'
/**
 * 소메뉴 : 항차리포트, CII Rating, IMO DCS, EU MRV
 */
import VoyageReport from '@/views/voyage/VoyageReport.vue'
import DetailCIIRating from '@/views/voyage/cii/DetailCIIRating.vue'

const voyageRoutes = [
  {
    path: '/voyage',
    component: BaseLayout,
    children: [
      {
        name: 'VoyageReport',
        path: 'report',
        component: VoyageReport
      },
      {
        name: 'CllMonitoring',
        path: 'cii/rating',
        component: DetailCIIRating
      },
      {
        name: 'AnualReport',
        path: '/voyage/anual',
        component: DetailCIIRating
      }
    ]
  }
]

export default voyageRoutes
