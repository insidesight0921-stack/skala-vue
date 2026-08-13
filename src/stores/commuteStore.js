import { defineStore } from 'pinia'

/** 통근 경로(집/회사): 표시명(한글) + 조회어(API용)를 분리 저장 */
export const useCommuteStore = defineStore('commute', {
  state: () => ({
    homeCity: '서울',
    workCity: '인천',
    homeQuery: 'Seoul',
    workQuery: 'Incheon',
    departHour: 8,
    returnHour: 18,
  }),
  actions: {
    setRoute(homeCity, workCity, homeQuery, workQuery) {
      this.homeCity = homeCity
      this.workCity = workCity
      this.homeQuery = homeQuery || homeCity
      this.workQuery = workQuery || workCity
    },
    setTimes(depart, ret) {
      this.departHour = Number(depart)
      this.returnHour = Number(ret)
    },
  },
})
