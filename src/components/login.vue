<template>
  <div class="login">
    <div class="header">
      <p class="title">共享纸巾机设备管理系统</p>
    </div>
    <div class="body">
      <img class="bodypic" src="/static/bodypic.png" />
      <div class="form">
        <span class="form_title">纸巾盒设备管理系统</span>
        <div style="width:100%;height:1px;margin-top:20px;background-color:#cac1c6;"></div>
        <el-form :model="ruleFormLogin" ref="ruleFormLogin" label-width="50px" :rules="rulesLogin">
          <!-- <el-form-item prop="username" label="账号">
            <el-autocomplete
              class="inline-input"
              v-model="ruleFormLogin.username"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              placeholder="请输入账号">
            </el-autocomplete>
          </el-form-item> -->
          <el-form-item prop="username" label="账号">
            <el-input type="text" @keyup.enter.native="loginBt(ruleFormLogin)" v-model="ruleFormLogin.username" auto-complete="off" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="password" class="password" label="密码">
            <el-input type="password" @keyup.enter.native="loginBt(ruleFormLogin)" v-model="ruleFormLogin.password" auto-complete="off" placeholder="请输入密码"></el-input>
          </el-form-item>
          <div style="margin-top: 20px;">
            <el-button style="width:50%;height:80%;font-size:16px;" plain type="primary" @click.native.prevent="loginBt(ruleFormLogin)">登录</el-button>
          </div>
          <!-- <div class="btntext">
            <el-button type="text" @click.native.prevent="toregister">{{$t('login.toregister')}}</el-button>
            <div style="margin-top:6px;width:2px;height:25px;border-right:2px solid #606266"></div>
            <el-button type="text" @click.native.prevent="toforgetPwd">{{$t('login.toforgetPwd')}}</el-button>
          </div> -->
        </el-form>
      </div>
    </div>
    <div class="footer">
      <p class="pfooter">Copyright © 杭州轨物科技有限公司, All rights reserved</p>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Routers from '@/router'
