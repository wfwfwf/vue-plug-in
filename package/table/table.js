export default {
  data: function () {
    return {
      data: [],
      table_height: 400,
      pageInfo: {
        page: 1,
        pageSize: 20,
        records: 0
      }
    }
  },
  methods: {
    handleRowHandle (row, event, column) {
    },
    tableFilter (value) {
    },
    // 改变页面显示条目数
    handleSizeChange (val) {
      this.pageInfo.pageSize = val
      if (this.pageInfo.page !== 1) {
        this.pageInfo.page = 1
      } else {
        this.getList()
      }
    },
    // 更改页面数
    handleCurrentChange (val) {
      this.pageInfo.page = val
      this.getList()
    }
  }
}
