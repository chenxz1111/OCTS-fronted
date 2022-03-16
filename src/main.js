import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './theme/element/index.css'
import './common/font/font.css'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http = axios

Vue.prototype.$http.interceptors.response.use(response => {
  // console.log(response)
  // if (response.data.resCode === '1000') {
  //   localStorage.clear()
  //   alert(response.data.resMsg)
  //   router.push({
  //     name: 'login'
  //   })
  // }
  return response
}, error => {
  if (error && error.response) {
    switch (error.response.status) {
      case 404:
        router.push('/404')
        error.message = '请求出错(404)'
        break
      case 500:
        // router.push('/500')
        //  error.message = '服务器错误(500)';
        break
      default:
        // error.message = '连接出错(${error.response.status})!'
    }
  }
  return Promise.reject(error)
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = '第八个店(Debug Store)-' + to.meta.title
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
