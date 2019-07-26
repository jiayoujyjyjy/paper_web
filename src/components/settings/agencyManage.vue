// 10系统配置-->10-3代理管理
<template>
  <div class="agencyManagePage">
    <div class="selectionOperation">
      <el-button type="primary" size="small" @click="addBt">新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        stripe
        border
        :max-height="tableMaxHeght"
        style="width: 100%;font-size:12px;"
        @selection-change="handleSelectionChange"
        >
        <el-table-column
          align="center"
          prop="username"
          label="用户"
          min-width="15%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="nickname"
          label="昵称"
          min-width="15%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="手机号"
          min-width="25%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="roleType"
          label="角色类型"
          min-width="25%">
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

    <!--新增/编辑对话框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogEditVisible"
      width="20%"
      center>
      <el-form :model="editform" class="form" label-width="80px" :rules="rulesLogin" ref="editform">
        <el-form-item label="用户" prop="username">
          <el-input v-model="editform.username" placeholder="请填写用户名"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="editform.nickname" placeholder="请填写昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editform.phone" placeholder="请填写手机号"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleType">
          <el-select v-model="editform.roleType" placeholder="请选择角色类型">
            <el-option label="管理员" value="0"></el-option>
            <el-option label="业务员" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editform.password" placeholder="请填写密码"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm('editform')">确 定</el-button>
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
    // 校验用户
    var checkUsername = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('用户名不能为空'))
      } else if (value.length > 20) {
        callback(new Error('用户名长度不超过20位'))
      } else {
        callback()
      }
    }
    // 校验昵称
    var checkNickname = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('昵称不能为空'))
      } else if (value.length > 20) {
        callback(new Error('用户名长度不超过20位'))
      } else {
        callback()
      }
    }
    // 校验手机号
    var checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (value.length !== 11) {
        callback(new Error('请输入11位手机号'))
      } else {
        callback()
      }
    }
    // 校验角色类型
    var checkRoleType = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('角色不能为空'))
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
        'currentPage': 1,
        'pagesize': 8,
        'currentPage_DiaDev': 1,
        'pagesize_DiaDev': 8
      },
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      selectedAgency: '',
      dialogEditVisible: false,
      isEditOrAdd: null, // 0-编辑 1-新增
      dialogTitle: '',
      currentPwd: '',
      dialogBtnName: '',
      multipleSelection: [],
      editform: {
        username: '',
        nickname: '',
        id: '',
        phone: '',
        roleType: '',
        password: ''
      },
      tableData: [],
      // 表单校验
      rulesLogin: {
        username: [
          { required: true, validator: checkUsername, trigger: 'blur' }
        ],
        nickname: [
          { required: true, validator: checkNickname, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        roleType: [
          { required: true, validator: checkRoleType, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: checkPassword, trigger: 'blur' }
        ]
      },
      tableMaxHeght: document.body.clientHeight - 40 - 40 - 40 - 40 - 53, // ===tableDiv的高度
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
  created: async function () {
    // session获取登录者关键参数
    this.param.id = sessionGetStore('managerId')
    // await this.backQueManagerInfo()
    // this.param.nickname = this.editform.nickname
    // this.param.roleType = Number(this.editform.roleType)
    // 传递 '' 代表非必传字段,在yapi上测试跑要传 ' '，注意中间有无空格
    // 分页查询请求可选项置空函数
    this.pageQueSelInit()
    this.backQueManagerPage()
  },
  mounted: function () {
    // 表格容器高度初始化
    this.tableContainerHeightSet()
    // 监听屏幕高度
    this.screenOnresizeFun()
  },
  methods: {
    // 表格容器高度随窗口视口变化函数
    tableContainerHeightSet: function () {
      var windowHeight = $(window).height()
      var mainHeight = windowHeight - 40 - 40 - 40
      $('.tableDiv').height(mainHeight - 40 - 53)
      this.tableMaxHeght = mainHeight - 40 - 53
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
    // 编辑代理人信息对话框
    editBt: async function (index, row) {
      console.log(index, row)
      // 1.查看管理员详情
      this.dialogTitle = '编辑信息'
      this.isEditOrAdd = 0
      this.param.id = row.id
      await this.backQueManagerInfo()
      this.dialogBtnName = '显示密码'
      if (this.$refs.editform !== undefined) {
        this.$refs.editform.clearValidate()
      }
      this.currentPwd = this.tableData[index].pwd
      this.dialogEditVisible = true
    },
    // 删除代理人信息对话框
    delBt: function (index, row) {
      console.log(index, row)
      this.$confirm('确定删除该账号吗?', '删除该账号', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.param.id = row.id
        this.backDelManager()
      }).catch(() => {
      })
    },
    // 新增代理人信息对话框
    addBt: function () {
      this.dialogTitle = '新增用户'
      this.isEditOrAdd = 1
      this.dialogBtnName = '生成密码'
      // if (this.editform.username !== '' || this.editform.phone !== '' || this.editform.password !== '') {
      //   this.$refs.editform.clearValidate()
      // }
      this.editform = {
        username: '',
        nickname: '',
        id: '',
        phone: '',
        roleType: '',
        password: ''
      }
      if (this.$refs.editform !== undefined) {
        this.$refs.editform.clearValidate()
      }
      this.dialogEditVisible = true
    },
    // 对话框修改确认
    editConfirm: function (formName) {
      console.log(this.editform)
      if (this.isEditOrAdd === 0) {
        if (this.editform.password === '******') { // 6个*与7个*
          this.editform.password = '无效'
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('正确提交')
          console.log(this.editform)
          this.param.id = this.editform.id
          this.param.username = this.editform.username
          this.param.nickname = this.editform.nickname
          this.param.phone = this.editform.phone
          this.param.password = this.editform.password
          if (this.param.password === '无效') {
            this.param.password = sessionGetStore('password')
          }
          this.param.roleType = this.editform.roleType
          if (this.isEditOrAdd === 0) {
            this.backUpdateManager()
          } else {
            this.backAddManager()
          }
          this.dialogEditVisible = false
        } else {
          console.log('错误提交')
        }
      })
    },
    dialogPwdMod: function () {
      let str = ''
      let index
      if (this.dialogBtnName === '生成密码') {
        // 随机生成六位密码，子母和数字组成
        let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b',
          'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
          'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D',
          'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
          'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        for (let i = 0; i < 6; i++) {
          index = Math.round(Math.random() * (arr.length - 1))
          str += arr[index]
        }
        this.editform.password = str
      } else if (this.dialogBtnName === '显示密码') {
        this.editform.password = this.currentPwd
        this.dialogBtnName = '隐藏密码'
      } else if (this.dialogBtnName === '隐藏密码') {
        this.editform.password = '******'
        this.dialogBtnName = '显示密码'
      }
    },
    handleSelectionChange: function (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backQueManagerPage()
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
    // 管理员分页查询
    backQueManagerPage: function () {
      sessionSetStore('backName', '管理员分页查询')
      back.queManagerPage(this.param).then(function (response) {
        console.log(response)
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.id = response.data.records[i].id
            obj.username = response.data.records[i].username
            obj.nickname = response.data.records[i].nickname
            obj.phone = response.data.records[i].phone
            obj.roleType = response.data.records[i].roleType === 0 ? '管理员' : '业务员'
            obj.state = response.data.records[i].isValid !== 0 // 牛逼啊，state只能用true false来标识
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
    // 新增管理员
    backAddManager: function () {
      sessionSetStore('backName', '新增管理员')
      back.addManager(this.param).then(function (response) {
        console.log(response)
        // 不传选传项
        this.param.nickname = ''
        this.param.roleType = ''
        this.backQueManagerPage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 修改管理员
    backUpdateManager: function () {
      sessionSetStore('backName', '修改管理员')
      back.updateManager(this.param).then(function (response) {
        console.log(response)
        // 不传选传项
        this.param.nickname = ''
        this.param.roleType = ''
        this.backQueManagerPage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 查看管理员详情
    backQueManagerInfo: function () {
      sessionSetStore('backName', '查看管理员详情')
      return new Promise(function (resolve, reject) {
        back.queManagerInfo(this.param).then(function (response) {
          console.log(response)
          let obj = {}
          obj.id = response.data.id
          obj.username = response.data.username
          obj.nickname = response.data.nickname
          obj.phone = response.data.phone
          obj.roleType = response.data.roleType.toString()
          obj.password = '******'
          this.editform = obj
          resolve()
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
    },
    // 删除管理员
    backDelManager: function () {
      sessionSetStore('backName', '删除管理员')
      back.delManager(this.param).then(function (response) {
        console.log(response)
        this.backQueManagerPage()
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
        this.backQueManagerPage()
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
      this.param.nickname = ''
      this.param.roleType = ''
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
/* .agencyManagePage {
  width: 100%;
  padding: 20px;
  background-color: white;
} */
.selectionOperation {
  height: 40px;
  text-align: left;
}
.agencyManagePage >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
</style>
