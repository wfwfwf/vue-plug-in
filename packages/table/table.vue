<template>
  <div class="td-table">
    <el-table ref="ha_table" :data="data" style="width: 100%" highlight-current-row @row-click="handleRowHandle" :height="height" @filter-change="tableFilter" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column v-if="isShowOrderNum" type="index" label="序号" width="70" resizable show-overflow-tooltip>
        <template slot-scope="scope">
          {{1+scope.$index+(pageInfo.page-1)*pageInfo.pageSize}}
        </template>
      </el-table-column>

      <template v-for="(column, ix) in columns">
        <el-table-column v-if="column.formatter" :fixed="column.fixed" resizable show-overflow-tooltip :prop="column.prop" :label="column.label" :width="column.width" :column-key="column.key" :formatter="column.formatter" :filters="column.filters" :filter-multiple="false">
        </el-table-column>
        <el-table-column  v-else-if="column.operations" :fixed="column.fixed" :prop="column.prop" :label="column.label" :width="column.width" >
          <template slot-scope="scope">
            <el-button v-for="(operate, index) in column.operations" :key="index" type="text" @click.native.prevent="operate.func(scope.$index, scope.row)">{{operate.label}}</el-button>
          </template>
        </el-table-column>

        <el-table-column v-else resizable show-overflow-tooltip :fixed="column.fixed" :prop="column.prop" :label="column.label" :width="column.width" :column-key="column.key" :formatter="defaultFormatter"  :filters="column.filters">
        </el-table-column>
      </template>
    </el-table>

    <div class="cs-footer-page" v-if="existPage">
      <el-pagination @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="myPageInfo.page"
         :page-sizes="[10, 20 ,30 ,50]"
         :page-size="myPageInfo.pageSize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="myPageInfo.records">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'td-table',
  props: {
    data:{
      type: Array,
      default: function() {
        return [];
      }
    },
    columns:Array,        // 列
    width: [String, Number],
    height: [String, Number],
    existPage : {         // 是否有分页面，false时表示没有分页
      type: Boolean,
      default: true
    },
    isShowOrderNum : {         // 是否有显示序号
      type: Boolean,
      default: false
    },
    pageInfo:{            // 分页面信息 records 总为数; page 页数; pageSize 一页显示条目数;
      type: Object,
      default: function() {
        return {
          page:1,
          pageSize:20,
          records:0
        };
      }
    }

  },
  data() {
    return {
      myPageInfo:{}
    };
  },
  watch: {
    pageInfo: {
      handler(curVal,oldVal){
        this.myPageInfo = {
          page:curVal.page,
          pageSize:curVal.pageSize,
          records:curVal.records
        }
      },
      deep:true
    }
  },
  computed: {

  },
  methods: {
    // 筛选
    tableFilter(val){
      this.$emit("filter-change", val)
    },
    // 条数更改
    handleSizeChange(val) {
      this.myPageInfo.pageSize = val
      if (this.myPageInfo.page != 1) {
        this.myPageInfo.page = 1;
      }
      this.$emit("handleSizeChange", val)
      this.$emit('size-change', val)
    },
    // 页面更改
    handleCurrentChange(val) {
      this.myPageInfo.page = val;
      this.$emit("handleCurrentChange", val)
      this.$emit('current-change', val)
    },
    // 行点击
    handleRowHandle(row, event, column) {
      this.$emit("handleRowHandle", row, event, column)
      this.$emit("row-click", row, event, column)
    },
    defaultFormatter(row, column) {
      return row[column.property]
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.$emit("selection-change", val)
    }
  },
  mounted() {
    this.myPageInfo = {
      page:this.pageInfo.page,
      pageSize:this.pageInfo.pageSize,
      records:this.pageInfo.records
    }
  }
};
</script>
