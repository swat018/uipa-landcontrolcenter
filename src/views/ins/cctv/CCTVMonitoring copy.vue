<template>
  <!-- <v-sheet class="d-flex ga-4">
    <div class="d-flex flex-wrap ga-4" style="
    flex: 2 1 0;">
      <div class=" cctv-container d-flex" v-for="cctv in cctvList">
        <video class="w-100" controls controlslist="nodownload noplaybackrate" disablepictureinpicture>
          <source :src="cctv.url" />
        </video>
      </div>
    </div>
    <div class="cctv-list-container d-flex flex-column">
      <DxDataGrid id="cctvGrid" ref="cctvGrid" :data-source="cctvs" :show-column-headers="false">
        <DxSelection mode="single"></DxSelection>
        <DxScrolling mode="virtual" />

        <DxColumn data-field="cctvName" :allow-editing="false" />
        <DxColumn data-field="status" :allow-editing="false" :show-column-lines="false"
          cell-template="status-template" />

        <template #status-template="{ data: templateOptions }">
          <div :class="getCCTVStatusClass(templateOptions.data.status)">●</div>
        </template>
      </DxDataGrid>
    </div>
  </v-sheet> -->
  <v-sheet>
    <!-- <div class="test">
      <div class="cctvs-container">
        <div class="video-container" v-for="cctv in cctvList">
        <video  class="" controls controlslist="nodownload noplaybackrate"
          disablepictureinpicture>
          <source :src="cctv.url" />
        </video>
        </div>
      </div>
      <div class="cctv-list-container d-flex flex-column">
        <DxDataGrid id="cctvGrid" ref="cctvGrid" :data-source="cctvs" :show-column-headers="false">
          <DxSelection mode="single"></DxSelection>
          <DxScrolling mode="virtual" />

          <DxColumn data-field="cctvName" :allow-editing="false" />
          <DxColumn data-field="status" :allow-editing="false" :show-column-lines="false"
            cell-template="status-template" />

          <template #status-template="{ data: templateOptions }">
            <div :class="getCCTVStatusClass(templateOptions.data.status)">●</div>
          </template>
        </DxDataGrid>
      </div>
    </div> -->
    <!-- <div class="container">
      <div class="item-container">
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
      </div>
      <div class="data-container">
        <DxDataGrid id="cctvGrid" ref="cctvGrid" :data-source="cctvs" :show-column-headers="false">
          <DxSelection mode="single"></DxSelection>
          <DxScrolling mode="virtual" />

          <DxColumn data-field="cctvName" :allow-editing="false" />
          <DxColumn data-field="status" :allow-editing="false" :show-column-lines="false"
            cell-template="status-template" />

          <template #status-template="{ data: templateOptions }">
            <div :class="getCCTVStatusClass(templateOptions.data.status)">●</div>
          </template>
        </DxDataGrid>
      </div>
    </div> -->

    <v-row>
      <v-col cols="8">
        <v-row>
          <v-col cols="3">
            <img
              src="https://img.freepik.com/premium-photo/close-up-business-colleagues-shaking-hands-office_1048944-29942241.jpg?t=st=1714128956~exp=1714129556~hmac=2a7942b2d2886397e81085ca15d664e802ef6d308bc2c1543a6473e224a395eb"
              cover />
            <!-- <video class="" controls controlslist="nodownload noplaybackrate" disablepictureinpicture>
              <source src="https://videos.pexels.com/video-files/2231802/2231802-sd_640_360_30fps.mp4" />
            </video> -->
          </v-col>
          <v-col cols="3">
            <img
              src="https://img.freepik.com/premium-photo/close-up-business-colleagues-shaking-hands-office_1048944-29942241.jpg?t=st=1714128956~exp=1714129556~hmac=2a7942b2d2886397e81085ca15d664e802ef6d308bc2c1543a6473e224a395eb"
              cover />
            <!-- <video class="" controls controlslist="nodownload noplaybackrate" disablepictureinpicture>
              <source src="https://videos.pexels.com/video-files/2231802/2231802-sd_640_360_30fps.mp4" />
            </video> -->
          </v-col>
          <v-col cols="3">
            <img
              src="https://img.freepik.com/premium-photo/close-up-business-colleagues-shaking-hands-office_1048944-29942241.jpg?t=st=1714128956~exp=1714129556~hmac=2a7942b2d2886397e81085ca15d664e802ef6d308bc2c1543a6473e224a395eb"
              cover />
            <!-- <video class="" controls controlslist="nodownload noplaybackrate" disablepictureinpicture>
              <source src="https://videos.pexels.com/video-files/2231802/2231802-sd_640_360_30fps.mp4" />
            </video> -->
          </v-col>
          <v-col cols="3">
            <img
              src="https://img.freepik.com/premium-photo/close-up-business-colleagues-shaking-hands-office_1048944-29942241.jpg?t=st=1714128956~exp=1714129556~hmac=2a7942b2d2886397e81085ca15d664e802ef6d308bc2c1543a6473e224a395eb"
              cover />
            <!-- <video class="" controls controlslist="nodownload noplaybackrate" disablepictureinpicture>
              <source src="https://videos.pexels.com/video-files/2231802/2231802-sd_640_360_30fps.mp4" />
            </video> -->
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4">
        <DxDataGrid id="cctvGrid" ref="cctvGrid" :data-source="cctvs" :show-column-headers="false">
          <DxSelection mode="single"></DxSelection>
          <DxScrolling mode="virtual" />

          <DxColumn data-field="cctvName" :allow-editing="false" />
          <DxColumn data-field="status" :allow-editing="false" :show-column-lines="false"
            cell-template="status-template" />

          <template #status-template="{ data: templateOptions }">
            <div :class="getCCTVStatusClass(templateOptions.data.status)">●</div>
          </template>
        </DxDataGrid>
      </v-col>
    </v-row>
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
  { id: 1, cctvName: 'CCTV 01', status: true },
  { id: 2, cctvName: 'CCTV 02', status: true },
  { id: 3, cctvName: 'CCTV 03', status: true },
  { id: 4, cctvName: 'CCTV 04', status: true },
  { id: 5, cctvName: 'CCTV 05', status: true },
  { id: 6, cctvName: 'CCTV 06', status: false },
  { id: 7, cctvName: 'CCTV 07', status: true },
  { id: 8, cctvName: 'CCTV 08', status: false },
  { id: 9, cctvName: 'CCTV 09', status: true },
  { id: 10, cctvName: 'CCTV 010', status: false },
  { id: 11, cctvName: 'CCTV 011', status: true },
  { id: 12, cctvName: 'CCTV 012', status: true },
  { id: 10, cctvName: 'CCTV 010', status: false },
  { id: 11, cctvName: 'CCTV 011', status: true },
  { id: 12, cctvName: 'CCTV 012', status: true },
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
  if (status) {
    colorClass = 'normal'
  } else {
    colorClass = 'danger'
  }

  return colorClass
}
</script>

<style scoped>
/* .cctv-container {
  flex: 1 1 20%;
} */

.cctv-list-container{
  flex : 1 1 0;
}

/* video {
  object-fit: fill;
} */

.test{
  display: grid;
  grid-template-columns: 70% 30%;
  gap : 12px;
}

.cctvs-container{
  display : grid;
  grid-template-columns: repeat(4,1fr);
}

.item-container{
  width : 70%;
  height: 100%;
}

.data-container{
  width : 30%;
}


</style>