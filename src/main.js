// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import apiConfig from '../config/api.config'; //别名
import qs from 'qs';


Vue.config.productionTip = false;
Vue.prototype.$axios=axios;
Vue.prototype.$qs=qs;
Vue.use(ElementUI, {size: 'medium'});

//axios配置
axios.defaults.timeout=5000;
axios.defaults.headers.post['Content-Type']='application/json;charset=UTF_8';
axios.defaults.baseURL=apiConfig.baseUrl;//后台接口调用配置


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
//全局路由守卫
router.beforeEach(function (to,from,next) {
  if(to.meta.Verify){
    //页面登陆采用sessionStorage存储
      if(sessionStorage.getItem("token")){
        //已经登陆
          next();
      }else{
        next({
            name :"Login"
        })
      }
  }else{
    //表示该页面不需要先登录
    next();
  }
});
