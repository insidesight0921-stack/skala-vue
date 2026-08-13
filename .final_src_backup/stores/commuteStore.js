import { defineStore } from 'pinia'

// 통근 경로(집/회사)와 출퇴근 시간을 저장하는 스토어
export const useCommuteStore = defineStore('commute', {
  state: () => ({
    homeCity: 'Seoul', // 집
    workCity: 'Incheon', // 회사
    departHour: 8, // 출근 시각
    returnHour: 18, // 퇴근 시각
  }),
  actions: {
    setRoute(home, work) {
      this.homeCity = home
      this.workCity = work
    },
    setTimes(depart, ret) {
      this.departHour = depart
      this.returnHour = ret
    },
  },
})
