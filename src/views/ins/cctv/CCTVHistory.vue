<template>
  <v-sheet class="h-100 py-3">
    <v-container fluid>
      <v-row>
        <v-col cols="9">
          <v-sheet class="h-100">
            <video class="w-100 cctv-history-area" controls controlslist="nodownload noplaybackrate"
              disablepictureinpicture>
              <source :src="videoUrl" />
            </video>
          </v-sheet>
        </v-col>
        <v-col cols="3">
          <DxDataGrid id="cctvGrid" ref="cctvGrid" class="cctv-history-grid cctv-history-area" :data-source="cctvs"
            :show-column-headers="false">
            <DxSelection mode="single"></DxSelection>
            <DxScrolling mode="virtual" />
            <!-- row-rendering-mode="virtual" -->
            <DxColumn data-field="cctvName" :allow-editing="false" />
            <DxColumn data-field="status" :allow-editing="false" :show-column-lines="false"
              cell-template="cctv-status-template" width="15%" />
            <DxColumn data-field="statusText" :allow-editing="false" />

            <template #cctv-status-template="{ data: templateOptions }">
              <div :class="getCCTVStatusClass(templateOptions.data.status)">●</div>
            </template>
          </DxDataGrid>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="timeline-container d-flex ga-3 pa-3">
            <div v-for="cctv in formattedFileNames" class="d-flex pa-3 timeline-btn" @click="changeVideo(cctv.url)">
              {{ cctv }}
            </div>
          </div>
        </v-col>

      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup>
import { ref, computed } from 'vue'

const vidoUrl = ''
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
  },
  {
    fileName: '24/07/01 11:50',
    url: 'https://videos.pexels.com/video-files/3840442/3840442-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 12:00',
    url: 'https://videos.pexels.com/video-files/6595364/6595364-sd_640_360_24fps.mp4'
  },
  {
    fileName: '24/07/01 12:10',
    url: 'https://videos.pexels.com/video-files/3864102/3864102-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 12:20',
    url: 'https://videos.pexels.com/video-files/3075999/3075999-sd_640_360_30fps.mp4'
  },
  {
    fileName: '24/07/01 12:30',
    url: 'https://videos.pexels.com/video-files/3075997/3075997-sd_640_360_30fps.mp4'
  }
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
  { id: 16, cctvName: 'CCTV 16', status: true, statusText: 'CONNECTED' },
])

const videoUrl = ref(cctvList.value[0].url)

const changeVideo = (url) => {
  console.log('클릭')
  videoUrl.value = url
}

const formattedFileNames = computed(() =>
  cctvList.value.map((cctv) => cctv.fileName.replace(/\s+/g, '\n'))
);

const getCCTVStatusClass = (status) => {
  let colorClass = ''
  console.log(status)
  if (status) {
    colorClass = 'normal'
  } else {
    colorClass = 'danger'
  }

  return colorClass
}
</script>

<style scoped>
.cctvs-container {
  flex: 2 2 0;
}

.cctv-list-container {
  flex: 1 1 0;
}

.timeline-btn {
  background-color: #3B3B3F;
  border-radius: 4px;
  white-space: pre-wrap;
  text-align: center;
  align-items: center;
}

.timeline-container {
  background: #333334;
  overflow-x: scroll;
}

.timeline-container .timeline-btn:nth-child(3) {
  background: #5789FE;
}

.cctv-list-container thead {
  display: none;
}

#cctvGrid .dx-datagrid .dx-column-lines>td {
  border: 0px;
}

#cctvGrid tr:nth-child(odd) {
  background: #222224;
}

#cctvGrid tr {
  border-bottom: 1px solid #585A61;
}

#cctvGrid {
  height: 100%;
}

.video-container {
  flex: 3 3 0;
}

video {
  height: 100%;
  object-fit: fill;
}

#cctvGrid {
  /* margin-left: 20px;
  margin-right: 20px; */
  border: 1px solid #585a6187;
}


</style>