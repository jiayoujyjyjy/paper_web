// 7.y用户管理 -> 7-1用户列表
<template>
  <div class="userList">
    <div class="select">
      <!-- 模糊搜索 -->
      <span style="width:80px;margin-top:6px">用户ID</span>
      <el-input size="small" v-model="selection.id" placeholder="请输入用户ID"></el-input>
      <span style="width:80px;margin-top:6px">用户昵称</span>
      <el-input size="small" v-model="selection.name" placeholder="请输入用户昵称"></el-input>
      <span style="width:80px;margin-top:6px">手机号码</span>
      <el-input size="small" v-model="selection.phone" placeholder="请输入手机号码"></el-input>
      <el-button type="primary" size="small" @click="searchBt">搜索</el-button>
    </div>
    <div class="tableDiv" style="margin-top: 20px;">
      <el-table
        :header-cell-style="{'font-size':'12px'}"
        :data="tableData"
        stripe
        border
        :max-height="tableMaxHeght"
        style="font-size:12px;">
        <el-table-column
          align="center"
          prop="id"
          label="用户ID">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="sex"
          label="性别">
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="手机号码">
        </el-table-column>
        <el-table-column
          align="center"
          prop="province"
          label="省份">
        </el-table-column>
        <el-table-column
          align="center"
          prop="city"
          label="详细地址">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="注册时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="cost"
          label="消费金额">
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      @current-change="handlePaginationChange"
      :current-page="param.pageNo"
      :page-size="param.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="eltotal">
    </el-pagination>

  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
import $ from 'jquery'
export default {
  name: 'userList',
  data () {
    return {
      param: {
        'pageSize': 10,
        'pageNo': 1,
        'currentPage_DiaDev': 1,
        'pagesize_DiaDev': 8,
        id: '',
        name: '',
        phone: ''
      },
      eltotal: 20,
      tableData: [],
      selection: {
        id: '',
        name: '',
        phone: ''
      },
      tableMaxHeght: document.body.clientHeight - 40 - 40 - 40 - 40 - 27 - 46, // ===tableDiv的高度
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
    this.param.managerId = sessionGetStore('managerId')
    // 分页查询请求可选项置空函数
    this.pageQueSelInit()
    this.backUserPage()
  },
  mounted: function () {
    this.tableContainerHeightSet()
    // 监听屏幕高度
    this.screenOnresizeFun()
  },
  methods: {
    // 表格容器高度随窗口视口变化函数
    tableContainerHeightSet: function () {
      var windowHeight = $(window).height()
      var mainHeight = windowHeight - 40 - 40 - 40
      $('.tableDiv').height(mainHeight - 40 - 27 - 46)
      this.tableMaxHeght = mainHeight - 40 - 27 - 46
    },
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
    // 搜索按钮
    searchBt: function () {
      console.log(this.selection)
      this.param.name = this.selection.name
      this.param.id = this.selection.id
      this.param.phone = this.selection.phone
      this.backUserPage()
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.param.pageNo = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backUserPage()
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 用户分页查询
    backUserPage: function () {
      sessionSetStore('backName', '用户分页查询')
      back.userPage(this.param).then(function (response) {
        console.log(response)
        this.eltotal = response.data.total
        if (response.code === 0) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            // 存储表格数据
            let obj = {}
            obj.id = response.data.records[i].id
            obj.name = response.data.records[i].name
            if (response.data.records[i].sex === '' || response.data.records[i].sex === null) {
              obj.sex = '暂无'
            } else {
              obj.sex = response.data.records[i].sex ? '男' : '女'
            }
            obj.phone = response.data.records[i].phone
            obj.province = response.data.records[i].province
            obj.city = response.data.records[i].city
            obj.createTime = response.data.records[i].createTime
            obj.cost = response.data.records[i].cost
            this.tableData.push(obj) // 或用this.tableData[i] = obj亦可
            console.log(this.tableData)
          }
        } else {
          this.tableData = []
        }
      }.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    /*
      *
      *******************   辅助函数   *********************
      *
    */
    // 分页查询请求可选项置空函数
    pageQueSelInit: function () {
      this.param.id = ''
      this.param.name = ''
      this.param.phone = ''
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
.select {
  width: 100%;
  height: 40px;
  text-align: left;
}
.select .el-input {
  width: 200px;
  margin-right: 5px;
}
.box {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  width:auto;
}
.userList >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
</style>
