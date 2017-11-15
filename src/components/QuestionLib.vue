<template>
  <div class="tiku">
    <h1>题库出题</h1>
    <div class="left" style="float: left;width: 49%">
      <left-select @selectEnd="getBook($event)" :token="token" ></left-select>
      <left-tree :token="token" :book="book" @getCata="getCata($event)"></left-tree>
    </div>
    <div class="right" style="float: left;width: 49%">
      <keep-alive>
         <main-list :catalog="catalog" :phase="phase" @select="getChecked($event)"></main-list>
      </keep-alive>
    </div>
    <div class="bot-button">
      <button @click="showBasket">习题蓝</button>
    </div>
    <div class="basket">
      <question-basket ref="basket" :checked="checkedData"></question-basket>
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
        checkedData: []
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
        this.$refs.basket.show()
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
