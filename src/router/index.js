import Vue from 'vue'
import Router from 'vue-router'
import QuestionLib from '@/components/QuestionLib'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'QuestionLib',
      component: QuestionLib
    }
  ]
})
