<template>
  <el-container>
    <el-aside width="200px">
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
        <el-menu-item index="1">
          <img :src="homeImgSrc" class="menuImg" />
          <span slot="title" class="menu_text">主页</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <img :src="devImgSrc" class="menuImg" />
            <span class="menu_text">设备管理</span>
          </template>
          <el-menu-item index="2-1">设备管理</el-menu-item>
          <el-menu-item index="2-2" v-show="false">设备故障信息</el-menu-item>
          <el-menu-item index="2-3">场地管理</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <img :src="dataImgSrc" class="menuImg" />
            <span class="menu_text">数据报表</span>
          </template>
          <el-menu-item index="3-1" v-show="false">收益统计</el-menu-item>
          <el-menu-item index="3-2" v-show="false">用户统计</el-menu-item>
          <el-menu-item index="3-3">设备统计</el-menu-item>
          <el-menu-item index="3-4">场地统计</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <img :src="operationImgSrc" class="menuImg" />
            <span class="menu_text">运营管理</span>
          </template>
          <el-menu-item index="4-1">产品管理</el-menu-item>
          <el-menu-item index="4-2">订单管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="5" v-show="(userAuth === 0)">
          <img :src="agencyImgSrc" class="menuImg" />
          <span slot="title" class="menu_text">用户管理</span>
        </el-menu-item>
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
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { back } from 'api'
import $ from 'jquery'
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
        value: '设备管理'
      }, {
        index: '2-2',
        value: '设备故障信息'
      }, {
        index: '2-3',
        value: '场地管理'
      }, {
        index: '3-1',
        value: '收益统计'
      }, {
        index: '3-2',
        value: '用户统计'
      }, {
        index: '3-3',
        value: '设备统计'
      }, {
        index: '3-4',
        value: '场地统计'
      }, {
        index: '4-1',
        value: '产品管理'
      }, {
        index: '4-2',
        value: '订单管理'
      }],
      userInfo: {}, // 管理员详情信息
      homeImgSrc: '/static/home_active.png',
      devImgSrc: '/static/devmanage.png',
      dataImgSrc: '/static/data.png',
      operationImgSrc: '/static/operation.png',
      agencyImgSrc: '/static/agency.png'
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
        this.changeMenuImg(true, false)
      } else if (sessionGetStore('menuActive') === '5') {
        this.changeMenuImg(false, true)
      } else {
        this.changeMenuImg(false, false)
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
    this.caculateContainer()
    // 菜单搜索权限区分
    if (this.userAuth === 0) {
      let obj = {
        index: '5',
        value: '用户管理'
      }
      this.searchItem.push(obj)
    }
    // var _this = this
    // window.onresize = function () {
    //   console.log('resize')
    //   console.log(document.body.clientWidth)
    //   _this.caculateContainer()
    // }
  },
  // 注销window.onresize事件
  destroyed () {
    window.onresize = null
  },
  methods: {
    // 计算元素高度
    caculateContainer: function () {
      var windowHeight = $(window).height()
      console.log(windowHeight)
      $('.el-aside').height(windowHeight)
    },
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
        this.changeMenuImg(true, false)
      }
      if (value === '2-1') {
        sessionSetStore('menuActive', '2-1')
        sessionSetStore('devmanage_activeName', 'first')
        Routers.push({ path: '/home/devmanage' })
        this.changeMenuImg(false, false)
      }
      if (value === '2-2') {
        sessionSetStore('menuActive', '2-2')
        Routers.push({ path: '/home/devInfo' })
        this.changeMenuImg(false, false)
      }
      if (value === '2-3') {
        sessionSetStore('menuActive', '2-3')
        Routers.push({ path: '/home/areamanage' })
        this.changeMenuImg(false, false)
      }
      if (value === '3-1') {
        sessionSetStore('menuActive', '3-1')
        Routers.push({ path: '/home/income' })
        this.changeMenuImg(false, false)
      }
      if (value === '3-2') {
        sessionSetStore('menuActive', '3-2')
        Routers.push({ path: '/home/user' })
        this.changeMenuImg(false, false)
      }
      if (value === '3-3') {
        sessionSetStore('menuActive', '3-3')
        Routers.push({ path: '/home/device' })
        this.changeMenuImg(false, false)
      }
      if (value === '3-4') {
        sessionSetStore('menuActive', '3-4')
        Routers.push({ path: '/home/place' })
        this.changeMenuImg(false, false)
      }
      if (value === '4-1') {
        sessionSetStore('menuActive', '4-1')
        Routers.push({ path: '/home/productmanage' })
        this.changeMenuImg(false, false)
      }
      if (value === '4-2') {
        sessionSetStore('menuActive', '4-2')
        Routers.push({ path: '/home/ordermanage' })
        this.changeMenuImg(false, false)
      }
      if (value === '5') {
        sessionSetStore('menuActive', '5')
        sessionSetStore('usermanage_activeName', 'first')
        Routers.push({ path: '/home/usermanage' })
        this.changeMenuImg(false, true)
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
    changeMenuImg: function (home, agency) {
      if (home) {
        this.homeImgSrc = '/static/home_active.png'
      } else {
        this.homeImgSrc = '/static/home.png'
      }
      if (agency) {
        this.agencyImgSrc = '/static/agency_active.png'
      } else {
        this.agencyImgSrc = '/static/agency.png'
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
  color:#fff
}
.search {
  width: 90%;
  margin: 0 auto;
  margin-top: 10px;
}
.el-main {
  background-color: #eee;
  text-align: center;
  padding: 10px;
  width: 100%;
}
.logo {
  height:80px;
  border-bottom: 0.5px solid gray;
}
.menuImg {
  margin-left: -20px;
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
</style>
