<template>
  <div class="exam_left_bottom">
    <ul class="ztree ztreeNode" v-if="courses.length">
      <!--根（1层）-->
      <li class="level0">
        <!--根开关-->
        <span class="button level0 switch" :class="unitShow?'root_open': 'root_close'"  @click="toggle()"></span>
        <!--根名称-->
        <a class="level0" :class="{'curSelectedNode': current === '0'}" @click="current = '0'">
          <!--名称前文件夹/文件图标-->
          <template>
        <span class="button ico_open" v-if="unitShow"></span>
        <span class="button ico_close" v-else></span>
          </template>
          <!--名称文本-->
        <span class="node_name" @click="sendCatalog()">{{book.name}}</span>
        </a>
        <!--单元、目录（1层）-->
        <ul class="level0" v-show="unitShow">
          <li v-for="(unit,index) in courses">
            <!--图标：开关or虚线-->
            <template v-if="unit.courses.length !== 0">
              <!--开关（是否结尾）-->
            <span class="button level1 switch " :class="!unit.hide?'center_open': 'center_close'"  v-if="index !== courses.length-1" @click="toggle(unit)"></span>
            <span class="button level1 switch " :class="!unit.hide?'bottom_open': 'bottom_close'" v-else @click="toggle(unit)"></span>
            </template>
            <template v-else>
              <!--X轴虚线（是否结尾）-->
            <span class="button level1 switch center_docu" v-if="index !== courses.length-1"></span>
            <span class="button level1 switch bottom_docu" v-else></span>
            </template>
            <!--单元名称-->
            <a class="level1" :class="{'curSelectedNode': current === unit.code}" @click="current = unit.code"><!-- ←bind类：是否选中-->
              <!--图标：文件or文件夹-->
              <span class="button ico_docu" v-if="!unit.courses.length"></span>
              <template v-else>
              <span class="button ico_open" v-if="!unit.hide"></span>
              <span class="button ico_close" v-else></span>
              </template>
              <!--单元名称文本-->
            <span class="node_name" @click="sendCatalog([unit.code])">{{unit.name}}</span>
            </a>
            <!--课文（2层）-->
            <template v-if="unit.courses.length">
              <ul class="level1" :class="{'line':index !== courses.length-1}" v-show="!unit.hide"><!--←bind类：是否有Y轴虚线-->
                <li v-for="(text,index1) in unit.courses">
                  <!--图标：开关or虚线-->
                  <template v-if="text.courses.length !== 0">
                    <!--开关（是否结尾）-->
                    <span class="button level2 switch " :class="!text.hide?'center_open': 'center_close'"  v-if="index1 !== unit.courses.length-1" @click="toggle(text)"></span>
                    <span class="button level2 switch " :class="!text.hide?'bottom_open': 'bottom_close'" v-else @click="toggle(text)"></span>
                  </template>
                  <template v-else>
                    <!--X轴虚线（是否结尾）-->
                    <span class="button level2 switch center_docu" v-if="index1 !== unit.courses.length-1"></span>
                    <span class="button level2 switch bottom_docu" v-else></span>
                  </template>
                  <!--课文名称-->
                  <a class="level2" :class="{'curSelectedNode': current === text.code}" @click="current = text.code">
                    <!--图标：文件or文件夹-->
                    <span class="button ico_docu" v-if="!text.courses.length"></span>
                    <template v-else>
                      <span class="button ico_open" v-if="!text.hide"></span>
                      <span class="button ico_close" v-else></span>
                    </template>
                    <!--课文名称文本-->
                  <span @click.stop="sendCatalog([unit.code, text.code])">{{text.name}}</span>
                  </a>
                  <!--章节（3层）-->
                  <template v-if="text.courses.length">
                    <ul class="level2" :class="{'line':index1 !== unit.courses.length-1}" v-show="!text.hide">
                      <li v-for="(chapter,index2) in text.courses">
                        <!--图标：开关or虚线-->
                        <template v-if="chapter.courses.length !== 0">
                          <!--图标：开关or虚线-->
                          <span class="button level3 switch " :class="!chapter.hide?'center_open': 'center_close'"  v-if="index2 !== text.courses.length-1" @click="toggle(chapter)"></span>
                          <span class="button level3 switch " :class="!chapter.hide?'bottom_open': 'bottom_close'" v-else @click="toggle(chapter)"></span>
                        </template>
                        <template v-else>
                          <!--X轴虚线（是否结尾）-->
                          <span class="button level3 switch center_docu" v-if="index2 !== text.courses.length-1"></span>
                          <span class="button level3 switch bottom_docu" v-else></span>
                        </template>
                        <!--章节名称-->
                        <a class="level3" :class="{'curSelectedNode': current === chapter.code}" @click="current = chapter.code">
                          <!--图标：文件or文件夹-->
                          <span class="button ico_docu" v-if="!chapter.courses.length"></span>
                          <template v-else>
                            <span class="button ico_open" v-if="!chapter.hide"></span>
                            <span class="button ico_close" v-else></span>
                          </template>
                          <!--章节名称文本-->
                          <span @click.stop="sendCatalog([unit.code, text.code, chapter.code])">{{chapter.name}}</span>
                        </a>
                      </li>
                    </ul>
                  </template>
                </li>
              </ul>
            </template>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  import { treeServer } from '@/api'

  export default {
    name: 'LeftTree',
    props: ['token', 'book', 'reset'],
    data () {
      return {
        courses: [],
        unitShow: true,
        textShow: true,
        current: ''
      }
    },
    /* created () {
      this.getTree()
    }, */
    watch: {
     /* token: function () {
        // console.log(this.token)
      }, */
      // 书本信息改变时重新获取树数据
      book: function () {
        if (this.token && this.reset === false) {
          this.getTree()
        }
      },
      // 更换课本时，树先置空
      reset: function (reset) {
        if (reset === true) {
          this.courses = []
        }
      }
    },
    methods: {
      // 获取树数据
      getTree () {
        let params = {
          token: this.token,
         // token: '0b4de1b8-dfde-46f6-be59-b34d983d9904',
         // bookCode: '09010201-002'
          bookCode: this.book.code
        }
       // console.log(this.token)
        treeServer.getTree(params).then(result => {
          // console.log(result)
          this.courses = result.data
        })
      },
      // 点击单元章节时，发送code
      sendCatalog (codes) {
        let catalog = this.book.code
        // 如果点击的不是书名，则将单元章节code拼接
        if (codes) {
          let temp = ''
          codes.map(code => {
            let arr = code.split('-')
            // console.log(arr[arr.length - 1] + '...')
            temp += '_' + arr[arr.length - 1]
          })
          // console.log(temp + 'temp')
          catalog += temp
          // 树节点被点击后切换样式
          this.current = codes[codes.length - 1]
        }
       // console.log(catalog)
        this.$emit('getCata', catalog)
      },
      // 树的展开合并
      toggle (unit) {
        if (!unit) {
          this.unitShow = !this.unitShow
        } else {
          unit.hide = !unit.hide
        }
      }
    }
  }
</script>

<style>

</style>
