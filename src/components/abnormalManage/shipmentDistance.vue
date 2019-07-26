// 异常管理 --> 远程出货
<template>
  <div class="shipmentDistance">
    <div class="select">
      <el-button type="primary" size="small" @click="start">远程启动</el-button>
    </div>
    <div class="tableDiv">
      <el-table
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        border
        style="margin-top: 2%;font-size:12px;"
        :max-height="tableMaxHeght">
        <el-table-column
          align="center"
          prop="id"
          label="记录编码"
          min-width="5%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="site"
          label="场地名称"
          min-width="15%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="详细地址"
          min-width="15%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="deviceId"
          label="设备编码"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="device"
          label="设备名称"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="device"
          label="操作人名称"
          min-width="5%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="paper"
          label="纸巾名称"
          min-width="5%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="type"
          label="纸巾类型"
          min-width="5%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="num"
          label="数量"
          min-width="5%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          min-width="15%">
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @current-change="handlePaginationChange"
      :current-page="param.currentPage"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="eltotal">
    </el-pagination>

    <!--新增/编辑对话框-->
    <el-dialog
      title="远程启动"
      :visible.sync="dialogEditVisible"
      width="30%"
      center>
      <el-form :model="editform" label-width="100px">
        <el-form-item label="场地类型" prop="siteType">
          <!-- <el-select v-model="editform.siteId" placeholder="请选择场地类型" style="width: 70%" @change="selectCode"> -->
          <el-select v-model="editform.siteId" placeholder="请选择场地类型" style="width: 70%">
            <el-option v-for="item in siteTypeOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场地编码" prop="siteCode">
          <el-select v-model="editform.id" placeholder="请选择场地编码" style="width: 70%">
            <el-option v-for="item in siteCodeOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="纸巾类型" prop="paperType">
          <el-select v-model="editform.type" placeholder="请选择纸巾类型" style="width: 70%">
            <el-option v-for="item in paperTypeOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="纸巾编码" prop="paperCode">
          <el-select v-model="editform.paperId" placeholder="请选择纸巾编码" style="width: 70%">
            <el-option v-for="item in paperCodeOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="paperNum">
          <el-input v-model="editform.num" placeholder="请填写出货数量 (默认为1)" style="width: 70%"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="startConfirm()">确 定</el-button>
      </span>
    </el-dialog>

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
        groupId: '',
        name: '',
        address: ''
      },
      currentPage: 1,
      dialogEditVisible: false,
      editform: {},
      pagesize: 9,
      eltotal: 20,
      // 表格数据
      tableData: [],
      tableMaxHeght: document.body.clientHeight - 40 - 40 - 40 - 40 - 40 - 50, // ===tableDiv的高度
      screenHeight: document.body.clientHeight, // 监听变化辅助用，一定要设初始值
      onresizeTimer: false, // 屏幕高度变化定时器，避免频繁调用window.onresize()方法
      siteTypeOptions: [], // 场地类型选项
      siteCodeOptions: [], // 场地编码选项
      siteCode: [],
      paperTypeOptions: [
        {
          value: 1,
          label: '小包纸'
        }, {
          value: 2,
          label: '卷纸'
        }
      ], // 纸巾类型选项
      paperCodeOptions: [] // 纸巾编码选项
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
    this.backDevStartupPage()
    // 获取场地类型
    this.backQueEnum()
    // 获取场地编码
    this.backQueArea()
    // 获取纸巾编码
    this.BackPaperPage()
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
      $('.tableDiv').height(mainHeight - 40 - 40 - 50)
      this.tableMaxHeght = mainHeight - 40 - 40 - 50
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
    // 场地类型选择之后触发，显示相应场地类型下的场地编码
    // selectCode: function (val) {
    //   console.log(val)
    //   if (val === '') {
    //     this.siteCodeOptions = []
    //   } else {
    //     for (var i = 0; i < this.siteCode.length; i++) {
    //       if (this.siteCode[i].type === val) {
    //         this.siteCodeOptions.push(this.siteCode[i])
    //       }
    //     }
    //   }
    // },
    // 远程启动
    start: function () {
      this.dialogEditVisible = true
      this.editform = {}
    },
    // 确定远程启动
    startConfirm: function () {
      this.param.siteId = this.editform.siteId
      this.param.id = this.editform.id
      this.param.type = this.editform.type
      this.param.paperId = this.editform.paperId
      this.backDevStartup()
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backDevStartupPage()
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 远程启动记录分页查询
    backDevStartupPage: function () {
      // degugger
      this.param.pageNo = this.param.currentPage
      this.param.pageSize = this.pagesize
      sessionSetStore('backName', '远程启动记录分页查询')
      back.devStartupPage(this.param).then(function (response) {
        console.log(response)
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.id = response.data.records[i].id
            obj.site = response.data.records[i].site
            obj.address = response.data.records[i].address
            obj.deviceId = response.data.records[i].deviceId
            obj.device = response.data.records[i].device
            obj.manager = response.data.records[i].manager
            obj.paper = response.data.records[i].paper
            obj.num = response.data.records[i].num
            obj.createTime = response.data.records[i].createTime
            obj.type = response.data.records[i].type === 1 ? '小包纸' : '卷纸'
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
    // 远程启动
    backDevStartup: function () {
      sessionSetStore('backName', '远程启动')
      back.devStartup(this.param).then(function (response) {
        console.log(response)
        if (response.code === 0) {
          this.backDevStartupPage()
        } else {
          this.notificationInfo('error', '远程启动失败')
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 获取场地类型
    backQueEnum: function () {
      sessionSetStore('backName', '获取场地类型')
      this.param.type = 'SITE_TYPE'
      back.queEnum(this.param).then(function (response) {
        console.log(response)
        this.siteTypeOptions = []
        if (response.code === 0) {
          for (var i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.value = response.data[i].enumKey
            obj.label = response.data[i].enumValue
            this.siteTypeOptions.push(obj)
          }
        } else {
          this.notificationInfo('error', '获取类型失败')
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 获取场地编码
    backQueArea: function () {
      sessionSetStore('backName', '获取场地编码')
      let paramObj = {
        name: '',
        groupId: '',
        address: ''
      }
      back.queArea(paramObj).then(function (response) {
        console.log(response)
        if (response.code === 0) {
          this.siteCodeOptions = []
          // this.siteCode = []
          for (var i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.value = response.data[i].id
            obj.label = response.data[i].name
            this.siteCodeOptions.push(obj)
          }
          // this.siteCode = []
          // for (var i = 0; i < response.data.length; i++) {
          //   let obj = {}
          //   obj.value = response.data[i].id
          //   obj.label = response.data[i].value
          //   obj.type = response.data[i].type
          //   this.siteCode.push(obj)
          // }
        } else {
          this.notificationInfo('error', '场地编码获取失败')
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 获取纸巾编码
    BackPaperPage: function () {
      let paramObj = {
        pageNo: 1,
        pageSize: 1000
      }
      sessionSetStore('backName', '获取纸巾编码')
      back.PaperPage(paramObj).then(function (response) {
        console.log(response)
        if (response.code === 0) {
          this.paperCodeOptions = []
          // this.siteCode = []
          for (var i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.value = response.data.records[i].id
            obj.label = response.data.records[i].name
            this.paperCodeOptions.push(obj)
          }
          console.log(this.paperCodeOptions)
        } else {
          this.notificationInfo('error', '纸巾编码获取失败')
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
.shipmentDistance >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
</style>
