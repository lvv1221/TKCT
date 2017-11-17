<template>
  <div id="Exam">
    <div class="exam_title_bar">
      <div class="exam_title">题库出题</div>
      <div class="exam_title_close" id="exam_close"><i class="glyphicon glyphicon-remove" style="color:#fff;"></i></div>
    </div>
    <div v-show="!basketShow">
    <div class="exam_left">
      <left-select @selectEnd="getBook($event)" :token="token" ></left-select>
      <div class="exam_textbook_title"  :title="book.name">{{book.name}}</div>
      <left-tree :token="token" :book="book" @getCata="getCata($event)"></left-tree>
    </div>
    <div class="exam_right">
      <keep-alive>
         <main-list :catalog="catalog" :phase="phase" @select="getChecked($event)"></main-list>
      </keep-alive>
    </div>
    <div class="exam_bottm">
      <div class="exam_bottm_generate" style="cursor: pointer;" @click="showBasket">
        <i></i>
        习题蓝
        <div class="exam_digital">{{checkedData.length}}</div>
      </div>
    </div>
    </div>
    <div v-show="basketShow">
      <question-basket ref="basket" :checked="checkedData" @hidden="showBasket"></question-basket>
    </div>
  </div>
</template>

<script>
  import LeftSelect from './LeftSelect/LeftSelect.vue'
  import LeftTree from './LeftTree/LeftTree.vue'
  import MainList from './MainList/MainList.vue'
  import QuestionBasket from './QuestionBasket/QuestionBasket.vue'
  import {mainServer} from '@/api'
  export default {
    name: 'tiku',
    data () {
      return {
        token: '',
        book: {},
        catalog: '',
        phase: '',
        checkedData: [],
        basketShow: false
      }
    },
    created () {
      mainServer.getToken().then(result => {
        this.token = result.access_token
      })
    },
    methods: {
      getBook (book) {
        this.book = book
        this.catalog = book.code
        this.phase = book.properties.phase
       // console.log(book.properties.phase)
      },
      getCata (catalog) {
        this.catalog = catalog
      },
      getChecked (arg) {
       // console.log(arg)
        this.checkedData = arg
      },
      showBasket () {
       // this.$refs.basket.show()
        this.basketShow = !this.basketShow
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
