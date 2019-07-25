// 10用户管理 -> 10-2子账号管理
<template>
  <div class="childAccountManage">
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
          align="center"
          prop="nickname"
          label="账号名称"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="username"
          label="账号信息"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="role"
          label="角色"
          min-width="15%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="siteNum"
          label="场地数量"
          min-width="15%">
        </el-table-column>
        <el-table-column
          align="center"
          label="状态"
          min-width="10%">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              @change="changeswitch(scope.$index, scope.row)">
            </el-switch>
          </template>
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

    <!-- 添加/编辑角色对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogEditVisible"
      width="1070px"
      center>
      <el-form :model="form" label-width="100px" :rules="rules" ref="form">
        <el-row>
          <el-col :span="8">
            <el-form-item label="账号" prop="account">
              <el-input v-model="form.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="使用人姓名" prop="nickname">
              <el-input v-model="form.nickname"></el-input>
            </el-form-item>
            <el-form-item label="岗位角色" prop="roleType">
              <el-select v-model="form.roleType" placeholder="请选择">
                <el-option v-for="item in roleList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-table
              ref="multipleTable"
              border
              :data="formTableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                align="center"
                type="selection"
                min-width="5%">
              </el-table-column>
              <el-table-column
                align="center"
                prop="siteName"
                label="场地名称"
                min-width="40%">
              </el-table-column>
              <el-table-column
                align="center"
                prop="area"
                label="地区"
                min-width="15%">
              </el-table-column>
              <el-table-column
                align="center"
                prop="address"
                label="详细地址"
                min-width="40%">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogConfirm('form')">确 定</el-button>
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
    var checkAccount = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('账号不能为空'))
      } else if (value.length > 20) {
        callback(new Error('账号长度不超过20位'))
      } else {
        callback()
      }
    }
    var checkPassword = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('密码不能为空'))
      } else if (value.length > 20) {
        callback(new Error('密码长度不超过20位'))
      } else {
        callback()
      }
    }
    var checkNickname = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('使用人姓名不能为空'))
      } else if (value.length > 20) {
        callback(new Error('使用人姓名长度不超过20位'))
      } else {
        callback()
      }
    }
    var checkRoleType = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('岗位角色不能为空'))
      } else {
        callback()
      }
    }
    return {
      param: {
        'currentPage': 1,
        'pagesize': 8,
        'currentPage_DiaDev': 1,
        'pagesize_DiaDev': 8,
        'username': '',
        'nickname': '',
        'groupId': '',
        'name': '',
        'address': ''
      },
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      dialogTitle: '',
      dialogEditVisible: false,
      isEditOrAdd: null, // 0-编辑 1-新增
      // 表格数据
      tableData: [],
      form: {
        account: '',
        password: '',
        nickname: '',
        roleType: ''
      },
      // 表单场地列表
      roleList: [],
      // 表单表格数据
      formTableData: [],
      multipleSelection: [],
      rules: {
        account: [
          { required: true, validator: checkAccount, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: checkPassword, trigger: 'blur' }
        ],
        nickname: [
          { required: true, validator: checkNickname, trigger: 'blur' }
        ],
        roleType: [
          { required: true, validator: checkRoleType, trigger: 'change' }
        ]
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
    this.param.roleId = ''
    this.backQueChildAccountPage()
    this.backQueSiteList()
    this.backQueRoleList()
  },
  mounted: function () {
    // 表格容器高度初始化
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
    handleSelectionChange (val) {
      console.log('handleSelectionChange')
      this.multipleSelection = val
    },
    // 新增按钮
    addBt: function () {
      this.dialogTitle = '新增子账号'
      this.isEditOrAdd = 1
      this.form = {
        account: '',
        password: '',
        nickname: '',
        roleType: ''
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
        this.$refs.multipleTable.clearSelection()
      })
      this.dialogEditVisible = true
    },
    // 编辑角色按钮
    editBt: async function (index, row) {
      this.dialogTitle = '编辑子账号'
      this.isEditOrAdd = 0
      this.param.id = this.tableData[index].id
      this.dialogEditVisible = true
      // 查询子账号详情
      await this.backQueChildAccountInfo()
    },
    // 编辑子账号按钮
    delBt: function (index, row) {
      console.log(index, row)
      this.$confirm('确定删除该子账号吗?', '删除该子账号', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.param.id = row.id
        this.backDelRole()
      }).catch(() => {
      })
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backQueChildAccountPage()
    },
    // 添加/编辑对话框确认操作
    editDialogConfirm: function (formName) {
      console.log(this.form)
      if (this.isEditOrAdd === 0) {
        if (this.form.password === '******') { // 6个*与7个*
          this.form.password = '无效'
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('正确提交')
          if (this.multipleSelection.length === 0) {
            this.$message.error('请至少选择一个场地')
            return
          }
          this.param.username = this.form.account
          this.param.nickname = this.form.nickname
          this.param.password = this.form.password
          if (this.param.password === '无效') {
            this.param.password = ''
          }
          this.param.roleType = this.form.roleType
          let siteIdsArr = []
          this.multipleSelection.forEach((item) => {
            siteIdsArr.push(item.id)
          })
          this.param.siteIds = siteIdsArr
          if (this.isEditOrAdd === 0) {
            this.backUpdateChildAccount()
          } else {
            this.backAddChildAccount()
          }
          this.dialogEditVisible = false
        } else {
          console.log('错误提交')
        }
      })
    },
    // 启用/禁用代理人
    changeswitch: function (index, row) {
      console.log('启用或禁用')
      console.log(row)
      this.param.id = row.id
      this.param.isValid = row.state === true ? 1 : 0
      this.backUpdateStatus()
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 子账号分页查询
    backQueChildAccountPage: function () {
      // degugger
      sessionSetStore('backName', '子账号分页查询')
      back.queChildAccountPage(this.param).then(function (response) {
        console.log(response)
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.id = response.data.records[i].id
            obj.nickname = response.data.records[i].nickname
            obj.username = response.data.records[i].username
            obj.role = response.data.records[i].role
            obj.siteNum = response.data.records[i].siteNum
            obj.state = response.data.records[i].isValid !== 0
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
    // 角色查询
    backQueRoleList: function () {
      sessionSetStore('backName', '角色查询')
      back.queRoleList(this.param).then(function (response) {
        console.log(response)
        this.roleList = response.data
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 场地查询
    backQueSiteList: function () {
      sessionSetStore('backName', '场地查询')
      back.queArea(this.param).then(function (response) {
        console.log(response)
        let data = []
        for (let i = 0; i < response.data.length; i++) {
          let obj = {}
          obj.id = response.data[i].id
          obj.siteName = response.data[i].name
          obj.address = response.data[i].address
          obj.area = response.data[i].area
          obj.province = response.data[i].province
          data.push(obj)
        }
        this.formTableData = data
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 新增子账号
    backAddChildAccount: function () {
      sessionSetStore('backName', '新增子账号')
      back.addChildAccount(this.param).then(function (response) {
        console.log(response)
        // 分页查询请求可选项置空函数
        this.pageQueSelInit()
        this.backQueChildAccountPage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 修改子账号
    backUpdateChildAccount: function () {
      sessionSetStore('backName', '修改子账号')
      back.updateChildAccount(this.param).then(function (response) {
        console.log(response)
        // 分页查询请求可选项置空函数
        this.pageQueSelInit()
        this.backQueChildAccountPage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 修改账号状态
    backUpdateStatus: function () {
      sessionSetStore('backName', '修改账号状态')
      back.updateStatus(this.param).then(function (response) {
        console.log(response)
        // 分页查询请求可选项置空函数
        this.pageQueSelInit()
        this.backQueChildAccountPage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 查询子账号详情
    backQueChildAccountInfo: function () {
      sessionSetStore('backName', '查询子账号详情')
      return new Promise(function (resolve, reject) {
        back.queChildAccountInfo(this.param).then(function (response) {
          console.log(response)
          let obj = {}
          obj.id = response.data.id
          obj.account = response.data.username
          obj.nickname = response.data.nickname
          obj.password = '******'
          let data = []
          for (let i = 0; i < response.data.siteList.length; i++) {
            let obj1 = {}
            obj1.id = response.data.siteList[i].id
            obj1.siteName = response.data.siteList[i].name
            obj1.address = response.data.siteList[i].address
            obj1.area = response.data.siteList[i].area
            obj1.province = response.data.siteList[i].province
            obj1.isChecked = response.data.siteList[i].isChecked
            data.push(obj1)
          }
          this.formTableData = data
          this.$nextTick(() => {
            this.formTableData.forEach((item, index) => {
              if (item.isChecked) {
                this.$refs.multipleTable.toggleRowSelection(this.formTableData[index])
              }
            })
          })
          this.form = obj
          this.roleList = response.data.roleList
          resolve()
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
    },
    // 删除子账号
    backDelRole: function () {
      sessionSetStore('backName', '删除子账号')
      back.delChildAccount(this.param).then(function (response) {
        console.log(response)
        // 分页查询请求可选项置空函数
        this.pageQueSelInit()
        this.backQueChildAccountPage()
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
      this.param.nickname = ''
      this.param.username = ''
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
.childAccountManage >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
</style>
