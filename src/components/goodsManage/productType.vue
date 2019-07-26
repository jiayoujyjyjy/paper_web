// 5商品管理 -> 5-2商品类型
<template>
  <div class="productType">
        <div class="select">
        <span style="margin: auto 1%;">分类名称</span>
        <el-input size="small" v-model="productName" placeholder="请输入分类名称"></el-input>
        <el-button type="primary" size="small" style="margin: auto 1%" @click="searchBt">搜索</el-button>
        <el-button type="primary" size="small" style="margin: auto 1%" @click="addBt">添加分类</el-button>
      </div>
    <div class="tableDiv" style="margin-top: 20px">
      <el-table
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        stripe
        border
        :max-height="tableMaxHeght"
        style="margin-top: 20px; font-size:12px;">
        <el-table-column
          align="center"
          prop="id"
          label="纸巾分类编码">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="纸巾分类名称">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editBt(scope.$index, scope.row)">编辑</el-button>
            <span style="margin: auto 10%">|</span>
            <el-button size="small" type="text" @click="delBt(scope.$index, scope.row)">删除</el-button>
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
      <el-form :model="editform" label-width="100px">
        <el-form-item label="纸巾分类编码" v-show="isProductIdShowDia">
          <el-input v-model="editform.id" :disabled="isedit"></el-input>
        </el-form-item>
        <el-form-item label="纸巾分类名称" prop="productName">
          <el-input v-model="editform.name" placeholder="请填写纸巾分类名称"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
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
        name: ''
      },
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      dialogEditVisible: false,
      isEditOrAdd: null,
      dialogTitle: '',
      multipleSelection: [],
      isedit: false,
      productName: '',
      editform: {
        id: '139761',
        name: '纸巾'
      },
      isProductIdShowDia: false,
      tableData: [],
      tableMaxHeght: document.body.clientHeight - 40 - 40 - 40 - 40 - 35 - 45, // ===tableDiv的高度
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
    this.backPaperTypePage()
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
      $('.tableDiv').height(mainHeight - 40 - 35 - 45)
      this.tableMaxHeght = mainHeight - 40 - 35 - 45
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
    // 编辑产品信息按钮
    editBt: function (index, row) {
      console.log(row)
      this.dialogTitle = '编辑'
      this.isEditOrAdd = 0
      this.isProductIdShowDia = true
      this.isedit = true
      this.param.id = row.id
      this.backPaperTypeDetail()
      this.dialogEditVisible = true
    },
    // 新增产品按钮
    addBt: function () {
      console.log(this.tableData)
      this.dialogTitle = '新增'
      this.isEditOrAdd = 1
      this.isProductIdShowDia = false
      this.isedit = false
      this.editform.id = ''
      this.editform.name = ''
      this.dialogEditVisible = true
    },
    // 对话框修改确认
    editConfirm: function (formName) {
      if (this.isEditOrAdd === 0) {
        this.param.id = this.editform.id
        this.param.name = this.editform.name
        this.backChangePaperType()
      } else {
        this.param.id = this.editform.id
        // 表单验证
        this.backAddPaperType()
      }
      this.dialogEditVisible = false
    },
    // 删除产品对话框
    delBt: function (index, row) {
      console.log(index)
      console.log(row)
      this.$confirm('确定删除该产品吗?', '删除该产品', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.param.id = row.id
        this.backDelPaperType()
      }).catch(() => {
      })
    },
    // 搜索按钮
    searchBt: function () {
      this.param.name = this.productName
      this.backPaperTypePage()
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backPaperTypePage()
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 纸巾分类分页查询
    backPaperTypePage: function () {
      sessionSetStore('backName', '纸巾分类分页查询')
      this.param.pageNo = this.param.currentPage
      this.param.pageSize = this.pagesize
      back.paperTypePage(this.param).then(function (response) {
        console.log(response)
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.id = response.data.records[i].id
            obj.name = response.data.records[i].name
            this.tableData.push(obj) // 或用this.tableData[i] = obj亦可
            console.log(this.tableData)
            // 清空搜索框
            this.productName = ''
          }
        } else {
          this.tableData = []
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 新增纸巾
    backAddPaperType: function () {
      sessionSetStore('backName', '新增纸巾')
      back.addPaperType(this.param).then(function (response) {
        console.log(response)
        this.param.name = ''
        this.param.type = ''
        this.backPaperTypePage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 编辑纸巾分类
    backChangePaperType: function () {
      sessionSetStore('backName', '修改纸巾')
      back.changePaperType(this.param).then(function (response) {
        console.log(response)
        this.param.name = ''
        this.backPaperTypePage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 查看纸巾分类详情
    backPaperTypeDetail: function () {
      return new Promise(function (resolve, reject) {
        sessionSetStore('backName', '查看纸巾详情')
        back.paperTypeDetail(this.param).then(function (response) {
          console.log(response)
          let obj = {}
          if (response.data !== undefined) {
            obj.id = response.data.id
            obj.name = response.data.name
          }
          this.editform = obj
          resolve()
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
    },
    // 删除纸巾分类
    backDelPaperType: function () {
      sessionSetStore('backName', '删除纸巾')
      back.delPaperType(this.param).then(function (response) {
        console.log(response)
        this.backPaperTypePage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 获取纸巾分类
    backpaperType: function () {
      this.param.name = ''
      sessionSetStore('backName', '获取纸巾分类')
      back.paperType(this.param).then(function (response) {
        console.log(response)
        if (response.code === 0) {
          for (var i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.value = response.data[i].id
            obj.label = response.data[i].name
            this.options.push(obj)
            this.option.push(obj)
            console.log(this.options)
          }
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // // 纸巾查询
    // backQuePaperList: function () {
    //   back.quePaperList().then(function (response) {
    //     console.log(response)
    //   })
    //     .catch(function (error) {
    //       console.log(error)
    //     })
    // },
    /*
      *
      *******************   辅助函数   *********************
      *
    */
    // 分页查询请求可选项置空函数
    pageQueSelInit: function () {
      this.param.id = ''
      this.param.name = ''
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
.box {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.productType >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
.select {
  width: 100%;
  height: 40px;
  text-align: left;
}
.el-select >>> .el-input {
  font-size: 12px;
}
.select .el-input {
  width: 230px;
  margin-right: 5px;
}
</style>
