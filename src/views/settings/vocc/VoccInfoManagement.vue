<template>
  <v-container fluid class="h-100">
    <v-row class="ma-0 h-100">
      <v-col cols="3">
        <v-card class="cardContainer h-100" rounded="30">
          <v-card-title>
            <div>선사기초정보</div>
          </v-card-title>
          <v-card-text>
            <VoccInfoEditForm></VoccInfoEditForm>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-card class="cardContainer h-100" rounded="30">
          <v-card-text class="py-0">
            <v-tabs v-model="tab" color="#5789FE" align-tabs="left">
              <v-tab :value="tabItem[0]">선박 관리</v-tab>
              <v-tab :value="tabItem[1]">선단 관리</v-tab>
            </v-tabs>
            <v-window v-model="tab">
              <v-window-item :value="tabItem[0]">
                <ShipManagement></ShipManagement>
              </v-window-item>
              <v-window-item :value="tabItem[1]">
                <FleetManagement></FleetManagement>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref} from 'vue'
import VoccInfoEditForm from '@/views/settings/vocc/VoccInfoEditForm.vue';
import ShipManagement from '@/views/settings/vocc/ship/ShipManagement.vue';
import FleetManagement from '@/views/settings/vocc/fleet/FleetManagement.vue';

const tab = ref('ship')

const tabItem = ref([
  'ship', 'vocc'
])

</script>

<style></style>