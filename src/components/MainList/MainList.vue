<template>
  <div class="list">
    <div class="type"></div>
    <div class="main">
    <div v-for="(item, index) in list">
      <p>
        <span>{{item.knowledge.knowledgeName}}</span>
        <span>{{item.difficulty.value}}</span>
        <span>{{item.section.categoryName}}</span>
        <input type="checkbox" :value="item.id" v-model="checkedQuestions">
      </p>
      <div v-html="item.content"></div>
      <div>
        <span @click="showAnalysis(index)">解析</span>
        <div v-html="item.analysis" v-show="showController[index]"></div>
      </div>
    </div>
  </div>
    <div class="page" v-show="pageCount">
{{pageCount}}
    </div>
  </div>
</template>

<script>
  import {listServer} from '@/api'
  export default {
    name: 'MainList',
    props: ['catalog'],
    data () {
      return {
        token: '',
        list: [],
        checkedQuestions: [],
        showController: [],
        pageCount: 0,
        pageNum: 1
      }
    },
    created () {
      listServer.getToken2().then(result => {
        this.token = result.access_token
      })
    },
    watch: {
      catalog: function () {
        if (this.catalog && this.token) {
          this.getHomeWork()
        }
      }
    },
    methods: {
      getHomeWork () {
        let params = {
          token: this.token,
          catalog: this.catalog,
          page: 1
        }
        listServer.getHomeWork(params).then(result => {
         // console.log(result.count)
          this.list = result.listQuestionModel
          this.pageCount = Math.ceil(result.count / this.CONFIG.limit)
          this.initShow(this.list.length)
        })
      },
      initShow (length) {
        for (let i = 0; i < length; i++) {
          this.showController.push(false)
        }
      },
      showAnalysis (index) {
        this.$set(this.showController, index, !this.showController[index])
      }
    }
  }
</script>

<style>

</style>
