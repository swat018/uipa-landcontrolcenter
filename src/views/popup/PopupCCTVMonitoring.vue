<template>
  <PopupSelectedShipSummary class="ma-3" :curSelectedShipImoNumber="selectedImoNumber" />
  <v-sheet class="popup-container mx-3 px-3 rounded-lg">
    <v-container fluid class="">
      <v-row class="h-100">
        <v-col cols="9" class="pl-0">
          <v-sheet class="video-container cctvlist-grid">
            <video
              class="w-100"
              v-for="cctv in cctvList"
              controls
              controlslist="nodownload noplaybackrate"
              disablepictureinpicture
            >
              <source :src="cctv.url" />
            </video>
          </v-sheet>
        </v-col>
        <v-col cols="3" class="pr-0">
          <DxDataGrid
            id="cctvListGrid"
            ref="cctvListGrid"
            :data-source="cctvs"
            :show-column-headers="false"
            :show-column-lines="false"
            :show-borders="true"
            class="cctvlist-grid"
          >
            <DxSelection mode="single"></DxSelection>
            <DxScrolling mode="virtual" />

            <DxColumn data-field="cctvName" class="cctv-name" :allow-editing="false" />

            <DxColumn
              data-field="status"
              :allow-editing="false"
              cell-template="cctv-status-template"
              width="15%"
            />
            <template #cctv-status-template="{ data: templateOptions }">
              <div :class="getCCTVStatusClass(templateOptions.data.status)">●</div>
            </template>

            <DxColumn data-field="statusText" :allow-editing="false" />
          </DxDataGrid>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import PopupSelectedShipSummary from '@/components/ship/PopupSelectedShipSummary.vue'

const vidoUrl = ''
const selectedImoNumber = ref('')
const cctvList = ref([
  {
    fileName: '24/07/01 09:00',
    url: 'https://videos.pexels.com/video-files/2231802/2231802-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 09:20',
    url: 'https://videos.pexels.com/video-files/3058057/3058057-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 09:30',
    url: 'https://videos.pexels.com/video-files/3840442/3840442-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 09:40',
    url: 'https://videos.pexels.com/video-files/6595364/6595364-sd_640_360_24fps.mp4'
  },
  {
    fileName: '24/07/01 09:50',
    url: 'https://videos.pexels.com/video-files/3864102/3864102-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 10:00',
    url: 'https://videos.pexels.com/video-files/3075999/3075999-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 10:10',
    url: 'https://videos.pexels.com/video-files/3075997/3075997-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 10:20',
    url: 'https://videos.pexels.com/video-files/2231802/2231802-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 10:30',
    url: 'https://videos.pexels.com/video-files/3058057/3058057-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 10:40',
    url: 'https://videos.pexels.com/video-files/3840442/3840442-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 10:50',
    url: 'https://videos.pexels.com/video-files/6595364/6595364-sd_640_360_24fps.mp4'
  },
  {
    fileName: '24/07/01 11:00',
    url: 'https://videos.pexels.com/video-files/3864102/3864102-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 11:10',
    url: 'https://videos.pexels.com/video-files/3075999/3075999-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 11:20',
    url: 'https://videos.pexels.com/video-files/3075997/3075997-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 11:30',
    url: 'https://videos.pexels.com/video-files/2231802/2231802-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 11:40',
    url: 'https://videos.pexels.com/video-files/3058057/3058057-sd_640_360_30fps.mp4'
  }
  // {
  //   fileName: '24/07/01 11:50',
  //   url: 'https://videos.pexels.com/video-files/3840442/3840442-sd_640_360_30fps.mp4'
  // },
  // {
  //   fileName: '24/07/01 12:00',
  //   url: 'https://videos.pexels.com/video-files/6595364/6595364-sd_640_360_24fps.mp4'
  // },
  // {
  //   fileName: '24/07/01 12:10',
  //   url: 'https://videos.pexels.com/video-files/3864102/3864102-sd_640_360_30fps.mp4'
  // },
  // {
  //   fileName: '24/07/01 12:20',
  //   url: 'https://videos.pexels.com/video-files/3075999/3075999-sd_640_360_30fps.mp4'
  // },
  // {
  //   fileName: '24/07/01 12:30',
  //   url: 'https://videos.pexels.com/video-files/3075997/3075997-sd_640_360_30fps.mp4'
  // }
])

const cctvs = ref([
  { id: 1, cctvName: 'CCTV 01', status: true, statusText: 'CONNECTED' },
  { id: 2, cctvName: 'CCTV 02', status: true, statusText: 'CONNECTED' },
  { id: 3, cctvName: 'CCTV 03', status: true, statusText: 'CONNECTED' },
  { id: 4, cctvName: 'CCTV 04', status: true, statusText: 'CONNECTED' },
  { id: 5, cctvName: 'CCTV 05', status: true, statusText: 'CONNECTED' },
  { id: 6, cctvName: 'CCTV 06', status: false, statusText: 'DISCONNECTED' },
  { id: 7, cctvName: 'CCTV 07', status: true, statusText: 'CONNECTED' },
  { id: 8, cctvName: 'CCTV 08', status: false, statusText: 'CONNECTED' },
  { id: 9, cctvName: 'CCTV 09', status: true, statusText: 'CONNECTED' },
  { id: 10, cctvName: 'CCTV 10', status: false, statusText: 'DISCONNECTED' },
  { id: 11, cctvName: 'CCTV 11', status: true, statusText: 'CONNECTED' },
  { id: 12, cctvName: 'CCTV 12', status: true, statusText: 'CONNECTED' },
  { id: 13, cctvName: 'CCTV 13', status: false, statusText: 'DISCONNECTED' },
  { id: 14, cctvName: 'CCTV 14', status: true, statusText: 'CONNECTED' },
  { id: 15, cctvName: 'CCTV 15', status: true, statusText: 'CONNECTED' },
  { id: 16, cctvName: 'CCTV 16', status: true, statusText: 'CONNECTED' }
])

const videoUrl = ref(cctvList.value[0].url)

onMounted(() => {
  let url = new URLSearchParams(location.search)
  let imoNumber = url.get('imoNumber')
  selectedImoNumber.value = imoNumber
})

const changeVideo = (url) => {
  console.log('클릭')
  videoUrl.value = url
}

const formattedFileNames = computed(() =>
  cctvList.value.map((cctv) => cctv.fileName.replace(/\s+/g, '\n'))
)

const getCCTVStatusClass = (status) => {
  let colorClass = ''
  if (status) {
    colorClass = 'normal'
  } else {
    colorClass = 'danger'
  }

  return colorClass
}
</script>

<style scoped>
.popup-container {
  height: 100vh;
  max-height: calc(100vh - (60px + 36px));
}
.cctv-container {
  flex: 1 1 20%;
}

.cctv-item {
  flex: 0 1 25%;
}

.cctv-list-container {
  flex: 1 1 0;
}

.cctvs-container {
  flex: 3 3 0;
  /* overflow : auto; */
}

.cctv-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.item-container {
  width: 70%;
  height: 100%;
}

.data-container {
  width: 30%;
}

/* #cctvListGrid {
  height: 100%;
} */

video {
  object-fit: fill;
  height: 100%;
}

/* #cctvListGrid .dx-datagrid .dx-column-lines>td {
  border: 0px;
} */

.cctv-grid {
  margin-left: 20px;
  margin-right: 20px;
  border: 1px solid #585a6187;
}

.video-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 12px;
}

.cctvlist-grid {
  height: 100vh;
  /* max-height: calc(100% - 24px); */
  max-height: calc(100vh - 12px - 60px - 12px - 12px - 24px);
}
</style>
