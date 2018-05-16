import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '#/components/HelloWorld'
import dragTable from '#/components/table/dragTable'
import elementDragTable from '#/components/table/elementDragTable'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/table/dragTable',
      name: 'dragTable',
      component: dragTable
    },
    {
      path: '/table/elementDragTable',
      name: 'elementDragTable',
      component: elementDragTable
    }
  ]
})
