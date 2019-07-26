import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store'
import { sessionGetStore } from '@/components/config/Utils'
// 路由懒加载
// 登录
const Login = r => require.ensure([], () => r(require('@/components/login')), 'Login')
// 1 主页
const Home = r => require.ensure([], () => r(require('@/components/home')), 'Home')
const Overview = r => require.ensure([], () => r(require('@/components/home/overview')), 'Overview')

// 2 我的收益 myProfit
// 2-1 钱包账户
const Income = r => require.ensure([], () => r(require('@/components/myProfit/income')), 'Income')
// 微信提现记录
const WechatCash = r => require.ensure([], () => r(require('@/components/myProfit/wechatCash')), 'WechatCash')
// 在线支付记录
const PaymentOnline = r => require.ensure([], () => r(require('@/components/myProfit/paymentOnline')), 'PaymentOnline')

// 3 交易管理 tradeManage
// 3-1 交易订单
const OrderForm = r => require.ensure([], () => r(require('@/components/tradeManage/orderForm')), 'OrderForm')
// 3-2 交易统计
const TradeSta = r => require.ensure([], () => r(require('@/components/tradeManage/tradeSta')), 'TradeSta')

// 4 设备管理 devManage
// 4-1 设备列表
const DevList = r => require.ensure([], () => r(require('@/components/devManage/devList')), 'DevList')
// 4-2 缺货备货
const DevSupply = r => require.ensure([], () => r(require('@/components/devManage/devSupply')), 'DevSupply')
// 4-3 补货日志
const DevLog = r => require.ensure([], () => r(require('@/components/devManage/devLog')), 'DevLog')

// 5 商品管理 goodsManage
// 5-1 商品列表
const Productmanage = r => require.ensure([], () => r(require('@/components/goodsManage/productmanage')), 'Productmanage')
// 5-2 商品类型
const ProductType = r => require.ensure([], () => r(require('@/components/goodsManage/productType')), 'ProductType')

// 6 场地管理 home
// 6-1 场地列表
const AreaManage = r => require.ensure([], () => r(require('@/components/home/areaManage')), 'AreaManage')

// 7 用户管理 home
// 7-1 用户列表
const UserList = r => require.ensure([], () => r(require('@/components/home/userList')), 'UserList')

// 8 数据分析 dataAnaly
// 8-1 订单分析
const OrderAnaly = r => require.ensure([], () => r(require('@/components/dataAnaly/orderAnaly')), 'OrderAnaly')
// 8-2 商品分析
const ProductAnaly = r => require.ensure([], () => r(require('@/components/dataAnaly/productAnaly')), 'ProductAnaly')
// 8-3 点位分析
const AreaAnaly = r => require.ensure([], () => r(require('@/components/dataAnaly/areaAnaly')), 'AreaAnaly')
// 8-4 客户分析
const CustomerAnaly = r => require.ensure([], () => r(require('@/components/dataAnaly/customerAnaly')), 'CustomerAnaly')

// 9 异常管理 abnormalManage
// 9-1 异常列表
const AbnormalList = r => require.ensure([], () => r(require('@/components/abnormalManage/abnormalList')), 'AbnormalList')
// 9-2 远程出货
const ShipmentDistance = r => require.ensure([], () => r(require('@/components/abnormalManage/shipmentDistance')), 'ShipmentDistance')

// 10 系统配置 settings
// 10-1 角色管理
const RoleManage = r => require.ensure([], () => r(require('@/components/settings/roleManage')), 'RoleManage')
// 10-2 子账号管理
const ChildAccountManage = r => require.ensure([], () => r(require('@/components/settings/childAccountManage')), 'ChildAccountManage')
// 10-3 代理管理
const AgencyManage = r => require.ensure([], () => r(require('@/components/settings/agencyManage')), 'AgencyManage')
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
        { path: 'incom',
          component: Income,
          children: [
            { path: '', redirect: 'paymentOnline' },
            { path: 'paymentOnline', name: 'paymentOnline', component: PaymentOnline },
            { path: 'wechatCash', name: 'wechatCash', component: WechatCash }           
          ]
        },
        { path: 'orderForm', name: 'orderForm', component: OrderForm },
        { path: 'tradeSta', name: 'tradeSta', component: TradeSta },
        { path: 'devList', name: 'devList', component: DevList },
        { path: 'devSupply', name: 'devSupply', component: DevSupply },
        { path: 'devLog', name: 'devLog', component: DevLog },
        { path: 'productmanage', name: 'productmanage', component: Productmanage },
        { path: 'productType', name: 'productType', component: ProductType },
        { path: 'areaManage', name: 'areaManage', component: AreaManage },
        { path: 'userList', name: 'userList', component: UserList },
        { path: 'orderAnaly', name: 'orderAnaly', component: OrderAnaly },
        { path: 'productAnaly', name: 'productAnaly', component: ProductAnaly },
        { path: 'areaAnaly', name: 'areaAnaly', component: AreaAnaly },
        { path: 'customerAnaly', name: 'customerAnaly', component: CustomerAnaly },
        { path: 'abnormalList', name: 'abnormalList', component: AbnormalList },
        { path: 'shipmentDistance', name: 'shipmentDistance', component: ShipmentDistance },
        { path: 'roleManage', name: 'roleManage', component: RoleManage },
        { path: 'childAccountManage', name: 'childAccountManage', component: ChildAccountManage },
        { path: 'agencyManage', name: 'agencyManage', component: AgencyManage },
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
