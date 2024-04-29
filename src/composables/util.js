import router from '@/routes/index.js'
import moment from 'moment'
import { getActivePinia } from 'pinia'

export const dateFormatter = (param) => {}
export const goPage = (url, metaName, metaValue) => {
  // console.log('경로' + url + '메타명' + metaName + '메타값' + metaValue)
  router.push(url)
}

export const logout = () => {
  localStorage.clear()
  sessionStorage.clear()
  alert('로그아웃')
  getActivePinia()._s.forEach((store) => {
    console.dir(store)
    // store.$dispose()
  })
  goPage('/auth/login')
}

/**
 * 객체 초기화
 * @param {} object 
 */
export const resetObject = ( object )=>{
   // 초기화
  for (const key in object) {
    object[key] = null;
  }
}


/**
 * SSE 이벤트 구독
 */
export const sse = (eventSource) => {
  
  eventSource.addEventListener('open', (e) => {
  })

  eventSource.addEventListener('sse', (e) => {
  

    const obj = JSON.parse(e.data)
    if (obj.sseReturnCode == 'DUPLICATED_LOGIN') {
      logout()
    }

    if (obj.sseReturnCode == 'SESSION_EXPIRED') {
      alert(obj.msg)
      logout()
    }

    if(obj.sseReturnCode == 'ALREADY_LOGGED_IN_USER'){
      const errMsg = obj.msg
      router.push({
        path: '/noAccess', 
        params: { 
          message: errMsg
        }
      })
    }

    if(obj.sseReturnCode == 'CHANGED_SHIP'){
      console.log('선박 변경')
      return obj.msg;
    }
  })

  eventSource.addEventListener('error', (e) => {
    if (e.readyState == EventSource.CLOSED) {
      eventSource.close()
    }
  })

}


/**
 * SSE 이벤트 구독
 */
export const sse2 = (eventSource) => {
  
  eventSource.addEventListener('sse2', (e) => {
  

    const obj = JSON.parse(e.data)
    if (obj.sseReturnCode == 'DUPLICATED_LOGIN') {
      logout()
    }

    if (obj.sseReturnCode == 'SESSION_EXPIRED') {
      alert(obj.msg)
      logout()
    }

    if(obj.sseReturnCode == 'ALREADY_LOGGED_IN_USER'){
      const errMsg = obj.msg
      router.push({
        path: '/noAccess', 
        params: { 
          message: errMsg
        }
      })
    }
  })

  eventSource.addEventListener('error', (e) => {
    if (e.readyState == EventSource.CLOSED) {
      eventSource.close()
    }
  })

}

/**
 * 숫자 3자리 단위로 끊는 기능
 * ex) 123000 => 1,23,000
 */

export const convertNumberFormat = ( data ) => {
  return new Intl.NumberFormat('ko', {
    style: 'decimal',
    minimumFractionDigits: 2
  }).format(data)
}

export const convertDateType = ( date ) => {
  const utcDate = moment(date)
  const formattedDate = utcDate.format('YYYY-MM-DD')

  return formattedDate;
}

export const convertDateTimeType = (date) => {
  const utcDate = moment(date)
  const formattedDate = utcDate.format('YYYY-MM-DD HH:mm')
  return formattedDate
}

export const convertDateTimeSecondType = (date) => {
  const utcDate = moment(date)
  const formattedDate = utcDate.format('YYYY-MM-DD HH:mm:ss')

  return formattedDate
}

export const addDay = (date, days) => {
  const originDate = moment(date);
  let addedDate = originDate.add(days, 'days')

  return addedDate;
}

/**
 * 날짜 범위 유효성 검사
 * 시작날짜는 종료날짜보다 과거여야한다
 * @param {*} startDate 
 * @param {*} endDate 
 * @returns 
 */
export const isValidDateRange = (startDate, endDate) =>{
  let startDateTime = moment(startDate)
  let endDateTime = moment(endDate)

  console.log(startDateTime)
  console.log(endDateTime)

  let result = startDateTime.isBefore(endDateTime)

  console.log(result)

  return result
}