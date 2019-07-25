<template>
  <el-container>
    <el-aside>
      <div class="logo">
        <img style="width:180px;margin-top:22px;" src="/static/logo.png" />
      </div>
      <div class="search">
        <el-autocomplete
          class="inline-input"
          prefix-icon="el-icon-search"
          v-model="selectedItem"
          :fetch-suggestions="querySearch"
          placeholder="查找菜单"
          @select="handleSearch">
        </el-autocomplete>
      </div>
      <el-menu
        :default-active="menuActive"
        unique-opened
        class="el-menu-vertical-demo"
        @select="handleSelect"
        background-color="#252E49"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1" class="home-menu">
          <img :src="homeImgSrc" class="menuImg" />
          <span slot="title" class="menu_text">主页</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <img :src="incomeImgSrc" class="menuImg" />
            <span class="menu_text">我的收益</span>
          </template>
          <el-menu-item index="2-1">钱包账户</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <img :src="tradeImgSrc" class="menuImg" />
            <span class="menu_text">交易管理</span>
          </template>
          <el-menu-item index="3-1">交易订单</el-menu-item>
          <el-menu-item index="3-2">交易统计</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <img :src="devImgSrc" class="menuImg" />
            <span class="menu_text">设备管理</span>
          </template>
          <el-menu-item index="4-1">设备列表</el-menu-item>
          <el-menu-item index="4-2">缺货备货</el-menu-item>
          <el-menu-item index="4-3">补货日志</el-menu-item>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <img :src="productImgSrc" class="menuImg" />
            <span class="menu_text">商品管理</span>
          </template>
          <el-menu-item index="5-1">商品列表</el-menu-item>
          <el-menu-item index="5-2">商品类型</el-menu-item>
        </el-submenu>
        <el-submenu index="6">
          <template slot="title">
            <img :src="areaImgSrc" class="menuImg" />
            <span class="menu_text">场地管理</span>
          </template>
          <el-menu-item index="6-1">场地列表</el-menu-item>
        </el-submenu>
        <el-submenu index="7">
          <template slot="title">
            <img :src="userImgSrc" class="menuImg" />
            <span class="menu_text">用户管理</span>
          </template>
          <el-menu-item index="7-1">用户列表</el-menu-item>
        </el-submenu>
        <el-submenu index="8">
          <template slot="title">
            <img :src="dataImgSrc" class="menuImg" />
            <span class="menu_text">数据分析</span>
          </template>
          <el-menu-item index="8-1">订单分析</el-menu-item>
          <el-menu-item index="8-2">商品分析</el-menu-item>
          <el-menu-item index="8-3">点位分析</el-menu-item>
          <el-menu-item index="8-4">客户分析</el-menu-item>
        </el-submenu>
        <el-submenu index="9">
          <template slot="title">
            <img :src="errImgSrc" class="menuImg" />
            <span class="menu_text">异常管理</span>
          </template>
          <el-menu-item index="9-1">异常列表</el-menu-item>
          <el-menu-item index="9-2">远程出货</el-menu-item>
        </el-submenu>
        <el-submenu index="10" v-show="(userAuth === 0)">
          <template slot="title">
            <img :src="settingImgSrc" class="menuImg" />
            <span class="menu_text">用户管理</span>
          </template>
          <el-menu-item index="10-1">角色管理</el-menu-item>
          <el-menu-item index="10-2">子账号管理</el-menu-item>
          <el-menu-item index="10-3">代理管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="user">
          <img style="width:40px;height:40px;float:left;margin-right:6px;" src="/static/user.png" />
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">退出系统</el-dropdown-item>
              <!-- <el-dropdown-item command="b">退出系统</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <div class="page-container main-page">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { back } from 'api'
