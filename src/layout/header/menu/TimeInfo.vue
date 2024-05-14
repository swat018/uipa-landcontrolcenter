<template>
  <div class="timeinfo d-flex mr-2 ">
    <div class="mr-2 d-flex ga-4 pointer-cursor">
      <div class="subTitle">UTC TIme</div>
      <div class="subTitle">{{ nowUTCTime }}</div>
    </div>
    <div class="d-flex ga-4 localTime pointer-cursor">
      <div class="subTitle">Local TIme</div>
      <div class="subTitle">{{ nowKRTime }} (+9)</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import moment from 'moment';
import { convertDateTimeType } from '@/composables/util.js'

const nowKRTime = ref()
const nowUTCTime = ref()
const SECOND_IN_ONE_MINUTE = 1000 * 30

onMounted(()=>{
  getNowTime()
  setInterval(getNowTime, SECOND_IN_ONE_MINUTE )
})

const getNowTime = () => {
  let nowTime = new Date()
  let utcNowTime = new Date()
  utcNowTime = utcNowTime.toUTCString()
  // nowTime = nowTime.toLocaleDateString()
  nowKRTime.value = convertDateTimeType(nowTime)
  let test = moment(utcNowTime).utc().format('YYYY-MM-DD HH:mm')
  nowUTCTime.value = test
}

</script>


<style scoped>
.subTitle {
  font-size: 0.9em;
}

.localTime::before {
  content: '';
  border: 0.5px solid #595A63;
  margin-left : 4px;
}

@media screen and (max-width: 1250px) {
  .timeinfo{
    flex-direction : column;
  }

  .localTime::before {
    display: none;
  }

  .localTime{
    margin-left : 0px;
  }
}
</style>