import { back } from 'api'
import { sessionSetStore, sessionClearStore } from '@/components/config/Utils'
export default {
  name: 'login',
  data () {
    // ***********表单输入规则校验***********
    // 校验账号
    var checkAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('账号不能为空'))
      } else {
        callback()
      }
    }
    // 校验密码
    var checkPassword = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('密码不能为空'))
      } else if (value.length > 20) {
        callback(new Error('密码长度不超过20位'))
      } else {
        callback()
      }
    }
    return {
      param: {
        'name': '',
        'password': '123456',
        'userId': 0,
        'mobile': '13588767140',
        'email': '',
        'code': ''
      },
      cookiephone: [], // cookie中手机号数据，根据el-autocomplete要求设置格式
      // 用户登录
      ruleFormLogin: {
        username: '',
        password: ''
      },
      // 登录表单校验
      rulesLogin: {
        username: [
          { validator: checkAccount, trigger: 'blur' }
        ],
        password: [
          { validator: checkPassword, trigger: 'blur' }
        ]
      }
    }
  },
  //
  // *****************生命周期****************
  //
  // 生命周期钩子--创建期
  created: function () {
    // 清空本地存储
    sessionClearStore()
  },
  mounted: function () {
    this.caculateHeight()
    var _this = this
    window.onresize = function () {
      console.log('resize')
      _this.caculateHeight()
    }
    this.getCookie()
  },
  // 注销window.onresize事件
  destroyed () {
    window.onresize = null
  },
  methods: {
    //
    // ***************** 功能函数 ****************
    //
    // 计算footer的高度
    caculateHeight: function () {
      var windowHeight = $(window).height()
      console.log(windowHeight)
      var footerHeight = windowHeight - 66 - 450 + 'px'
      console.log(footerHeight)
      $('.footer').height(footerHeight)
    },
    // input自动填充
    querySearch: function (queryString, cb) {
      var cookiephone = this.cookiephone
      var results = queryString ? cookiephone.filter(this.createFilter(queryString)) : cookiephone
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter: function (queryString) {
      return (cookiephone) => {
        return (cookiephone.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    /*
    *
    *   *************** 用户操作 *********************
    *
    */
    // 用户登录
    loginBt: function (ruleFormLogin) {
      console.log(ruleFormLogin)
      // 错误检查
      this.$refs.ruleFormLogin.validate((valid) => {
        if (valid) {
          sessionSetStore('username', ruleFormLogin.username)
          sessionSetStore('password', ruleFormLogin.password)
          // sessionSetStore('userAuth', 1)
          this.$store.commit('setUserName', ruleFormLogin.username)
          // this.$store.commit('setUserAuth', 1)
          // this.$cookies.set('name', 'may')
          this.setCookie(ruleFormLogin.username, 7)
          // Routers.push({ path: '/home' })
          console.log('success')
          this.param.username = this.ruleFormLogin.username
          this.param.password = this.ruleFormLogin.password
          this.backUserLogin()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // // 注册
    // toregister: function () {
    //   Routers.push({ path: '/register' })
    // },
    // // 忘记密码
    // toforgetPwd: function () {
    //   Routers.push({ path: '/forgetPwd' })
    // },
    /*
    *
    *   ******** cookie ********
    *
    */
    // 设置cookie
    setCookie: function (username, exdays) {
      // 获取时间
      var exdate = new Date()
      // 保存的天数,setTime() 方法以毫秒设置 Date 对象
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays)
      // 如果用户用一个以上的手机号登入系统，那么应当存多个值到cookie中，但是cookie的keyname是唯一的，
      // 如果每次都设置相同的keyname，后一次的值会覆盖前一次的值，如果每次都设置不同的keyname值，如name1、name2，
      // 一个页面对cookie的数量有限制，效果不好；考虑数组的形式，但是js中数组无法直接保存为Cookie，
      // 综上，我采用拼接字符串的方法，用“&”做分隔符，把不同的手机号拼接成一个字符串，读取的时候再处理得到多个数据
      // 要考虑几种情况，第一，除了userPhone还有其他的cookie，第二，用户是否是第一次操作
      var nameupdate
      if (document.cookie.indexOf('username') === -1) {
        // 第一次操作
        nameupdate = username
      } else {
        // 取出cookie中各个手机号的值，与当前值比较，如果当前值已存在，不改变cookie，否则写入新的cookie
        var nameStr = ''
        if (document.cookie.indexOf(';') > -1) {
          console.log('多个cookie')
          var data1 = document.cookie.split(';')
          for (let i = 0; i < data1.length; i++) {
            if (data1[i].split('=')[0] === ' username' || data1[i].split('=')[0] === 'username') {
              nameStr = data1[i].split('=')[1]
            }
          }
        } else {
          console.log('单个')
          nameStr = document.cookie.split('=')[1]
        }
        var data = nameStr.split('&')
        for (let i = 0; i < data.length; i++) {
          if (data[i] === username) {
            return
          }
        }
        nameupdate = nameStr + '&' + username
      }
      // 字符串拼接cookie，toGMTString() 方法根据格林威治时间 (GMT) 把 Date 对象转换为字符串
      document.cookie = 'username' + '=' + nameupdate + ';path=/;expires=' + exdate.toGMTString()
    },
    // 读取cookie
    getCookie: function () {
      if (document.cookie.length > 0) {
        // 处理数据，这里有很多方式处理字符串，split()、substring()、indexOf()等等
        console.log('cookie')
        console.log(document.cookie)
        // 得到cookie中userPhone的值，一个拼接的字符串
        var nameStr = ''
        if (document.cookie.indexOf(';') > -1) {
          console.log('多个')
          if (document.cookie.indexOf('username') === -1) {
            console.log('没有用户信息的cookie')
            return
          }
          var data1 = document.cookie.split(';')
          for (let i = 0; i < data1.length; i++) {
            if (data1[i].split('=')[0] === ' username' || data1[i].split('=')[0] === 'username') {
              nameStr = data1[i].split('=')[1]
            }
          }
        } else {
          console.log('单个')
          nameStr = document.cookie.split('=')[1]
        }
        // nameStr = document.cookie.split('=')[1]
        // 得到各个手机号的值，value2是一个数组
        console.log(nameStr)
        var data2 = nameStr.split('&')
        this.cookiephone = []
        for (let i = 0; i < data2.length; i++) {
          let obj = {}
          obj.value = data2[i]
          this.cookiephone.push(obj)
        }
      }
    },
    // 清除cookie
    clearCookie: function () {
      // 修改天数为负就可以清除cookie,这里写-1天
      this.setCookie('', -1)
    },
    /*
    *
    *   ******** 辅助方法函数 ********
    *
    */
    // 用户信息存储vuex localstorge
    userinfoStore: function (info) {
      // vuex存储
      this.$store.commit('setUserId', info.data.managerId)
      this.$store.commit('setUserName', this.param.username)
      // 浏览器本地存储
      sessionSetStore('managerId', info.data.id)
      sessionSetStore('roleId', info.data.roleType)
      sessionSetStore('activeNum', '1')
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
    *   ******** API调用函数 ********
    *
    */
    // 用户登录
    backUserLogin: function () {
      sessionSetStore('backName', '用户登录')
      back.loginManager(this.param).then(function (response) {
        console.log(response)
        // 用户信息存储vuex localstorge
        this.userinfoStore(response)
        // 萤石云
        // this.backEzvizBindQue()
        // 跳转到home页面s
        Routers.push({ path: '/home' })
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
.login{
  width: 100%;
  /* height: auto; */
  /* line-height:0px; */
  overflow: hidden;
}
/* header */
.header {
  height:66px;
  width:100%;
  /* color: #FFFAFA; */
  overflow: hidden;
}
.title {
  color: #007aff;
  float: left;
  font-size: 30px;
  margin: 12px 0 0 30px;
}
/* body */
.body {
  height:450px;
  width:100%;
  overflow: hidden;
  background-color: #4176e9;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  /* justify-content: space-around; */
}
.bodypic {
  /* float: left; */
  margin: 80px 0 0 13%;
  /* margin: 80px 0 0 250px; */
  width: 455px;
  height: 325px;
}
.form {
  margin: 90px 0 0 15.6%;
  /* margin: 90px 0 0 300px; */
  width: 450px;
  height: 270px;
  border-radius: 3px;
  padding: 20px 0 0 0;
  background-color: white;
  box-shadow: 0 0 10px #cac1c6;
}
.form_title {
  font-size: 18px;
  font-weight: bold;
}
.el-form {
  padding: 12px 50px 20px 50px;
  margin-top: 20px;
}
.el-autocomplete >>> .el-input__inner {
  width: 300px;
}
/* footer */
.footer {
  height: auto;
  background-color: #E5EDFF;
  /* margin: 40px 0 0 19%;
  color: #FFFAFA; */
}
.pfooter {
  /* line-height: 0px; */
  font-size: 15px;
  margin: 0;
  padding-top:200px;
}
</style>
