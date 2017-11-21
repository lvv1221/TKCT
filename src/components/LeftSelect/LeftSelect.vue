<template>
    <div class="exam_left_content">
      <ex-select :items="subjects" @select="getPublishers($event)"  selectName="subjects"></ex-select>
      <ex-select :items="publishers" @select="getGrades($event)" class="exam_group_right" selectName="publishers"></ex-select>
      <ex-select :items="grades" @select="getBooks($event)" selectName="grades"></ex-select>
      <ex-select :items="books" @select="selectBook($event)" class="exam_group_right" selectName="books" @reset="resetBook"></ex-select>
      <!--<div class="btn-group exam_group" :class="{'open': selectShow1}">
        <select v-model="subject" @change="getPublishers" class="btn dropdown-toggle exam_toggle">
          <option v-for="item in subjects" :value="item.code"  :title="item.name">
            {{item.name.length < 4 ? item.name : item.name.slice(0, 3) + '...'}}
          </option>
        </select>
        <a class="btn dropdown-toggle exam_toggle"  href="#"  @click="selectShow1 = !selectShow1">
          <span class="exam_textbook"  title="subject" >{{subject}}</span>
          <span class="caret exam_caret"></span>
        </a>
        <ul class="dropdown-menu exam_menu exam_scroll">
          <li><a href="#" v-for="item in subjects" :title="item.name" @click="checkedSubject(item.code)">{{item.name}}</a></li>
        </ul>
      </div>-->
      <!--<div class="btn-group exam_group exam_group_right">
        <select v-model="publisher" @change="getGrades" class="btn dropdown-toggle exam_toggle">
          <option v-for="item in publishers" :value="item.code"  :title="item.name">
            {{item.name.length < 4 ? item.name : item.name.slice(0, 3) + '...'}}
          </option>
        </select>
      </div>
      <div class="btn-group exam_group">
        <select v-model="grade" @change="getBooks" class="btn dropdown-toggle exam_toggle">
          <option v-for="item in grades" :value="item.code"   :title="item.name">
            {{item.name.length < 4 ? item.name : item.name.slice(0, 3) + '...'}}
          </option>
        </select>
      </div>
      <div class="btn-group exam_group exam_group_right">
        <select v-model="book" @change="selectBook" class="btn dropdown-toggle exam_toggle">
          <option v-for="item in books" :value="item"   :title="item.name">
            {{item.name.length < 4 ? item.name : item.name.slice(0, 3) + '...'}}
          </option>
        </select>
      </div>-->
    </div>
</template>

<script>
  import { selectServer } from '@/api'
  import ExSelect from './ExSelect.vue'

  export default {
    name: 'LeftSelect',
    props: ['token'],
    data () {
      return {
        subjects: [],
        subject: '',
        publishers: [],
        publisher: '',
        grades: [],
        grade: '',
        books: [],
        book: ''
      }
    },
    watch: {
      token: function () {
        this.getSubjects()
      }
    },
    created () {
      if (this.token) {
        this.getSubjects()
      }
    },
    methods: {
      getSubjects () {
        let params = {
          token: this.token
        }
        selectServer.getSubjects(params).then(result => {
          // console.log(JSON.stringify(result))
          this.subjects = result.data
        })
      },
      getPublishers (subject) {
        // 获取数据
        this.subject = subject.code
        // 清空后续选项
        this.publishers = []
        this.grades = []
        this.books = []
        // 获得参数
        let params = {
          token: this.token,
          subject: this.subject
        }
        // 发送请求
        selectServer.getPublishers(params).then(result => {
          // console.log(JSON.stringify(result))
          this.publishers = result.data
          this.selectShow1 = false
        })
      },
      getGrades (publisher) {
        this.publisher = publisher.code
        this.grades = []
        this.books = []
        let params = {
          token: this.token,
          subject: this.subject,
          publisher: this.publisher
        }
        // console.log(params)
        selectServer.getGrades(params).then(result => {
          // console.log(JSON.stringify(result))
          this.grades = result.data
        })
      },
      getBooks (grade) {
        this.grade = grade.code
        this.books = []
        let params = {
          token: this.token,
          subject: this.subject,
          publisher: this.publisher,
          grade: this.grade
        }
        selectServer.getBooks(params).then(result => {
          // console.log(JSON.stringify(result))
          this.books = result.data
        })
      },
      selectBook (book) {
        this.book = book
        this.$emit('selectEnd', this.book)
      },
      resetBook () {
        this.$emit('reset')
      },
      checkedSubject (subject) {
        this.subject = subject
      //  this.selectShow1 = false
        this.getPublishers()
      }
    },
    components: {
      'ex-select': ExSelect
    }
  }
</script>

<style lang="stylus" scoped>
  select
    padding 3px 5px
    border 1px solid #7F7F7F
    border-radius: 0
    option
      overflow hidden /*自动隐藏文字*/
      text-overflow ellipsis /*文字隐藏后添加省略号*/
      white-space nowrap
  /*强制不换行*/
</style>
