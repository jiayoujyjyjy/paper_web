import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store'
import { sessionGetStore } from '@/components/config/Utils'
// 路由懒加载
// 登录
const Login = r => require.ensure([], () => r(require('@/components/login')), 'Login')
// 主页
const Home = r => require.ensure([], () => r(require('@/components/home')), 'Home')
// 数据概况
const Overview = r => require.ensure([], () => r(require('@/components/home/overview')), 'Overview')
// 设备管理
const DevmanageBase = r => require.ensure([], () => r(require('@/components/home/devmanage/devmanageBase')), 'DevmanageBase')
const DevList = r => require.ensure([], () => r(require('@/components/home/devmanage/devList')), 'DevList')
const DevTransferRecord = r => require.ensure([], () => r(require('@/components/home/devmanage/devTransferRecord')), 'DevTransferRecord')
const DevInfo = r => require.ensure([], () => r(require('@/components/home/devInfo')), 'DevInfo')
// 数据统计
const Income = r => require.ensure([], () => r(require('@/components/home/income')), 'Income')
const User = r => require.ensure([], () => r(require('@/components/home/user')), 'User')
const Device = r => require.ensure([], () => r(require('@/components/home/device')), 'Device')
const Place = r => require.ensure([], () => r(require('@/components/home/place')), 'Place')
// 运营
const Productmanage = r => require.ensure([], () => r(require('@/components/home/productmanage')), 'Productmanage')
const Ordermanage = r => require.ensure([], () => r(require('@/components/home/ordermanage')), 'Ordermanage')
// 用户管理
const UserBase = r => require.ensure([], () => r(require('@/components/home/userManage/userBase')), 'UserBase')
const Agency = r => require.ensure([], () => r(require('@/components/home/userManage/agency')), 'Agency')
const Manager = r => require.ensure([], () => r(require('@/components/home/userManage/manager')), 'Manager')
// 重置刷新跳转空白页
const Blank = r => require.ensure([], () => r(require('@/components/home/blank')), 'Blank')

Vue.use(Router)
const router = new Router({
  // mode: 'history',
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    { path: '/home',
      component: Home,
      children: [
        { path: '', redirect: 'overview' },
        { path: 'overview', name: 'overview', component: Overview },
        { path: 'devmanage',
          component: DevmanageBase,
          children: [
            { path: '', redirect: 'devList' },
            { path: 'devList', component: DevList },
            { path: 'devTransferRecord', component: DevTransferRecord }
          ]},
        { path: 'devInfo', name: 'devInfo', component: DevInfo },
        { path: 'income', name: 'income', component: Income },
        { path: 'user', name: 'user', component: User },
        { path: 'device', name: 'device', component: Device },
        { path: 'place', name: 'place', component: Place },
        { path: 'productmanage', name: 'productmanage', component: Productmanage },
        { path: 'ordermanage', name: 'ordermanage', component: Ordermanage },
        { path: 'usermanage',
          component: UserBase,
          children: [
            { path: '', redirect: 'agency' },
            { path: 'agency', component: Agency },
            { path: 'manager', component: Manager }
          ]},
        { path: 'blank', name: 'blank', component: Blank }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  console.log(from.name) // 上边的组件配置项一定要写name字段
  console.log(to.name)
  if (to.name === 'blank') {
    if (from.name === 'device') {
      store.commit('setResetPage', 'device')
    }
    if (from.name === 'place') {
      store.commit('setResetPage', 'place')
    }
  }
  // next()
  // 校验uesrId
  let userId = sessionGetStore('managerId')
  if (userId && userId !== '') {
    // 验证通过---跳转到目标路由
    next()
  } else {
    if (to.path.indexOf('login') !== -1) {
      // 是登录---跳转到目标路由
      next()
    } else {
      // 不是登录---返回登录页
      next({
        path: '/login'
      })
    }
  }
})

export default router