import Routers from '@/router'
import { sessionSetStore, sessionGetStore } from '@/components/config/Utils'
export default {
  name: 'home',
  data () {
    return {
      param: {
        'id': ''
      },
      // userAuth: 1, // 当前用户的角色权限
      superAdminAuth: 0, // 0超级管理员 1一级管理员 2客户 3转换的角色
      clientAuth: 2,
      selectedItem: '',
      searchItem: [{
        index: '1',
        value: '主页'
      }, {
        index: '2-1',
        value: '钱包账户'
      }, {
        index: '3-1',
        value: '交易管理'
      }, {
        index: '3-2',
        value: '交易统计'
      }, {
        index: '4-1',
        value: '设备列表'
      }, {
        index: '4-2',
        value: '缺货补货'
      }, {
        index: '4-3',
        value: '补货日志'
      }, {
        index: '5-1',
        value: '商品列表'
      }, {
        index: '5-2',
        value: '商品类型'
      }, {
        index: '6-1',
        value: '场地列表'
      }, {
        index: '7-1',
        value: '用户列表'
      }, {
        index: '8-1',
        value: '订单分析'
      }, {
        index: '8-2',
        value: '商品分析'
      }, {
        index: '8-3',
        value: '点位分析'
      }, {
        index: '8-4',
        value: '客户分析'
      }, {
        index: '9-1',
        value: '异常列表'
      }, {
        index: '9-2',
        value: '远程出货'
      }, {
        index: '10-1',
        value: '角色管理'
      }, {
        index: '10-2',
        value: '子账号管理'
      }, {
        index: '10-3',
        value: '代理管理'
      }],
      userInfo: {}, // 管理员详情信息
      homeImgSrc: '/static/home_active.png',
      devImgSrc: '/static/devmanage.png',
      dataImgSrc: '/static/data.png',
      tradeImgSrc: '/static/operation.png',
      userImgSrc: '/static/agency.png',
      incomeImgSrc: '/static/income.png',
      productImgSrc: '/static/product.png',
      areaImgSrc: '/static/site.png',
      errImgSrc: '/static/error.png',
      settingImgSrc: '/static/settings.png'
      // username: 'admin'
    }
  },
  // vuex数据绑定
  computed: {
    username () {
      return this.userInfo.nickname
    },
    userAuth () {
      return this.$store.state.userAuth
    },
    menuActive () {
      return this.$store.state.menuActive
    }
  },
  created: function () {
    // 防止刷新vuex数据丢失
    if (sessionGetStore('menuActive')) {
      this.$store.commit('setMenuActive', sessionGetStore('menuActive'))
      if (sessionGetStore('menuActive') === '1') {
        this.changeMenuImg(true)
      } else {
        this.changeMenuImg(false)
      }
    }
    // session获取登录者关键参数
    this.param.id = sessionGetStore('managerId')
    this.backQueManagerInfo()
    // var username = sessionGetStore('username')
    // this.$store.commit('setUserName', username)
    // var userAuth = sessionGetStore('userAuth')
    // this.$store.commit('setUserAuth', userAuth)
    // var userId = sessionGetStore('userId')
    // if (!userId) {
    //   this.notificationInfo('提示', '用户数据过期，请重新登陆')
    //   Routers.push({ path: '/login' })
    // }
    // this.activeNum = sessionGetStore('activeNum')
    // this.userAuth = sessionGetStore('role')
    // 防止刷新后丢失用户信息
  },
  mounted: function () {
    // 菜单搜索权限区分
    if (this.userAuth === 0) {
      let obj = {
        index: '10-2',
        value: '账号管理'
      }
      this.searchItem.push(obj)
    }
  },
  // 注销window.onresize事件
  destroyed () {
    window.onresize = null
  },
  methods: {
    // 搜索框选中事件
    handleSearch: function () {
      console.log(this.selectedItem)
      for (let i = 0; i < this.searchItem.length; i++) {
        if (this.selectedItem === this.searchItem[i].value) {
          this.$store.commit('setMenuActive', this.searchItem[i].index)
          this.switchpage(this.searchItem[i].index)
        }
      }
    },
    // 导航菜单选择事件
    handleSelect: function (key, keyPath) {
      console.log('select')
      console.log(key, keyPath)
      this.switchpage(key)
    },
    // 导航菜单切换，路由跳转
    switchpage: function (value) {
      if (value === '1') {
        sessionSetStore('menuActive', '1')
        Routers.push({ path: '/home/overview' })
        this.changeMenuImg(true)
      }

      if (value === '2-1') {
        sessionSetStore('menuActive', '2-1')
        // sessionSetStore('devmanage_activeName', 'first')
        Routers.push({ path: '/home/incom' })
        this.changeMenuImg(false)
      }
      if (value === '3-1') {
        sessionSetStore('menuActive', '3-1')
        Routers.push({ path: '/home/orderForm' })
        this.changeMenuImg(false)
      }
      if (value === '3-2') {
        sessionSetStore('menuActive', '3-2')
        Routers.push({ path: '/home/tradeSta' })
        this.changeMenuImg(false)
      }
      if (value === '4-1') {
        sessionSetStore('menuActive', '4-1')
        Routers.push({ path: '/home/devList' })
        this.changeMenuImg(false)
      }
      if (value === '4-2') {
        sessionSetStore('menuActive', '4-2')
        Routers.push({ path: '/home/devSupply' })
        this.changeMenuImg(false)
      }
      if (value === '4-3') {
        sessionSetStore('menuActive', '4-3')
        Routers.push({ path: '/home/devLog' })
        this.changeMenuImg(false)
      }
      if (value === '5-1') {
        sessionSetStore('menuActive', '5-1')
        Routers.push({ path: '/home/productmanage' })
        this.changeMenuImg(false)
      }
      if (value === '5-2') {
        sessionSetStore('menuActive', '5-2')
        Routers.push({ path: '/home/productType' })
        this.changeMenuImg(false)
      }
      if (value === '6-1') {
        sessionSetStore('menuActive', '6-1')
        Routers.push({ path: '/home/areaManage' })
        this.changeMenuImg(false)
      }
      if (value === '7-1') {
        sessionSetStore('menuActive', '7-1')
        // sessionSetStore('usermanage_activeName', 'first')
        Routers.push({ path: '/home/userList' })
        this.changeMenuImg(false)
      }
      if (value === '8-1') {
        sessionSetStore('menuActive', '8-1')
        Routers.push({ path: '/home/orderAnaly' })
        this.changeMenuImg(false)
      }
      if (value === '8-2') {
        sessionSetStore('menuActive', '8-2')
        Routers.push({ path: '/home/productAnaly' })
        this.changeMenuImg(false)
      }
      if (value === '8-3') {
        sessionSetStore('menuActive', '8-3')
        Routers.push({ path: '/home/areaAnaly' })
        this.changeMenuImg(false)
      }
      if (value === '8-4') {
        sessionSetStore('menuActive', '8-4')
        Routers.push({ path: '/home/customerAnaly' })
        this.changeMenuImg(false)
      }
      if (value === '9-1') {
        sessionSetStore('menuActive', '9-1')
        Routers.push({ path: '/home/abnormalList' })
        this.changeMenuImg(false)
      }
      if (value === '9-2') {
        sessionSetStore('menuActive', '9-2')
        Routers.push({ path: '/home/shipmentDistance' })
        this.changeMenuImg(false)
      }
      if (value === '10-1') {
        sessionSetStore('menuActive', '10-1')
        Routers.push({ path: '/home/roleManage' })
        this.changeMenuImg(false)
      }
      if (value === '10-2') {
        sessionSetStore('menuActive', '10-2')
        Routers.push({ path: '/home/childAccountManage' })
        this.changeMenuImg(false)
      }
      if (value === '10-3') {
        sessionSetStore('menuActive', '10-3')
        Routers.push({ path: '/home/agencyManage' })
        this.changeMenuImg(false)
      }
    },
    querySearch: function (queryString, cb) {
      var searchItem = this.searchItem
      var results = queryString ? searchItem.filter(this.createFilter(queryString)) : searchItem
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter: function (queryString) {
      return (searchItem) => {
        return (searchItem.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 菜单项切换时，对应图标颜色改变
    changeMenuImg: function (home) {
      if (home) {
        this.homeImgSrc = '/static/home_active.png'
      } else {
        this.homeImgSrc = '/static/home.png'
      }
    },
    tologinBt: function () {
      Routers.push({ path: '/login' })
    },
    // 用户名下拉菜单选择事件
    handleCommand: function (command) {
      console.log(command)
      if (command === 'a') {
        Routers.push({ path: '/login' })
      }
    },
    // 可关闭式通知提示，titlePara为标题，messagePara为通知内容
    notificationInfo: function (titlePara, messagePara) {
      const h = this.$createElement
      this.$notify({
        title: titlePara,
        message: h('i', {style: 'color: teal'}, `${messagePara}`)
      })
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 查看管理员详情
    backQueManagerInfo: function () {
      return new Promise(function (resolve, reject) {
        sessionSetStore('backName', '查看管理员详情')
        back.queManagerInfo(this.param).then(function (response) {
          console.log(response)
          let obj = {}
          obj.id = response.data.id
          obj.username = response.data.username
          obj.nickname = response.data.nickname
          obj.name = response.data.name
          obj.phone = response.data.phone
          obj.roleType = response.data.roleType
          this.userInfo = obj
          resolve()
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
    }
  }
}
</script>

<style>
.el-header {
  background-color: #fff;
}
.user {
  float: right;
  margin: 1px 0;
}
.el-dropdown {
  /* line-height === 包含快高度,可垂直居中文本 */
  line-height: 40px;
}
.el-aside {
  background-color: #252E49;
  text-align: center;
  height: 100%;
  color:#fff;
  width: 15.94%!important;
  min-width: 200px;
  padding: 0 13px;
}
.search {
  width: 90%;
  margin: 0 auto;
  margin-top: 10px;
}
.el-main {
  color: #333;
  background-color: #f0f2f5;
  text-align: center;
  padding: 20px;
  height: 100%;
  margin: unset;
}
.logo {
  height:80px;
  border-bottom: 0.5px solid gray;
}
.menuImg {
  margin-left: -6vw;
  width: 20px;
  height: 20px;
}
.menu_text {
  width: 80px;
  display: inline-block
}
.el-menu {
  border-right: 0px solid #e6e6e6;
}
.el-submenu {
  margin: 7px 0;
  font-size: 14px;
}
.el-submenu .el-menu-item {
  margin-left: -2vw;
}
.el-submenu__title {
  height: 40px;
  line-height: 40px;
}
.el-submenu .el-menu-item {
  height: 40px;
  line-height: 40px;
}
.main-page {
  height: calc(100% - 40px);
  max-width: 100%;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
}
</style>
