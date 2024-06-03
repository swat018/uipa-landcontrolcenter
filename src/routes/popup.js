/**
 * 대메뉴 : 설정
 */
import NoHeaderLayout from '@/layout/NoHeaderLayout.vue'
/**
 * 소메뉴 : 알람 모니터링
 */
import PopupAlertList from '@/views/popup/PopupAlertList.vue'
import PouppEngineRealTimeMonitoring from '@/views/popup/PouppEngineRealTimeMonitoring.vue'
import PopupFDSMonitoring from '@/views/popup/PopupFDSMonitoring.vue'
import PopupCCTVMonitoring from '@/views/popup/PopupCCTVMonitoring.vue'
import PopupECDISMonitoring from '@/views/popup/PopupECDISMonitoring.vue'
import PopupRADARMonitoring from '@/views/popup/PopupRADARMonitoring.vue'

const popupRoutes = [
  {
    path: '/popup',
    component: NoHeaderLayout,
    children: [
      {
        name: 'PopupAlertList',
        path: 'alert',
        component: PopupAlertList
      },
      {
        name: 'PopupEngineRealTimeMonitoring',
        path: 'monitoring/engine',
        component: PouppEngineRealTimeMonitoring
      },
      {
        name: 'PopupFDSMonitoring',
        path: 'monitoring/fds',
        component: PopupFDSMonitoring
      },
      {
        name: 'PopupCCTVMonitoring',
        path: 'monitoring/cctv',
        component: PopupCCTVMonitoring
      },
      {
        name: 'PopupECDISMonitoring',
        path: 'monitoring/ecdis',
        component: PopupECDISMonitoring
      },
      {
        name: 'PopupRADARMonitoring',
        path: 'monitoring/radar',
        component: PopupRADARMonitoring
      }
    ]
  }
]

export default popupRoutes
