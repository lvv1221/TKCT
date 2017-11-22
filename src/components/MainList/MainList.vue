<template>
  <div class="list">
    <div class="exam_right_top">
      <!--题型列表-->
      <ul class="nav nav-tabs exam_tabs" v-if="types.length !== 0">
        <!--<li @click="getAll" :class="{'active': section === ''}"><a href="#">全部</a></li>-->
        <li v-for="(value,key) in types" @click="getSection(key, value)" :class="{'active': section === key, 'disabled': !typeController[value]}">
          <a href="#">{{value}}</a>
        </li>
      </ul>
    </div>
    <div class="exam_content">
      <!--题干列表-->
      <ul class="exam_content_ul" v-if="list !== null">
        <li v-for="(item, index) in list">
          <div class="exam_content_ul_top">
            <div class="exam_content_ul_top_img">
              <span>{{index + 1}}</span>
            </div>
            <div class="exam_knowledge">
              知识点：<span :title="item.knowledge[0].knowledgeName">{{item.knowledge[0].knowledgeName}}</span>
            </div>
            <div class="exam_difficulty">
              难度：
              <span class="exam_star exam_star_orange" v-for="star in (6-item.difficulty.key)"></span>
              <span class="exam_star" v-for="star in (item.difficulty.key-1)"></span>
            </div>
            <div class="exam_Questions">
              题型：<span>{{item.section.categoryName}}</span>
            </div>
            <div class="exam_input" :class="{'exam_input_active': showSelected[index]}"
                 @click="selectQuestion(index)"></div>
          </div>
          <!--<p>
            <span>{{item.knowledge.knowledgeName}}</span>
            <span>{{item.difficulty.value}}</span>
            <span>{{item.section.categoryName}}</span>
            <input type="checkbox" class="exam_input"  :value="item" v-model="checkedQuestions" @change="selectQuestion">
          </p>-->
          <div class="exam_content_ul_bottom">
            <!--题干-->
            <div class="exam_content_topic">
              <div v-html="item.content"></div>
              <div class="exam_resolve" @click="showAnalysis(index)">
                解析
                <i class="glyphicon" :class="showController[index]?'glyphicon-menu-up':'glyphicon-menu-down'"></i>
              </div>
            </div>
            <!--解析-->
            <div class="exam_resolve_topic" :class="{'show': showController[index]}">
              【解析】
              <div v-html="item.analysis" :class="{'show': showController[index]}"></div>
            </div>
          </div>
        </li>
      </ul>
      <!--分页-->
      <div class="laypage_main laypageskin_molv" v-show="pageCount.length > 1">
        <!--上一页-->
        <a href="javascript:;" @click="prePage" v-if="pageNum !== 1">上一页</a>
        <!--第一页-->
        <a href="javascript:;" :class="{'laypage_curr': pageNum === 1}" @click="page(1)">1</a>
        <!--省略号1-->
        <span href="javascript:;" v-if="pomit">...</span>
        <!--中间分页-->
        <a href="javascript:;" v-for="item in pageCount" v-if="item.show"
           :class="{'laypage_curr': pageNum === item.page}" @click="page(item.page)">{{item.page}}</a>
        <!--省略号2-->
        <span href="javascript:;" v-if="nomit">...</span>
        <!--最后一页-->
        <a href="javascript:;" class="laypage_last" :class="{'laypage_curr': pageNum === pageCount.length}"
           @click="page(pageCount.length)" v-if="pageCount.length > 1">{{pageCount.length}}</a>
        <!--下一页-->
        <a href="javascript:;" @click="nextPage" v-if="pageNum !== pageCount.length">下一页</a>
      </div>
      <!--无数据图片-->
      <div class="no-data" v-if="list === null || list.length === 0">
        <img src="../../assets/img/no_data.png" alt="no-data" class="ex-img">
      </div>
    </div>
  </div>
</template>

