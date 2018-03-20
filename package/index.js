//树封装
import TdTable from './table/table.vue'
// 级联树选择
import TdCascaderTree from './cascader-tree/cascader-tree.vue'

const components = [
  TdTable,
  TdCascaderTree
]

const install = function (Vue,options) {
  components.map(component => {
    Vue.component(component.name, component)
  })
}

export default {
  install
}
