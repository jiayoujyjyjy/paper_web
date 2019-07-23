// 2.我的收益 -> 2-1钱包账户
<template>
  <div class="income">
    <div class="flexbox">
      <div class="box">
        <div style="margin: auto 8%; width: 50%;">
          <p>欢迎你：<span style="margin: auto 22%; font-weight:bold;">{{userName}}</span></p>
          <p>钱包余额：<span style="margin: auto 20%; font-weight:bold;">{{income}} 元</span></p>
          <p>PC端提现功能暂时维护中，请前往移动端提现。</p>
        </div>
        <div style="width: 50%; margin:auto 4%;">
          <p>今日在线支付收益：<span style="margin: auto 15%; font-weight:bold;">{{todayIncome}} 元</span></p>
          <p>昨日在线支付收益：<span style="margin: auto 15%; font-weight:bold;">{{yesterdayIncome}} 元</span></p>
          <p>累计在线支付收益：<span style="margin: auto 15%; font-weight:bold;">{{totalIncome}} 元</span></p>
        </div>
      </div>
    </div>
      <div class="two">
        <el-tabs v-model="usermanage_activeName" @tab-click="handleClick">
          <el-tab-pane label="在线支付记录" name="first"></el-tab-pane>
          <el-tab-pane label="微信提现记录" name="second"></el-tab-pane>
        </el-tabs>
      </div>
      <el-container class="userBasemain">
        <router-view></router-view>
      </el-container>
    </div>
    <!--查看对话框-->
</template>

<script>
import { back } from 'api'
import Routers from '@/router'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
import $ from 'jquery'
export default {
  data () {
    return {
      param: {
        beginDate: '',
        endDate: ''
      },
      userName: '',
      income: '',
      todayIncome: '',
      yesterdayIncome: '',
      totalIncome: '',
      usermanage_activeName: 'first'
    }
  },
  created: function () {
    // session获取登录者关键参数
    this.param.id = sessionGetStore('managerId')
    this.usermanage_activeName = sessionGetStore('usermanage_activeName')
    // 获取收益
    this.backMyIncome()
  },
  mounted: function () {
    var windowHeight = $(window).height()
    var mainHeight = windowHeight - 40 - 20 - 40
    $('.income').height(mainHeight)
  },
  methods: {
    handleClick: function (tab) {
      if (tab.index === '0') {
        this.toOnline()
      } else if (tab.index === '1') {
        this.toWechat()
      }
    },
    toOnline: function () {
      this.usermanage_activeName = 'first'
      sessionSetStore('usermanage_activeName', this.usermanage_activeName)
      Routers.push({ path: '/home/income/paymentOnline' })
    },
    toWechat: function () {
      this.usermanage_activeName = 'second'
      sessionSetStore('usermanage_activeName', this.usermanage_activeName)
      Routers.push({ path: '/home/income/wechatCash' })
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 收益查询
    backMyIncome: function () {
      sessionSetStore('backName', '交易查询')
      back.myIncome(this.param).then(function (response) {
        console.log(response)
        if (response.code === 0) {
          this.userName = response.data.username
          this.income = response.data.income
          this.todayIncome = response.data.todayIncome
          this.yesterdayIncome = response.data.yesterdayIncome
          this.totalIncome = response.data.totalIncome
        } else {
          this.notificationInfo('error', '收益获取失败！')
        }
      }.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    // 可关闭式通知提示，titlePara为标题，messagePara为通知内容
    notificationInfo: function (titlePara, messagePara) {
      const h = this.$createElement
      this.$notify({
        title: titlePara,
        message: h('i', {style: 'color: teal'}, `${messagePara}`)
      })
    }
  }
}
</script>

<style scoped>
.income {
  padding: 20px;
  background-color: white;
  font-size: 14px;
  width: 100%;
  overflow: hidden;
}
.flexbox {
  margin: 20px 80px 20px 0;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
}
.box {
display: -webkit-flex; /* Safari */
display: flex;
flex-wrap: nowrap;
justify-content: space-between;
width:100%;
text-align: left;
border:1px solid #ccc;
}
</style>
