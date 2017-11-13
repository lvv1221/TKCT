<template>
  <div class="list">
    <div class="type">
      <span v-if="types.length !== 0" @click="getAll" :class="{'current': section === ''}">全部</span>
      <span v-for="(value,key) in types" @click="getSection(key)" :class="{'current': section === key}"> {{value}}</span>
    </div>
    <div class="main">
    <div v-for="(item, index) in list">
      <p>
        <span>{{item.knowledge.knowledgeName}}</span>
        <span>{{item.difficulty.value}}</span>
        <span>{{item.section.categoryName}}</span>
        <input type="checkbox" :value="item" v-model="checkedQuestions" @change="selectQuestion">
      </p>
      <div v-html="item.content"></div>
      <div>
        <span @click="showAnalysis(index)">解析</span>
        <div v-html="item.analysis" v-show="showController[index]"></div>
      </div>
    </div>
  </div>
    <div class="page" v-show="pageCount.length > 1">
      <span @click="prePage">上一页</span>
      <span :class="{'current': pageNum === 1}" @click="page(1)">1</span>
      <span v-if="pomit">...</span>
      <span v-for="item in pageCount" v-if="item.show" :class="{'current': pageNum === item.page}" style="margin: 0 10px" @click="page(item.page)">{{item.page}}</span>
      <span v-if="nomit">...</span>
      <span :class="{'current': pageNum === pageCount.length}" @click="page(pageCount.length)" v-if="pageCount.length > 1">{{pageCount.length}}</span>
      <span @click="nextPage">下一页</span>
    </div>
  </div>
</template>

<script>
  import {listServer} from '@/api'
  export default {
    name: 'MainList',
    props: ['catalog', 'phase'],
    data () {
      return {
        token: '',
        list: [],
        checkedQuestions: [], // 已选择的题目
        showController: [], // 解析内容显示控制
        pageCount: [],
        pageNum: 1,
        types: [],
        section: ''
      }
    },
    created () {
      // 获取token
      listServer.getToken2().then(result => {
        this.token = result.access_token
       // this.getHomeWork()
      })
    },
    watch: {
      // 如果获取到书本信息，则执行初始化题目列表
      catalog: function () {
        if (this.catalog && this.token) {
          this.getHomeWork()
        }
      },
      // 如果获取到学段信息，则初始化题目类型列表
      phase: function () {
        if (this.phase && this.token) {
          this.getQuestionType()
        }
      },
      // 如果当前页被改变，则请求接口获取题目列表，同时改变分页控件样式
      pageNum: function () {
        for (let obj of this.pageCount) {
          if (obj.page !== 1 && obj.page !== this.pageCount.length) { // 前五个特殊处理
            if (this.pageNum < 5 && obj.page < 6) {
              obj.show = true
            } else if (this.pageNum > this.pageCount.length - 4 && obj.page > this.pageCount.length - 5) { // 后五个特殊处理
              obj.show = true
            } else if (this.pageNum > 4 && this.pageNum < this.pageCount.length - 3 && Math.abs(obj.page - this.pageNum) < 3) { // 中间普通处理
              obj.show = true
            } else {
              obj.show = false
            }
          }
        }
        // 请求接口，获取题目列表
        this.getHomeWork('page')
      },
      // 题目类型改变后，改变题目列表
      section: function () {
        this.getHomeWork()
      }
    },
    computed: {
      // 是否显示后面的省略号
      nomit: function () {
        if (this.pageCount.length - this.pageNum > 3 && this.pageCount.length > 6) {
          return true
        } else {
          return false
        }
      },
      // 是否显示前面的省略号
      pomit: function () {
        if (this.pageNum - 1 > 3 && this.pageCount.length > 6) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      // 初始化&& 翻页后，获取题目列表
      getHomeWork (page) {
        // 待测试
        if (!page) {
          this.pageNum = 1
        }
        let params = {
          token: this.token,
          catalog: this.catalog,
         // catalog: '09010201-002',
          page: this.pageNum,
          section: this.section ? this.section : '' // 若没有指定题目类型，则获取全部
        }
        listServer.getHomeWork(params).then(result => {
         // console.log(result.count)
          this.list = result.listQuestionModel
          this.initShow(this.list.length)
          // 没有参数时为初始化模式
          if (!page) {
            let pageCount = Math.ceil(result.count / this.CONFIG.limit)
            this.initPageCount(pageCount)
          }
        })
      },
      // 初始化分析内容显示
      initShow (length) {
        for (let i = 0; i < length; i++) {
          this.showController.push(false)
        }
      },
      // 分析内容显示
      showAnalysis (index) {
        this.$set(this.showController, index, !this.showController[index])
      },
      // 翻页
      page (num) {
        this.pageNum = num
      },
      // 上一页
      prePage () {
        if (this.pageNum > 1) {
          this.pageNum--
        }
      },
      // 下一页
      nextPage () {
        if (this.pageNum < this.pageCount.length) {
          this.pageNum ++
        }
      },
      // 初始化翻页控件
      initPageCount (pageCount) {
        this.pageCount = []
        for (let i = 0; i < pageCount; i++) {
          if (i < Math.min(5, pageCount - 1) && i > 0) {
            this.pageCount.push({page: i + 1, show: true})
          } else {
            this.pageCount.push({page: i + 1, show: false})
          }
        }
      },
      // 获取题目类型列表
      getQuestionType () {
        let params = {
          token: this.token,
          phase: this.phase[0]
        }
        listServer.getQuestionType(params).then(result => {
          this.types = result
         // console.log(JSON.stringify(this.types))
        })
      },
      // 全部题目类型
      getAll () {
        if (this.section !== '') {
          this.section = ''
          this.pageNum = 1
        }
      },
      // 其他题目类型
      getSection (key) {
        if (this.section !== key) {
          this.section = key
          this.pageNum = 1
        }
      },
      selectQuestion () {
        this.$emit('select', this.checkedQuestions)
      }
    }
  }
</script>

<style lang="stylus" scoped>
.current
  color red
</style>
