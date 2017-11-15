<template>
<div class="basket" v-show="showFlag">
  <div class="top-button">
    <button>删除本题</button>
  </div>
  <div class="main">
    <div v-for="(item, index) in checked"  v-if="index === i">
      <div v-html="item.contentObject.accessories[0].desc"></div>
      <span>知识点：{{item.knowledge[0].knowledgeName}}</span>
      <span>难度：{{item.difficulty.value}}</span>
      <span>题型：{{item.section.categoryName}}</span>
      <p v-for="op in item.contentObject.accessories[0].options">
        <span>{{op.id}}</span>
        <span v-html="op.desc"></span>
      </p>
      <p>答案：
        <span v-for="op in item.contentObject.accessories[0].options"><input type="checkbox"/>{{op.id}}</span>
      </p>
      <div>
        解析：
        <p v-html="item.analysis"></p>
      </div>
    </div>
  </div>
  <div class="pagenation">
    <span v-for="(item, index) in checked" @click="page(index)">{{index+1}}</span>
  </div>
  <div class="bot-button">
    <button @click="hidden">返回</button>
    <button @click="">保存</button>
  </div>
</div>
</template>

<script>
  export default {
    name: 'QuestionBasket',
    props: ['checked'],
    data () {
      return {
        showFlag: false,
        ccc: '',
        pageCount: 0,
        i: 0
      }
    },
    updated () {
      console.log(this.checked)
      this.ccc = this.checked[0].content
      this.pageCount = this.checked.length
    },
    watch: {
      i: function () {
        this.ccc = this.checked[this.i].content
        console.log(this.i)
      }
    },
    methods: {
      show () {
        this.showFlag = true
      },
      hidden () {
        this.showFlag = false
      },
      page (index) {
        this.i = index
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .basket
    position fixed
    left 0
    top 0
    z-index 30
    width 100%
    height 100%
    background #fff
</style>
