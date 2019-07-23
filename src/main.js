// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vuex from 'vuex'
import store from './vuex/store'
import router from './router'
import axios from 'axios'
import { sessionGetStore } from '@/components/config/Utils'

Vue.use(ElementUI)
Vue.use(Vuex)

Vue.config.productionTip = false

/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

interceptors()

// 拦截器函数
function interceptors () {
  // http request 拦截器
  axios.interceptors.request.use(
    config => {
      // console.log(config)
      let userId = sessionGetStore('managerId')
      let roleId = sessionGetStore('roleId')
      if (userId && userId !== '') {
        // 验证通过
        // console.log(userId)
        // 设置请求头
        config.headers['managerId'] = userId
        config.headers['roleId'] = roleId
      } else {
        if (config.url.indexOf('login') !== -1) {
          // 是登录---不做处理
          // console.log('是登录')
        } else {
          // 不是登录---返回登录页
          console.log('返回登录页')
          vm.$router.push({
            path: '/login'
          })
        }
      }
      return config
    },
    error => {
      // console.log(error)
      return Promise.reject(error)
    }
  )
  // http response 拦截器 //
  axios.interceptors.response.use(
    response => {
      // console.log(response)
      console.log(sessionGetStore('backName'))
      if (response.config.url.indexOf('login') !== -1) {
        // 是登录---正常返回，不用判断code
        return response
      } else {
        // 不是登录---判断code
        if (response.data.code === 0) {
          // console.log('请求成功')
          return response // 跳到api页面中.then()
        } else {
          vm.$notify({
            title: '请求出错',
            type: 'error',
            message: response.data.msg
          })
          return Promise.reject(response.data) // 跳到api页面中.catch()
        }
      }
    },
    error => {
      // console.log(error)
      return Promise.reject(error)
    }
  )
}
