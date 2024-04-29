/**
 * 대메뉴 : 기관정보
 */
import BaseLayout from '@/layout/BaseLayout.vue'
/**
 * 소메뉴 : 데이터 모니터링, 퍼포먼스 
 */
import EquipmentMonitoring from '@/views/equipment/EquipmentMonitoring.vue'
import EquipmentPerformance from '@/views/equipment/EquipmentPerformance.vue'

const equipmentRoutes = [
  {
    path: '/equipment',
    component: BaseLayout,
    children: [
      {
        name: 'EquipmentMonitoring',
        path: 'monitoring',
        component: EquipmentMonitoring
      },
      {
        name: 'EquipmentPerformance',
        path: 'performance',
        component: EquipmentPerformance
      }
    ]
  }
]

export default equipmentRoutes
