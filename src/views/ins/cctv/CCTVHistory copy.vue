<template>
  <v-sheet class="d-flex flex-column">
    <div class="d-flex ga-4" style="height: calc(100% * 0.8);">
      <div class="cctv-container d-flex">
        <video class="w-100" controls controlslist="nodownload noplaybackrate" disablepictureinpicture>
          <source :src="videoUrl" />
        </video>
      </div>
      <div class="cctv-list-container d-flex flex-column">
        <DxDataGrid id="cctvGrid" ref="cctvGrid" :data-source="cctvs" :show-column-headers="false"
          :column-auto-width="true">
          <DxSelection mode="single"></DxSelection>
          <DxScrolling mode="virtual" />
          <!-- row-rendering-mode="virtual" -->
          <DxColumn data-field="cctvName" :allow-editing="false" />
          <DxColumn data-field="status" :allow-editing="false" 
            cell-template="status-template" />

          <template #status-template="{ data: templateOptions }">
            <div :class="getCCTVStatusClass(templateOptions.data.status) ">●</div>
          </template>
        </DxDataGrid>
      </div>
    </div>
    <div class="timeline-container mt-4 d-flex ga-4 pa-4" style="height: calc(100% * 0.2);">
      <div v-for="cctv in formattedFileNames" class="d-flex pa-3 timeline-btn" @click="changeVideo(cctv.url)">
        {{ cctv }}
      </div>
    </div>

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
  { id : 1, cctvName: 'CCTV 01', status: true},
  { id : 2, cctvName: 'CCTV 02', status: true },
  { id : 3, cctvName: 'CCTV 03', status: true },
  { id : 4, cctvName: 'CCTV 04', status: true },
  { id : 5, cctvName: 'CCTV 05', status: true },
  { id : 6, cctvName: 'CCTV 06', status: false },
  { id : 7, cctvName: 'CCTV 07', status: true },
  { id : 8, cctvName: 'CCTV 08', status: false },
  { id : 9, cctvName: 'CCTV 09', status: true },
  { id : 10, cctvName: 'CCTV 010', status: false },
  { id : 11, cctvName: 'CCTV 011', status: true },
  { id : 12, cctvName: 'CCTV 012', status: true },
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
  if(status){
    colorClass =  'normal'
  }else{
    colorClass = 'danger'
  }

  return colorClass
}
</script>

<style scoped>
.cctv-container{
  flex : 2 2 0;
}

.cctv-list-container{
  flex : 1 1 0;
}

.timeline-btn{
 background-color : #3B3B3F;
 border-radius : 4px;
 white-space: pre-wrap;
 text-align: center;
 align-items: center;
}

.timeline-container{
  background : #333334;
  overflow-x: scroll ;
}

.timeline-container .timeline-btn:nth-child(3) {
  background: #5789FE;
}

.cctv-list-container thead {
  display: none;
}

.cctv-list-container thead {
  display: none;
}

#cctvGrid .dx-datagrid .dx-column-lines>td{
  border : 0px;
}

#cctvGrid tr:nth-child(odd){
  background  : #222224;
}

#cctvGrid tr {
  border-bottom: 1px solid #585A61;
}

#cctvGrid {
  height: 100%;
}
</style>