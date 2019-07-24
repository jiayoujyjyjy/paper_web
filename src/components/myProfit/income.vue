// 2.我的收益 -> 2-1钱包账户
<template>
  <div class="income">
    <div class="flexbox">
      <div class="box">
        <div style="width: 50%; border: 1px solid #eee;">
          <p style="margin-left: 18%;">欢迎你：<span style="margin: auto 22%; font-weight:bold;">{{userName}}</span></p>
          <p style="margin-left: 18%;">钱包余额：<span style="margin: auto 20%; font-weight:bold;">{{income}} 元</span></p>
          <p style="margin-left: 18%;">PC端提现功能暂时维护中，请前往移动端提现。</p>
        </div>
        <div style="width: 50%; border: 1px solid #eee;">
          <p style="margin-left: 18%;">今日在线支付收益：<span style="margin: auto 15%; font-weight:bold;">{{todayIncome}} 元</span></p>
          <p style="margin-left: 18%;">昨日在线支付收益：<span style="margin: auto 15%; font-weight:bold;">{{yesterdayIncome}} 元</span></p>
          <p style="margin-left: 18%;">累计在线支付收益：<span style="margin: auto 15%; font-weight:bold;">{{totalIncome}} 元</span></p>
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
      usermanage_activeName: 'first',
      screenHeight: document.body.clientHeight, // 监听变化辅助用，一定要设初始值
      onresizeTimer: false // 屏幕高度变化定时器，避免频繁调用window.onresize()方法      
    }
  },
  watch: {
    // 监听屏幕高度改变表格高度
    screenHeight (val) {
      /* 触发dom操作，考虑到函数节流，避免window.onresize()方法频繁触发
      强调一点，window.onresize()方法频繁触发也无所谓，前提是在不操作dom的情况下 */
      if (!this.onresizeTimer) {
        this.tableContainerHeightSet()
        this.onresizeTimer = true
        const that = this
        setTimeout(function () {
          that.onresizeTimer = false
        }, 400)
      }
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
    // 监听屏幕高度
    this.screenOnresizeFun()
  },
  methods: {
    // 监听屏幕高度
    screenOnresizeFun: function () {
      const that = this
      window.onresize = () => {
        return (() => {
          that.screenHeight = document.body.clientHeight
          console.log('that.screenHeight: ' + that.screenHeight)
        })() // 不加最后()会报错，并没有立即执行,立即执行函数
      }
    },
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
.flexbox {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  width: 100%
}
.box {
display: -webkit-flex; /* Safari */
display: flex;
flex-wrap: nowrap;
justify-content: space-between;
width:90%;
text-align: left;
}
.userBasemain{
  height: 70%;
}
.income {
  width: 100%;
  height: 100%
}
</style>