<script>
  import { listServer } from '@/api'
  import _ from 'lodash'

  export default {
    name: 'MainList',
    props: ['catalog', 'phase', 'subject', 'reset'],
    data () {
      return {
        token: '',
        list: [],
        checkedQuestions: [], // 已选择的题目
        showController: [], // 解析内容显示控制
        // showSelected: [],
        pageCount: [], // 分页按钮，包含显示属性
        pageNum: 1,
        types: [], // 题目类型列表
        section: '', //  题型
        typeController: {} // 作答模式控制
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
         // this.section = '' // 更换单元时，保持题型筛选
          this.getHomeWork()
        }
      },
      // 如果获取到学段信息，则初始化题目类型列表
      phase: function () {
        if (this.phase && this.token) {
          this.getQuestionType()
        }
      },
      // 更换课本时，数据先置空
      reset: function (reset) {
        if (reset === true) {
          this.list = []
          this.types = []
          this.pageCount = []
          this.section = ''
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
      },
      // 题目复选框选中状态控制
      showSelected () {
        let showSelected = []
        for (let i = 0; i < this.list.length; i++) {
          showSelected.push(false)
        }
        for (let i = 0; i < this.list.length; i++) {
          if (_.findIndex(this.$store.state.checkedQuestions, this.list[i]) !== -1) {
            this.$set(showSelected, i, true)
            // this.showSelected[i].push(true)
          } else {
            this.$set(showSelected, i, false)
            // this.showSelected.push(false)
          }
        }
        return showSelected
      },
      // 作答模式
      questionType () {
        let type = this.$store.state.questionType
        if (type.length === 1 && type[0] === 'subjective') {
          return '0'
        } else if (type.length === 1 && type[0] === 'objective') {
          return '1'
        } else {
          return '2'
        }
      }
    },
    methods: {
      // 初始化&& 翻页后，获取题目列表
      getHomeWork (page) {
        // 如果未传入参数，代表非翻页操作，故页码置为1
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
          if (this.list !== null) {
            this.initShow(this.list.length)
          }
          /*  for (let i = 0; i < result.count; i++) {
            this.showSelected.push(false)
          }  */
          // 没有参数时为初始化模式
          if (!page) {
            if (result.count !== null) {
              let pageCount = Math.ceil(result.count / this.CONFIG.limit)
              this.initPageCount(pageCount)
            } else {
              this.initPageCount(0)
            }
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
          this.pageNum++
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
          subject: this.subject,
          phase: this.phase[0]
        }
        listServer.getQuestionType(params).then(result => {
          this.types = result
          this.getTypeController(result)
          // console.log(JSON.stringify(this.types))
        })
      },
      // 获取作答模式控制下题型的显示控制器
      getTypeController (result) {
        let type = {}
        if (this.questionType === '1') {
         // console.log(1)
          for (let i in result) {
            if (result[i] === '选择题' || result[i] === '多选题' || result[i] === '判断题') {
              this.$set(type, result[i], true)
            } else {
              this.$set(type, result[i], false)
            }
          }
        } else if (this.questionType === '0') {
         // console.log(2)
          for (let i in result) {
            if (result[i] !== '选择题' && result[i] !== '多选题' && result[i] !== '判断题') {
              this.$set(type, result[i], true)
            } else {
              this.$set(type, result[i], false)
            }
          }
        } else {
          for (let i in result) {
            this.$set(type, result[i], true)
          }
        }
        this.typeController = type
        this.initSection(result)
       // console.log(this.typeController)
      },
      // 作答模式控制下，初始显示的题型
      initSection (result) {
        for (let i in result) {
          if (this.typeController[result[i]] === true) {
            this.section = i
            //  console.log(result[i])
            return
          }
        }
      },
      // 全部题目类型
      getAll () {
        if (this.section !== '') {
          this.section = ''
        }
      },
      // 其他题目类型
      getSection (key, value) {
        if (this.section !== key && this.typeController[value]) {
          this.section = key
        }
      },
      /* selectQuestion (item) {
        this.checkedQuestions.push(item)
       // this.$emit('select', this.checkedQuestions)
      }, */
      // 选题
      selectQuestion (index) {
        // console.log(index)
        //  this.$set(this.showSelected, index, !this.showSelected[index])
        /*  if (_.findIndex(this.checkedQuestions, this.list[index]) === -1) {
            this.checkedQuestions.push(this.list[index])
           // console.log(this.checkedQuestions)
          } else {
            let i = _.findIndex(this.checkedQuestions, this.list[index])
            this.checkedQuestions.splice(i, 1)
           // console.log(this.checkedQuestions)
          }  */
        this.$store.dispatch('addOrDel', this.list[index])
        // this.$emit('select', this.checkedQuestions)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .exam_right_top
    ul
      padding-left 16px
      li
        &.disabled
          a
            color #666
        &.active
          a
            background-color #43A0F2
            color #fff
        a
          padding 3px 14px
          border-radius 0

  .show
    display block

  .laypage_main
    float right
    margin 10px 0px

  .no-data
    color red
    font-size 20px
    text-align center
    height 554px
    ex-img
      width 100%
      height 100%
</style>
