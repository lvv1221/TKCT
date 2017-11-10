<template>
  <div class="left-select">
    <div class="select-book">
      <div class="select-1">
        <select v-model="subject" @change="getPublishers">
          <option v-for="item in subjects" :value="item.code" class="opt" style="width: 50px" :title="item.name">
            {{item.name.length < 4 ? item.name : item.name.slice(0, 3) + '...'}}
          </option>
        </select>
        <select v-model="publisher" @change="getGrades">
          <option v-for="item in publishers" :value="item.code" class="opt" style="width: 50px" :title="item.name">
            {{item.name.length < 4 ? item.name : item.name.slice(0, 3) + '...'}}
          </option>
        </select>
      </div>
      <div class="select-2">
        <select v-model="grade" @change="getBooks">
          <option v-for="item in grades" :value="item.code" class="opt" style="width: 50px" :title="item.name">
            {{item.name.length < 4 ? item.name : item.name.slice(0, 3) + '...'}}
          </option>
        </select>
        <select v-model="book" @change="selectBook">
          <option v-for="item in books" :value="item" class="opt" style="width: 50px" :title="item.name">
            {{item.name.length < 4 ? item.name : item.name.slice(0, 3) + '...'}}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
  import { selectServer } from '@/api'

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
      getPublishers () {
        // 清空后续选项
        this.publishers = []
        this.grades = []
        this.books = []
        this.publisher = ''
        // 获得参数
        let params = {
          token: this.token
        }
        // 发送请求
        selectServer.getPublishers(params).then(result => {
          // console.log(JSON.stringify(result))
          this.publishers = result.data
        })
      },
      getGrades () {
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
      getBooks () {
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
      selectBook () {
        this.$emit('selectEnd', this.book)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  select
    width 80px
    .opt
      overflow hidden /*自动隐藏文字*/
      text-overflow ellipsis /*文字隐藏后添加省略号*/
      white-space nowrap

  /*强制不换行*/
</style>
