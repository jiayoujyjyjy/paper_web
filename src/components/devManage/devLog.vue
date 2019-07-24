// 4.我的收益 -> 4-3补货日志
<template>
  <div class="devLog">
    <div class="select">
      <span style="margin: auto 1%">设备编码:</span>
      <el-input v-model="input_devMac" placeholder="请输入设备编码"></el-input>
      <span style="margin: auto 1%">场地名称:</span>
      <el-select v-model="selected" placeholder="请选择">
        <el-option
          v-for="item in selectData"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span style="width:80px;margin:6px auto auto 1%">日期:</span>
      <el-date-picker
        v-model="dateValue"
        type="daterange"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button size="small" type="primary" style="margin-left:1%;" @click="searchDev">搜 索</el-button>
    </div>
    <div class="tableDiv">
      <el-table
        ref="multipleTable"
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        border
        style="margin-top: 2%;font-size:12px;"
        :max-height="tableMaxHeght">
        <el-table-column
          align="center"
          prop="id"
          label="补货记录编码"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="deviceId"
          label="设备编码"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="site"
          label="场地名称"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="paper"
          label="纸巾名称"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="num"
          label="补货数量"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="manager"
          label="补货员"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="补货时间"
          min-width="30%">
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      @current-change="handlePaginationChange"
      :current-page="param.currentPage"
      :page-size="param.pagesize"
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
  data () {
    return {
      param: {
        'currentPage': 1,
        'pagesize': 8,
        'currentPage_DiaDev': 1,
        'pagesize_DiaDev': 8,
        beginDate: '',
        endDate: '',
        id: '',
        siteId: ''
      },
      selectedValue: [],
      input_devMac: '', // 输入设备编号
      input_areaName: '', // 输入场地名称
      dateValue: ['', ''], // 选择时间
      total: 6,
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      // 表格数据
      tableData: [],
      selectData: [
        {
          value: '',
          label: '全部'
        }
      ], // 下拉选择框
      user: '',
      userData: [
        {
          value: '',
          label: '全部'
        }
      ],
      selected: '',
      tableMaxHeght: document.body.clientHeight - 40 - 40 - 40 - 40 - 25 - 53, // ===tableDiv的高度
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
    this.param.roleId = sessionGetStore('roleId')
    this.backAddLog()
    this.backQueArea()
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
      $('.tableDiv').height(mainHeight - 40 - 24 - 53)
      this.tableMaxHeght = mainHeight - 40 - 24 - 53
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
    // 根据条件查找设备
    searchDev: function () {
      console.log(this.input_devMac)
      // 时间选择器
      this.param.beginDate = this.dateValue[0]
      this.param.endDate = this.dateValue[1]
      // 设备编码
      this.param.id = this.input_devMac
      // 场地名称
      console.log(this.dateValue)
      this.param.siteId = this.selected
      this.backAddLog()
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      // this.tableMaxHeght = document.body.clientHeight - 40 - 20 - 40 - 40 - 40 - 42 - 53 // ===tableDiv的高度
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backQueDevPage()
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 设备补货记录分页查询
    backAddLog: function () {
      // degugger
      this.param.pageNo = this.currentPage
      this.param.pageSize = this.pagesize
      sessionSetStore('backName', '设备补货记录分页查询')
      back.addLog(this.param).then(function (response) {
        console.log(response)
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.id = response.data.records[i].id
            obj.deviceId = response.data.records[i].deviceId
            obj.site = response.data.records[i].site
            obj.paper = response.data.records[i].paper
            obj.num = response.data.records[i].num
            obj.manager = response.data.records[i].manager
            obj.createTime = response.data.records[i].createTime
            this.tableData.push(obj)
          }
          console.log(this.tableData)
        } else {
          this.tableData = []
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 场地查询，用在显示场地搜索中，显示场地编码 siteId=id
    backQueArea: function () {
      let paramObj = {
        managerId: this.param.managerId,
        roleId: this.param.roleId,
        groupId: '',
        name: '',
        address: ''
      }
      sessionSetStore('bacName', '场地查询')
      back.queArea(paramObj).then(function (response) {
        if (response.code === 0) {
          console.log(response.data)
          for (var i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.value = response.data[i].id
            obj.label = response.data[i].name
            this.selectData.push(obj)
          }
          console.log(this.selectData)
        } else {
          this.$message.error('场地获取错误')
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    //
    // *******************   辅助函数   *********************
    //
    // 分页查询请求可选项置空函数
    pageQueSelInit: function () {
      this.param.deviceId = ''
      this.param.siteId = ''
      this.param.userId = ''
      this.param.site = ''
      this.param.id = ''
      this.param.beginDate = ''
      this.param.endDate = ''
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
.el-select >>> .el-input {
  font-size: 12px;
}
.select .el-input {
  width: 200px;
  margin-right: 5px;
}
.box2 {
  font-size:15px;
  letter-spacing:3px
}
.box2 p {
  margin-top: 10px;
}
.devLog >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
</style>
