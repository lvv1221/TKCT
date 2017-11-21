<template>
  <div id="Exam">
    <!--标题栏-->
    <div class="exam_title_bar">
      <div class="exam_title">题库出题</div>
      <div class="exam_title_close" id="exam_close" @click="close"><i class="glyphicon glyphicon-remove" style="color:#fff;"></i></div>
    </div>
    <!--题库正文-->
    <div v-show="!basketShow">
      <!--左侧-->
    <div class="exam_left">
      <!--左侧选择框组-->
      <left-select @selectEnd="getBook($event)" :token="token" @reset="resetBook"></left-select>
      <!--左侧中间书名-->
      <div class="exam_textbook_title"  :title="book.name">{{book.name}}</div>
      <!--左侧树-->
      <left-tree :token="token" :book="book" :reset="reset" @getCata="getCata($event)"></left-tree>
    </div>
      <!--右侧-->
    <div class="exam_right">
      <!--右侧题型列表与题目列表（动态缓存）-->
      <keep-alive>
         <main-list :catalog="catalog" :phase="phase" :subject="subject" :reset="reset"></main-list>
      </keep-alive>
    </div>
      <!--底部-->
    <div class="exam_bottm">
      <!--底部按钮-->
      <div class="exam_bottm_generate" style="cursor: pointer;" @click="showBasket">
        <i></i>
        习题蓝
        <div class="exam_digital">{{checkedCount}}</div>
      </div>
    </div>
    </div>
    <!--习题蓝-->
    <div v-show="basketShow">
      <question-basket ref="basket"  @hidden="showBasket"></question-basket>
    </div>
  </div>
</template>

<script>
  import LeftSelect from './LeftSelect/LeftSelect.vue'
  import LeftTree from './LeftTree/LeftTree.vue'
  import MainList from './MainList/MainList.vue'
  import QuestionBasket from './QuestionBasket/QuestionBasket.vue'
  import {mainServer} from '@/api'
//  import winTool from '../assets/js/winTool'

  export default {
    name: 'tiku',
    data () {
      return {
        token: '',
        book: {},
        catalog: '', // 书本序号
        phase: '', // 学段
        subject: '', // 学科
        basketShow: false,
        reset: false // 重置书本信息标识
      }
    },
    created () {
      // 获取限定参数
     // let max = winTool.win.params.maxiQuesNums
     // let questionType = winTool.win.params.questionTypes
      let max = 5
      let questionType = ['objective']
      console.log(max)
      console.log(questionType)
      this.$store.dispatch('setMax', max)
      this.$store.dispatch('setQuestionType', questionType)
      /* 获取token */
      mainServer.getToken().then(result => {
        this.token = result.access_token
      })
    },
    computed: {
      // 习题蓝已选习题个数
      checkedCount () {
        return this.$store.getters.checkedCount
      }
    },
    methods: {
      // 获取书本信息
      getBook (book) {
        this.reset = false
        this.book = book
        this.catalog = book.code
        this.phase = book.properties.phase
        this.subject = book.properties.subject[0]
       // console.log(this.subject)
      },
      // 选择框改变，重置左侧书名、树、以及右侧信息
      resetBook () {
        this.reset = true
        this.book = {
          name: '',
          code: ''
        }
      },
      // 左侧书本点击单元后，获取右侧列表所需code
      getCata (catalog) {
        this.reset = false
        this.catalog = catalog
      },
      // 隐藏页面，显示习题蓝
      showBasket () {
       // this.$refs.basket.show()
        if (this.checkedCount !== 0) {
          this.basketShow = !this.basketShow
        }
      },
      close () {
        winTool.win.emit('close')
      }
    },
    components: {
      'left-select': LeftSelect,
      'left-tree': LeftTree,
      'main-list': MainList,
      'question-basket': QuestionBasket
    }
  }
</script>

<style lang="stylus" scoped>
select
  width 80px
  .opt
    overflow hidden /*自动隐藏文字*/
    text-overflow ellipsis/*文字隐藏后添加省略号*/
    white-space nowrap/*强制不换行*/
</style>
