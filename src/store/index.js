import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const store = {
  state: {
    selectType: ''
  },
  mutations: {
    setSelectType (state, type) {
      state.selectType = type
    }
  },
  actions: {
    setSelectType ({commit}, type) {
      commit('setSelectType', type)
    }
  },
  // 严格模式
  strict: process.env.NODE_ENV === 'development'
}

export default new Vuex.Store(store)
