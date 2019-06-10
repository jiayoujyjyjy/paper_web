<template>
  <div class="managerPage">
    <div class="selectionOperation">勾选操作：
      <el-button type="primary" size="small" @click="addBt">新增</el-button>
      <el-button size="small" type="primary" style="margin-left:20px;" @click="delBt">删除</el-button>
    </div>
    <el-table
      :header-cell-style="{'font-size':'14px'}"
      :data="tableData"
      stripe
      border
      style="width: 100%;font-size:12px;"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        min-width="10%">
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="用户名"
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
        prop="password"
        label="密码"
        min-width="20%">
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
          <!-- <el-button type="text" size="small" icon="el-icon-delete" @click="delBt(scope.$index, scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handlePaginationChange"
      :current-page="currentPage"
      :page-size="pagesize"
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
        <el-form-item label="用户名">
          <el-input v-model="editform.name"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editform.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editform.password"></el-input>
          <el-button style="margin-top:20px;" type="primary" plain @click="dialogPwdMod">{{dialogBtnName}}</el-button>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!--删除对话框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogDelVisible"
      width="20%"
      center>
      <span>确定删除【{{selectedAgency}}】的信息吗？</span>
      <span slot="footer">
        <el-button @click="dialogDelVisible = false">取 消</el-button>
        <el-button type="primary" @click="delConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data () {
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
    return {
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      selectedAgency: '',
      dialogEditVisible: false,
      dialogDelVisible: false,
      dialogTitle: '',
      currentPwd: '',
      dialogBtnName: '',
      multipleSelection: [],
      editform: {
        name: '',
        phone: '',
        password: ''
      },
      tableData: [{
        name: '管理员1',
        phone: '13588767140',
        password: '******',
        pwd: '123456',
        state: true
      }, {
        name: '管理员2',
        phone: '13588767140',
        password: '******',
        pwd: '654321',
        state: true
      }, {
        name: '管理员3',
        phone: '13588767140',
        password: '******',
        pwd: 'abcdef',
        state: false
      }, {
        name: '管理员4',
        phone: '13588767140',
        password: '******',
        pwd: 'fedcba',
        state: true
      }],
      // 表单校验
      rulesLogin: {
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        password: [
          { validator: checkPassword, trigger: 'blur' }
        ]
      }
    }
  },
  mounted: function () {
    var windowHeight = $(window).height()
    console.log(windowHeight)
    var mainHeight = windowHeight - 180
    $('.managerPage').height(mainHeight)
    $('.el-table').height(mainHeight - 90)
  },
  methods: {
    // 编辑管理员信息对话框
    editBt: function (index, row) {
      this.dialogTitle = '编辑信息'
      this.dialogBtnName = '显示密码'
      if (this.editform.name !== '' || this.editform.phone !== '' || this.editform.password !== '') {
        this.$refs.editform.clearValidate()
      }
      this.editform = {
        name: this.tableData[index].name,
        phone: this.tableData[index].phone,
        password: '******'
      }
      this.currentPwd = this.tableData[index].pwd
      this.dialogEditVisible = true
    },
    // 删除管理员信息对话框
    delBt: function () {
      if (this.multipleSelection.length !== 0) {
        this.$confirm('您确定删除所选管理员信息吗?', '删除管理员', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.backDel()
        }).catch(() => {
        })
      } else {
        this.$message.error('请至少选择一个条目')
      }
    },
    // 新增管理员信息对话框
    addBt: function () {
      this.dialogTitle = '新增管理员'
      this.dialogBtnName = '生成密码'
      if (this.editform.name !== '' || this.editform.phone !== '' || this.editform.password !== '') {
        this.$refs.editform.clearValidate()
      }
      this.editform = {
        name: '',
        phone: '',
        password: ''
      }
      this.dialogEditVisible = true
    },
    // 对话框修改确认
    editConfirm: function () {
    },
    // 对话框删除确认
    delConfirm: function () {
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
    handlePaginationChange: function (value) {
      console.log(value)
    },
    // 启用/禁用管理员
    changeswitch: function (index, row) {
      console.log('启用或禁用')
    },
    //
    // *******************   API调用   *********************
    //
    backDel: function () {
      console.log('删除设备')
    }
  }
}
</script>

<style scoped>
.managerPage {
  width: 100%;
  padding: 20px;
  background-color: white;
}
.el-pagination {
  margin: 20px 20px 0 0;
  float: right;
}
.selectionOperation {
  float: left;
  margin: 0 0 20px 10px;
}
.managerPage >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
</style>
