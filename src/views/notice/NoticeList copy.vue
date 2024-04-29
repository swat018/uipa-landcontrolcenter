<template>
  <v-container fluid class="h-100">
    <v-row class="ma-0 h-100">
      <v-col cols="12">
        <v-card class="cardContainer h-100" flat>

          <v-card-title class="d-flex justify-space-between mt-1 mb-2">
            <div>공지사항</div>
            <div class="d-flex justify-space-between ">
              <div class="d-flex ga-3 mr-2">
                <input class="noticeList-datePicker" type="date" v-model="startDate" />
                <input class="noticeList-datePicker" type="date" v-model="endDate" />
                <i-btn @click="periodData()" text="조회"></i-btn>
              </div>
              <div class="d-flex ml-2">
                <!-- <v-responsive> -->
                <i-input id="searchBox" v-model="search" prepend-inner-icon="mdi-magnify" placeholder="제목을 입력해주세요"
                  single-line hide-details :custom-filter="filterOnlyCapsText" style="width:350px"></i-input>
                <!-- </v-responsive> -->
              </div>
            </div>

          </v-card-title>

          <v-card-text>
            <v-data-table class="noticeTable elevation-1 management-container" :page="page" :headers="tableHeaders" headers.filter="readonly"
              :items="currentPagePost" :items-per-page="itemsPerPage" v-model:search="search" min-height="576">
              <template v-slot:item="{ item }">
                <tr :class="item.topFix == true ? 'pinned' : ''">
                  <td @click="goDetailPage(item.id)">
                    <v-icon v-if="item.topFix == true" class="pr-2" icon="mdi-volume-high"></v-icon>{{ item.title }}
                  </td>
                  <td class="text-center">{{ item.register }}</td>
                  <td class="text-center">{{ item.registTime }}</td>
                  <td class="text-center">{{ item.views }}</td>

                  <td>
                    <span v-if="role === 'ROLE_LCC_ADMIN'">
                      <i-btn class="mr-2" :text="item.topFix ? '고정해제' : '상단고정'"
                        @click="changeTopFix(item.id, !item.topFix)"
                        :prepend-icon="item.topFix ? 'mdi-pin-off' : 'mdi-pin'"
                        :color="item.topFix ? '#5789FE' : '#3D3D40'"></i-btn>
                      <i-btn class="ml-2" text="삭제" @click="removeNotice(item.id)" color="#F04A4A"
                        prepend-icon="mdi-trash-can"></i-btn>
                    </span>
                  </td>
                  <!-- <td v-else>
                      <v-btn class="mr-2" @click="changeTopFix(item.id, !item.topFix)" prepend-icon="mdi-pin">상단고정</v-btn>
                      <v-btn class="ml-2" @click="removeNotice(item.id)">삭제</v-btn>
                    </td> -->
                </tr>
              </template>


              <template v-slot:bottom>
                <div class="d-flex  justify-space-between text-center pt-2">
                  <div></div>
                  <div><v-pagination v-model="currentPage" :length="totalPageCount"></v-pagination></div>
                  <div class="align-self-center"><i-btn v-if="role === 'ROLE_LCC_ADMIN'" text="새 글 등록" color="#3D3D40"
                      width="105" prepend-icon="mdi-plus" @click="goPage('/notice/add')"></i-btn></div>

                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, watch, computed, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useNoticeStore } from '@/stores/noticeStore'
import { goPage } from '@/composables/util.js'
import moment from 'moment'
import { storeToRefs } from 'pinia'
import { useToast } from '@/composables/useToast'
const { showResMsg } = useToast()


const itemsPerPage = ref(10)
const page = ref(1)
const currentPage = ref(1)
const notices = ref()
const currentPagePost = ref([])
const displayedPost = ref()
const totalPageCount = ref()


const store = useNoticeStore();
const { topPinnedPosts, normalNotices } = storeToRefs(store);
const authStore = useAuthStore();
const { userInfo } = storeToRefs(authStore)

let role = ''
const search = ref('')

const startDate = ref()
const endDate = ref()

const tableHeaders = [
  { title: '제목', key: 'title', align: 'center' },
  { title: '작성자', key: 'register', align: 'center' },
  { title: '등록일', key: 'registTime', align: 'center' },
  { title: '조회수', key: 'views', align: 'center' },
  { title: '', key: '', align: '' }
]

onMounted(() => {
  fetchNotices();
  role = userInfo.value.role
})

let start = ''
let end = ''

const fetchNotices = async (startDate = '', endDate = '') => {
  await store.fetchNotices(startDate, endDate)
    .then(result => {
      notices.value = result;

      displayedPost.value = [...topPinnedPosts.value, ...normalNotices.value]
      getTotalPageCount()
      start = (currentPage.value - 1) * (itemsPerPage.value - topPinnedPosts.value.length)
      end = itemsPerPage.value - topPinnedPosts.value.length;
      currentPagePost.value = [...topPinnedPosts.value, ...normalNotices.value.slice(start, start + end)]
    })
}

const getPostsByPage = () => {
  start = (currentPage.value - 1) * (itemsPerPage.value - topPinnedPosts.value.length)
  end = itemsPerPage.value - topPinnedPosts.value.length;
  const normalNotice = normalNotices.value.slice(start, start + end)
  const notices = [...topPinnedPosts.value, ...normalNotice]
  currentPagePost.value = notices
}

/**
 * 페이지 수 반환
 */
const getTotalPageCount = () => {
  const TotaldisplayCount = displayedPost.value.length - topPinnedPosts.value.length;
  const displayCount = itemsPerPage.value - topPinnedPosts.value.length;
  totalPageCount.value = Math.ceil((TotaldisplayCount / displayCount));
}

watch(currentPage, getPostsByPage)


const changeTopFix = (id, topFix) => {
  if (topFix && topPinnedPosts.value.length >= 5) {
    showResMsg('6개 이상 고정할 수 없습니다')
    return;
  }
  store.changeTopFix(id, topFix).then(() => {
    getPostsByPage()
  })
}

const removeNotice = (noticeId) => {
  store.removeNotice(noticeId)
}

const goDetailPage = (id) => {
  goPage(`/notice/${id}`)
}

const periodData = () => {
  fetchNotices(startDate.value, endDate.value)
}

</script>

<style scoped>
.noticeTable tr td:first-child {
  width: 45%;
}

.noticeTable tbody>tr:nth-child(odd) {
  background: #2F2F32;
}

.noticeTable tbody>tr:nth-child(even) {
  background: #222224;
}

#searchBox .v-input__control {
  width: 350px;
}

.noticeList-datePicker {
  font-size: 0.8em;
  text-align: center;
}

input[type=date] {
  border: 1px solid #49494E;
  padding: 3px 15px;
  border-radius: 8px;
}

/* .pinned {
  background-color: rgb(16 44 123 / 30%);
} */
</style>