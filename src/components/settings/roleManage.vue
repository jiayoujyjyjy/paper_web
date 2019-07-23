// 10用户管理 -> 10-1角色管理
<template>
  <div class="roleManangePage">
    <div class="select">
      <el-button type="primary" size="small" @click="addBt">新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        border
        style="width: 100%;font-size:12px;"
        :max-height="tableMaxHeght">
        <el-table-column
          align="left"
          prop="roleName"
          label="角色名称"
          min-width="80%">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="20%">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click="editBt(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="text" icon="el-icon-delete" @click="delBt(scope.$index, scope.row)">删除</el-button>
          </template>
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

    <!-- 添加/编辑设备对话框 -->
    <el-dialog
      :title="editDialogTitle"
      :visible.sync="editDialogVisible"
      width="30%"
      center>
      <el-form :model="editform" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="editform.roleName" :disabled="isedit"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogConfirm">确 定</el-button>
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
        'pagesize_DiaDev': 8
      },
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      editDialogTitle: '',
      editDialogVisible: false,
      isedit: true,
      isadd: false,
      selectedSite: [],
      // 表格数据
      tableData: [{
        roleName: '店长'
      }, {
        roleName: '管理员'
      }],
      editform: {
        roleName: '',
        location: '',
        locaDetail: '',
        devName: '名称1',
        state: 0,
        group: '',
        msg: ''
      },
      tableMaxHeght: document.body.clientHeight - 60 - 40 - 40 - 40 - 53 + 13, // ===tableDiv的高度
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
    this.param.devId = ''
    this.backQueDevPage()
  },
  mounted: function () {
    this.tableContainerHeightSet()
    // 监听屏幕高度
    this.screenOnresizeFun()
  },
  beforeDestroy: function () {
  },
  methods: {
    // 表格容器高度随窗口视口变化函数
    tableContainerHeightSet: function () {
      var windowHeight = $(window).height()
      var mainHeight = windowHeight - 60 - 40 - 40
      $('.tableDiv').height(mainHeight - 40 - 53 + 13)
      this.tableMaxHeght = mainHeight - 40 - 53 + 13
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
    // 编辑设备按钮
    editBt: function (index, row) {
      this.editDialogTitle = '设备信息'
      this.isedit = true
      this.isadd = true
      this.param.roleName = this.tableData[index].roleName
      this.editDialogVisible = true
      // 查看设备详情
      this.backQueDevInfo()
      // this.editform = {
      //   roleName: this.tableData[index].roleName,
      //   devName: this.tableData[index].devName
      // }
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backQueDevPage()
    },
    // 添加/编辑对话框确认操作
    editDialogConfirm: function () {
      if (this.editDialogTitle === '新增设备') {
        // 1.新增设备
        console.log('新增设备')
        console.log(this.editform)
      } else {
        // 2.更改设备
        console.log('设备信息')
        console.log(this.editform)
        this.param.roleName = this.editform.roleName
        this.param.deviceName = this.editform.devName
        this.param.siteId = this.selectedSite[1]
        this.backUpdateDevice()
        this.editDialogVisible = false
      }
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 设备分页查询
    backQueDevPage: function () {
      // degugger
      sessionSetStore('backName', '设备分页查询')
      back.queDevPage(this.param).then(function (response) {
        console.log(response)
        this.total = response.sumNum
        this.online = response.onlineNum
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.roleName = response.data.records[i].id
            obj.devName = response.data.records[i].name
            obj.location = response.data.records[i].site
            obj.stateNum = response.data.records[i].state
            if (obj.stateNum === 0) {
              obj.state = '离线'
            } else if (obj.stateNum === 1) {
              obj.state = '在线'
            }
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
    // 修改设备
    backUpdateDevice: function () {
      sessionSetStore('backName', '修改设备')
      back.updateDevice(this.param).then(function (response) {
        console.log(response)
        this.param.devId = ''
        this.backQueDevPage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    backUnbind: function () {
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    },
    //
    // *******************   辅助函数   *********************
    //
    // 分页查询请求可选项置空函数
    pageQueSelInit: function () {
      this.param.devId = ''
      this.param.roleName = ''
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
}
.roleManangePage >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
</style>
