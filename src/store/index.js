import Vuex from 'vuex'
import Vue from 'vue'
import _ from 'lodash'
Vue.use(Vuex)

const store = {
  state: {
    selectType: '',
    questionType: [],
    maxQuesNums: 1,
    checkedQuestions: []
  },
  getters: {
    checkedCount: state => {
      return state.checkedQuestions.length
    }
  },
  mutations: {
    setMax (state, max) {
      state.maxQuesNums = max
    },
    setQuestionType (state, type) {
      state.questionType = type
    },
    setSelectType (state, type) {
      state.selectType = type
    },
    addQuestion (state, que) {
      if (_.findIndex(state.checkedQuestions, que) === -1) {
        state.checkedQuestions.push(que)
      }
    },
    deleteQuestion (state, que) {
      let i = _.findIndex(state.checkedQuestions, que)
      if (i !== -1) {
        state.checkedQuestions.splice(i, 1)
      }
    },
    addOrDel (state, que) {
      if (_.findIndex(state.checkedQuestions, que) === -1) {
        if (state.checkedQuestions.length < state.maxQuesNums) {
          state.checkedQuestions.push(que)
        }
      } else {
        let i = _.findIndex(state.checkedQuestions, que)
        state.checkedQuestions.splice(i, 1)
      }
    },
    setQuestions (state, ques) {
      state.checkedQuestions = ques
    }
  },
  actions: {
    setMax ({commit}, max) {
      commit('setMax', max)
    },
    setQuestionType ({commit}, type) {
      commit('setQuestionType', type)
    },
    setSelectType ({commit}, type) {
      commit('setSelectType', type)
    },
    addQuestion ({commit}, que) {
      commit('addQuestion', que)
    },
    deleteQuestion ({commit}, que) {
      commit('deleteQuestion', que)
    },
    addOrDel ({commit}, que) {
      commit('addOrDel', que)
    },
    setQuestions ({commit}, ques) {
      commit('setQuestions', ques)
    }
  },
  // 严格模式
  strict: process.env.NODE_ENV === 'development'
}

export default new Vuex.Store(store)
