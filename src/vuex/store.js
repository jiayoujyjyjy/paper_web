import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    username: 'noUser',
    userId: 123,
    userAuth: 0,
    menuActive: '1',
    resetPage: ''
  },
  mutations: {
    setUserName (state, msg) {
      state.username = msg
    },
    setUserId (state, msg) {
      state.userId = msg
    },
    setUserAuth (state, msg) {
      state.userAuth = msg
    },
    setMenuActive (state, msg) {
      state.menuActive = msg
    },
    setResetPage (state, msg) {
      state.resetPage = msg
    }
  }
})

export default store
