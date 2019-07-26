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
          prop="name"
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

    <!-- 添加/编辑角色对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogEditVisible"
      width="750px"
      center>
      <el-form :model="form" label-width="100px" :rules="rules" ref="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色对应的权限" label-width="120px" required>
            </el-form-item>
            <el-tree
              ref="tree"
              :data="treeData"
              node-key="id"
              :default-checked-keys="defaultCheckedKeys"
              :props="defaultProps"
              show-checkbox>
            </el-tree>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
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
    // 校验名称
    var checkName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('角色名不能为空'))
      } else if (value.length > 20) {
        callback(new Error('角色名长度不超过20位'))
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
      treeData: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultCheckedKeys: [],
      dialogTitle: '',
      dialogEditVisible: false,
      isEditOrAdd: null, // 0-编辑 1-新增
      // 表格数据
      tableData: [{
        name: '店长'
      }, {
        name: '角色'
      }],
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, validator: checkName, trigger: 'blur' }
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
  created: function () {
    // session获取登录者关键参数
    this.param.managerId = sessionGetStore('managerId')
    this.param.roleId = ''
    this.backQueRolePage()
    this.backQueMenuList()
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
    // 新增按钮
    addBt: function () {
      this.dialogTitle = '新增角色'
      this.isEditOrAdd = 1
      this.form = {
        name: ''
      }
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([])
      })
      if (this.$refs.form !== undefined) {
        this.$refs.form.clearValidate()
      }
      this.dialogEditVisible = true
    },
    // 编辑角色按钮
    editBt: async function (index, row) {
      this.dialogTitle = '编辑角色'
      this.param.id = this.tableData[index].id
      // 查看角色详情
      await this.backQueRoleInfo()
      this.dialogEditVisible = true
    },
    // 编辑角色按钮
    delBt: function (index, row) {
      console.log(index, row)
      this.$confirm('确定删除该角色吗?', '删除该角色', {
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
      this.backQueRolePage()
    },
    // 添加/编辑对话框确认操作
    editDialogConfirm: function () {
      if (this.dialogTitle === '新增角色') {
        // 1.新增角色
        console.log('新增角色')
        console.log(this.form)
        this.param.name = this.form.name
        console.log(this.$refs.tree.getCheckedKeys())
        this.dialogEditVisible = false
        if (this.$refs.tree.getCheckedKeys().length === 0) {
          this.notificationInfo('错误提示：', '角色权限不可为空')
          return
        }
        this.param.menuIds = this.$refs.tree.getCheckedKeys()
        this.backAddRole()
      } else {
        // 2.更改角色
        console.log('角色信息')
        console.log(this.form)
        this.param.name = this.form.name
        this.param.id = this.form.id
        console.log(this.$refs.tree.getCheckedKeys())
        this.dialogEditVisible = false
        if (this.$refs.tree.getCheckedKeys().length === 0) {
          this.notificationInfo('错误提示：', '角色权限不可为空')
          return
        }
        this.param.menuIds = this.$refs.tree.getCheckedKeys()
        this.backUpdateRole()
      }
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 角色分页查询
    backQueRolePage: function () {
      // degugger
      sessionSetStore('backName', '角色分页查询')
      back.queRolePage(this.param).then(function (response) {
        console.log(response)
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.id = response.data.records[i].id
            obj.name = response.data.records[i].name
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
    // 菜单查询
    backQueMenuList: function () {
      sessionSetStore('backName', '菜单查询')
      back.queMenuList(this.param).then(function (response) {
        console.log(response)
        let treeDataAlt = []
        for (let i = 0; i < response.data.length; i++) {
          let obj1 = {}
          obj1.id = response.data[i].id
          obj1.label = response.data[i].name
          let childrenData = []
          for (let j = 0; j < response.data[i].menuList.length; j++) {
            let obj2 = {}
            obj2.id = response.data[i].menuList[j].id
            obj2.label = response.data[i].menuList[j].name
            obj2.icon = response.data[i].menuList[j].icon
            obj2.isChecked = response.data[i].menuList[j].isChecked
            obj2.parentId = response.data[i].menuList[j].parentId
            obj2.url = response.data[i].menuList[j].url
            childrenData.push(obj2)
          }
          obj1.children = childrenData
          treeDataAlt.push(obj1)
        }
        this.treeData = treeDataAlt
        this.defaultCheckedKeys = []
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 新增角色
    backAddRole: function () {
      sessionSetStore('backName', '新增角色')
      back.addRole(this.param).then(function (response) {
        console.log(response)
        this.backQueRolePage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 修改角色
    backUpdateRole: function () {
      sessionSetStore('backName', '修改角色')
      back.updateRole(this.param).then(function (response) {
        console.log(response)
        this.backQueRolePage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 查看角色详情
    backQueRoleInfo: function () {
      sessionSetStore('backName', '查看角色详情')
      return new Promise(function (resolve, reject) {
        back.queRoleInfo(this.param).then(function (response) {
          console.log(response)
          let obj = {}
          obj.id = response.data.id
          obj.name = response.data.name
          let treeDataAlt = []
          for (let i = 0; i < response.data.navList.length; i++) {
            let obj1 = {}
            obj1.id = response.data.navList[i].id
            obj1.label = response.data.navList[i].name
            let childrenData = []
            for (let j = 0; j < response.data.navList[i].menuList.length; j++) {
              let obj2 = {}
              obj2.id = response.data.navList[i].menuList[j].id
              obj2.label = response.data.navList[i].menuList[j].name
              obj2.icon = response.data.navList[i].menuList[j].icon
              obj2.isChecked = response.data.navList[i].menuList[j].isChecked
              if (response.data.navList[i].menuList[j].isChecked) {
                this.defaultCheckedKeys.push(response.data.navList[i].menuList[j].id)
              }
              obj2.parentId = response.data.navList[i].menuList[j].parentId
              obj2.url = response.data.navList[i].menuList[j].url
              childrenData.push(obj2)
            }
            obj1.children = childrenData
            treeDataAlt.push(obj1)
          }
          this.form = obj
          this.treeData = treeDataAlt
          resolve()
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
    },
    // 删除角色
    backDelRole: function () {
      sessionSetStore('backName', '删除角色')
      back.delRole(this.param).then(function (response) {
        console.log(response)
        this.backQueRolePage()
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
      this.param.name = ''
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
