import Vue from 'vue'    //引入Vue
import Router from 'vue-router'  //引入Vue-route
import Login from '@/components/Login'  //引入根目录下的hello.vue组件
import Home from '@/components/Home'
import editRoute from '@/components/editRoute'
import addStop from '@/components/addStop'
import deleteStop from '@/components/deleteStop'
import searchStop from '@/components/searchStop'
import updateStop from '@/components/updateStop'
import addRoute from '@/components/addRoute'
import driverManagement from '@/components/driverManagement'
Vue.use(Router);
export default new Router({
  routes: [//配置路由，是一个数组
    {                          //每一个链接都是一个对象
      path: '/',               //链接路径
      name: 'Login',      //路由名称
      component: Login    //对应的组件模板
    },
      {
          path : '/Home',
          name : 'Home',
          component : Home,
          redirect: '/searchStop',   //利用此重定向来解决第一次跳转到home页面时，页面大部分空白。
                                     //重定向后默认选择到/searchStop页面
          meta:{ Verify:true},//需要验证登陆与否
          children:[
              //{path: '/addStop', name : 'addStop', component :addStop, meta:{ Verify:true},},
              //{path : '/deleteStop', name : 'deleteStop', component : deleteStop , meta:{ Verify:true}},
              {path:'/searchStop', name: 'searchStop', component : searchStop ,meta:{ Verify:true}},
              //{path:'/updateStop', name: 'updateStop', component : updateStop , meta:{ Verify:true}},
              {path : '/editRoute', name : 'editRoute', component : editRoute , meta:{ Verify:true}},
              {path : '/addRoute', name : 'addRoute', component : addRoute , meta:{ Verify:true}},
              {path : '/driverManagement' , name : 'driverManagement' ,component : driverManagement,meta:{ Verify:true}}

          ]

      }
  ]
})
