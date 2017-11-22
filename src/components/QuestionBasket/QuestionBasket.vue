<template>
<div class="xy-qtool" style="background-color: #e8e8e8;height: 678px">
  <!--习题列表-->
  <div class="xy-make-ques-body" >
    <template v-for="(item, index) in list"  v-if="index === i">
      <!--习题序号& 删除按钮-->
    <div class="frame question-detail">
      <div class="xy-q-triangle current-number">
        <span class="xy-q-triangle-content">{{index+1}}</span>
      </div>
      <div class="del" v-if="pageCount === 1" style="opacity: 0.4; cursor: default;">
        <i class="iconfont"></i>
        删除本题
      </div>
      <div class="del" @click="diaShow = true" v-else>
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
      <!--确认弹窗-->
      <div tabindex="-1" class="modal fade ng-isolate-scope in" style="z-index: 1050; display: block;" v-show="diaShow">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-body xy-modal-body">
              <div class="xy-ensure-body">
                <p>是否删除习题？</p>
              </div>
              <div class="xy-ensure-footer">
                <button class="button ensure" @click="deleteQue(index)">确定</button>
                <button class="button cancel" @click="diaShow = false">取消</button>
              </div>
            </div>
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
      <span class="xy-tab ctrl" v-if="list.length > 10" @click="prePage">&lt;&lt;</span>
      <div class="switcher-pool">
        <ul class="switcher" style="margin: auto;position: static;" :style="{width: pageWidth }">
          <li class="current" :class="{active: index === i}" style="cursor: pointer;" v-for="(item, index) in list" @click="page(index)" v-if="index > pageNum &&index < pageNum + 11">
            <div>{{index + 1}}</div>
          </li>
        </ul>
      </div>
      <span class="xy-tab ctrl" v-if="list.length > 10" @click="NextPage">&gt;&gt;</span>
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
      <button class="optional save" @click="save">保存</button>
      <button class="optional back" @click="hidden">返回</button>
      <input type="file" id="save-file" style="display: none" accept=".sco">
    </div>
    <!--<div class="pagenation">
      <span v-for="(item, index) in checked" @click="page(index)">{{index+1}}</span>
    </div>-->
    <!--<button @click="hidden">返回</button>
    <button @click="">保存</button>-->
  </div>
  <!--遮罩层-->
  <div class="modal-backdrop fade in" style="z-index: 998;width: 970px;
    height: 803px;margin: 0 auto;display: block;" v-show="diaShow"></div>
</div>
</template>

<script>
 // import winTool from '../../assets/js/winTool'

  export default {
    name: 'QuestionBasket',
    data () {
      return {
        showFlag: true,
        list: [],
        pageCount: 0,
        i: 0,
        pageNum: -1,
        diaShow: false
      }
    },
    created () {
     // console.log(this.checked)
      this.list = this.$store.state.checkedQuestions
    },
    updated () {
      this.pageCount = this.$store.getters.checkedCount
    },
    computed: {
      pageWidth () {
        let width = ''
        width = 71 + (this.pageCount - 1) * 76 + 'px'
        return width
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
      },
      deleteQue (index) {
        if (index === this.pageCount - 1) {
          this.i--
        }
        this.$store.dispatch('deleteQuestion', this.list[index])
        this.diaShow = false
      },
      prePage () {
        if (this.pageNum > -1) {
          this.pageNum -= 1
        }
      },
      NextPage () {
        if (this.pageNum < this.pageCount - 11) {
          this.pageNum += 1
        }
      },
      save () {
        console.log(this.pageCount)
        let list = this.$store.state.checkedQuestions
        let arr = []
        for (let i = 0; i < this.pageCount; i++) {
          let obj = {}
          this.$set(obj, 'categoryCode', list[i].section.categoryCode)
          this.$set(obj, 'contentType', list[i].content && list[i].section.content !== null ? '01' : '00')
          this.$set(obj, 'content', list[i].content && list[i].section.content !== null ? list[i].content : list[i].contentImg)
          this.$set(obj, 'answer', list[i].content && list[i].section.content !== null ? list[i].answer : list[i].answerImg)
          this.$set(obj, 'contentObject', list[i].contentObject)
          arr.push(obj)
        }
       // winTool.win.emit('setStudyCloudContent', arr)
        console.log(JSON.stringify(arr))
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
