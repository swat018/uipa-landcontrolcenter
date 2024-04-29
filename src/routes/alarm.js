/**
 * 대메뉴 : 설정
 */
import BaseLayout from '@/layout/BaseLayout.vue'
/**
 * 소메뉴 : 알람 모니터링
 */
import AlarmMonitoring from '@/views/alarm/AlarmMonitoring.vue'

const alarmRoutes = [
  {
    path: '/alarm',
    component: BaseLayout,
    children: [
      {
        name: 'AlarmMonitoring',
        path: 'real',
        component: AlarmMonitoring
      },
    ]
  }
]

export default alarmRoutes
