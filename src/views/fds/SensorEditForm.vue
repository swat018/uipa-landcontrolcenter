<template>
  <div>
    <div class="title">센서 정보 수정</div>
    <v-form @submit.prevent="" class="w-100">
      <div class="tab-container">
        <div class="sensor-container ga-2">
          <div class="sensor-item">
            <div class="mb-1">Deck</div>
            <v-autocomplete v-model="sensorData.decks[0]" :items="sensorData.decks" item-title="deckName" item-value="id"
              density="compact" bg-color='#434348' variant="solo-filled" placeholder="Deck를 선택하여 주십시오"
              no-data-text="데이터가 없습니다" hide-details />
          </div>
          <div class="sensor-item mt-1">
            <div class="mb-1">Installation Location</div>
            <i-input label="" type="text" v-model="sensorRegisterForm.location"
              placeholder="nstallation Location를 입력하여 주십시오" :hide-details="true">
            </i-input>
          </div>
          <div class="sensor-item">
            <div class="mb-1">Sensor Type</div>
            <i-input label="Sensor Typer" type="text" v-model="sensorRegisterForm.sensorType"
              placeholder="Sensor Type을 입력하여 주십시오"  :hide-details="true">
            </i-input>
          </div>
          <div class="sensor-item">
            <div class="mb-1">Tag ID</div>
            <i-input label="Tag ID" type="text" v-model="sensorRegisterForm.tagId"
              placeholder="Tag ID를 입력하여 주십시오" :hide-details="true">
            </i-input>
          </div>
          <div class="sensor-item">
            <div class="mb-1">Sensor No</div>
            <i-input label="TYPE" type="text" v-model="sensorRegisterForm.sensorNumber"
              placeholder="Sensor No를 입력하여 주십시오" :hide-details="true">
            </i-input>
          </div>

          <div class="sensor-item d-flex ga-2">
            <div class="flex-grow-1">
              <div class="mb-1">X</div>
              <i-input label="TYPE" type="text"  v-model="sensorRegisterForm.x"
                placeholder="x를 입력하여 주십시오" :hide-details="true">
              </i-input>
            </div>

            <div class="flex-grow-1">
              <div class="mb-1">Y</div>
              <i-input label="TYPE" type="text"  v-model="sensorRegisterForm.y"
                placeholder="y를 입력하여 주십시오" :hide-details="true">
              </i-input>
            </div>
          </div>
        </div>

        <div class="sensor-item">

        </div>

        <i-btn v-if="role != 'ROLE_VOCC_USER'" type="submit" class="w-100 mt-4" text="등록" :disabled="!disabled"></i-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import sensorData from '@/assets/mockup/fdsMonitoring.json'


const sensorRegisterForm = ref({
  location: '',
  nation: null,
  sensorType: '',
  tagId: '',
  sensorNumber: '',
  x : '',
  y : ''
})


</script>

<style scoped>
.title { 
  font-size : 1.2em;
  margin-bottom: 16px;
}
</style>
