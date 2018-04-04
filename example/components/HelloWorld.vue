<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <div><el-input v-model="input" placeholder="请输入内容"></el-input></div>
    <p>
      <el-radio v-model="radio" label="1">备选项</el-radio>
      <el-radio v-model="radio" label="2">备选项</el-radio>
    </p>
    <td-table :isShowOrderNum="true" :existPage="false" :data="tableData" :columns="tableColumns">
    </td-table>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      input: '',
      radio: '2',
      tableData: [{'no': 22, 'type': '222'}],
      tableColumns: [{
        prop: 'no',
        label: '盘点单号'
      }, {
        prop: 'type',
        label: '盘点类型',
        formatter: function (item) {
          return 'cc'
        }
      }]
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
