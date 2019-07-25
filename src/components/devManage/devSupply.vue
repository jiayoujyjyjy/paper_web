// 4.我的收益 -> 4-2缺货备货
<template>
  <div class="devSupply">
    <div class="select">
      <el-button type="primary" size="small" @click="toShortage">缺货备货</el-button>
      <el-button type="primary" size="small" @click="toStockup">备货单列表</el-button>
    </div>
    <!-- 缺货备货 -->
    <div class="select" v-show="shortage">
      <span style="margin: auto 1%">设备编号:</span>
      <el-input v-model="input_devMac" placeholder="请输入设备编号"></el-input>
      <span style="margin: auto 1%">场地:</span>
      <el-select v-model="selected" placeholder="请选择">
        <el-option
          v-for="item in selectData"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button size="small" type="primary" style="margin-left:10%;" @click="searchDev">搜 索</el-button>
      <el-button type="primary" size="small">生成备货单</el-button>
    </div>

    <!-- 备货单列表 -->
    <div class="select" v-show="stockup">
      <span style="margin: auto 1%">备货单号:</span>
      <el-input v-model="stockTable" placeholder="请输入设备编号"></el-input>
      <span style="margin: aoto 1%">日期</span>
        <el-date-picker
          style="width: 250px; height:40px;"
          v-model="dateValue"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      <span style="margin: auto 1%">备货状态:</span>
      <el-select v-model="status" placeholder="请选择">
        <el-option
          v-for="item in statusTable"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button size="small" type="primary" style="margin-left:10%;">搜 索</el-button>
    </div>

    <!-- 缺货备货单 -->
    <div class="tableDiv" v-show="shortage">
      <el-table
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        border
        style="margin-top: 2%;font-size:12px;"
        :max-height="tableMaxHeght">
        <el-table-column
          align="center"
          prop="deviceId"
          label="设备编号"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="siteName"
          label="场地名称"
          min-width="30%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="paperName"
          label="纸巾名称"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="stockNum"
          label="库存数量"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="shortageNum"
          label="缺货数量"
          min-width="10%">
        </el-table-column>
      </el-table>
    </div>

    <!-- 备货单列表 -->
    <div class="tableDiv" v-show="stockup">
      <el-table
        :header-cell-style="{'font-size':'14px'}"
        :data="tableList"
        border
        style="margin-top: 2%;font-size:12px;"
        :max-height="tableMaxHeght">
        <el-table-column
          align="center"
          prop="deviceId"
          label="设备编号"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="siteName"
          label="场地名称"
          min-width="30%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="paperName"
          label="纸巾名称"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="stockNum"
          label="库存数量"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="shortageNum"
          label="缺货数量"
          min-width="10%">
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
        'pagesize_DiaDev': 8
      },
      input_devMac: '', // 输入设备编号
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      // 表格数据
      tableData: [],
      tableList: [],
      selectData: [
        {
          value: '',
          label: '全部'
        }
      ], // 下拉选择框
      selected: '',
      shortage: true, // 缺货列表
      stockup: false, // 备货列表
      stockTable: '',
      status: '全部',
      dateValue: '',
      statusTable: [
        {
          value: '1',
          label: '全部  '
        }, {
          value: '2',
          label: '未处理'
        }, {
          value: '3',
          label: '部分出库'
        }, {
          value: '4',
          label: '已出库'
        }, {
          value: '5',
          label: '已完成'
        }, {
          value: '6',
          label: '已拒绝'
        }
      ],
      tableMaxHeght: document.body.clientHeight - 40 - 40 - 40 - 40 - 42 - 49 - 53, // ===tableDiv的高度
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
    this.param.siteId = ''
    this.param.id = ''
    this.backStockAlarm()
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
      $('.tableDiv').height(mainHeight - 40 - 42 - 47 - 53)
      this.tableMaxHeght = mainHeight - 40 - 42 - 47 - 53
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
    // 跳转到缺货备货
    toShortage: function () {
      this.shortage = true
      this.stockup = false
    },
    // 跳转到备货单列表
    toStockup: function () {
      this.shortage = false
      this.stockup = true
    },
    // 根据条件查找设备
    searchDev: function () {
      console.log(this.input_devMac)
      this.param.id = this.input_devMac
      this.param.siteId = this.selected
      this.backStockAlarm()
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      // this.tableMaxHeght = document.body.clientHeight - 40 - 20 - 40 - 40 - 40 - 42 - 53 // ===tableDiv的高度
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backStockAlarm()
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 库存分页查询
    backStockAlarm: function () {
      // degugger
      this.param.pageNo = this.currentPage
      this.param.pageSize = this.pagesize
      sessionSetStore('backName', '库存分页查询')
      back.stockAlarm(this.param).then(function (response) {
        console.log(response)
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.deviceId = response.data.records[i].deviceId
            obj.siteName = response.data.records[i].siteName
            obj.paperName = response.data.records[i].paperName
            obj.stockNum = response.data.records[i].stockNum
            obj.shortageNum = response.data.records[i].shortageNum
            this.tableData.push(obj)
          }
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
      this.param.devId = ''
      this.param.deviceId = ''
      this.param.siteId = ''
      this.param.managerId = ''
      this.param.userId = ''
      this.param.state = ''
      this.param.site = ''
      this.param.id = ''
      this.param.paperId = ''
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
  margin-top: 1%;
}
.el-select >>> .el-input {
  font-size: 12px;
}
.select .el-input {
  width: 230px;
  margin-right: 5px;
}
.flexbox {
  /* margin: 20px 0 0 0; */
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 30px;
  margin: 6px 0;
}
.box2 {
  font-size:15px;
  letter-spacing:3px
}
.box2 p {
  margin: 0;
}
.devSupply >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
</style>
