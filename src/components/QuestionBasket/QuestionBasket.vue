<template>
<div class="xy-qtool" style="background-color: #e8e8e8">
  <!--习题列表-->
  <div class="xy-make-ques-body">
    <template v-for="(item, index) in checked"  v-if="index === i">
      <!--习题序号& 删除按钮-->
    <div class="frame question-detail">
      <div class="xy-q-triangle current-number">
        <span class="xy-q-triangle-content">{{index+1}}</span>
      </div>
      <div class="del">
        <i class="iconfont"></i>
        删除本题
      </div>
        <div class="title" v-html="item.contentObject.accessories[0].desc"></div>
        <div class="property">
          <span class="keyword" :title="item.knowledge[0].knowledgeName">知识点：{{item.knowledge[0].knowledgeName}}</span>
          <span class="keyword">
            <div class="difficulty-start-icon on" v-for="star in (6-item.difficulty.key)" ></div>
            <div class="difficulty-start-icon off" v-for="(star,index) in (item.difficulty.key-1)" :style="{'margin-left': index === 0 ? '-5px': '0'}"></div>
          </span>
          <span class="keyword">题型：{{item.section.categoryName}}</span>
        </div>
        <div class="selection">
          <p v-for="op in item.contentObject.accessories[0].options">
            <span>{{op.id}}.</span>
            <span v-html="op.desc"></span>
          </p>
        </div>
    </div>
      <!--答案-->
      <!--<div class="frame answer-content">
        <div class="title">答案：</div>
        <div class="selection" style="margin-top: 0" v-if="item.section.categoryCode === '00'">
          <template>
            <input type="checkbox" class="question-checkbox" value="A" v-model="item.objectiveQuestionAnswer">&nbsp;A&nbsp;&nbsp;&nbsp;
            <input type="checkbox" class="question-checkbox" value="B" v-model="item.objectiveQuestionAnswer">&nbsp;B&nbsp;&nbsp;&nbsp;
            <input type="checkbox" class="question-checkbox" value="C" v-model="item.objectiveQuestionAnswer">&nbsp;C&nbsp;&nbsp;&nbsp;
            <input type="checkbox" class="question-checkbox" value="D" v-model="item.objectiveQuestionAnswer">&nbsp;D&nbsp;&nbsp;&nbsp;
          </template>
        </div>
        <div class="answer"  contenteditable="true" v-if="item.section.categoryCode === '02'">
        </div>
      </div>-->
      <!--习题解析-->
      <div class="frame explain">
        <div class="title">解析：</div>
        <div class="content">
          <div class="edit-area" v-html="item.analysis">
          </div>
        </div>
      </div>
    </template>
    <!--<div v-for="(item, index) in checked"  v-if="index === i">
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
    </div>-->
  </div>
  <!--底部-->
  <div class="xy-switcher-main container">
    <!--分页-->
    <div class="switcher-main">
      <span class="xy-tab ctrl" >&lt;&lt;</span>
      <div class="switcher-pool">
        <ul class="switcher" style="margin: auto; width: 223px; position: static;">
          <li class="current active" style="cursor: pointer;" v-for="(item, index) in checked" @click="page(index)">
            <div>{{index+1}}</div>
          </li>
        </ul>
      </div>
      <span class="xy-tab ctrl">&gt;&gt;</span>
    </div>
    <!--提示与按钮-->
    <div class="row ctrl-row">
      <div class="hint">
        <i class="iconfont"> </i>
        拖动标签可调整顺序
      </div>
      <div class="ctrl-buttons col-md-4 col-sm-4 col-md-offset-4 col-sm-offset-4">
        <div class="ctrl-div">
          <button class="button">
            上一题
          </button>
          <button class="indicator">
          </button>
          <button>
            下一题
          </button>
        </div>
      </div>
      <button class="optional save">保存</button>
      <button class="optional back" @click="hidden">返回</button>
      <input type="file" id="save-file" style="display: none" accept=".sco">
    </div>
    <!--<div class="pagenation">
      <span v-for="(item, index) in checked" @click="page(index)">{{index+1}}</span>
    </div>-->
    <!--<button @click="hidden">返回</button>
    <button @click="">保存</button>-->
  </div>
</div>
</template>

<script>
  export default {
    name: 'QuestionBasket',
    props: ['checked'],
    data () {
      return {
        showFlag: true,
        ccc: '',
        pageCount: 0,
        i: 0
      }
    },
    updated () {
     // console.log(this.checked)
      if (this.checked.length !== 0) {
        this.ccc = this.checked[0].content
        this.pageCount = this.checked.length
      }
    },
    watch: {
      i: function () {
        this.ccc = this.checked[this.i].content
       // console.log(this.i)
      }
    },
    methods: {
      show () {
        this.showFlag = true
      },
      hidden () {
        this.$emit('hidden')
       // this.showFlag = false
      },
      page (index) {
        this.i = index
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .basket
    z-index 30
    background #fff
    font-family: "微软雅黑";
    width: 970px;
    height: 728px;
    margin: 0 auto;
</style>
