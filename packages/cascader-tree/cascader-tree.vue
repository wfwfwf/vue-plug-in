<script>
  export default {
    name: 'td-cascader-tree',
    props: {
      data :  {
        type: Array,
        default() {
          return []
        }
      },
      initVal :  {
        type: Array,
        default() {
          return []
        }
      },
      height : {
        type : Number,
        default() {
          return 300
        }
      }
    },
    data() {
      return {
        myTreeData : [],        // 格式化树得到的数据
        expandingIndexArr: [], // 展开数组对应的下标
        queryVal : ''   // 搜索值
      }
    },
    components: {

    },
    watch: {

    },

    computed: {
      ulStyle() {
        return {
          height : this.height + 'px'
        }
      }
    },

    methods: {
      /**
       * 获取选中项
       * treeArr
       * resArr 表示id结果
       * resJsonArr 表示整体json数组
       * */
      getCheckedArr (treeArr, resArr, resJsonArr) {
        treeArr.forEach((item, index) => {
          if (item.check === 1) {
            resArr.push(item.id)
            resJsonArr.push(item)
          } else {
            if (item.child && item.child.length > 0) {
              this.getCheckedArr(item.child, resArr, resJsonArr)
            }
          }
        })
      },
      /**
       * 选中改变的时候
       * **/
      onChange() {
        let resArr = [], resJsonArr = []
        this.getCheckedArr(this.myTreeData, resArr, resJsonArr)
        this.$emit('change', resArr, resJsonArr)
      },
      /***
       * 格式化树添加idx来作为每项在树中的位置
       * treeArr
       * idx  在数组中的位置
       * */
      formatterTreeArr () {
        let newArr = []
        this.data.forEach((item, index) => {
          let newItem = Object.assign({}, item)
          newArr.push(this.formatterItem(newItem, index))
        })
        this.myTreeData = newArr
      },
      /***
       * 为每一项添加在数据中的位置，并且根据初始值初始化每一项是否选中
       * **/
      formatterItem (item, idx, status) {
        idx = idx + ''
        let idxArr = idx.split('-')
        item.lev = idxArr.length
        item.idx = idx
        if (( this.initVal && this.initVal.length > 0 && this.initVal.indexOf(item.id) > -1 ) || status === 1) {
          item.check = 1
        }
        if (!item.child || item.child.length < 1) {
          return item
        }
        // 根据子决定父类是否选中
        let check_num1 = 0
        let check_num2 = 0
        item.child = item.child.map((it, ix) => {
          if (item.check === 1 || ( this.initVal && this.initVal.length > 0 && this.initVal.indexOf(it.id) > -1 )) {
            it.check = 1
          }
          let newItem = Object.assign({}, it)
          it = this.formatterItem(newItem, idx + '-' + ix, it.check)
          if ( 1 === it.check ) {
            check_num1 = check_num1 + 1
          } else if ( 2 === it.check ) {
            check_num2 = check_num2 + 1
          }
          return it
        })

        // 是否根据子类选中数来判断当前是否应该选中
        if ( typeof (item.check) === undefined || !item.check) {
          if (check_num1 === item.child.length) {
            item.check = 1
          } else if (check_num2 > 0 || check_num1> 0) {
            item.check = 2
          } else {
            item.check = null
          }
        }
        return item
      },
      /***
       * 展开第几级的第几项
       * @param item
       * @param lev   级数
       * @param index 项数
         */
      selectItem (item, index) {
        let lev = item.lev - 1
        let arr = this.expandingIndexArr
        arr[lev] = index
        let arr2 = ( lev === 0 ? [] : arr.slice(0, lev) )
        arr2.push(arr[lev])
        this.expandingIndexArr = arr2
      },

      // 根据父类设置子以及子孙类选中状态
      setChildCheckByParent(item, status) {
        if (item && item.child && item.child.length > 0) {
          item.child = item.child.map ((it, i)=> {
            it.check = status
            return this.setChildCheckByParent(it, status)
          })
        }
        return item
      },
      // 点击后设置选项选中状态，以及相关连子父选中状态
      resetItem (item, idxArr, ix, currentItem) {
        let curIndex = ix + 1
        if (curIndex === idxArr.length && currentItem.id === item.id) {
          // 表示这是当前项
          item.check = (item.check === 1 ? 0 : 1)
          this.setChildCheckByParent(item, item.check)
        }

        if (!item.child) {
          return item
        }
        let status1 = 0
        let status2 = 0
        item.child = item.child.map ((it, i) => {
          let childItem = this.resetItem(it, idxArr, curIndex, currentItem)
          if (childItem.check === 1) {
            status1++
          } else if (childItem.check === 2) {
            status2++
          }
          return childItem
        })
        if (status1 === item.child.length) {
          item.check = 1
        } else if (status2 > 0 || status1> 0) {
          item.check = 2
        } else {
          item.check = null
        }
        return item
      },

      /***
       * 选中事件 变量选中状态
       * @param item
       * @param index
         */
      checkedItem(item, index) {
        // 获取此项在树中所在位置
        let idx = item.idx + ''
        let idxArr = idx.split('-')
        let myTreeData = this.myTreeData
        myTreeData[idxArr[0]] = this.resetItem(myTreeData[idxArr[0]], idxArr, 0, item)
        this.myTreeData = myTreeData
        this.onChange()
      },
      // 获取展开的树
      getExpandUl () {
        let newArr = this.myTreeData
        let htmlArr = []

        for (let i=0; i< this.expandingIndexArr.length+1; i++) {
          let v = i< this.expandingIndexArr.length ? this.expandingIndexArr[i] : null
          let htmlChildArr = newArr.map((item, index) => {
//            item.lev = i
            const events = {
              on: {
              }
            }
            // 选项框点击
            const checkBoxEvents = {
              on: {
                click:(e)=> {
                  // e.stopPropagation()
                  this.checkedItem(item, index)
                }
              }
            }

            let checkBoxHtml = (<span class="td-tree_checkbox" {...checkBoxEvents}></span>);
            if (item.check == 1) {
              checkBoxHtml = (<span class="td-tree_checkbox td-tree_checkbox__checked" {...checkBoxEvents}></span>);
            } else if (item.check == 2) {
              checkBoxHtml = (<span class="td-tree_checkbox td-tree_checkbox__inner" {...checkBoxEvents}></span>);
            }

            // 行点击展开
            events.on.click = () => {
              this.selectItem(item, index)
            }

            let isFlat = false
            if (index == v) {
              isFlat = true
            }
            return (
              <li class={{
                  'cascader-tree_module_li': true,
                  'cascader-tree_li_current': isFlat
                }}
                {...events}
              >
                {checkBoxHtml}
                <span class="td-tree_checkbox_span">{item.name}</span>
              </li>
            )
          })

          if (htmlChildArr.length > 0) {
            htmlArr.push(
              <div class="cascader-tree_panel">
                <div class="cascader-tree_module_title">{i+1}级</div>
                <ul class="cascader-tree_module_ul" style={this.ulStyle}> {htmlChildArr} </ul>
              </div>)
          }
          if (v !=null && newArr[v] && newArr[v].child) {
            newArr =  newArr[v].child
          } else {
            newArr =  []
          }
        }
        return htmlArr
      },
      createFilter(queryString, initTreeData, resArr) {
        initTreeData.forEach((item, index) => {
          if ( item.name && ( item.name.indexOf(queryString) > -1 )) {
            item.value =  item.name + ' [' + item.lev + '级]'
            if (item.check === 1) {
              item.value = item.value + ' [已选]'
            } else if (item.check === 2) {
              item.value = item.value + ' [子孙类有选]'
            }
            resArr.push(item)
          }
          if (item.child && item.child.length > 0) {
            this.createFilter(queryString, item.child, resArr)
          }
        })
      },
      querySearch(queryString, cb) {

        let results =  []
        if (!queryString) {
          return cb(results);
        }

        this.createFilter(queryString, this.myTreeData, results)

        results.sort(function(a, b) {
          return b.lev - a.lev
        })

        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      handleSelect (item) {
        this.checkedItem(item)
        this.queryVal = ''
      }
    },
    mounted () {
      let that = this
      that.formatterTreeArr()

      let tdSearchAutocomplete = this.$refs.tdSearchAutocomplete
      tdSearchAutocomplete.handleComposition = function(event) {
        if (event.type === 'compositionend') {
          this.isOnComposition = false
          this.handleChange(event.target.value)
        } else {
          this.isOnComposition = true
        }
      }

    },
    render (h) {
      const {querySearch, getExpandUl, myTreeData, handleSelect, queryVal} = this
      let expand = ''
      if (myTreeData && myTreeData.length > 0) {
        expand = getExpandUl()
      }
      const searchEvents = {
        on: {
        }
      }
      searchEvents.on.select = (item)=>{
        handleSelect(item)
      }
      searchEvents.on.input = (val)=>{
        this.queryVal = val
      }
      return (
        <div class="cascader-tree_module">
          <div class="cascader-tree_header">
            <el-autocomplete
              props ={{
                label: 'value',
                value: 'name'
              }}
              fetch-suggestions= {querySearch}
              value={queryVal}
              clearable={true}
              trigger-on-focus={false}
              ref= 'tdSearchAutocomplete'
              placeholder= '请输入名称进行搜索'
              class= 'cascader-tree_search'
              {...searchEvents}
            ></el-autocomplete>
          </div>
          <div class="cascader-tree_body">
            {expand}
          </div>
        </div>
      )
    }

  }
</script>
<style lang="scss">
.cascader-tree_module {

  .cascader-tree_header {
      padding: 10px;
      .cascader-tree_search {
        width: 100%;
      }
  }

  .cascader-tree_panel {
    display: inline-block;
    .cascader-tree_module_title {
      text-align: center;
    }
  }

  .cascader-tree_module_ul {
    display: inline-block;
    overflow-y: auto;
    padding: 0;
    margin:0 10px;
    border: 1px solid #d6d6d6;
    min-width: 160px;

    .cascader-tree_module_li {
      height: 26px;
      padding: 3px 10px;
      display: flex;
      cursor: pointer;
      align-items: center;

      .td-tree_checkbox {
        display: inline-block;
        position: relative;
        border: 1px solid #dcdfe6;
        border-radius: 2px;
        box-sizing: border-box;
        width: 14px;
        height: 14px;
        background-color: #fff;
        z-index: 1;
        transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
      }

      .td-tree_checkbox__inner {
        background-color: #409eff;
        border-color: #409eff;
      }

      .td-tree_checkbox__inner:before {
        content: "";
        position: absolute;
        display: block;
        background-color: #fff;
        height: 2px;
        transform: scale(.5);
        left: 0;
        right: 0;
        top: 5px;
      }

      .td-tree_checkbox__checked {
        background-color: #409eff;
        border-color: #409eff;
      }

      .td-tree_checkbox__checked:after {
        transform: rotate(45deg) scaleY(1);
        box-sizing: content-box;
        content: "";
        border: 1px solid #fff;
        border-left: 0;
        border-top: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        width: 3px;
        transition: transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;
        transform-origin: center;
      }

      .td-tree_checkbox_span {
        display: inline-block;
        margin-left: 10px;
      }

    }

    .cascader-tree_module_li:hover {
      background-color: #f5f7fa;
    }

    .cascader-tree_li_current {
      background-color: #f5f7fa;

      .td-tree_checkbox_span {
        color: #409eff;
      }

    }

  }

}
</style>
